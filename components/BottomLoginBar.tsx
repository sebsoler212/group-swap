'use client';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';

export default function BottomLoginBar() {
  const [show, setShow] = useState(false)
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

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

  useEffect(() => {
    const handleScroll = () => {
      const reviews = document.getElementById('reviews');
      if (!reviews) return;

      const rect = reviews.getBoundingClientRect();
      const hasScrolledPast = rect.top < window.innerHeight;

      setShow(hasScrolledPast);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-[#0B1120] border-t border-gray-200 px-4 py-4 shadow-xl transition-transform duration-300 z-50 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="w-full max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex w-full gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black"
            />

            <button
              onClick={handleEmailSubmit}
              className="px-6 md:px-8 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-slate-100 whitespace-nowrap"
            >
              Create Photos
            </button>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white"
          >
            <FaGoogle /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
