import Image from 'next/image';
import { useRouter } from 'next/navigation';

const scenes = [
  {
    id: 1,
    emoji: '🐰',
    title: 'Easter',
    description:
      'Hop into the spirit of Easter with a joyful and colorful photo shoot. Capture the fun of the season with bunny ears, Easter eggs, and bright spring colors for a cheerful, family-friendly look',
    images: ['/swap/original.jpg', '/swap/original.jpg'],
    photos: 18,
    runs: 14,
    url: '/pack/easter'
  },
  {
    id: 2,
    emoji: '🎁',
    title: 'Holidays',
    description:
      'Be the most fun at every holiday. Create amazing cards of your family or friends for every special occacion of the year. Spead the most cheer.',
    images: ['/swap/original.jpg', '/swap/original.jpg'],
    photos: 32,
    runs: 47,
    url: 'pack/holidays'
  },
  {
    id: 3,
    emoji: '🔥',
    title: 'Halloween',
    description:
      'Look your best while staying true to who you are. Take photos with a variety of poses, playful expressions, and vibrant colors to make your dating profile stand out.',
    images: ['/swap/original.jpg', '/swap/original.jpg'],
    photos: 24,
    runs: 19,
    url: 'pack/halloween'
  },
];

export default function SceneCardsSection() {
  const router = useRouter();

  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="bg-[#0B1120] border border-neutral-800 rounded-xl p-4 flex flex-col gap-4 cursor-pointer"
            onClick={() => router.push(scene.url)}
          >
            {/* Top Images */}
            <div className="grid grid-cols-2 gap-2">
              {scene.images.map((src, i) => (
                <div key={i} className="relative aspect-[16/9] w-full rounded-lg overflow-hidden">
                  <Image
                    src={src}
                    alt={`${scene.title} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Title + Description */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {scene.emoji} {scene.title}
              </h3>
              <p className="text-sm text-white/80 leading-snug">
                {scene.description}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="flex gap-2 text-xs font-semibold">
              <span className="bg-green-600 text-white px-2 py-1 rounded-full">
                {scene.photos} PHOTOS
              </span>
              <span className="bg-red-600 text-white px-2 py-1 rounded-full">
                {scene.runs}X RAN THIS WEEK
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
