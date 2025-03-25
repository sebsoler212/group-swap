'use client';
import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    question: 'How does your AI photo enhancement work?',
    answer:
      'Our AI analyzes facial features and lighting to automatically enhance your photos in a natural and flattering way.'
  },
  {
    question: 'Can I delete my photos after generation?',
    answer:
      'Yes, all generated content is stored securely and can be permanently deleted at any time by the user.'
  },
  {
    question: 'What makes your product better than competitors?',
    answer:
      'We offer more scene variety, stronger privacy controls, and higher-quality image outputs backed by custom AI models.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-14 max-w-3xl mx-auto" id="faq">
      <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-4">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center text-left text-base font-medium text-gray-900"
            >
              {faq.question}
              <span className="ml-4 text-sm text-gray-500">
                {openIndex === idx ? <FaMinus /> : <FaPlus />}
              </span>
            </button>
            {openIndex === idx && (
              <div className="mt-3 text-sm text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
