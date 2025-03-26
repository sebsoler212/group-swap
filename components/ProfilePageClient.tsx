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
    <main className="flex flex-col h-screen">
      <div
          onClick={handleLogout}
          className="fixed top-5 right-5 bg-gray-800 text-white text-sm cursor-pointer z-10">
              🔒 Logout
      </div>
      <header className="fixed top-0 w-full bg-gray-800 text-white py-4 text-center text-xl font-bold">
        My Profile
      </header>

      <div className="flex-grow pt-16 pb-14 px-4 overflow-hidden">
        <h1>Profile Page</h1>
        <p>Your email: {user?.email}</p>
      </div>

      <footer className="fixed bottom-0 w-full bg-gray-900 text-white py-4 flex justify-center gap-4">
        <button
            onClick={goToCreate}
            className="px-24 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer"
          >
            Create Photos
        </button>
      </footer>



      <div>
        
      </div>
    </main>
  )
}