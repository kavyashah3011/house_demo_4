import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Shield, Phone, ArrowUpRight, Compass, Maximize2, Layers, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/soundEngine';

interface Take {
  id: number;
  title: string;
  label: string;
  headline: string;
  sub: string;
  price: string;
  mls: string;
  dimensionLabel: string;
  dimensionValue: string;
  progressRange: [number, number]; // start, end
}

const TAKES: Take[] = [
  {
    id: 1,
    title: 'THE HOUSE',
    label: 'TAKE 01 — THE HOUSE',
    headline: 'ELEVEN THOUSAND SQUARE FEET.',
    sub: 'Mediterranean contemporary estate situated along 340 feet of private bay frontage.',
    price: '$24,500,000',
    mls: 'MLS# 45391',
    dimensionLabel: 'PROPERTY BREADTH',
    dimensionValue: '120.4 FT',
    progressRange: [0.45, 1.0]
  },
  {
    id: 2,
    title: 'GRAND FOYER',
    label: 'TAKE 02 — GRAND FOYER',
    headline: 'EVERY DOOR OPENS TO THE WATER.',
    sub: 'Twin floating limestone staircases beneath an arched cathedral rotunda.',
    price: '$24,500,000',
    mls: 'MLS# 45391',
    dimensionLabel: 'CEILING HEIGHT',
    dimensionValue: '28.5 FT',
    progressRange: [0.0, 0.44]
  }
];

