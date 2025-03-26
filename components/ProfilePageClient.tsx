"use client"

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from "next/navigation"

import Image from 'next/image';

export default function ProfilePage() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  // Handle logout
  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
  }

  const goToCreate = async () => {
    router.push('/create')
  }

  return (
    <main className="flex flex-col h-screen">
      <div
          onClick={goToCreate}
          className="fixed top-3 left-4 bg-gray-800 text-white text-4xl cursor-pointer z-10">
           👨‍👩‍👧‍👧   
      </div>
      <div
          onClick={handleLogout}
          className="fixed top-5 right-4 bg-gray-800 text-white text-sm cursor-pointer z-10">
              🔒 Logout
      </div>
      <header className="fixed top-0 w-full bg-gray-800 text-white py-4 text-center text-xl font-bold">
        My Profile
      </header>

      <div className="flex-grow pt-16 pb-14 px-4 overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">

          <div className="col-span-1 md:col-span-2 md:border-r-4 border-b-4 md:border-b-0 md:mr-4">

            <h2 className="text-xl font-bold text-center mb-4 mt-1">Generated Content</h2>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="col-span-1 mx-auto md:mx-0">
                <Image src="/4update.webp" alt="" width={300} height={0} className="w-auto h-auto text-center" />
              </div>
              <div className="col-span-1">
              </div>
            </div>

          </div>

          <div className="col-span-1 mt-4 md:mt-0">

            <h2 className="text-xl font-bold text-center mb-2 md:mt-1">Detected Faces</h2>
            <div className="flex flex-row">
              <div className="p-2">
                <Image src="/person1.png" alt="Person 1" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="p-2">
                <Image src="/person2.png" alt="Person 2" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="p-2">
                <Image src="/person3.png" alt="Person 3" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="p-2">
                <Image src="/person1.png" alt="Person 4" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="p-2">
                <Image src="/person1.png" alt="Person 4" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
            </div>

            <p className="text-center mb-4">Your email: {user?.email}</p>

          </div>

        </div>

      </div>

      <footer className="fixed bottom-0 w-full bg-gray-900 text-white py-4 flex justify-center gap-4">
        <button
            onClick={goToCreate}
            className="px-28 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer"
          >
            Create Photos
        </button>
      </footer>

    </main>
  )
}