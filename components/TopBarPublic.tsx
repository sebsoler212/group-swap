'use client';
import Image from 'next/image'

const TopBarPublic = () => {

  return (
    <header className="fixed top-0 w-full bg-gray-800 text-white py-6 z-30">
        <div className="fixed top-2 left-4 cursor-pointer z-40 flex">
                <Image 
                src="/glogo.png"
                alt="Group Swap"
                className="text-center cursor-pointer"
                width={40}
                height={30}
                />
                <span className="mt-1 ml-1">Group Swap</span>
        </div>
        <div className="fixed top-4 md:top-3 right-4 text-slate-600 text-xs md:text-sm text-white cursor-pointer z-40">
            <a href="/#packs" className="px-2">Photo Packs</a>
            <a href="/#pricing" className="px-2 hidden md:inline">Pricing</a>
            <a href="/#faq" className="px-2">FAQ</a>
            <a href="/login" className="px-2">Log in</a>
        </div>
    </header>

  );
};

export default TopBarPublic;
