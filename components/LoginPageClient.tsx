"use client"

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function LoginPageClient() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const searchParams = useSearchParams();

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // 1) If URL includes '?email=...', prefill the email state
  useEffect(() => {
    if (typeof searchParams.get("email") === 'string') {
      // router.query.email is already URL-decoded by Next.js
      setEmail(searchParams.get("email") ?? '')
    }
  }, [searchParams.get("email")])

  // 2) Handle sign up / sign in logic
  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')

    // Attempt to sign up first
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      // If user already exists, try sign in
      if (signUpError.message.toLowerCase().includes('already registered')) {
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

        // Successfully signed in existing user
        router.push('/create')
        return
      } else {
        // Some other error creating user
        setErrorMsg(signUpError.message)
        console.error('Sign-up error:', signUpError)
        return
      }
    }

    // Sign-up succeeded, now sign them in
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

    // All good: user created & signed in => go to /create
    router.push('/create')
  }

  return (
    <main className="flex items-center justify-center mt-24">
      <div className="grid grid-cols-1">
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

      </div>
    </main>
  )
}
