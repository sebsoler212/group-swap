'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [1, 2, 3, 4, 5, 6];

export default function TransformationShowcase() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollByImage = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth / 3; // assume ~3 images visible at once
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full py-8 px-4 flex flex-col items-center justify-center">
      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Input Image */}
        <div className="text-center">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src="/swap/original.jpg"
              alt="Original"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-2">
            <span className="text-primary">Swap everyone</span> in any photo with <span className="underline">one click</span>.
          </h2>
        </div>

        {/* Carousel with Arrows */}        
        <div className="relative w-full">

          {/* Left Arrow */}
          <button
            onClick={() => scrollByImage('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8"
          >
            {images.map((n, i) => (
              <div
                key={i}
                className="relative aspect-square w-80 shrink-0 snap-start"
              >
                <Image
                  src={`/swap/output-${n}.webp`}
                  alt={`Output ${n}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="text-center mx-8">
            <p className="mt-4 text-sm text-slate-600">
              * All these images were created from the <span className="font-bold">same group photo</span>
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollByImage('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
