# 🎬 Cinematic 5K Showcase (Port 3008)

An ultra-luxury 5K scrollytelling tri-brand showcase:
- **Kettle & Deck** — Master-Crafted Copper Cookware
- **Café Polidori** — Heritage Italian Espresso Roastery
- **Reyes & Hale** — Handcrafted Timepieces & Leather Goods

## 📁 Architecture & Module Structure

```
04_Cinematic_5K_Showcase_Port_3008/
├── dist/                      # ⚡ Production-ready bundle (runs immediately on Port 3008)
│   ├── index.html
│   └── assets/
│       ├── kettle/            # 120 Ultra-HD frames for Kettle & Deck sequence
│       ├── polidori/          # 120 Ultra-HD frames for Café Polidori sequence
│       ├── reyes/             # 120 Ultra-HD frames for Reyes & Hale sequence
│       ├── masters/           # High-resolution hero visuals
│       ├── audio/             # Ambient acoustic soundtrack
│       ├── index-*.js         # Production React/TypeScript bundle
│       └── index-*.css        # Tailored typography and keyframe animations
├── src/                       # 🛠️ Complete Modular React + TypeScript Source Code
│   ├── App.tsx                # Master orchestration & active brand switcher
│   ├── main.tsx               # React root renderer
│   ├── index.css              # Global styles, fonts & Tailwind directives
│   ├── components/
│   │   ├── ScrollyCanvas.tsx    # High-performance 60fps HTML5 Canvas frame scrubbing engine
│   │   ├── ShowcaseHeader.tsx   # Top architectural navbar & brand switcher
│   │   ├── ShowcaseGrid.tsx     # Interactive multi-brand exhibition gallery
│   │   ├── InteractiveModal.tsx # Fullscreen modal with sound-reactive specs
│   │   ├── StatsMarquee.tsx     # Brand metrics ticker
│   │   ├── LuxuryFooter.tsx     # Editorial footer & inquiry actions
│   │   ├── kettle/
│   │   │   └── KettleAndDeck.tsx  # Dedicated component for Kettle & Deck
│   │   ├── polidori/
│   │   │   └── CafePolidori.tsx   # Dedicated component for Café Polidori
│   │   └── reyes/
│   │       └── ReyesAndHale.tsx   # Dedicated component for Reyes & Hale
│   └── utils/
│       └── soundEngine.ts       # Web Audio API spatial acoustic synthesizer
├── index.html                 # Source entry file
├── package.json               # NPM scripts & dependencies (React, Lucide, Tailwind, Vite)
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Custom luxury color palette & typography
├── tsconfig.json              # TypeScript compilation rules
└── README.md                  # This documentation
```

## 🚀 How to Run

### Option A: Serve the Production Build (Instant, No Node required)
```bash
python -m http.server 3008 --directory dist
```
Open [http://localhost:3008](http://localhost:3008) in your browser.

### Option B: Run in Development Mode with Vite (Node.js)
```bash
npm install
npm run dev
```
