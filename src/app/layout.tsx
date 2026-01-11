
import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Modern, premium font
import "./globals.css";

const font = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coupon Website",
  description: "Best deals and discounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased text-slate-900 bg-white`}>
        {children}
      </body>
    </html>
  );
}