export const ReyesAndHale: React.FC = () => {
  const [progress, setProgress] = useState(0.2); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [currentTakeIndex, setCurrentTakeIndex] = useState(1);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [hudActive, setHudActive] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync video time with scrub
  useEffect(() => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = progress * videoRef.current.duration;
    }

    if (progress < 0.45) {
      setCurrentTakeIndex(1); // Grand Foyer
    } else {
      setCurrentTakeIndex(0); // The House
    }
  }, [progress]);

  const handleScrub = (clientX: number, targetRect: DOMRect) => {
    const raw = (clientX - targetRect.left) / targetRect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    setProgress(clamped);

    if (Math.abs(clamped - progress) > 0.04) {
      sounds.playTick(0.9 + clamped * 0.4);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
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
      sounds.playLuxuryChime();
    }
  };

  const handleSelectTake = (takeIndex: number) => {
    sounds.playLuxuryChime();
    const target = takeIndex === 0 ? 0.75 : 0.15;
    setProgress(target);
  };

  const handleBookViewing = () => {
    sounds.playLuxuryChime();
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.5 }
    });
    setBookingConfirmed(true);
  };

  const activeTake = TAKES[currentTakeIndex];

  return (
    <div className="relative w-full min-h-screen bg-[#07090d] text-white font-sans antialiased overflow-hidden select-none">
      {/* Background Architectural Video Scrub */}
      <div 
        className="absolute inset-0 w-full h-full cursor-ew-resize"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <video
          ref={videoRef}
          src="/assets/reyes/video.mp4"
          playsInline
          muted
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Subtle cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Top Header - Exact match to video: "REYES & HALE", "PART 01 / THE HOUSE", "[ ARRANGE A VIEWING ]" */}
      <header className="absolute top-0 left-0 w-full px-6 sm:px-12 py-8 flex items-center justify-between z-30 pointer-events-none">
        {/* Brand */}
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-display font-black tracking-widest text-white uppercase">
            REYES & HALE
          </span>
        </div>

        {/* Center Take Indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-mono tracking-widest uppercase text-white/80 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#ff334b] animate-ping" />
          <span>{currentTakeIndex === 1 ? 'PART 02 / GRAND FOYER' : 'PART 01 / THE HOUSE'}</span>
        </div>

        {/* Arrange a viewing button */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => setHudActive(!hudActive)}
            title="Toggle Architectural Measurement HUD"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-all text-xs"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playSwoosh();
              setViewingModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-none border border-[#ff334b] text-[#ff334b] hover:bg-[#ff334b] hover:text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all shadow-lg bg-black/40 backdrop-blur-sm"
          >
            [ ARRANGE A VIEWING ]
          </button>
        </div>
      </header>

      {/* HUD Architectural Dimension Overlay Lines (Matches Video exactly!) */}
      {hudActive && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {currentTakeIndex === 0 ? (
            /* Dimension Line across mansion facade */
            <div className="absolute top-[38%] left-[30%] sm:left-[36%] w-[42%] flex flex-col items-center animate-fade-in">
              <div className="flex items-center justify-between w-full text-[10px] sm:text-xs font-mono text-white/90 mb-1 tracking-wider">
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur">PROPERTY BREADTH 120.4 FT</span>
                <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur">±0.2 IN</span>
              </div>
              <div className="w-full flex items-center">
                <div className="w-1.5 h-3 bg-white" />
                <div className="flex-1 h-px bg-white/70 border-t border-dashed border-white" />
                <div className="w-1.5 h-3 bg-white" />
              </div>
            </div>
          ) : (
            /* Dimension Line for Grand Foyer Ceiling */
            <div className="absolute top-[28%] left-[48%] h-[35%] flex flex-row items-center animate-fade-in">
              <div className="h-full flex flex-col items-center">
                <div className="w-3 h-1.5 bg-white" />
                <div className="flex-1 w-px bg-white/70 border-l border-dashed border-white" />
                <div className="w-3 h-1.5 bg-white" />
              </div>
              <span className="ml-2 text-[10px] sm:text-xs font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur tracking-wider">
                ROTUNDA HEIGHT 28.5 FT
              </span>
            </div>
          )}
        </div>
      )}

      {/* Big Headline Overlay - Left aligned bottom half (Exact Match to Video!) */}
      <div className="absolute bottom-24 left-6 sm:left-12 max-w-2xl z-20 pointer-events-none">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter text-white leading-none mb-3 drop-shadow-2xl uppercase">
          {activeTake.headline}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono tracking-wider">
          <span className="text-[#ff334b] font-bold">{activeTake.price}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/80 uppercase font-semibold">SOLE AGENCY</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">{activeTake.mls}</span>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-md font-light drop-shadow">
          {activeTake.sub}
        </p>
      </div>

      {/* BOTTOM SCRUBBER BAR - Exact match to video: "TAKE 01 — THE HOUSE", Red Timeline Scrubber, "45391 / MLS" */}
      <div className="absolute bottom-6 left-0 w-full px-6 sm:px-12 z-30 flex flex-col gap-2">
        {/* Scrubber control */}
        <div 
          className="relative w-full h-2 rounded-full bg-white/20 cursor-pointer overflow-visible group/scrub"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Active red progress line */}
          <div 
            className="absolute top-0 left-0 h-full bg-[#ff334b] rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />

          {/* Draggable scrub head */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-[#ff334b] pointer-events-none"
            style={{ left: `calc(${progress * 100}% - 8px)` }}
          />
        </div>

        {/* Bottom bar metadata line */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-white/70 pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectTake(0)}
              className={`hover:text-[#ff334b] transition-colors ${currentTakeIndex === 0 ? 'text-[#ff334b] font-bold' : ''}`}
            >
              TAKE 01 — THE HOUSE
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => handleSelectTake(1)}
              className={`hover:text-[#ff334b] transition-colors ${currentTakeIndex === 1 ? 'text-[#ff334b] font-bold' : ''}`}
            >
              TAKE 02 — GRAND FOYER
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-white/50">DRAG TIMELINE TO SCRUB</span>
            <span className="text-white/80 font-bold">45391 / MLS</span>
          </div>
        </div>
      </div>

      {/* ARRANGE A VIEWING MODAL */}
      {viewingModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setViewingModalOpen(false)}
        >
          <div 
            className="max-w-lg w-full bg-[#0d1017] border border-white/20 p-8 text-white shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#ff334b] uppercase tracking-widest block mb-1">
                  Private Brokerage Portfolio
                </span>
                <h3 className="text-2xl font-display font-black tracking-tight">
                  ARRANGE A PRIVATE VIEWING
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">ESTATE 45391 • $24,500,000 USD</p>
              </div>
              <button
                onClick={() => setViewingModalOpen(false)}
                className="text-white/50 hover:text-white px-2 py-1 text-sm rounded border border-white/10"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold">Confidential Dossier Dispatched</h4>
                <p className="text-xs text-white/70 max-w-sm mx-auto">
                  Senior Managing Partner Catherine Hale has received your viewing request. Private helipad or yacht arrival coordinates will be sent via encrypted channel.
                </p>
                <button
                  onClick={() => setViewingModalOpen(false)}
                  className="mt-4 px-6 py-2 bg-white text-black font-mono text-xs uppercase font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-white/60 uppercase mb-1">Principal / Representative Name</label>
                  <input
                    type="text"
                    defaultValue="Alexander Vance"
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 text-white rounded-none focus:outline-none focus:border-[#ff334b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 uppercase mb-1">Preferred Date</label>
                    <input
                      type="date"
                      defaultValue="2026-09-18"
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 text-white rounded-none focus:outline-none focus:border-[#ff334b]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 uppercase mb-1">Arrival Mode</label>
                    <select className="w-full px-3 py-2 bg-black/50 border border-white/20 text-white rounded-none focus:outline-none focus:border-[#ff334b]">
                      <option>Chauffeured Sedan</option>
                      <option>Helicopter (Pad A)</option>
                      <option>Deep-Water Yacht Dock</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-white/70 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#ff334b] shrink-0 mt-0.5" />
                  <span>
                    Non-disclosure agreement (NDA) and proof of funds verification will be executed prior to perimeter access.
                  </span>
                </div>

                <button
                  onClick={handleBookViewing}
                  className="w-full py-3 bg-[#ff334b] text-white font-bold tracking-widest uppercase hover:bg-red-600 transition-all text-xs"
                >
                  Submit Viewing Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
