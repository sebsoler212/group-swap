import { useRef, useState } from 'react';
import Image from 'next/image';

export default function ImageComparisonSlider({
  beforeSrc,
  afterSrc,
  alt = 'Image comparison',
}: {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (x: number) => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const offset = x - bounds.left;
    const percent = Math.max(0, Math.min(100, (offset / bounds.width) * 100));
    setSliderPosition(percent);
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if ('touches' in e) {
      handleMove(e.touches[0].clientX);
    } else {
      handleMove(e.clientX);
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    if ('touches' in e) {
      handleMove(e.touches[0].clientX);
    } else {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onDrag}
      onTouchMove={onDrag}
      onMouseUp={stopDrag}
      onTouchEnd={stopDrag}
      onMouseLeave={stopDrag}
      className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden rounded-xl select-none"
    >
      <Image
        src={afterSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover select-none"
        draggable={false}
        priority
      />
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={beforeSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover select-none"
          draggable={false}
          priority
        />
      </div>

      {/* SLIDER HANDLE */}
      <div
        className="absolute top-0 h-full border-l-2 border-white z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-black rounded-full p-2 shadow-md z-20 cursor-pointer ${isDragging ? 'touch-none' : ''}"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M10 6L4 12L10 18" stroke="black" strokeWidth="2" />
            <path d="M14 6L20 12L14 18" stroke="black" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
