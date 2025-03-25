import { FaCheckCircle } from 'react-icons/fa';

const pricingTiers = [
  {
    title: 'Try for Free',
    price: '$0',
    features: [
      'Watermarked photos',
      'Lower resolution',
      'Select any template'
    ]
  },
  {
    title: 'Individual Photo',
    price: '$2',
    features: [
      'Studio Quality',
      'Priority Processing',
      'Select any template'
    ]
  },
  {
    title: 'Photo Pack',
    price: '$29',
    features: [
      'Studio Quality',
      '20-40 Theme Specific Photos',
      'Priority Processing'
    ],
    popular: true
  }
];

export default function PricingSection() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <section className="w-full max-w-5xl mx-auto" id="pricing">
      <h2 className="text-2xl md:text-4xl font-bold text-slate-900 text-center mb-8">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center"
          >
            {tier.popular && (
              <span className="absolute -top-3 right-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold mb-2 text-gray-900">
              {tier.title}
            </h3>
            <p className="text-3xl font-semibold text-primary mb-4">{tier.price}</p>
            <button
              onClick={scrollToTop}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-medium mb-6 w-full"
            >
              Create Photos
            </button>
            <div className="w-full">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-600 mb-2">
                  <FaCheckCircle className="mt-[2px]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
