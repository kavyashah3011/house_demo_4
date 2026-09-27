import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, ArrowUpRight, Compass, Sparkles, Clock, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export interface Chapter {
  id: string;
  label: string;
  progress: number;
  range: [number, number];
  title: string;
  sub: string;
  badge?: string;
  hud?: string;
  ctaText?: string;
}

interface ScrollyCanvasProps {
  siteKey: 'reyes' | 'kettle' | 'polidori';
  brandTitle: string;
  tagline: string;
  totalFrames: number;
  framesPath: string;
  chapters: Chapter[];
  accentColor: string; // e.g. '#ff334b' or '#e5c189' or '#dfa255'
  onOpenAction: (chapterId: string) => void;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  siteKey,
  brandTitle,
  tagline,
  totalFrames,
  framesPath,
  chapters,
  accentColor,
  onOpenAction
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hudActive, setHudActive] = useState(true);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isAutoPlayingRef = useRef(false);

  // 1. PRELOAD FRAMES
  useEffect(() => {
    setIsLoading(true);
    setLoadPct(0);
    imagesRef.current = [];

    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${framesPath}/frame_${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / totalFrames) * 100);
        setLoadPct(pct);
        if (loadedCount === totalFrames) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsLoading(false);
        }
      };

      imgs[i] = img;
    }

    imagesRef.current = imgs;

    return () => {
      imagesRef.current = [];
    };
  }, [totalFrames, framesPath]);

  // 2. SCROLL & LERP RENDER LOOP
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (scrollable > 0) {
        const p = Math.max(0, Math.min(1, -rect.top / scrollable));
        targetProgressRef.current = p;
        setTargetProgress(p);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Canvas render frame function
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Auto-play progress accumulation
      if (isAutoPlayingRef.current) {
        targetProgressRef.current += 0.00065;
        if (targetProgressRef.current >= 1) {
          targetProgressRef.current = 0;
        }
        if (containerRef.current) {
          const scrollable = containerRef.current.offsetHeight - window.innerHeight;
          window.scrollTo({
            top: containerRef.current.offsetTop + targetProgressRef.current * scrollable,
            behavior: 'auto'
          });
        }
      }

      // Smooth Lerp Physics
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.08;
      const progress = currentProgressRef.current;
      setCurrentProgress(progress);

      // Sizing canvas to window with retina DPR
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = window.innerWidth * dpr;
      const targetHeight = window.innerHeight * dpr;

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      // Frame Index
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(progress * (totalFrames - 1)))
      );

      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        // Object-fit: cover math
        const hRatio = canvas.width / img.naturalWidth;
        const vRatio = canvas.height / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);

        const renderW = img.naturalWidth * ratio;
        const renderH = img.naturalHeight * ratio;
        const shiftX = (canvas.width - renderW) / 2;
        const shiftY = (canvas.height - renderH) / 2;

        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, renderW, renderH);
      }

      // Determine active chapter
      const chIdx = chapters.findIndex(ch => progress >= ch.range[0] && progress <= ch.range[1]);
      if (chIdx !== -1 && chIdx !== activeChapterIndex) {
        setActiveChapterIndex(chIdx);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalFrames, chapters, activeChapterIndex]);

  // Jump to chapter
  const handleJumpToChapter = (chapter: Chapter) => {
    sounds.playTick(1.2);
    if (!containerRef.current) return;
    const scrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerRef.current.offsetTop + chapter.progress * scrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Toggle Auto-Tour
  const handleToggleAutoTour = () => {
    const nextState = !isAutoPlaying;
    setIsAutoPlaying(nextState);
    isAutoPlayingRef.current = nextState;
    sounds.playSwoosh();
  };

  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: '420vh' }}
    >
      {/* Sticky 100vh Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#070709]">
        {/* Full-Screen Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover block"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/60 pointer-events-none z-10" />

        {/* LUXURY PRELOADER (Exact match to reference site) */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#070709] transition-opacity duration-700">
            <div className="w-[90%] max-w-sm text-center">
              <div className="font-display tracking-[0.3em] text-sm text-white/90 font-bold mb-6 uppercase">
                {brandTitle}
              </div>

              <div className="w-full h-0.5 bg-white/10 overflow-hidden rounded-full mb-3">
                <div 
                  className="h-full transition-all duration-200 rounded-full"
                  style={{ 
                    width: `${loadPct}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 12px ${accentColor}`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/50 tracking-wider">
                <span>INITIALIZING DIGITAL EXPERIENCE</span>
                <span className="text-white font-semibold">{loadPct}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURAL HUD OVERLAYS (Active for Reyes & Hale or Technical Specs) */}
        {hudActive && activeChapter.hud && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white/90 flex items-center gap-3 shadow-2xl animate-fade-in">
              <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
              <span className="tracking-widest uppercase">{activeChapter.hud}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/60">PRECISION 0.1%</span>
            </div>
          </div>
        )}

        {/* SYNCHRONIZED CHAPTER OVERLAYS (Exact typography from video) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end p-8 sm:p-14">
          <div className="max-w-3xl transition-all duration-500 transform translate-y-0 opacity-100 mb-8 sm:mb-12">
            {/* Chapter Badge */}
            {activeChapter.badge && (
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest uppercase mb-4"
                style={{ color: accentColor }}
              >
                <Clock className="w-3 h-3" />
                <span>{activeChapter.badge}</span>
              </div>
            )}

            {/* Chapter Main Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-2xl mb-4">
              {activeChapter.title}
            </h2>

            {/* Chapter Subtitle */}
            <p className="text-sm sm:text-base text-white/80 font-sans font-light max-w-xl leading-relaxed drop-shadow mb-6">
              {activeChapter.sub}
            </p>

            {/* CTA Action Dock */}
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.playSwoosh();
                  onOpenAction(activeChapter.id);
                }}
                className="px-6 py-3 rounded-full font-mono text-xs tracking-widest uppercase font-bold text-black transition-all shadow-xl hover:scale-105 flex items-center gap-2"
                style={{ 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 25px ${accentColor}40`
                }}
              >
                <span>{activeChapter.ctaText || 'Explore Details'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playTick(1.0);
                  setHudActive(!hudActive);
                }}
                title="Toggle HUD overlays"
                className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-all text-xs"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING AUTO-TOUR CONTROL PILL (Bottom Left - Reference Site match!) */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl text-xs font-mono">
          <button
            onClick={handleToggleAutoTour}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            aria-label="Toggle Cinematic Auto-Tour"
          >
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isAutoPlaying ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/15 text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </div>
            <span className="hidden sm:inline tracking-wider uppercase font-semibold">
              {isAutoPlaying ? 'Auto-Tour Running' : 'Start Auto-Tour'}
            </span>
          </button>

          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/60">
            {Math.round(currentProgress * 100)}%
          </span>
        </div>

        {/* RIGHT-SIDE LUXURY TIMELINE TRACKER (Exact match to reference site!) */}
        <div className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center gap-4 pointer-events-auto">
          {/* Vertical Track Line */}
          <div className="relative w-0.5 h-60 bg-white/15 rounded-full overflow-hidden">
            {/* Active Fill */}
            <div 
              className="absolute top-0 left-0 w-full rounded-full transition-all"
              style={{ 
                height: `${currentProgress * 100}%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}`
              }}
            />
          </div>

          {/* Chapter Markers */}
          <div className="flex flex-col justify-between h-60 py-1">
            {chapters.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleJumpToChapter(ch)}
                  className="flex items-center gap-3 group text-left transition-all"
                >
                  <div 
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive 
                        ? 'scale-150 shadow-md' 
                        : 'bg-white/30 group-hover:bg-white/70'
                    }`}
                    style={{ backgroundColor: isActive ? accentColor : undefined }}
                  />
                  <span 
                    className={`text-[10px] font-mono tracking-widest uppercase transition-all ${
                      isActive 
                        ? 'font-bold opacity-100' 
                        : 'opacity-40 group-hover:opacity-80'
                    }`}
                    style={{ color: isActive ? accentColor : '#ffffff' }}
                  >
                    {ch.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SCRUBBER TRACK (Exact match to video timeline!) */}
        <div className="absolute bottom-2 left-0 w-full px-6 sm:px-10 z-30">
          <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${currentProgress * 100}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
