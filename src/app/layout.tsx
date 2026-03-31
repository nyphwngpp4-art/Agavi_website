import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agavi Dispatch",
  description: "Command dispatch interface for Agavi AI workflows",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Agavi Dispatch",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ServiceWorkerRegistrar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
