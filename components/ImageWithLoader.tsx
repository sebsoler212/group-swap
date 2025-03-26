import React from "react";

interface ImageWithLoaderProps {
  imageSrc?: string;
  alt?: string;
  loading?: boolean;
  className?: string;
  onLoad?: () => void;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  imageSrc,
  alt = "Generated Image",
  loading = false,
  className = "",
  onLoad,
}) => {
  return (
    <div
      className={`relative w-[380px] max-w-full rounded-lg overflow-hidden shadow-md border border-gray-200 ${className}`}
    >
      {/* Image or Placeholder */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={onLoad}
          className={`w-full h-auto object-contain transition-all duration-500 ${
            loading ? "opacity-40 blur-[2px]" : "opacity-100 blur-0"
          }`}
        />
      ) : (
        <div className="aspect-video w-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 animate-pulse" />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 bg-opacity-90">
          {/* Sparkle animation */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-white/80 blur-sm animate-ping"></div>
            <div className="absolute inset-1 rounded-full bg-white/90 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithLoader;
