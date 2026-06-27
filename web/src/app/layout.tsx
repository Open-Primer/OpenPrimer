import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Gatekeeper } from "@/components/Gatekeeper";
import Script from "next/script";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="theme-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('op_reading_mode') || 'dark';
                  var root = document.documentElement;
                  var style = document.createElement('style');
                  style.id = 'op-theme-style';

                  if (theme === 'paper') {
                    root.style.setProperty('--background', '#fcfaf2');
                    root.style.setProperty('--foreground', '#0f172a');
                    root.classList.add('theme-paper');
                    root.classList.remove('dark', 'theme-dark', 'theme-focus');
                    style.innerHTML = 'body{background-color:#fcfaf2!important;color:#0f172a!important;font-family:Georgia,Cambria,\\"Times New Roman\\",Times,serif!important;}';
                  } else if (theme === 'focus') {
                    root.style.setProperty('--background', '#000000');
                    root.style.setProperty('--foreground', '#94a3b8');
                    root.classList.add('theme-focus');
                    root.classList.remove('dark', 'theme-dark', 'theme-paper');
                    style.innerHTML = 'body{background-color:#000000!important;color:#94a3b8!important;}';
                  } else {
                    root.style.setProperty('--background', '#020617');
                    root.style.setProperty('--foreground', '#f8fafc');
                    root.classList.add('dark', 'theme-dark');
                    root.classList.remove('theme-paper', 'theme-focus');
                    style.innerHTML = 'body{background-color:#020617!important;color:#f8fafc!important;}';
                  }

                  document.head.appendChild(style);
                  
                  document.addEventListener('DOMContentLoaded', function() {
                    if (theme === 'paper') {
                      document.body.classList.add('theme-paper');
                      document.body.classList.remove('theme-focus', 'theme-dark');
                    } else if (theme === 'focus') {
                      document.body.classList.add('theme-focus');
                      document.body.classList.remove('theme-paper', 'theme-dark');
                    } else {
                      document.body.classList.add('theme-dark');
                      document.body.classList.remove('theme-paper', 'theme-focus');
                    }
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} selection:bg-blue-500/30`} suppressHydrationWarning>
        <ClientProviders>
          <Gatekeeper>
            {children}
          </Gatekeeper>
        </ClientProviders>
      </body>
    </html>
  );
}
