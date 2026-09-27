import React from 'react';

export const StatsMarquee: React.FC = () => {
  const items = [
    'ELEVEN THOUSAND SQUARE FEET',
    '$24,500,000 SOLE AGENCY',
    'PROPERTY BREADTH 120.4 FT',
    'BOILED AT FOUR • SOLD BY SEVEN',
    'CUT, NEVER TORN',
    'THE STEAM SHOULD STILL BE ON IT',
    'BAKED AT 5AM • SPLIT LENGTHWISE',
    'PROSCIUTTO DI PARMA 24MO',
    'WRAPPED IN BUTCHER PAPER & TWINE',
    'YOURS WITH AN ESPRESSO',
    'CLAUDE CODE 5K SHOWCASE'
  ];

  return (
    <div className="w-full bg-[#050507] border-y border-white/10 py-5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-12 text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-12 shrink-0">
            <span className="hover:text-amber-400 transition-colors">{item}</span>
            <span className="text-amber-500 font-bold">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
