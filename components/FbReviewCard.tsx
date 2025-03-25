import Image from 'next/image';
import { FaFacebook, FaStar } from 'react-icons/fa';

type FacebookReviewProps = {
  avatar: string;
  name: string;
  date: string;
  text: string;
};

export default function FacebookReviewCard({
  avatar,
  name,
  date,
  text,
}: FacebookReviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 w-[85vw] max-w-[300px] flex-shrink-0 snap-start">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={avatar} alt={name} fill className="object-cover" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900 leading-tight">{name}</p>
            <p className="text-gray-400 text-xs">{date}</p>
          </div>
        </div>
        <FaFacebook className="text-[#1877F2] text-xl" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-gray-800 leading-snug break-words">{text}</p>
    </div>
  );
}