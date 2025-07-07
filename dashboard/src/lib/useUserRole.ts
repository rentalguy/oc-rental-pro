import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";

export function useUserRole() {
  const { session } = useSessionContext();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setRole(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setRole("user"); // fallback
        else setRole(data.role);
        setLoading(false);
      });
  }, [session]);

  return { role, loading };
}
