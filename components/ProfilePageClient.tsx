"use client"

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  // Handle logout
  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    // Redirect to homepage (or wherever you prefer)
    router.replace('/')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile Page</h1>
      <p>Your email: {user?.email}</p>
      <button onClick={handleLogout}>Log Out</button>
    </main>
  )
}