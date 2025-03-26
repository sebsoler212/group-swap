"use client"

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from "next/navigation"

import Image from 'next/image'
import { BiPurchaseTag } from "react-icons/bi"
import { FaEye } from "react-icons/fa"
import { IoMdDownload } from "react-icons/io"

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

      <div className="flex-grow pt-16 pb-24 px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">

          <div className="col-span-1 md:col-span-2 md:border-r-4 border-b-4 md:border-b-0 md:mr-4 md:pr-4">

            <h2 className="text-xl font-bold text-center mb-4 mt-1">Generated Content</h2>

            {/* individual photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mb-4 border-b-2">
              <div className="col-span-1 mx-auto md:mx-0">
                <Image src="/4update.webp" alt="" width={300} height={0} className="w-auto h-auto text-center cursor-pointer" />
              </div>
              <div className="col-span-1">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  <div className="col-span-1 w-full">
                    <button
                      className="w-full flex items-center justify-center p-2 rounded-lg border bg-white text-black hover:bg-slate-100 cursor-pointer"
                    >
                      <FaEye /> <span className="pl-1">View Sample</span>
                    </button>
                  </div>
                  <div className="col-span-1 w-full">
                    <button
                      className="w-full flex items-center justify-center p-2 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer"
                    >
                      <BiPurchaseTag /> <span className="pl-1">Buy Photo - $2</span>
                    </button>
                  </div>
                  <div className="col-span-2 md:col-span-1 w-full">
                    <p className="text-sm text-center font-bold px-8">Buy photo to access the studio quality version with watermark removed.</p>
                  </div>
                </div>
                
              </div>
            </div> {/* end individual photo */}

            {/* individual photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mb-4 border-b-2">
              <div className="col-span-1 mx-auto md:mx-0">
                <Image src="/4update.webp" alt="" width={300} height={0} className="w-auto h-auto text-center cursor-pointer" />
              </div>
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                  <div className="col-span-1w-full">
                    <p className="text-sm text-center font-bold px-8">✅ Purchase Successful</p>
                  </div>
                  <div className="col-span-1 w-full">
                    <button
                      className="w-full flex items-center justify-center p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                    >
                      <IoMdDownload /><span className="pl-1">Download</span>
                    </button>
                  </div>
                </div>
                
              </div>
            </div> {/* individual content grid */}

          </div>

          <div className="col-span-1 mt-4 md:mt-0">

            <h2 className="text-xl font-bold text-center mb-2 md:mt-1">Detected Faces</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1">
                <Image src="/person1.png" alt="Person 1" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="col-span-1">
                <Image src="/person2.png" alt="Person 2" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="col-span-1">
                <Image src="/person3.png" alt="Person 3" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="col-span-1">
                <Image src="/person1.png" alt="Person 4" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
              <div className="col-span-1">
                <Image src="/person1.png" alt="Person 4" width={100} height={100} className="w-auto h-auto rounded-full" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-2 pt-4 border-t-4">Account Information</h2>
            <p className="text-center mt-1">Your email: {user?.email}</p>

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