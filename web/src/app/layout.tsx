import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Gatekeeper } from "@/components/Gatekeeper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenPrimer | Universal Academic Repository",
  description: "Access the entire global academic knowledge from Primary School to Bachelor degree, AI-powered and community-certified.",
};

import { ClientProviders } from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} selection:bg-blue-500/30`}>
        <ClientProviders>
          <Gatekeeper>
            {children}
          </Gatekeeper>
        </ClientProviders>
      </body>
    </html>
  );
}
