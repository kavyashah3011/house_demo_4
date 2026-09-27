import React, { useState } from 'react';
import { Check, Shield, ShoppingBag, Coffee, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEngine';

interface InteractiveModalProps {
  siteKey: 'reyes' | 'kettle' | 'polidori';
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveModal: React.FC<InteractiveModalProps> = ({ siteKey, isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [bagelCounts, setBagelCounts] = useState<Record<string, number>>({
    'Everything': 4,
    'Rosemary Sea Salt': 4,
    'Classic Sesame': 4,
  });
  const [schmear, setSchmear] = useState('Scallion Cream Cheese');

  if (!isOpen) return null;

  const totalBagels = Object.values(bagelCounts).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playLuxuryChime();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
  };

  const handleAddBagel = (name: string) => {
    sounds.playTick(1.2);
    setBagelCounts(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const handleRemoveBagel = (name: string) => {
    sounds.playTick(0.9);
    setBagelCounts(prev => {
      const cur = prev[name] || 0;
      if (cur <= 0) return prev;
      return { ...prev, [name]: cur - 1 };
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0e0e12] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all text-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-display font-bold">
              {siteKey === 'reyes' && 'Confidential Dossier Dispatched'}
              {siteKey === 'kettle' && 'Morning Batch Box Reserved'}
              {siteKey === 'polidori' && 'Panino Ticket #042 Printed'}
            </h3>

            <p className="text-sm text-white/70 max-w-sm mx-auto font-sans leading-relaxed">
              {siteKey === 'reyes' && 'Partner Catherine Hale will contact your family office within 2 hours. Helipad and deep-water dock coordinates transmitted via encrypted link.'}
              {siteKey === 'kettle' && 'Your dozen is scheduled for stone hearth oven removal at 06:45 AM. Pick up hot at the lower east counter.'}
              {siteKey === 'polidori' && 'Fresh ciabatta split lengthwise, layered with 24mo prosciutto and served warm with your double espresso.'}
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 px-8 py-3 rounded-full bg-white text-black font-mono text-xs uppercase font-bold hover:bg-white/90 transition-all"
            >
              Return to Experience
            </button>
          </div>
        ) : (
          <div>
            {/* Reyes & Hale Form */}
            {siteKey === 'reyes' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-mono text-[#ff334b] uppercase tracking-widest block mb-1">
                    ESTATE 45391 • PRIVATE BROKERAGE
                  </span>
                  <h3 className="text-2xl font-display font-black tracking-tight">
                    ARRANGE A PRIVATE VIEWING
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-1">$24,500,000 USD • 11,420 SQ FT</p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-white/60 uppercase mb-1">Principal / Representative Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alexander Sterling"
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff334b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/60 uppercase mb-1">Preferred Date</label>
                      <input
                        type="date"
                        defaultValue="2026-09-18"
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff334b]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 uppercase mb-1">Arrival Mode</label>
                      <select className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff334b]">
                        <option>Chauffeured Sedan</option>
                        <option>Helicopter (Pad A)</option>
                        <option>Deep-Water Yacht Dock</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-[11px] text-white/70">
                    <Shield className="w-4 h-4 text-[#ff334b] shrink-0 mt-0.5" />
                    <span>Non-disclosure agreement and proof of funds verification will be executed prior to perimeter clearance.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#ff334b] text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-red-600 transition-all shadow-xl"
                  >
                    Submit Viewing Request
                  </button>
                </div>
              </form>
            )}

            {/* Kettle & Deck Form */}
            {siteKey === 'kettle' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                    DAILY MORNING BATCH
                  </span>
                  <h3 className="text-2xl font-display font-black tracking-tight">
                    BUILD YOUR DOZEN BOX
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-1">12 Hand-Rolled Bagels + 1 Baker's Bonus</p>
                </div>

                <div className="space-y-3">
                  {['Everything', 'Rosemary Sea Salt', 'Classic Sesame', 'Smoked Jalapeño Cheddar'].map(flavor => (
                    <div key={flavor} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-sm font-medium">{flavor}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveBagel(flavor)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono text-sm">{bagelCounts[flavor] || 0}</span>
                        <button
                          type="button"
                          onClick={() => handleAddBagel(flavor)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-amber-400"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-2">Include 8oz Whipped Schmear</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Scallion Cream Cheese', 'Lox Spread (+ $3)', 'Truffle Honey Butter', 'Vegan Cultured Herb'].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSchmear(s)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          schmear === s
                            ? 'border-amber-500 bg-amber-500/20 text-white font-medium'
                            : 'border-white/10 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-amber-500 text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-amber-400 transition-all shadow-xl"
                >
                  Confirm Morning Batch Hold • $38.00
                </button>
              </form>
            )}

            {/* Café Polidori Form */}
            {siteKey === 'polidori' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-mono text-[#e2bb82] uppercase tracking-widest block mb-1">
                    MILANO 1984 • IL BANCONE
                  </span>
                  <h3 className="text-2xl font-serif font-bold tracking-tight">
                    Order at Counter
                  </h3>
                  <p className="text-xs text-white/60 font-mono mt-1">Ciabatta sliced to order with hot espresso</p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-white/60 uppercase mb-1">Your Name for Butcher Paper</label>
                    <input
                      type="text"
                      required
                      defaultValue="Matteo Rossi"
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#e2bb82]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 uppercase mb-1">Selected Panino</label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#e2bb82]">
                      <option>The Polidori Classico (24mo Prosciutto & Mozzarella) - $17.50</option>
                      <option>Truffle Mortadella & Whipped Stracciatella - $18.00</option>
                      <option>Slow-Roasted Fennel Porchetta & Salsa Verde - $16.50</option>
                      <option>Caprese Rustica (Campania Buffalo Mozzarella) - $15.00</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 uppercase mb-1">Espresso Ritual</label>
                    <select className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#e2bb82]">
                      <option>Doppio Espresso (Double Shot Hot)</option>
                      <option>Macchiato Caldo</option>
                      <option>Caffè Shakerato (Iced & Frothy)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#e2bb82] text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl"
                  >
                    Print Order Ticket • $21.50
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
