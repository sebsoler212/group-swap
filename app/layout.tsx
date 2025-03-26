// app/layout.tsx
import "./global.css";
import type { Metadata } from "next";
import Head from 'next/head';
import SupabaseProvider from "./SupabaseProvider"; // your new client component

export const metadata: Metadata = {
  title: "Group Swap",
  description: "Group Swap | Limitless Group Photos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <body>
        {/* Wrap everything with the client-based provider */}
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
