import React, { useState, useEffect } from 'react';
import { ShowcaseHeader, ShowcaseSite } from './components/ShowcaseHeader';
import { ScrollyCanvas, Chapter } from './components/ScrollyCanvas';
import { StatsMarquee } from './components/StatsMarquee';
import { EditorialSection } from './components/EditorialSection';
import { ShowcaseGrid } from './components/ShowcaseGrid';
import { LuxuryFooter } from './components/LuxuryFooter';
import { InteractiveModal } from './components/InteractiveModal';
import { sounds } from './utils/soundEngine';

interface SiteConfig {
  key: ShowcaseSite;
  brandTitle: string;
  tagline: string;
  totalFrames: number;
  framesPath: string;
  accentColor: string;
  chapters: Chapter[];
}

const SITE_CONFIGS: Record<ShowcaseSite, SiteConfig> = {
  reyes: {
    key: 'reyes',
    brandTitle: 'REYES & HALE',
    tagline: 'PRIVATE BROKERAGE • RESIDENCE 45391',
    totalFrames: 120,
    framesPath: '/assets/reyes',
    accentColor: '#ff334b',
    chapters: [
      {
        id: 'exterior',
        label: 'THE ESTATE',
        progress: 0.0,
        range: [0.0, 0.28],
        title: 'EVERY DOOR OPENS TO THE WATER.',
        sub: 'Forty feet of floor-to-ceiling glass stretches between interior limestone and private bay waters.',
        hud: 'WATER FRONTAGE 340 FT',
        ctaText: 'Arrange a Viewing'
      },
      {
        id: 'facade',
        label: 'BREADTH',
        progress: 0.38,
        range: [0.28, 0.58],
        title: 'ELEVEN THOUSAND SQUARE FEET.',
        sub: '$24,500,000 / SOLE AGENCY / MLS# 45391',
        hud: 'PROPERTY BREADTH 120.4 FT',
        ctaText: 'View Blueprint Specs'
      },
      {
        id: 'foyer',
        label: 'ROTUNDA',
        progress: 0.72,
        range: [0.58, 0.88],
        title: 'THE TWIN SPIRAL FOYER.',
        sub: 'Hand-forged iron balustrades beneath a twenty-eight foot cathedral rotunda.',
        hud: 'ROTUNDA HEIGHT 28.5 FT',
        ctaText: 'Request Floorplans'
      },
      {
        id: 'sanctuary',
        label: 'SANCTUARY',
        progress: 1.0,
        range: [0.88, 1.0],
        title: 'UNCOMPROMISING LUXURY.',
        sub: 'Private deep-water yacht dock, infinity reflection pool, and executive helipad access.',
        hud: 'DEEP WATER YACHT DOCK',
        ctaText: 'Book Private Tour'
      }
    ]
  },
  kettle: {
    key: 'kettle',
    brandTitle: 'KETTLE & DECK',
    tagline: 'HAND-ROLLED ARTISAN BAGELS',
    totalFrames: 120,
    framesPath: '/assets/kettle',
    accentColor: '#e5a955',
    chapters: [
      {
        id: 'hero',
        label: 'MORNING BOIL',
        progress: 0.0,
        range: [0.0, 0.25],
        title: 'Boiled at four. Sold by seven.',
        sub: 'Six kinds of bagel, one dark roast, and a queue that starts before the sun does.',
        badge: '04:00 AM HEARTH',
        ctaText: 'Reserve a Dozen'
      },
      {
        id: 'craft',
        label: 'THE CRAFT',
        progress: 0.35,
        range: [0.25, 0.52],
        title: 'Hand-Rolled & Malt Boiled.',
        sub: 'Poached in authentic barley malt kettle bath for genuine blistered sheen.',
        badge: 'BARLEY MALT KETTLE',
        ctaText: 'Explore Batch Times'
      },
      {
        id: 'split',
        label: 'THE HOT SPLIT',
        progress: 0.68,
        range: [0.52, 0.82],
        title: 'Cut, never torn.',
        sub: 'The steam should still be in it when it reaches the counter.',
        badge: '04:30 — THE HOT SPLIT',
        ctaText: 'Build Dozen Box'
      },
      {
        id: 'board',
        label: 'THE BOARD',
        progress: 1.0,
        range: [0.82, 1.0],
        title: 'Honeycomb Crumb & Schmear.',
        sub: 'Crisp blistered crust giving way to an airy, dense chew with house whipped cream cheese.',
        badge: 'FRESH ON WOOD BOARD',
        ctaText: 'Order Morning Box'
      }
    ]
  },
  polidori: {
    key: 'polidori',
    brandTitle: 'CAFE POLIDORI',
    tagline: 'MILANO 1984 • SALUMERIA & TORREFAZIONE',
    totalFrames: 120,
    framesPath: '/assets/polidori',
    accentColor: '#e2bb82',
    chapters: [
      {
        id: 'bread',
        label: 'THE BREAD',
        progress: 0.0,
        range: [0.0, 0.28],
        title: 'The bread.',
        sub: 'Baked at 5am, split lengthwise, still warm.',
        badge: '05:00 AM STONE HEARTH',
        ctaText: 'The Morning Bake'
      },
      {
        id: 'layers',
        label: 'THE LAYERS',
        progress: 0.38,
        range: [0.28, 0.62],
        title: 'The layers.',
        sub: 'Prosciutto di Parma, fior di latte mozzarella, vine-ripened tomatoes, sweet basil.',
        badge: '24-MONTH PROSCIUTTO',
        ctaText: 'Inspect Ingredients'
      },
      {
        id: 'wrapped',
        label: 'WRAPPED',
        progress: 0.72,
        range: [0.62, 0.88],
        title: 'Wrapped.',
        sub: 'Butcher paper, a fold, tied with natural twine, your name on top.',
        badge: 'TIED WITH TWINE',
        ctaText: 'Order at Counter'
      },
      {
        id: 'yours',
        label: 'YOURS',
        progress: 1.0,
        range: [0.88, 1.0],
        title: 'Yours.',
        sub: 'Served on an olive wood board with a double shot of espresso, if you have a minute.',
        badge: 'DOPPIO ESPRESSO',
        ctaText: 'Print Order Ticket'
      }
    ]
  }
};

