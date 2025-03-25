// app/page.tsx
import HomePageClient from "@/components/HomePageClient";

// By default, a file in `app/` with no "use client" is a Server Component.
export default function HomePage() {
  // No hooks or client logic here; we simply render our client component
  return <HomePageClient />;
}
