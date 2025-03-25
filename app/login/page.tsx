// app/page.tsx
import LoginPageClient from "@/components/LoginPageClient";

// By default, a file in `app/` with no "use client" is a Server Component.
export default function LoginPage() {
  // No hooks or client logic here; we simply render our client component
  return <LoginPageClient />;
}