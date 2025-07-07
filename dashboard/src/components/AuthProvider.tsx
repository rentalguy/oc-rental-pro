"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";

interface Props {
  initialSession: Session | null;
  children: React.ReactNode;
}

export default function AuthProvider({ initialSession, children }: Props) {
  const [session, setSession] = useState<Session | null>(initialSession);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
