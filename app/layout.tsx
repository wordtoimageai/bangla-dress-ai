import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "BanglaDress AI – স্মার্ট থ্রি পিস শপিং",
  description: "AI-powered Bangladeshi three-piece dress platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
