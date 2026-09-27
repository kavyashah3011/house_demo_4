import React from 'react';
import { ArrowUpRight, Sparkles, Check, Flame } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  badge: string;
  metric: string;
  img: string;
}

interface ShowcaseGridProps {
  siteKey: 'reyes' | 'kettle' | 'polidori';
  onSelectItem: (item: ShowcaseItem) => void;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({ siteKey, onSelectItem }) => {
  const items: Record<'reyes' | 'kettle' | 'polidori', ShowcaseItem[]> = {
    reyes: [
      {
        id: 'rotunda',
        title: 'The Cathedral Rotunda',
        category: 'INTERIOR ARCHITECTURE',
        desc: 'Twenty-eight foot vertical limestone gallery with twin curved helical staircases and hand-hammered iron balustrades.',
        badge: 'Take 02',
        metric: '28.5 FT CEILING',
        img: '/assets/masters/reyes_rotunda_foyer.jpg'
      },
      {
        id: 'facade',
        title: 'Waterfront Facade & Loggia',
        category: 'EXTERIOR ENGINEERING',
        desc: 'Honed coral limestone exterior stretching across 120.4 feet of Mediterranean-inspired coastal frontage.',
        badge: 'Take 01',
        metric: '120.4 FT BREADTH',
        img: '/assets/masters/reyes_mansion_facade.jpg'
      },
      {
        id: 'terrace',
        title: 'Infinity Reflection Basin',
        category: 'LANDSCAPE',
        desc: 'Seventy-five foot dark obsidian pebble pool cascading seamlessly toward 340 linear feet of private bay waters.',
        badge: 'Waterfront',
        metric: '340 FT WATERFRONT',
        img: '/assets/masters/reyes_aerial_dock.jpg'
      },
      {
        id: 'sanctuary',
        title: 'Owner Primary Wing',
        category: 'PRIVATE RESIDENCE',
        desc: 'Full-floor private suite featuring sunrise bay terrace, dual limestone dressing suites, and integrated security safe room.',
        badge: 'Private Suite',
        metric: '2,400 SQ FT WING',
        img: '/assets/masters/reyes_mansion_facade.jpg'
      }
    ],
    kettle: [
      {
        id: 'everything',
        title: 'The Signature Everything',
        category: 'HEARTH BAKE',
        desc: 'Heirloom black and white sesame seeds, toasted garlic flakes, dried shallots, and cracked Maldon sea salt crystals.',
        badge: 'Morning Classic',
        metric: '550°F STONE BAKE',
        img: '/assets/masters/kettle_bagel_hero.jpg'
      },
      {
        id: 'split',
        title: 'The Hot Split',
        category: 'THE RITUAL',
        desc: 'Sliced with precision while the internal steam retains its aromatics. Never squished, never torn.',
        badge: '04:30 Split',
        metric: 'CUT, NEVER TORN',
        img: '/assets/masters/kettle_bagel_split.jpg'
      },
      {
        id: 'hearth',
        title: 'Stone Hearth Deck Oven',
        category: 'ORGANIC MALT',
        desc: 'Kettle-poached in barley malt syrup and stone-baked directly on 550°F refractory hearth decks.',
        badge: 'Daily Hearth',
        metric: '550°F HEARTH',
        img: '/assets/masters/kettle_hearth_oven.jpg'
      },
      {
        id: 'board',
        title: 'The Baker\'s Board',
        category: 'DAILY RUN',
        desc: 'Served warm on rustic olive wood cutting boards with freshly whipped scallion schmear and house lox.',
        badge: 'Fresh Out',
        metric: '12-BAGEL DOZEN',
        img: '/assets/masters/kettle_bagel_hero.jpg'
      }
    ],
    polidori: [
      {
        id: 'bread',
        title: 'Stone Hearth Ciabatta',
        category: 'THE BREAD',
        desc: 'Baked at 5:00 AM on volcanic stone decks. Crisp glass-like crust with tender, highly hydrated alveolar crumb.',
        badge: 'Step 01: Bread',
        metric: '84% HYDRATION',
        img: '/assets/masters/polidori_bread_split.jpg'
      },
      {
        id: 'classico',
        title: 'The Polidori Classico',
        category: 'PANINO D\'AUTORE',
        desc: '24-month aged Prosciutto di Parma sliced paper-thin, torn fior di latte mozzarella, vine-ripened tomatoes, sweet basil.',
        badge: 'Step 02: Layers',
        metric: '24MO PROSCIUTTO',
        img: '/assets/masters/polidori_sandwich_layers.jpg'
      },
      {
        id: 'wrapped',
        title: 'The Twine Wrap',
        category: 'PACKAGING',
        desc: 'Folded in unbleached butcher paper, bound with coarse natural jute twine, with your morning order ticket penciled on top.',
        badge: 'Step 03: Wrapped',
        metric: 'CRAFT PAPER & TWINE',
        img: '/assets/masters/polidori_wrapped_panino.jpg'
      },
      {
        id: 'yours',
        title: 'Yours with an Espresso',
        category: 'THE COUNTER',
        desc: 'Served alongside a single-origin Ethiopian espresso extracted at 9 bar pressure with velvety tiger-stripe crema.',
        badge: 'Step 04: Yours',
        metric: 'DOUBLE SHOT CREMA',
        img: '/assets/masters/polidori_yours_espresso.jpg'
      }
    ]
  };

  const currentItems = items[siteKey];

  return (
    <section className="relative w-full bg-[#070709] text-white py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase block mb-2">
              Curated Portfolio
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Detailed Perspectives & Specs
            </h3>
          </div>
          <span className="text-xs font-mono text-white/40">
            04 KEY CHAPTER HIGHLIGHTS
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentItems.map(item => (
            <div
              key={item.id}
              onClick={() => {
                sounds.playTick(1.3);
                onSelectItem(item);
              }}
              className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90">
                  {item.badge}
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-amber-400">
                  {item.metric}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
                  {item.category}
                </span>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
