import React from 'react';
import { Compass, Sparkles, Award, Shield, Layers, Clock, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

interface EditorialSectionProps {
  siteKey: 'reyes' | 'kettle' | 'polidori';
  onActionClick: () => void;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({ siteKey, onActionClick }) => {
  const content = {
    reyes: {
      eyebrow: 'ARCHITECTURAL DOSSIER • RESIDENCE 45391',
      title: 'Monolithic waterfront engineering meets Mediterranean restraint.',
      desc: 'Commissioned by international industrialists and engineered over four years, Residence 45391 represents the zenith of private coastal architecture. Eleven thousand square feet of hand-honed French limestone, forty-foot operable glass pocket walls, and twin cantilevered spiral staircases.',
      stats: [
        { label: 'INTERIOR AREA', val: '11,420 SQ FT' },
        { label: 'BAY FRONTAGE', val: '340 LINEAR FT' },
        { label: 'CEILING ROTUNDA', val: '28.5 FT CLEAR' },
        { label: 'YACHT DOCKAGE', val: 'DEEP WATER 140 FT' },
      ],
      features: [
        { title: 'Twin Helical Staircases', text: 'Curved structural steel clad in imported Crema Marfil limestone with bespoke forged iron balustrades.' },
        { title: 'Sub-Zero & Gaggenau Galley', text: 'Custom fluted walnut cabinetry with integrated dual chef suites and walk-in temperature-controlled wine room.' },
        { title: 'Zero-Edge Pool', text: 'Seventy-five foot infinity reflection basin merging visually with the horizon of the open bay.' }
      ],
      btn: 'Request Private Dossier'
    },
    kettle: {
      eyebrow: 'THE MORNING RITUAL • HEARTH CRAFT',
      title: 'Boiled in malted barley water. Baked on stone decks at 550°F.',
      desc: 'Our dough begins forty-eight hours before dawn with a wild-yeast preferment and cold fermentation. Hand-shaped by veteran bakers, kettle-boiled in organic malted barley wash, and stone-baked until the exterior achieves a microscopic blistered crust with chewy honeycomb crumb.',
      stats: [
        { label: 'COLD FERMENT', val: '24–48 HOURS' },
        { label: 'FIRST KETTLE BOIL', val: '04:00 AM' },
        { label: 'STONE HEARTH TEMP', val: '550° FAHRENHEIT' },
        { label: 'BATCH CAPACITY', val: '120 DOZEN / DAY' },
      ],
      features: [
        { title: 'Barley Malt Kettle Wash', text: 'Traditional immersion boiling caramelizes exterior starches for an authentic, glass-crackling chew.' },
        { title: 'Heritage Grain Blend', text: 'Stone-ground unbleached hard red winter wheat and unbromated spring flours sourced from single-family mills.' },
        { title: 'Cut, Never Torn', text: 'Always split hot with an offset serrated blade to preserve the delicate steam pocket within the honeycomb.' }
      ],
      btn: 'Reserve Morning Dozen'
    },
    polidori: {
      eyebrow: 'MILANO 1984 • SALUMERIA & TORREFAZIONE',
      title: 'The bread is baked at dawn. The prosciutto is sliced to translucent silk.',
      desc: 'A sanctuary of Northern Italian culinary discipline. Crisp, airy ciabatta baked fresh every three hours, layered with twenty-four-month Prosciutto di Parma, torn mozzarella di bufala, vine-ripened pomodori, and cold-pressed Ligurian olive oil. Wrapped in coarse butcher paper, tied with twine, and handed to you with a scalding espresso.',
      stats: [
        { label: 'PROSCIUTTO MATURATION', val: '24 MONTHS' },
        { label: 'FRESH BAKE CADENCE', val: 'EVERY 3 HOURS' },
        { label: 'ESPRESSO PRESSURE', val: '9 BAR / 93°C' },
        { label: 'MOZZARELLA ORIGIN', val: 'CAMPANIA DOP' },
      ],
      features: [
        { title: 'Manual Berkel Slicing', text: 'Flywheel mechanical slicer prevents friction heat, preserving the melt-in-mouth texture of the cured prosciutto.' },
        { title: 'High-Hydration Ciabatta', text: '84% hydration poolish dough with generous alveolar structure, blistered on natural refractory volcanic stone.' },
        { title: 'Double Shot Extraction', text: 'Single-origin washed beans extracted for 26 seconds with rich hazelnut crema that holds a dusting of sugar.' }
      ],
      btn: 'Order at the Counter'
    }
  }[siteKey];

  return (
    <section className="relative w-full bg-[#0a0a0d] text-white py-24 sm:py-32 border-t border-white/10 overflow-hidden">
      {/* Background subtle radial spotlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{content.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-6">
            {content.title}
          </h2>

          <p className="text-base sm:text-lg text-white/70 font-sans font-light leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* 4 Stats Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {content.stats.map(stat => (
            <div 
              key={stat.label}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mb-1">
                {stat.val}
              </div>
              <div className="text-[11px] font-mono text-white/50 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3 Detailed Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {content.features.map(f => (
            <div 
              key={f.title}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-white/60 font-sans leading-relaxed">
                  {f.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-white/40">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>CERTIFIED ARTISAN STANDARD</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-display font-bold text-white mb-1">
              Experience the Craftsmanship Firsthand
            </h4>
            <p className="text-sm text-white/60 font-sans">
              Direct access reservations, private appointments, and morning batch holds.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playSwoosh();
              onActionClick();
            }}
            className="px-8 py-4 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-all shadow-xl flex items-center gap-2 shrink-0"
          >
            <span>{content.btn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
