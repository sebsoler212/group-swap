import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function DynamicAuthPage() {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')

    // 1) Attempt to sign up the user first
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      // 2) If "user already registered", try sign-in
      if (signUpError.message.toLowerCase().includes('already registered')) {
        const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          // Check if it's the "Email not confirmed" error
          if (signInError.message.toLowerCase().includes('email not confirmed')) {
            setErrorMsg('Please verify your email address before signing in.')
          } else {
            setErrorMsg(signInError.message)
          }
          console.error('Sign-in error:', signInError)
          return
        }
        // Successfully signed in existing user
        router.push('/profile')
        return
      } else {
        // Some other sign-up error
        setErrorMsg(signUpError.message)
        console.error('Sign-up error:', signUpError)
        return
      }
    }

    // 3) If sign-up succeeded, we sign them in (unless they need email confirmation)
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      if (signInError.message.toLowerCase().includes('email not confirmed')) {
        setErrorMsg('Please verify your email address before signing in.')
      } else {
        setErrorMsg(signInError.message)
      }
      console.error('Sign-in error:', signInError)
      return
    }

    // All good: user created & signed in => go to /profile
    router.push('/profile')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Dynamic Auth (Sign Up or Login)</h1>
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit">Submit</button>
      </form>
    </main>
  )
}
