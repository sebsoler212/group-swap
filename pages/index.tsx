/******* CORE IMPORTS ****************/
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

/******* COMPONENTS IMPORTS ****************/
import ImageComparisonSlider from '@/components/ImageComparisonSlider';
import FacebookReviewCard from '@/components/FbReviewCard';
import TransformationShowcase from '@/components/TransformationShowcase';
import SceneCards from '@/components/SceneCards';
import FeatureComparison from '@/components/FeatureComparison';
import Faqsection from '@/components/Faqsection';
import Pricing from '@/components/Pricing';
import ImageTextHeroSection from '@/components/ImageTextHeroSection';
import FooterLinks from '@/components/FooterLinks';
import BottomLoginBar from '@/components/BottomLoginBar';

/******* STYLE IMPORTS ****************/
import { motion, AnimatePresence } from 'framer-motion'
import { FaGoogle } from 'react-icons/fa'


/******* HOME PAGE ****************/
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
              className="px-8 py-2 border border-gray-300 rounded-lg bg-whit text-black hover:bg-slate-100 rounded-lg whitespace-nowrap cursor-pointer"
            >
              Create Photos
            </button>
          </div>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer"
          >
            <FaGoogle /> Continue with Google
          </button>
        </div>
      </div> {/* end top section */}

      {/********* Comparison Slider ***********/}
      <ImageComparisonSlider
        beforeSrc="/4people.webp"
        afterSrc="/4update.webp"
      />

      {/********* FB REVIEWS ***********/}
      <section className="py-4 max-w-5xl">
        <div className="w-full overflow-hidden py-2">

          <div className="md:grid md:grid-cols-3 gap-4 hidden md:grid">
            {/* 3-column layout on desktop */}
            <FacebookReviewCard
              avatar="/person1.png"
              name="Maria Korsgaard"
              date="15/04/2021"
              text="The host was waiting for us and was very polite and helpful. Apartments are amazing!"
            />
            <FacebookReviewCard
              avatar="/person2.png"
              name="David Kim"
              date="28/03/2021"
              text="Fantastic experience. The place was clean, modern, and better than the photos. Highly recommend!"
            />
            <FacebookReviewCard
              avatar="/person3.png"
              name="Sophia Reyes"
              date="10/03/2021"
              text="Excellent host and beautiful scenery. We'll definitely be coming back next year!"
            />
          </div>

          <div className="flex md:hidden gap-2 snap-x snap-mandatory overflow-x-auto w-screen scrollbar-none">
            {/* Horizontal scroll on mobile */}
            <div className="flex gap-4">
              <FacebookReviewCard
                avatar="/person1.png"
                name="Maria Korsgaard"
                date="15/04/2021"
                text="The host was waiting for us and was very polite and helpful. Apartments are amazing!"
              />
              <FacebookReviewCard
                avatar="/person2.png"
                name="David Kim"
                date="28/03/2021"
                text="Fantastic experience. The place was clean, modern, and better than the photos. Highly recommend!"
              />
              <FacebookReviewCard
                avatar="/person3.png"
                name="Sophia Reyes"
                date="10/03/2021"
                text="Excellent host and beautiful scenery. We'll definitely be coming back next year!"
              />
            </div>
          </div>

        </div>
      </section> {/* end FB REVIEWS */}

      {/********* Templates Grid ***********/}
      <div className="max-w-5xl">

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4" id="reviews">
          {[
            { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
            { src: '/landingwebp/samurai.webp', title: 'Samurai', link: '/photo/samurai' },
            { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
            { src: '/landingwebp/supermen.webp', title: 'Supermen', link: '/photo/vikings' },
            { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
            { src: '/landingwebp/firemen.webp', title: 'Firemen', link: '/photo/vikings' },
            { src: '/landingwebp/knights.webp', title: 'Knights', link: '/photo/knights' },
            { src: '/landingwebp/spartans.webp', title: 'Spartans', link: '/photo/spartans' },
            { src: '/landingwebp/dragon-trainer.webp', title: 'Dragon Trainer', link: '/photo/vikings' },
            { src: '/landingwebp/jungle-explorers.webp', title: 'Jungle', link: '/photo/vikings' },
            { src: '/landingwebp/space.webp', title: 'Space', link: '/photo/vikings' },
            { src: '/landingwebp/greeks.webp', title: 'Greeks', link: '/photo/vikings' }
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-[#0B1120] rounded-xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(item.link)}
            >
              <img src={item.src} alt={item.title} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
        
      </div>{/* end Templates Grid */}
      
      <div className="text-center max-w-5xl">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-8">
            Upload a <span className="text-primary">single group photo</span> and pick templates.
        </h2>
      </div>

      {/********* Transformation Showcaes ***********/}
      <TransformationShowcase />

      <div className="text-center max-w-5xl">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-2 md:mt-8">
          🔥 New Photo packs just dropped
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Photo packs are themed collections. With a single group photo and one click you can face swap everyone into every photo in the pack.
          It's the perfect way to create photos for every occasion.
        </p>
      </div>
      
      {/* Photo Packs */}
      <SceneCards />

      {/********* FB REVIEWS ***********/}
      <section className="py-4 max-w-5xl">
        <div className="w-full overflow-hidden py-2">

          <div className="md:grid md:grid-cols-3 gap-4 hidden md:grid">
            {/* 3-column layout on desktop */}
            <FacebookReviewCard
              avatar="/person1.png"
              name="Maria Korsgaard"
              date="15/04/2021"
              text="The host was waiting for us and was very polite and helpful. Apartments are amazing!"
            />
            <FacebookReviewCard
              avatar="/person2.png"
              name="David Kim"
              date="28/03/2021"
              text="Fantastic experience. The place was clean, modern, and better than the photos. Highly recommend!"
            />
            <FacebookReviewCard
              avatar="/person3.png"
              name="Sophia Reyes"
              date="10/03/2021"
              text="Excellent host and beautiful scenery. We'll definitely be coming back next year!"
            />
          </div>

          <div className="flex md:hidden gap-2 snap-x snap-mandatory overflow-x-auto w-screen scrollbar-none">
            {/* Horizontal scroll on mobile */}
            <div className="flex gap-4">
              <FacebookReviewCard
                avatar="/person1.png"
                name="Maria Korsgaard"
                date="15/04/2021"
                text="The host was waiting for us and was very polite and helpful. Apartments are amazing!"
              />
              <FacebookReviewCard
                avatar="/person2.png"
                name="David Kim"
                date="28/03/2021"
                text="Fantastic experience. The place was clean, modern, and better than the photos. Highly recommend!"
              />
              <FacebookReviewCard
                avatar="/person3.png"
                name="Sophia Reyes"
                date="10/03/2021"
                text="Excellent host and beautiful scenery. We'll definitely be coming back next year!"
              />
            </div>
          </div>

        </div>
      </section> {/* end FB REVIEWS */}

      {/* Feature Comparison */}
      <FeatureComparison />

      {/* Faqsection */}
      <Faqsection />

      {/* Pricing */}
      <Pricing />

      {/* ImageTextHero */}
      <ImageTextHeroSection imgUrl='/swap/output-1.webp'/>

      {/* FooterLinks */}
      <FooterLinks />
      

      {/* Bottom Login */}
      <BottomLoginBar />

    {/* end body container */}
    </div>
  )
}
