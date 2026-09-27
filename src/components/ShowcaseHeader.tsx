import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Info, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export type ShowcaseSite = 'kettle' | 'polidori' | 'reyes';

interface ShowcaseHeaderProps {
  currentSite: ShowcaseSite;
  onSelectSite: (site: ShowcaseSite) => void;
}

export const ShowcaseHeader: React.FC<ShowcaseHeaderProps> = ({ currentSite, onSelectSite }) => {
  const [muted, setMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleToggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sounds.playTick(1.4);
    }
  };

  const handleSwitch = (site: ShowcaseSite) => {
    sounds.playSwoosh();
    onSelectSite(site);
  };

  return (
    <>
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl transition-all hover:border-white/30 text-xs sm:text-sm">
        {/* Claude Code badge inspired by the video */}
        <div className="flex items-center gap-1.5 pl-1.5 pr-2 border-r border-white/15 text-white/90">
          <div className="w-5 h-5 rounded-full bg-[#d97757] flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
            ✱
          </div>
          <span className="font-semibold tracking-wide hidden md:inline text-white/90">5K Studio</span>
        </div>

        {/* Site Switchers */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => handleSwitch('kettle')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-medium ${
              currentSite === 'kettle'
                ? 'bg-amber-500 text-black shadow-md font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🥯</span>
            <span>Kettle & Deck</span>
          </button>

          <button
            onClick={() => handleSwitch('polidori')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-medium ${
              currentSite === 'polidori'
                ? 'bg-[#e2bb82] text-black shadow-md font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🥖</span>
            <span>Café Polidori</span>
          </button>

          <button
            onClick={() => handleSwitch('reyes')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-medium ${
              currentSite === 'reyes'
                ? 'bg-[#ff334b] text-white shadow-md font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏛️</span>
            <span>Reyes & Hale</span>
          </button>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1 border-l border-white/15 pl-2 ml-1">
          <button
            onClick={handleToggleSound}
            title={muted ? "Unmute sound effects" : "Mute sound effects"}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            title="Showcase interaction details"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setShowInfo(false)}
        >
          <div 
            className="max-w-md w-full rounded-2xl bg-[#141416] border border-white/20 p-6 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#d97757] flex items-center justify-center font-bold text-xs">✱</div>
                <h3 className="font-bold text-base">Recreating "$5k Websites"</h3>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-white/50 hover:text-white px-2 py-1 text-sm rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-white/80 space-y-2 leading-relaxed">
              <p>This implementation accurately reproduces the 3 viral showcase designs from the recording:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/70">
                <li><strong className="text-amber-300">Kettle & Deck:</strong> Hero bagel on board, transition into dark 3D split view (<em>"Cut, never torn."</em>), horizontal scrub, bread steam, and bakery schedule.</li>
                <li><strong className="text-[#e2bb82]">Café Polidori:</strong> Frame-accurate scroll-scrubbed Italian sandwich storytelling across 4 sequential stages with interactive playhead and deli order drawer.</li>
                <li><strong className="text-[#ff334b]">Reyes & Hale:</strong> Full-screen architectural estate scrub with Take markers, dynamic HUD dimension overlay lines, and private viewing booking.</li>
              </ul>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/90">
                💡 <strong>Tip:</strong> Drag the red or gold timeline slider on any site or scroll to scrub through frames smoothly!
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
};
