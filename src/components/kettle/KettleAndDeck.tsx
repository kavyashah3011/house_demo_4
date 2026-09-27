import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Clock, MapPin, ShoppingBag, Sparkles, Check, Flame, Award, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEngine';

export const KettleAndDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'still' | 'split' | 'bake' | 'board'>('split');
  const [scrubProgress, setScrubProgress] = useState(0.45); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedBagels, setSelectedBagels] = useState<Record<string, number>>({
    'Everything': 4,
    'Rosemary Sea Salt': 3,
    'Classic Sesame': 3,
    'Smoked Jalapeño': 2
  });
  const [selectedSchmear, setSelectedSchmear] = useState('Scallion Cream Cheese');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync video time with scrub progress
  useEffect(() => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = scrubProgress * videoRef.current.duration;
    }
  }, [scrubProgress]);

  const handleScrubMove = (clientX: number, targetRect: DOMRect) => {
    const raw = (clientX - targetRect.left) / targetRect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    setScrubProgress(clamped);

    // Audio tick on significant scrub movements
    if (Math.abs(clamped - scrubProgress) > 0.03) {
      sounds.playTick(1.0 + clamped * 0.5);
    }

    if (clamped < 0.25) setActiveTab('still');
    else if (clamped < 0.55) setActiveTab('split');
    else if (clamped < 0.8) setActiveTab('bake');
    else setActiveTab('board');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrubMove(e.clientX, rect);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrubMove(e.clientX, rect);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      sounds.playCrunch();
    }
  };

  const handleTabClick = (tab: 'still' | 'split' | 'bake' | 'board', targetProgress: number) => {
    setActiveTab(tab);
    setScrubProgress(targetProgress);
    sounds.playCrunch();
  };

  const totalSelected = Object.values(selectedBagels).reduce((a, b) => a + b, 0);

  const handleAddBagel = (flavor: string) => {
    sounds.playTick(1.2);
    setSelectedBagels(prev => ({
      ...prev,
      [flavor]: (prev[flavor] || 0) + 1
    }));
  };

  const handleRemoveBagel = (flavor: string) => {
    sounds.playTick(0.9);
    setSelectedBagels(prev => {
      const cur = prev[flavor] || 0;
      if (cur <= 0) return prev;
      return { ...prev, [flavor]: cur - 1 };
    });
  };

  const handleConfirmOrder = () => {
    sounds.playCrunch();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setOrderConfirmed(true);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#faf7f2] text-[#1c1815] font-sans antialiased overflow-x-hidden selection:bg-amber-300 selection:text-black"
    >
      {/* Kettle & Deck Top Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700 animate-pulse"></span>
          <span className="font-semibold tracking-tight text-lg text-[#201a15]">Kettle & Deck</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#schedule" className="hidden sm:inline text-black/70 hover:text-black transition-colors font-medium">
            Schedule
          </a>
          <a href="#visit" className="hidden sm:inline text-black/70 hover:text-black transition-colors font-medium">
            Visit
          </a>
          <button
            onClick={() => {
              sounds.playSwoosh();
              setOrderOpen(true);
            }}
            className="px-5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-all shadow-sm font-medium text-xs sm:text-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order a Dozen</span>
            {totalSelected > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {totalSelected}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION - Exact Match to Video: "Boiled at four. Sold by seven." */}
      <section className="relative w-full max-w-5xl mx-auto px-6 pt-12 pb-20 text-center flex flex-col items-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-[#1e1713] leading-[1.08] mb-6">
          Boiled at four.<br />
          Sold by seven.
        </h1>

        <p className="max-w-xl text-base sm:text-lg text-[#5a4d43] leading-relaxed mb-8">
          Six kinds of bagel, one dark roast, and a queue that starts before the sun does. Hand-rolled, 24-hour slow fermented, and kettle-poached in barley malt.
        </p>

        <div className="flex items-center gap-4 mb-14">
          <a
            href="#interactive-cut"
            onClick={() => sounds.playTick(1.1)}
            className="px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 font-medium text-sm transition-all shadow-md flex items-center gap-2"
          >
            <span>See the bagels</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
          <button
            onClick={() => {
              sounds.playSwoosh();
              setOrderOpen(true);
            }}
            className="px-6 py-3 rounded-full bg-white border border-black/15 text-black hover:bg-black/5 font-medium text-sm transition-all"
          >
            Daily Batch Times
          </button>
        </div>

        {/* Hero Cutting Board Presentation */}
        <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-amber-50/50 to-amber-100/30 border border-amber-900/10 p-6 sm:p-10">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden flex items-center justify-center group">
            <img
              src="/assets/kettle/frame_000.jpg"
              alt="Artisan bagel on wooden board with wild arugula"
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
            {/* Ambient hot badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>BATCH 03 • FRESH OUT AT 07:15 AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE EXPERIENCE SECTION: "Cut, never torn." - Dark Studio Shift */}
      <section 
        id="interactive-cut"
        className="relative w-full bg-[#171412] text-white py-24 sm:py-32 transition-colors duration-700 overflow-hidden"
      >
        {/* Warm ambient studio glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Subheader */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4 tracking-wider uppercase">
            <Clock className="w-3 h-3" />
            <span>04:30 — THE HOT SPLIT</span>
          </div>

          {/* Core Headline */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white mb-4">
            Cut, never torn.
          </h2>

          <p className="max-w-lg text-base sm:text-lg text-white/70 mb-8 font-light">
            The steam should still be on it when it reaches the counter. A clean razor slice preserves the honeycomb crumb.
          </p>

          {/* Interactive 3D / Video Scrubber Box */}
          <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl">
            {/* Visual Canvas / Video Element */}
            <div 
              className="relative aspect-[16/10] w-full select-none cursor-ew-resize overflow-hidden flex items-center justify-center"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <video
                ref={videoRef}
                src="/assets/kettle/video.mp4"
                playsInline
                muted
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Drag instruction overlay */}
              {!isDragging && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white/80 text-xs flex items-center gap-2 pointer-events-none animate-pulse">
                  <span>↔ Drag horizontally to inspect split</span>
                </div>
              )}
            </div>

            {/* Scrubber control line */}
            <div 
              className="w-full px-6 py-4 bg-[#1e1916] border-t border-white/10 flex flex-col gap-3 select-none cursor-pointer"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${scrubProgress * 100}%` }}
                />
              </div>

              {/* Timeline markers and dots */}
              <div className="flex items-center justify-between text-xs text-white/60 font-mono pt-1">
                <button
                  onClick={() => handleTabClick('still', 0.05)}
                  className={`hover:text-amber-400 transition-colors ${activeTab === 'still' ? 'text-amber-400 font-bold' : ''}`}
                >
                  • The Still
                </button>
                <button
                  onClick={() => handleTabClick('split', 0.45)}
                  className={`hover:text-amber-400 transition-colors ${activeTab === 'split' ? 'text-amber-400 font-bold' : ''}`}
                >
                  • The Split
                </button>
                <button
                  onClick={() => handleTabClick('bake', 0.72)}
                  className={`hover:text-amber-400 transition-colors ${activeTab === 'bake' ? 'text-amber-400 font-bold' : ''}`}
                >
                  • The Bake
                </button>
                <button
                  onClick={() => handleTabClick('board', 0.95)}
                  className={`hover:text-amber-400 transition-colors ${activeTab === 'board' ? 'text-amber-400 font-bold' : ''}`}
                >
                  • The Board
                </button>
              </div>
            </div>
          </div>

          {/* Flavor Varieties Grid */}
          <div className="w-full max-w-4xl mt-20 text-left">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Morning Boil Menu</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Everything', desc: 'Poppy, roasted garlic, black sesame, Maldon flake.', tag: 'Signature' },
                { name: 'Rosemary Sea Salt', desc: 'Fresh organic rosemary infused dough with mineral salt.', tag: 'Popular' },
                { name: 'Classic Sesame', desc: 'Toasted heirloom sesame with rich nutty crust.', tag: 'Classic' },
                { name: 'Smoked Jalapeño', desc: 'Aged Vermont cheddar crust with smoked chilies.', tag: 'Savory' },
                { name: 'Cinnamon Currant', desc: 'Saigon cinnamon swirl with plump sun-dried currants.', tag: 'Sweet' },
                { name: 'Old World Plain', desc: 'Pure 24h sourdough ferment with crackling chew.', tag: 'Standard' },
              ].map(bagel => (
                <div 
                  key={bagel.name}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{bagel.name}</h4>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {bagel.tag}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">{bagel.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="font-mono text-sm text-amber-400">$3.75</span>
                    <button
                      onClick={() => handleAddBagel(bagel.name)}
                      className="px-3 py-1 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-xs font-semibold transition-all"
                    >
                      + Add to Box
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bakery Schedule & Visit Information */}
      <section id="schedule" className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 rounded-3xl bg-amber-900/5 border border-amber-900/10">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-3">
              <Clock className="w-5 h-5" />
              <span>Daily Boil Timeline</span>
            </div>
            <ul className="space-y-4 text-sm text-[#4a3f37]">
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span>04:00 AM</span>
                <span className="font-medium text-black">First Kettle Boil & Hearth Preheat</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span>06:30 AM</span>
                <span className="font-medium text-black">Doors Open & First Batch Shelved</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-2">
                <span>09:30 AM</span>
                <span className="font-medium text-black">Second Warm Boil (Weekend Double Run)</span>
              </li>
              <li className="flex justify-between">
                <span>Until Sold Out</span>
                <span className="font-medium text-black">Usually ~12:30 PM</span>
              </li>
            </ul>
          </div>

          <div id="visit" className="p-8 rounded-3xl bg-amber-900/5 border border-amber-900/10">
            <div className="flex items-center gap-2 text-amber-800 font-semibold mb-3">
              <MapPin className="w-5 h-5" />
              <span>Counter & Roastery</span>
            </div>
            <p className="text-sm text-[#5a4d43] leading-relaxed mb-4">
              412 Mulberry Lane, Lower East District.<br />
              No pre-cut bags. Every bagel sliced to order, hot from the stone.
            </p>
            <div className="p-4 rounded-xl bg-white border border-black/5 text-xs text-[#5a4d43]">
              <strong>Parking note:</strong> Mulberry Lane is pedestrian-priority between 7 AM and 11 AM. Street stalls available on Elm St.
            </div>
          </div>
        </div>
      </section>

      {/* ORDER A DOZEN SLIDE-OVER DRAWER */}
      {orderOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setOrderOpen(false)}
        >
          <div 
            className="w-full max-w-md h-full bg-[#181512] text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-l border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold">Baker's Dozen Box</h3>
                  <p className="text-xs text-white/60">Choose 12 hot bagels + 1 complimentary baker's bonus</p>
                </div>
                <button
                  onClick={() => setOrderOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Box progress count */}
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span>Box Capacity</span>
                  <span className={totalSelected === 12 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {totalSelected} / 12 bagels selected
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalSelected / 12) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Flavor Increment/Decrement list */}
              <div className="space-y-3 mb-6">
                {Object.entries(selectedBagels).map(([flavor, count]) => (
                  <div key={flavor} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                    <span className="text-sm font-medium">{flavor}</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleRemoveBagel(flavor)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-mono text-sm">{count}</span>
                      <button
                        onClick={() => handleAddBagel(flavor)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-amber-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schmear selection */}
              <div className="mb-6">
                <label className="block text-xs font-mono uppercase text-white/60 mb-2">Include 8oz Whipped Schmear</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Scallion Cream Cheese', 'Lox Spread (+ $3)', 'Truffle Honey Butter', 'Cultured Vegan Herb'].map(schmear => (
                    <button
                      key={schmear}
                      onClick={() => {
                        sounds.playTick(1.3);
                        setSelectedSchmear(schmear);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedSchmear === schmear
                          ? 'border-amber-500 bg-amber-500/20 text-white font-medium'
                          : 'border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {schmear}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Checkout Button */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {orderConfirmed ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-sm font-medium">
                  ✓ Hot batch reserved for pickup at 07:30 AM!
                </div>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full py-3.5 rounded-full bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Reserve Morning Box • $38.00</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
