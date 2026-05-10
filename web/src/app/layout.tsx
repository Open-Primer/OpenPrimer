import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Gatekeeper } from "@/components/Gatekeeper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenPrimer | L'Encyclopédie du Savoir Universel",
  description: "Accédez gratuitement à tous les cours du CP à la Licence, générés par IA et validés par la communauté.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} selection:bg-blue-500/30`}>
        <Gatekeeper>
          {children}
        </Gatekeeper>
      </body>
    </html>
  );
}
