import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Amiquz - Find the Right Lawyer",
  description: "Connect with verified legal professionals for your personal and business needs. Powered by Amiquz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
