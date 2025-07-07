import React from "react";
import Image from "next/image";

export default function GuestServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-zinc-900 flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-zinc-900 shadow-md">
        <Image src="/mbr-logo-bno.png" alt="MBR Logo" width={48} height={48} />
        <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Guest Services</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start w-full p-4">
        {children}
      </main>
    </div>
  );
}
