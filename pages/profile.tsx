import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'

export default function ProfilePage() {
  const user = useUser()
  const router = useRouter()

  // If no user, redirect back to home
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [user, router])

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile Page</h1>
      {user ? (
        <p>Your email: {user.email}</p>
      ) : (
        <p>Loading session...</p>
      )}
    </main>
  )
}
