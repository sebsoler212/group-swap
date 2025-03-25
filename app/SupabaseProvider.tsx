// app/SupabaseProvider.tsx (or app/providers/SupabaseProvider.tsx)
"use client";

import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// If you used `initialSession={pageProps.initialSession}` in _app.tsx, you can
// optionally accept a prop here to pass it in. For simplicity, we skip that.
export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just like in your _app.tsx, create the client once per app load
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
