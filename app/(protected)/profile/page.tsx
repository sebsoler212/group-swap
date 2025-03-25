// app/page.tsx
import ProfilePageClient from "@/components/ProfilePageClient";

// By default, a file in `app/` with no "use client" is a Server Component.
export default function ProfilePage() {
  // No hooks or client logic here; we simply render our client component
  return <ProfilePageClient />;
}