import React, { useState, useEffect } from 'react';

export const LuxuryFooter: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(time);
  };

  return (
    <footer className="w-full bg-[#050507] text-white py-16 border-t border-white/10 select-none">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* World Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          {[
            { city: 'NEW YORK', tz: 'America/New_York' },
            { city: 'MILAN', tz: 'Europe/Rome' },
            { city: 'ZURICH', tz: 'Europe/Zurich' },
            { city: 'TOKYO', tz: 'Asia/Tokyo' }
          ].map(c => (
            <div key={c.city} className="flex flex-col">
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">
                {c.city}
              </span>
              <span className="text-sm font-mono text-white font-medium tracking-wider">
                {formatCityTime(c.tz)}
              </span>
            </div>
          ))}
        </div>

        {/* Brand & Credits */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/50 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#d97757] flex items-center justify-center text-white text-[11px] font-bold">
              ✱
            </div>
            <span className="font-display text-sm font-bold text-white tracking-wider">
              5K SHOWCASE STUDIO
            </span>
          </div>

          <div className="font-mono text-[11px] text-white/40 tracking-wider text-center sm:text-right">
            <span>INSPIRED BY CLAUDE CODE 5K SHOWCASE</span>
            <span className="mx-2">•</span>
            <span>PROUD BOSE ENGINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
