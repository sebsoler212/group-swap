import React from "react";

interface ImageWithLoaderProps {
  placeholderSrc: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ placeholderSrc }) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Placeholder Image */}
      <img
        src={placeholderSrc}
        alt="Placeholder"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Purple Gradient Overlay with Bouncing Dots */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[linear-gradient(to_bottom_right,rgba(128,90,213,0.5),rgba(139,92,246,0.5),rgba(124,58,237,0.5))]">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default ImageWithLoader;
