"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function LoginPage() {
  const router = useRouter();
  const { session } = useSessionContext();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={[]}
        redirectTo="/"
      />
    </main>
  );
}