export const App: React.FC = () => {
  const [currentSite, setCurrentSite] = useState<ShowcaseSite>('reyes');
  const [modalOpen, setModalOpen] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') {
        sounds.playSwoosh();
        setCurrentSite('reyes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === '2') {
        sounds.playSwoosh();
        setCurrentSite('kettle');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === '3') {
        sounds.playSwoosh();
        setCurrentSite('polidori');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'm') {
        sounds.toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentConfig = SITE_CONFIGS[currentSite];

  const handleSelectSite = (site: ShowcaseSite) => {
    setCurrentSite(site);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white selection:bg-amber-400 selection:text-black">
      {/* Floating Top Navigation Switcher */}
      <ShowcaseHeader
        currentSite={currentSite}
        onSelectSite={handleSelectSite}
      />

      {/* Main 60FPS Canvas Frame-Scrubbing Scrolly Engine */}
      <ScrollyCanvas
        key={currentSite}
        siteKey={currentSite}
        brandTitle={currentConfig.brandTitle}
        tagline={currentConfig.tagline}
        totalFrames={currentConfig.totalFrames}
        framesPath={currentConfig.framesPath}
        chapters={currentConfig.chapters}
        accentColor={currentConfig.accentColor}
        onOpenAction={() => setModalOpen(true)}
      />

      {/* Infinite Luxury Stats Marquee */}
      <StatsMarquee />

      {/* Editorial Craftsmanship & Architectural Dossier Section */}
      <EditorialSection
        siteKey={currentSite}
        onActionClick={() => setModalOpen(true)}
      />

      {/* Interactive Perspectives Showcase Grid */}
      <ShowcaseGrid
        siteKey={currentSite}
        onSelectItem={() => setModalOpen(true)}
      />

      {/* Live Global Timezone Clocks & Luxury Footer */}
      <LuxuryFooter />

      {/* Interactive Modal Form (Viewing, Dozen Builder, Ticket) */}
      <InteractiveModal
        siteKey={currentSite}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default App;
