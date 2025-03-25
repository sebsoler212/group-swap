import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import ImageComparisonSlider from '@/components/ImageComparisonSlider';

import { motion, AnimatePresence } from 'framer-motion'
import { FaGoogle } from 'react-icons/fa'

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

  /******* EMAIL AUTH ****************/
  const [email, setEmail] = useState('')
  const handleEmailSubmit = () => {
    if (!email) return;
    router.push(`/login?email=${encodeURIComponent(email)}`)
  }

  /******* GOOGLE AUTH ****************/
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

  /******* ROTATING WORDS ****************/
  const rotatingWords = [
    'Infinite',
    'Majestic',
    'Limitles',
    'Enchanted',
    'Boundless',
    'Marvelous',
    'Radiant',
    'Wondrous',
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  /******* Start HTML ****************/
  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center px-6 py-12 z-10 pb-20">
      <div id="top-section" className="w-full max-w-5xl mt-2 md:mt-4 flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        {/* Text Column */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight flex flex-wrap justify-center md:justify-start gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[wordIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-primary"
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
            <span>group photos from one picture</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Upload a single picture of your family or friends and swap them into thousands of templates. Studio quality in one click.
          </p>
        </div>

        {/* Login Column */}
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              name="dummy-email"
              data-form-type="other"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black"
            />
            <button
              onClick={handleEmailSubmit}
              className="px-8 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg whitespace-nowrap cursor-pointer"
            >
              Create Photos
            </button>
          </div>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-slate-100 cursor-pointer"
          >
            <FaGoogle /> Continue with Google
          </button>
        </div>
      </div> {/* end top section */}

      {/* Comparison Slider */}
      <ImageComparisonSlider
        beforeSrc="/4people.webp"
        afterSrc="/4update.webp"
      />


    {/* end body container */}
    </div>
  )
}
