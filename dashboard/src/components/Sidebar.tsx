"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "../lib/useUserRole";

const navLinks = [
  { name: "Listings", href: "/listings" },
  { name: "Bookings", href: "/bookings" },
  { name: "Payments", href: "/payments" },
  // Guests (admin/manager only)
  { name: "Guests", href: "/guests", adminOnly: true },
  // Guest Services (for guests only, not admin/manager)
  { name: "Guest Services", href: "/guest", guestOnly: true },
  { name: "Users", href: "/users", adminOnly: true },
  { name: "Settings", href: "/settings", adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, loading } = useUserRole();
  if (loading) return null;
  return (
    <nav className="flex flex-col gap-2 p-4 border-r border-gray-200 min-h-screen bg-white dark:bg-zinc-900">
      <div className="text-xl font-bold mb-8 tracking-tight">OC Rental Pro</div>
      <ul>
        {navLinks
          .filter(link => {
            // Admin/manager only links
            if (link.adminOnly && role !== "admin" && role !== "manager") return false;
            // Guest Services only for regular users (not admin/manager)
            if (link.guestOnly && (role === "admin" || role === "manager")) return false;
            return true;
          })
          .map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded px-3 py-2 transition-colors font-medium text-base ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
