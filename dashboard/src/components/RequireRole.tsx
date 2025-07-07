"use client";

import { useUserRole } from "../lib/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireRole({ role: requiredRole, children }: { role: string; children: React.ReactNode }) {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== requiredRole) {
      router.replace("/unauthorized");
    }
  }, [role, loading, requiredRole, router]);

  if (loading || role !== requiredRole) return null;
  return <>{children}</>;
}
