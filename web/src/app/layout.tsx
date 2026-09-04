import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BPLPromise from "@/components/BPLPromise";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BPL Arena | Best Home & Personal Loans in Bangalore",
  description:
    "Bangalore Property and Loan Arena — VIP Doorstep Service for Home Loans, Personal Loans, Balance Transfers, Khatha Transfers & BBMP assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <BPLPromise />
      </body>
    </html>
  );
}
