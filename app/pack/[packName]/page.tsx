'use client';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import TopBarPublic from '@/components/TopBarPublic';
import ImageComparisonSlider from '@/components/ImageComparisonSlider';
import BottomLoginBar from '@/components/BottomLoginBar';
import TransformationShowcase from '@/components/TransformationShowcase';
import SceneCards from '@/components/SceneCards';
import FacebookReviewCard from '@/components/FbReviewCard';
import FeatureComparison from '@/components/FeatureComparison';
import Faqsection from '@/components/Faqsection';
import Pricing from '@/components/Pricing';
import ImageTextHeroSection from '@/components/ImageTextHeroSection';
import FooterLinks from '@/components/FooterLinks';

const packs = [
    { description: "Hop into the spirit of Easter with a joyful and colorful photo shoot. Capture the fun of the season with bunny ears, Easter eggs, and bright spring colors for a cheerful, family-friendly look.",
      name: "Easter",
      img: "/landingwebp/cowboys.webp",
      alt: "Easter",
      url: "easter",
      photos: [
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' },
        { src: '/landingwebp/cowboys.webp', title: 'Cowboys', link: '/photo/cowboys' }
      ]
    },
    { description: "Be the most fun at every holiday. Create amazing cards of your family or friends for every special occacion of the year. Spead the most cheer.",
      name: "Holidays",
      img: "/landingwebp/bond.webp",
      alt: "Holidays",
      url: "holidays",
      photos: [
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' },
        { src: '/landingwebp/bond.webp', title: 'Bond', link: '/photo/spies' }
      ]
    },
    { description: "Look your best while staying true to who you are. Take photos with a variety of poses, playful expressions, and vibrant colors to make your dating profile stand out.",
        name: "Halloween",
        img: "/landingwebp/vikings.webp",
        alt: "Halloween",
        url: "halloween",
        photos: [
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' },
          { src: '/landingwebp/vikings.webp', title: 'Vikings', link: '/photo/vikings' }
        ]
      }
  ];

export default function PackPage() {
  const [email, setEmail] = useState('');
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  type Photo = {
    src: string;
    title: string;
    link: string;
  };

  /******* GOOGLE AUTH ****************/
  const signInWithGoogle = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://next-activitybox.ngrok.dev",
      },
    });

    if (error) {
      console.error("Google sign-in error:", error);
    } else {
      console.log("Google sign-in started:", data);
    }
  };

  const params = useParams(); // Correct way to get dynamic route params
    const [pack, setPack] = useState<{ name: string; description: string; img:string; alt:string; url:string; photos: Photo[]; } | null>(null);

    useEffect(() => {
        if (!params.packName) return;

        const matchedPack = packs.find((act) => act.url === params.packName);
        setPack(matchedPack || null);
    }, [params.packName]);

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

  const handleEmailSubmit = () => {
    if (!email) return;
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    // bg-[#0B1120]
    <div className="relative min-h-screen bg-white flex flex-col items-center px-6 py-12 z-10 pb-20">

      <TopBarPublic />

      <div id="top-section" className="w-full max-w-5xl mt-4 md:mt-6 flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
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
            {pack?.description}
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
              className="px-8 py-2 rounded-lg border border-gray-300 rounded-lg bg-white text-black hover:bg-slate-100 whitespace-nowrap cursor-pointer"
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
      </div>

      <ImageComparisonSlider
        beforeSrc="/4people.webp"
        afterSrc="/4update.webp"
      />

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
      </section>

      <div className="max-w-5xl">

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4" id="reviews">
          {pack?.photos.map((item, index) => (
            <div 
              key={index}
              className="bg-[#0B1120] rounded-xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(item.link)}
            >
              <img src={item.src} alt={item.title} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
        
      </div>

      <div className="text-center max-w-5xl">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-8">
            Upload a <span className="text-primary">single group photo</span> and swap into every template in the <span className="text-primary">{pack?.name}</span> pack.
        </h2>
      </div>

      {/* Showcaes */}
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
      <div id="packs"></div>
      <SceneCards />

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
      </section>

      {/* Feature Comparison */}
      <FeatureComparison />

      {/* Faqsection */}
      <Faqsection />

      {/* Pricing */}
      <Pricing />

      {/* ImageTextHero */}
      <ImageTextHeroSection imgUrl={pack?.img ?? '/swap/output-1.webp'} />

      {/* FooterLinks */}
      <FooterLinks />


      {/* Bottom Login */}
      <BottomLoginBar />
      
    </div>
  );
}
