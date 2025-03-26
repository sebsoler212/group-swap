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
    router.replace('/')
  }

  const goToCreate = async () => {
    router.push('/create')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Profile Page</h1>
      <p>Your email: {user?.email}</p>
      <button onClick={handleLogout}>Log Out</button>

      <div>
        <button
          onClick={goToCreate}
          className="px-8 py-2 border border-gray-300 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer"
        >
          Create Photos
        </button>
      </div>
    </main>
  )
}