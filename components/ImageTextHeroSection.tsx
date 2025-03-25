import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HeroSectionProps = {
  imgUrl: string;
};

export default function ImageTextHeroSection({ imgUrl }: HeroSectionProps) {

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

  return (
    <section className="w-full py-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Text section */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
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

        {/* Image section */}
        <div className="relative w-full aspect-[3/2] lg:aspect-auto h-64 lg:h-[400px] order-1 lg:order-2">
          <Image
            src={imgUrl}
            alt="AI enhanced photo example"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
