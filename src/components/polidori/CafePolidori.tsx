import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Coffee, Sparkles, Check, ChevronRight, Clock, MapPin, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEngine';

interface StoryStage {
  id: number;
  title: string;
  subtitle: string;
  timestamp: number; // 0 to 1
  timecode: string;
  notes: string[];
}

const STAGES: StoryStage[] = [
  {
    id: 1,
    title: 'The bread.',
    subtitle: 'Baked at 5am, split lengthwise, still warm.',
    timestamp: 0.05,
    timecode: '00:01',
    notes: ['Wild yeast biga', '48h slow poolish', 'Stone hearth blister']
  },
  {
    id: 2,
    title: 'The layers.',
    subtitle: 'Prosciutto di Parma, fior di latte mozzarella, vine-ripened tomatoes, sweet basil.',
    timestamp: 0.38,
    timecode: '00:02',
    notes: ['24-Month Prosciutto', 'Fresh Fior di Latte', 'Cold-pressed Ligurian oil']
  },
  {
    id: 3,
    title: 'Wrapped.',
    subtitle: 'Butcher paper, a fold, tied with natural twine, your name on top.',
    timestamp: 0.72,
    timecode: '00:03',
    notes: ['Unbleached craft paper', 'Twine tied knot', 'Penciled batch mark']
  },
  {
    id: 4,
    title: 'Yours.',
    subtitle: 'Served on an olive wood board with a double shot of espresso, if you have a minute.',
    timestamp: 0.96,
    timecode: '00:04',
    notes: ['Single-origin Ethiopian doppio', 'Thick crema layer', 'Warm table service']
  }
];

