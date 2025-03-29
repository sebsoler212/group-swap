"use client"

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FaGoogle } from 'react-icons/fa'

import Image from 'next/image'

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
  const handleAuth = async () => {
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

  const goHome = () => {
    router.push('/')
  }

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
    <main className="flex items-center justify-center mt-24 w-full">
      <div className="grid grid-cols-1 max-w-md w-full mx-8">

        <div className="cursor-pointer flex mb-2 flex items-center justify-center" onClick={goHome}>
          <Image 
          src="/glogo.png"
          alt="Group Swap"
          className="text-center cursor-pointer"
          width={60}
          height={50}
          />
          <span className="ml-1 text-xl font-bold">Group Swap</span>
        </div>

        <p className="text-lg text-slate-600 flex items-center justify-center text-center mx-4">
          Limitless group photos of your family and friends.
        </p>

        <hr className="mt-4 mb-4 mx-12" />

        <div className="mb-1">
          <label htmlFor="email" className="block w-full">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="block">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black w-full"
          />
        </div>
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <button
          onClick={handleAuth}
          className="px-6 md:px-8 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-slate-100 whitespace-nowrap w-full">
            Create Photos
        </button>

        <hr className="mt-4 mx-12" />

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white mt-4"
        >
          <FaGoogle /> Continue with Google
        </button>

      </div>
    </main>
  )
}
