"use client"; // Ensure this is a client component

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import TransformationShowcase from '@/components/TransformationShowcase';
import FooterLinks from '@/components/FooterLinks';

import Image from 'next/image';

const activities = [
  { description: "Become Knights of Camelot.",
    name: "Knights",
    img: "/knights.jpeg",
    alt: "Knights",
    url: "knights",
  },
  { description: "Become Samurai",
    name: "Samurai",
    img: "/samurai.jpeg",
    alt: "Samurai",
    url: "samurai",
  },
  { description: "Become Vikings", 
    name: "Vikings",
    img: "/vikings.jpeg",
    alt: "Vikings",
    url: "vikings"
  },
  { description: "Become Spartans",
    name: "Spartans",
    img: "/spartans.jpeg",
    alt: "Spartans",
    url: "spartans"
  },
  { description: "Become Cowboys",
    name: "Cowboys",
    img: "/cowboys.jpeg",
    alt: "Cowboys",
    url: "cowboys"
  },
  { description: "Become Spies", 
    name: "Spies",
    img: "/bond.jpeg",
    alt: "Spies",
    url: "spies"
  }
];

export default function PhotoPage() {
  const params = useParams(); // Correct way to get dynamic route params
  const [photo, setPhoto] = useState<{ name: string; description: string; img:string; alt:string; url:string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!params.photoName) return;

    // Find the photo that matches the URL parameter
    const matchedPhoto = activities.find((act) => act.url === params.photoName);
    setPhoto(matchedPhoto || null);
  }, [params.photoName]);

  return (

    <div className="min-h-screen bg-white">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">

        <div className="col-span-1 md:col-span-2 bg-white p-0 pt-6">
          {photo ? (
            <>
              <Image 
                src={photo.img}
                alt={photo.alt}
                width={1276} 
                height={508} 
                className="w-full h-auto object-contain mb-6"
              />

              <h1 className="text-4xl font-bold text-gray-900">{photo.name}</h1>
              <h2 className="text-2xl text-gray-600 mt-4">{photo.description}</h2>

              <p className="mt-6 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales neque vel finibus commodo. Nam id sem vitae sapien maximus scelerisque sit amet id velit.  Nam id sem vitae sapien maximus scelerisque sit amet id velit.
              </p>

              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-8">
                    Upload a <span className="text-primary">single group photo</span> and pick templates.
                </h2>
              </div>
              
              {/* Showcaes */}
              <TransformationShowcase />
              
            </>
          ) : (
            <h1 className="text-4xl font-bold">Loading...</h1>
          )}
        </div>

        <div className="col-span-1 p-0 bg-white h-fit md:sticky md:top-0 z-40">

          <div className="sm:pt-0 md:pt-10">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/profile')}
              className="w-full px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Create Photos Now ➡️
            </motion.button>
          </div>
          <p className="mt-6 mb-6">
            Upload a single picture of your family or friends and swap them into thousands of templates. Studio quality in one click.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-6">Related Photos</h2>

          <div className="flex grid grid-cols-2 gap-4 mb-4 lg:mb-2">
            {[
              { src: '/landingwebp/vikings.webp', title: 'Vikings' },
              { src: '/landingwebp/samurai.webp', title: 'Samurai' },
              { src: '/landingwebp/bond.webp', title: 'Bond' },
              { src: '/landingwebp/cowboys.webp', title: 'Cowboys' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-[#0B1120] rounded-xl overflow-hidden shadow hover:shadow-lg transition-all"
              >
                <img src={item.src} alt={item.title} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* FooterLinks */}
      <FooterLinks />
  
    </div>

  );
}
