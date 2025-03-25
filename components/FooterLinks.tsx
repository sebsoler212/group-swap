import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const pageLinks = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Legal', href: '/legal' }
];

const photoLinks = [
  { label: 'Cowboys', href: '/photo/cowboys' },
  { label: 'Knights', href: '/photo/knights' },
  { label: 'Samurai', href: '/photo/samurai' },
  { label: 'Spartans', href: '/photo/spartans' },
  { label: 'Spies', href: '/photo/spies' },
  { label: 'Vikings', href: '/photo/vikings' }
];

const photoPackLinks = [
  { label: 'Easter', href: '/pack/easter' },
  { label: 'Holidays', href: '/pack/holidays' },
  { label: 'Halloween', href: '/pack/halloween' }
];

export default function FooterLinksSection() {
  return (
    <footer className="w-full py-12 bg-gray-100 border-t border-gray-200">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pl-12 md:pl-0">
        {/* Column 1: Logo and copyright */}
        <div className="flex flex-col items-start">
          <Image src="/emoji.png" alt="Company Logo" width={80} height={80} />
          <p className="text-sm text-gray-600 mt-4">© 2025 Activity Box. All rights reserved.</p>
          <div className="flex gap-4 mt-4 text-gray-600">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-primary transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-primary transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-primary transition" />
            </Link>
          </div>
        </div>

        {/* Column 2: Page Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-gray-900 mb-2">Pages</h4>
          {pageLinks.map((link, i) => (
            <Link key={i} href={link.href} className="text-sm text-gray-600 hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 3: Photos Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-gray-900 mb-2">Photos</h4>
          {photoLinks.map((link, i) => (
            <Link key={i} href={link.href} className="text-sm text-gray-600 hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Column 4: Photo Pack Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-gray-900 mb-2">Photo Packs</h4>
          {photoPackLinks.map((link, i) => (
            <Link key={i} href={link.href} className="text-sm text-gray-600 hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