export const CafePolidori: React.FC = () => {
  const [progress, setProgress] = useState(0.05); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync video time with scrub progress
  useEffect(() => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = progress * videoRef.current.duration;
    }

    // Determine active stage
    if (progress < 0.25) setActiveStageIndex(0);
    else if (progress < 0.58) setActiveStageIndex(1);
    else if (progress < 0.85) setActiveStageIndex(2);
    else setActiveStageIndex(3);
  }, [progress]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setProgress(prev => {
        let next = prev + delta * 0.15;
        if (next >= 1) next = 0;
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleScrub = (clientX: number, targetRect: DOMRect) => {
    const raw = (clientX - targetRect.left) / targetRect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    setProgress(clamped);

    // Subtle audio tick during scrub
    if (Math.abs(clamped - progress) > 0.04) {
      sounds.playTick(1.2 + clamped * 0.4);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsPlaying(false);
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrub(e.clientX, rect);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrub(e.clientX, rect);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      sounds.playCrunch();
    }
  };

  const handleJumpToStage = (index: number) => {
    setActiveStageIndex(index);
    setProgress(STAGES[index].timestamp);
    setIsPlaying(false);
    if (index === 0) sounds.playCrunch();
    else if (index === 3) sounds.playEspresso();
    else sounds.playTick(1.3);
  };

  const handleOrder = (name: string) => {
    sounds.playEspresso();
    setOrderedItem(name);
    setOrderModalOpen(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const currentStage = STAGES[activeStageIndex];

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-[#f4ede4] font-serif antialiased selection:bg-[#e2bb82] selection:text-black">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-7 flex items-center justify-between border-b border-white/10 text-xs tracking-widest uppercase font-mono">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-normal normal-case font-bold text-[#f4ede4]">
            Cafe Polidori
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/60">Milano 1984</span>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#menu" className="text-white/70 hover:text-white transition-colors">
            Il Menu
          </a>
          <a href="#story" className="hidden sm:inline text-white/70 hover:text-white transition-colors">
            The Ritual
          </a>
          <button
            onClick={() => handleJumpToStage(3)}
            className="px-4 py-2 rounded-full border border-[#e2bb82]/40 text-[#e2bb82] hover:bg-[#e2bb82] hover:text-black transition-all flex items-center gap-1.5"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Order at Counter</span>
          </button>
        </nav>
      </header>

      {/* Hero Headline & Philosophy */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="text-xs uppercase font-mono tracking-widest text-[#e2bb82] block mb-3">
          Artisanal Panini & Espresso
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#f4ede4] leading-tight mb-4">
          Baked in the morning.<br />
          <span className="italic font-normal">Sliced all day.</span>
        </h1>
        <p className="max-w-md mx-auto text-sm sm:text-base text-white/60 font-sans font-light">
          Espresso whenever you need it. Hand-crafted focaccia, 24-month prosciutto di Parma, sliced to the paper thinness of silk.
        </p>
      </section>

      {/* INTERACTIVE VIDEO / TIMELINE SCRUBBER SHOWCASE */}
      <section id="story" className="max-w-5xl mx-auto px-6 py-6 flex flex-col items-center">
        {/* Main Stage Presentation Frame */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl group">
          {/* Rectified Video Element */}
          <div 
            className="relative aspect-[16/9] w-full select-none cursor-ew-resize overflow-hidden flex items-center justify-center"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <video
              ref={videoRef}
              src="/assets/polidori/video.mp4"
              playsInline
              muted
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Stage Title and Story Overlay - Exact match to video! */}
            <div className="absolute bottom-10 left-8 max-w-lg pointer-events-none transition-all duration-300">
              <h2 className="text-3xl sm:text-5xl font-serif font-medium text-white mb-2 drop-shadow-md">
                {currentStage.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-sans font-light drop-shadow">
                {currentStage.subtitle}
              </p>
            </div>

            {/* Stage Ingredients Tag Overlay */}
            <div className="absolute top-6 right-6 hidden sm:flex flex-col gap-1.5 pointer-events-none">
              {currentStage.notes.map(note => (
                <span 
                  key={note}
                  className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80 text-right"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Control Console & Scrubber Bar */}
          <div className="w-full bg-[#141210] border-t border-white/15 p-5 flex flex-col gap-4">
            {/* Scrubber Track */}
            <div 
              className="relative w-full h-3 rounded-full bg-white/10 cursor-pointer overflow-hidden group/track"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Scrubbed fill */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d4af37] to-[#e2bb82] rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />

              {/* Stage division markers */}
              {STAGES.map(stage => (
                <div
                  key={stage.id}
                  className="absolute top-0 w-0.5 h-full bg-white/30"
                  style={{ left: `${stage.timestamp * 100}%` }}
                />
              ))}
            </div>

            {/* Playback Controls & Stage Jumpers */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playTick(isPlaying ? 0.9 : 1.4);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#e2bb82] hover:text-black flex items-center justify-center transition-all text-white"
                  title={isPlaying ? "Pause narrative" : "Play narrative"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    sounds.playTick(0.8);
                    setProgress(0.05);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  title="Restart from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="text-white/60 tracking-wider">
                  00:0{Math.floor(progress * 4) + 1} / 00:04
                </span>
              </div>

              {/* 4 Story Stage Selector Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {STAGES.map((st, idx) => (
                  <button
                    key={st.id}
                    onClick={() => handleJumpToStage(idx)}
                    className={`px-3 py-1.5 rounded-full transition-all text-[11px] font-sans ${
                      activeStageIndex === idx
                        ? 'bg-[#e2bb82] text-black font-semibold shadow-md'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{idx + 1}. {st.title.replace('.', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELI MENU & PANINI SELECTIONS */}
      <section id="menu" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-serif text-[#f4ede4] mb-2">
            Panini d'Autore
          </h3>
          <p className="text-xs uppercase font-mono tracking-widest text-[#e2bb82]">
            Served on fresh crusty ciabatta with Tuscan sea salt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'The Polidori Classico',
              italian: 'Prosciutto di Parma 24mo & Mozzarella',
              desc: 'Thinly draped prosciutto, torn fior di latte, vine tomatoes, basil pesto, cold-pressed olive oil.',
              price: '$17.50',
              badge: 'The Original'
            },
            {
              name: 'Truffle Mortadella',
              italian: 'Mortadella di Bologna & Stracciatella',
              desc: 'Artisanal pistachio mortadella, warm whipped stracciatella cheese, white truffle emulsion.',
              price: '$18.00',
              badge: 'Chef Choice'
            },
            {
              name: 'Arista Toscana',
              italian: 'Roasted Fennel Pork & Salsa Verde',
              desc: 'Slow-roasted herb pork loin, house salsa verde, pickled shallots, baby wild arugula.',
              price: '$16.50',
              badge: 'House Special'
            },
            {
              name: 'Caprese Nocciola',
              italian: 'Heirloom Tomato & Buffalo Mozzarella',
              desc: 'Ripe heirloom beefsteak tomatoes, fresh buffalo mozzarella, toasted hazelnuts, 12-year balsamic.',
              price: '$15.00',
              badge: 'Vegetariano'
            }
          ].map(item => (
            <div 
              key={item.name}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#e2bb82]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-lg font-serif font-semibold text-white">{item.name}</h4>
                  <span className="font-mono text-sm text-[#e2bb82]">{item.price}</span>
                </div>
                <div className="text-xs font-mono italic text-[#e2bb82]/80 mb-2">{item.italian}</div>
                <p className="text-xs text-white/60 font-sans leading-relaxed mb-4">{item.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-white/40">{item.badge}</span>
                <button
                  onClick={() => handleOrder(item.name)}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#e2bb82] hover:text-black text-xs font-sans font-medium transition-all"
                >
                  Order for Counter Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 py-12 text-center text-xs font-mono text-white/40">
        <p>CAFE POLIDORI • VIA SANTA CROCE 14 • MILANO</p>
        <p className="mt-1">STONE HEARTH BAKED • EVERY MORNING AT 05:00</p>
      </footer>

      {/* ORDER CONFIRMATION MODAL */}
      {orderModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setOrderModalOpen(false)}
        >
          <div 
            className="max-w-md w-full bg-[#161412] border border-[#e2bb82]/30 rounded-2xl p-6 text-white text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#e2bb82]/20 border border-[#e2bb82]/40 flex items-center justify-center mx-auto mb-4 text-[#e2bb82]">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-1">
              Ticket #042 Printed
            </h3>
            <p className="text-sm text-white/70 font-sans mb-4">
              Your sandwich <strong className="text-[#e2bb82]">{orderedItem}</strong> will be sliced and wrapped warm in butcher paper.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/80 space-y-1 mb-6 text-left">
              <div className="flex justify-between">
                <span>Estimated Wait:</span>
                <span className="text-[#e2bb82]">6 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Espresso Included:</span>
                <span className="text-[#e2bb82]">Double shot (Hot)</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Counter:</span>
                <span>Milano Station 2</span>
              </div>
            </div>

            <button
              onClick={() => setOrderModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#e2bb82] text-black font-semibold text-xs font-sans hover:bg-white transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
