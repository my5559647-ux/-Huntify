import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import GuardModal from "@/components/GuardModal";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  title: "Huntify - Client Lead & Deal Management",
  description: "Huntify connects you with verified regional businesses, audits legacy websites, and manages all deal conversions securely.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#F4FAFC] dark:bg-[#05161A] text-[#05161A] dark:text-[#FAF8F5] antialiased">
<AuthProvider>
          <div className="flex flex-col min-h-screen">
            {children}
            <ConditionalFooter />
          </div>
          <GuardModal />
        </AuthProvider>
      </body>
    </html>
  );
}
