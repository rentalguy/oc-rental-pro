"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import ChatAssistant from "./ChatAssistant";

// Placeholder for logo - place your logo in public/mbr-logo-bno.png
const LOGO_SRC = "/mbr-logo-bno.png";

interface GuestArrivalGuideProps {
  reservationId?: string | null;
}

export default function GuestArrivalGuide({ reservationId }: GuestArrivalGuideProps = {}) {
  const { session } = useSessionContext();
  const [reservation, setReservation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // For check-in/check-out button logic
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Simulate guest name for demo
  const guestName = session?.user?.user_metadata?.full_name || "Guest";

  useEffect(() => {
    async function fetchReservation() {
      setLoading(true);
      if (!session) return;
      let data = null;
      if (reservationId) {
        // Fetch the specific reservation for this user
        const res = await supabase
          .from("bookings")
          .select("*, listing:listing_id(name, city, description, image, map_url, video_url, street_address, city, state, zip_code, coastal_street)")
          .eq("user_id", session.user.id)
          .eq("id", reservationId)
          .single();
        data = res.data;
      } else {
        // Fetch the most recent reservation for this user
        const res = await supabase
          .from("bookings")
          .select("*, listing:listing_id(name, city, description, image, map_url, video_url, street_address, city, state, zip_code, coastal_street)")
          .eq("user_id", session.user.id)
          .order("check_in", { ascending: false })
          .limit(1)
          .single();
        data = res.data;
      }
      setReservation(data);
      setLoading(false);
    }
    fetchReservation();
  }, [session]);

  // Date logic for check-in/check-out buttons
  const today = new Date();
  const checkInDate = reservation?.check_in ? new Date(reservation.check_in) : null;
  const checkOutDate = reservation?.check_out ? new Date(reservation.check_out) : null;
  const isCheckInDay = checkInDate && today.toDateString() === checkInDate.toDateString();
  const isCheckOutDay = checkOutDate && today.toDateString() === checkOutDate.toDateString();

  if (loading) return <div>Loading...</div>;
  if (!reservation) return <div>No reservation found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Logo and Welcome */}
      <div className="flex flex-col items-center">
        <Image src={LOGO_SRC} alt="Morgan's Bayside Retreat Logo" width={128} height={128} className="mb-2" />
        <h1 className="text-3xl font-bold text-blue-600 mb-1 text-center">Welcome, {guestName}!</h1>
        <div className="text-lg text-zinc-600 dark:text-zinc-300 mb-2 text-center">
          to your stay at <span className="font-semibold">{reservation.listing?.name}</span>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 text-center">
          {reservation.listing?.street_address}, {reservation.listing?.city}, {reservation.listing?.state} {reservation.listing?.zip_code}
        </div>
        {typeof reservation.listing?.coastal_street === 'number' && (
          <div className="text-xs text-blue-700 dark:text-blue-300 mb-2 text-center">
            Coastal Street #: <span className="font-semibold">{reservation.listing.coastal_street}</span>
          </div>
        )}
      </div>
      {/* Reservation Info & Check-in/Checkout Button */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 dark:bg-zinc-800 rounded-lg shadow p-4 my-4 gap-4">
        <div className="flex-1">
          <div className="text-zinc-700 dark:text-zinc-200 mb-1">
            <b>Reservation:</b> {reservation.check_in} &rarr; {reservation.check_out}
          </div>
          <div className="text-zinc-700 dark:text-zinc-200 mb-1">
            <b>Guests:</b> {guestName}
          </div>
          <div className="text-zinc-700 dark:text-zinc-200">
            <b>Status:</b> {reservation.status}
          </div>
        </div>
        <div className="flex flex-col items-end">
          {!hasCheckedIn ? (
            <button
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg text-lg ${isCheckInDay ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!isCheckInDay}
              onClick={() => isCheckInDay && setShowCheckInModal(true)}
            >
              {isCheckInDay ? "Check In Now" : `Check-in Unavailable\n(${reservation.check_in})`}
            </button>
          ) : (
            <button
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg text-lg ${isCheckOutDay ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!isCheckOutDay}
            >
              {isCheckOutDay ? "Check Out" : `Checkout Unavailable\n(${reservation.check_out})`}
            </button>
          )}
        </div>
      </div>
      {/* Central Chat Assistant */}
      <div className="my-8">
        <ChatAssistant />
      </div>
      {/* Media Gallery, Map, Video Tour, Guestbook, etc. will be scaffolded after chat */}
      {/* Check-in Feedback Modal placeholder */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Check-In Feedback</h2>
            <p className="mb-4">How was your arrival experience?</p>
            {/* Feedback form will be implemented here */}
            <button className="mt-4 px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { setHasCheckedIn(true); setShowCheckInModal(false); }}>Submit Feedback</button>
          </div>
        </div>
      )}
    </div>
  );
}
