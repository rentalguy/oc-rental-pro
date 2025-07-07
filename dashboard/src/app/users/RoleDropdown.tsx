"use client";

import { useState } from "react";

export const ROLES = ["admin", "manager", "cleaner", "owner", "user"];

export default function RoleDropdown({ value, onChange }: { value: string; onChange: (role: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="px-2 py-1 border rounded bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800"
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <ul className="absolute z-10 bg-white dark:bg-zinc-900 border rounded shadow mt-1 w-full">
          {ROLES.map((role) => (
            <li
              key={role}
              className={`px-3 py-1 hover:bg-blue-100 dark:hover:bg-zinc-800 cursor-pointer ${role === value ? "font-bold" : ""}`}
              onClick={() => {
                setOpen(false);
                onChange(role);
              }}
            >
              {role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
