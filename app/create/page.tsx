// app/page.tsx
import CreatePageClient from "@/components/CreatePageClient";

// By default, a file in `app/` with no "use client" is a Server Component.
export default function CreatePage() {
  // No hooks or client logic here; we simply render our client component
  return <CreatePageClient />;
}