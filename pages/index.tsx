import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export default function HomePage() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  // If user is already logged in, redirect to /profile
  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  const signInWithGoogle = async () => {
    // Attempt sign-in with Google
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://next-activitybox.ngrok.dev',
      },
    })

    if (error) {
      console.error('Google sign-in error:', error)
    } else {
      console.log('Google sign-in started:', data)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1 className="bg-primary">Home Page</h1>
      <button onClick={signInWithGoogle}>Continue with Google</button>
    </main>
  )
}
