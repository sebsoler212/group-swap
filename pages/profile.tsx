// pages/profile.tsx

import { useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

export default function ProfilePage() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    // If there's no user, redirect to home
    if (!user) {
      router.replace('/')
    }
  }, [user, router])

  // Handle logout
  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    // Redirect to homepage (or wherever you prefer)
    router.replace('/')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <p>Your email: {user.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <p>Loading session...</p>
      )}
    </main>
  )
}