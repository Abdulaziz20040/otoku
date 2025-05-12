// app/layout.jsx

"use client";
import Sidebar from "@/components/Sidebar";
import "../app/globals.css";
import ClientWrapper from "../components/ClientWrapper";
import { usePathname } from "next/navigation"; // TO‘G‘RI HOZIRGI URL olish
import React from "react";
import Followers from "./Foollowers";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/admin";

  // Login yoki register sahifalari bo‘lsa, faqat sahifa chiqadi
  if (isAuthPage) {
    return (
      <html lang="en">
        <body>
          <div className="">{children}</div>
        </body>
      </html>
    );
  }

  // Boshqa sahifalar uchun to‘liq layout
  return (
    <html lang="en">
      <body>
        <div
          className="container flex flex-col min-h-screen text-black"
          style={{
            background:
              "linear-gradient(135deg,rgb(233, 233, 233),rgb(244, 244, 244),rgb(229, 229, 229),rgb(246, 245, 245))",
          }}
        >
          <ClientWrapper className="w-full" />

          <div className="flex flex-1 mt-8">
            <Sidebar className="w-1/4 min-w-[250px]" />

            <main className="flex justify-center flex-1 max-h-[87vh] overflow-y-auto scrollbar-hidden">
              <div className="w-[920px]">{children}</div>
            </main>

            <Followers className="w-1/4 min-w-[250px] border-l border-gray-300" />
          </div>
        </div>
      </body>
    </html>
  );
}
