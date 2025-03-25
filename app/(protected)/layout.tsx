// app/(protected)/layout.tsx
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // NO <html> or <body> here:
    <>
      {/* any shared protected layout UI, e.g. a sidebar */}
      {children}
    </>
  )
}