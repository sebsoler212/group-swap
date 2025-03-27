"use client"

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from "next/navigation"

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

import { useEffect, useState } from "react"
import ImageWithLoader from "./ImageWithLoader"

import Image from 'next/image'
import { BiPurchaseTag } from "react-icons/bi"
import { FaEye } from "react-icons/fa"
import { IoMdDownload } from "react-icons/io"

// Define Face type
interface Face {
  faceIndex: number;
  faceUrl: string;
}

export default function ProfilePage() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()
  const supabase = createPagesBrowserClient()

  const [faces, setFaces] = useState<Face[]>([])

  useEffect(() => {
    const fetchFaces = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const response = await fetch('/api/images/get-user-faces', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                }
            });

            const data = await response.json();
            setFaces(data.cleanFaces);
        } catch (err) {
            console.error("Error fetching faces:", err);
        }
    };

    fetchFaces();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
  }

  const goToCreate = async () => {
    router.push('/create')
  }

  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState("")

  const handleGenerate = async () => {
    setLoading(true);
    setImageSrc(""); // Optional: clear previous image

    // Simulate API call to generate image
    const response = await fetch("/api/generate-image"); // replace with your actual endpoint
    const data = await response.json();

    // Update image and turn off loading
    setImageSrc(data.imageUrl);
  };

  // When image is fully loaded in browser, stop loading state
  const handleImageLoad = () => {
    //TODO: REMOVE HARD CODED IMAGE.. JUST USE URL
    setImageSrc("/4update.webp");
    setLoading(false);
  };

  // Remove a face from the list
  const handleRemoveFace = (faceIndex: number) => {
      setFaces(prevFaces => prevFaces.filter(face => face.faceIndex !== faceIndex));
  };

  return (
    <main className="flex flex-col h-screen">
      <div
          onClick={goToCreate}
          className="fixed top-2 left-4 cursor-pointer z-40">
           <Image 
              src="/glogo.png"
              alt="Group Swap"
              className="text-center cursor-pointer"
              width={58}
              height={44}
            />
      </div>
      <div
          onClick={handleLogout}
          className="fixed top-5 right-4 text-white text-sm cursor-pointer z-40">
              🔒 Logout
      </div>
      <header className="fixed top-0 w-full bg-gray-800 text-white py-4 text-center text-xl font-bold z-30">
        My Profile
      </header>

      <div className="flex-grow pt-16 pb-24 px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 h-full">

          <div className="col-span-1 md:col-span-2 md:border-r-4 border-b-4 md:border-b-0 md:mr-4 md:pr-4">

            {/* individual photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mb-4 border-b-2 mt-4">
              <div className="col-span-1 w-full mx-auto md:mx-0 cursor-pointer" onClick={handleImageLoad}>

                {!imageSrc && (
                  <ImageWithLoader placeholderSrc="/4update.webp" />
                )}

                {/* Invisible img to trigger onLoad event */}
                {imageSrc && (
                  <Image 
                    src={imageSrc}
                    alt="hidden"
                    className="hidden w-full h-auto text-center cursor-pointer rounded-lg"
                    onLoad={handleImageLoad}
                    width={300}
                    height={0}
                  />
                )}
              </div>
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-2">
                  <div className="col-span-1w-full">

                    <div className="flex items-center justify-center space-x-3 text-xl font-semibold text-primary">
                      {/* Pulsing Star Emoji */}
                      <div className="text-yellow-400 animate-ping-slow">✨</div>

                      {/* Shimmering Text */}
                      <div className="relative inline-block overflow-hidden">
                        <span className="relative z-10">Generating image...</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none"></span>
                      </div>
                      <div className="hidden animate-shimmer animate-ping-slow" />

                      <div className="text-yellow-400 animate-ping-slow">✨</div>
                    </div>

                    <p className="text-sm text-center px-8">
                      Your image is being created. This usually takes about 1-2 mintues. <b>In the meantime you can always create more photos!</b>
                    </p>

                  </div>
                </div>
                
              </div>
            </div> {/* individual content grid */}

            {/* individual photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mb-4 border-b-2">
              <div className="col-span-1 w-full mx-auto md:mx-0">
                <Image src="/4update.webp" alt="" width={300} height={0} className="w-full h-auto text-center cursor-pointer rounded-lg" />
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
              <div className="col-span-1 w-full mx-auto md:mx-0">
                <Image src="/4update.webp" alt="" width={300} height={0} className="w-full h-auto text-center cursor-pointer rounded-lg" />
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

            {faces.length === 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-center mb-2 md:mt-1">Add group photo</h2>
              </div>
            )}
            
            {faces.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-center mb-2 md:mt-1">My Faces</h2>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {faces.map(({ faceIndex, faceUrl }, index) => (
                      <div key={faceIndex} className="flex flex-col items-center">
                          <Image src={faceUrl} alt={`Face ${faceIndex}`} width={100} height={100} className="w-auto h-auto" />
                          <div className="flex">
                              <button onClick={() => handleRemoveFace(faceIndex)} className="mt-2 px-3 py-1 bg-red-500 text-white text-sm">x</button>
                          </div>
                      </div>
                  ))}
                </div>
              </div>
            )}

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