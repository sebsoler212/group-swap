// app/layout.tsx
import "./global.css";
import type { Metadata } from "next";
import SupabaseProvider from "./SupabaseProvider"; // your new client component

export const metadata: Metadata = {
  title: "My Next App",
  description: "App Router + Supabase session",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything with the client-based provider */}
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
