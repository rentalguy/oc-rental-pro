"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUserRole } from "../../lib/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BookingsPage() {
  const { session } = useSessionContext();
  const { role } = useUserRole();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      let query = supabase.from("bookings").select("*, listing:listing_id(name, city)");
      if (role !== "admin" && role !== "manager") {
        query = query.eq("user_id", session?.user.id);
      }
      const { data } = await query;
      setBookings(data || []);
      setLoading(false);
    }
    if (session) fetchBookings();
  }, [session, role]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      {loading ? (
        <div>Loading...</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-800">
              <th className="border p-2 text-left">Property</th>
              <th className="border p-2 text-left">Check-in</th>
              <th className="border p-2 text-left">Check-out</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Guest Email</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">{b.listing?.name || b.listing_id}</td>
                <td className="border p-2">{b.check_in?.slice(0,10)}</td>
                <td className="border p-2">{b.check_out?.slice(0,10)}</td>
                <td className="border p-2">{b.status}</td>
                <td className="border p-2">{b.guest_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add booking creation/edit UI for admin/manager here */}
    </div>
  );
}
