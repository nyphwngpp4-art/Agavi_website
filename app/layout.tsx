import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agavi Operational Diagnostic | Agavi AI",
  description:
    "8 questions across 8 operational dimensions. Identify exactly where AI integration would move the needle in your business.",
  openGraph: {
    title: "Agavi Operational Diagnostic",
    description:
      "Find out where your business is leaving money on the table — and what to do about it.",
    siteName: "Agavi AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
