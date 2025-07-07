"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GuestArrivalGuide from "../guest/page";

export default function GuestServicesPage() {
  // Read reservation_id from the URL
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation_id");

  // Pass reservationId as a prop to GuestArrivalGuide (to implement filtering)
  return <GuestArrivalGuide reservationId={reservationId} />;
}
