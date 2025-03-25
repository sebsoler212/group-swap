import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const features = [
  {
    title: 'Group Photos',
    ours: [
      'Works with group photos of 3 to 10 people',
      'Only need a single group reference photo',
      'Swap everyone in any photo with 1 click'
    ],
    theirs: [
      'Only works with individual selfies',
      'Can only generate individual photos (headshots etc...)',
      "Can't generate group photos"
    ]
  },
  {
    title: '100% Focus on Face Swapping',
    ours: [
      'Our model is built specifically for photorealistic, accurate face swapping',
      'Our model is extremely accurate with a single group reference photo'
    ],
    theirs: [
      'Needs multiple reference photos for a single person',
      'Needs complex prompts to generate entire photo, including background, scene etc...'
    ]
  },
  {
    title: 'Simplicity',
    ours: [
      'Template based approach to ensure quality with 1 click',
      'No prompts',
      'Thousands of templates to chooose from'
    ],
    theirs: [
      'Only generate via text prompting',
      'Prone to errors, quality issues',
      "Can't generate group photos"
    ]
  }
];

export default function FeatureComparisonSection() {
  return (
    <section className="w-full max-w-6xl mx-auto md:mt-4">
      <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-2 text-center">
        How do we compare to other AI image generators?
      </h2>
      <p className="mt-4 mb-4 text-lg text-slate-600 text-center">
          In three words: "Group Photos & Simplicity"
        </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-4 text-center text-gray-900">
              {feature.title}
            </h3>

            <div className="mb-4">
              {feature.ours.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-600 mb-2">
                  <FaCheckCircle className="mt-[2px]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-semibold text-gray-500 mb-2">Others</h4>

            <div>
              {feature.theirs.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-500 mb-2">
                  <FaTimesCircle className="mt-[2px]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
