"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUserRole } from "../lib/useUserRole";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProfileMenu() {
  const { session } = useSessionContext();
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative ml-auto">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-800"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold">{session.user.email}</span>
        <span className="text-xs text-zinc-500">({role})</span>
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border rounded shadow z-20">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
