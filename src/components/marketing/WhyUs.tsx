// src/components/marketing/WhyUs.tsx
"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "intro" | "fan" | "grid";

// Framer Motion easing tuples (typed so TS accepts them)
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// Your card images (spaces kept; we encode on use)
const RAW = [
  "card1 (1).webp",
  "card2 (1).webp",
  "card3 (1).webp",
  "card4 (1).webp",
  "card5 (1).webp",
  "card6 (1).webp",
  "card7 (1).webp",
];
const src = (name: string) => encodeURI(`/whyus/${name}`);

export default function WhyUs() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });

  // --- State machine ---
  const [mode, setMode] = useState<Mode>("intro");
  useEffect(() => {
    if (!inView || mode !== "intro") return;
    const t = setTimeout(() => setMode("fan"), 1200); // after hero lands
    return () => clearTimeout(t);
  }, [inView, mode]);

  const ALL = useMemo(() => RAW, []);
  const HERO_INDEX = 0;
  const DECK = useMemo(() => RAW.slice(1), []);

  // Fan positions for deck (hero stays center)
  const fanPositions = useMemo(() => {
    const total = DECK.length;
    const arcSpread = 180;
    const radius = 350;
    const startAngle = -arcSpread / 2;
    const step = total > 1 ? arcSpread / (total - 1) : 0;

    return Array.from({ length: total }, (_, i) => {
      const angle = startAngle + step * i;
      const rad = (angle * Math.PI) / 180;
      return {
        x: Math.sin(rad) * radius,
        y: Math.cos(rad) * radius * 0.4,
        rotate: angle * 0.3,
      };
    });
  }, [DECK.length]);

  // Grid targets: 4 on top row, 3 on bottom (centered)
  const gridTargets = useMemo(() => {
    const row1 = 4;
    const spacingX = 240;
    const topY = -120;
    const botY = 120;

    const distribute = (n: number) => {
      if (n <= 0) return [] as number[];
      if (n === 1) return [0];
      const totalWidth = spacingX * (n - 1);
      const start = -totalWidth / 2;
      return Array.from({ length: n }, (_, i) => start + i * spacingX);
    };

    const row1Xs = distribute(Math.min(row1, ALL.length));
    const row2Count = Math.max(ALL.length - row1, 0);
    const row2Xs = distribute(row2Count);

    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < Math.min(row1, ALL.length); i++) out.push({ x: row1Xs[i], y: topY });
    for (let j = 0; j < row2Count; j++) out.push({ x: row2Xs[j], y: botY });
    return out; // index in ALL -> target
  }, [ALL.length]);

  // Sizes: hero larger only in intro/fan; equal in grid
  const sizeFor = (i: number) => {
    const base = { w: 260, h: 172 };
    const hero = { w: 300, h: 198 };
    return mode === "grid" ? base : i === HERO_INDEX ? hero : base;
  };

  // Z-index: flat in grid; hero on top otherwise
  const zIndexFor = (i: number) => (mode === "grid" ? 1 : i === HERO_INDEX ? 10 : 0);

  // Variants per mode (typed with Variants)
  const variants: Variants = {
    intro: (i: number) =>
      i === HERO_INDEX
        ? {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: { duration: 1.2, ease: EASE_SMOOTH },
          }
        : {
            x: 0,
            y: 0,
            scale: 0.9,
            opacity: 0,
            rotate: 0,
            transition: { duration: 0.4, ease: "linear" },
          },

    fan: (i: number) =>
      i === HERO_INDEX
        ? {
            x: 0,
            y: 0,
            scale: 1.12,
            opacity: 1,
            rotate: 0,
            transition: { duration: 0.6, ease: EASE_SMOOTH },
          }
        : {
            ...(fanPositions[i - 1] ?? { x: 0, y: 0, rotate: 0 }),
            scale: 1,
            opacity: 1,
            transition: { duration: 0.75, ease: EASE_SMOOTH },
          },

    grid: (i: number) => {
      const t = gridTargets[i] ?? { x: 0, y: 0 };
      return {
        x: t.x,
        y: t.y,
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: { duration: 0.55, ease: EASE_SMOOTH },
      };
    },
  };

  // Initial (on mount)
  const initialFor = (i: number) =>
    i === HERO_INDEX ? { x: 0, y: 260, scale: 0.9, opacity: 0 } : { x: 0, y: 0, scale: 0.9, opacity: 0 };

  // Click handlers
  const toGrid = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMode("grid");
  };
  const toFan = () => setMode("fan");

  return (
    <section id="why-us" className="bg-white">
      {/* ultra-tight vertical padding */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 md:py-8">
        {/* Heading (animated) */}
        <motion.div
          className="text-center mb-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 1 },
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.p
            className="uppercase tracking-wider text-xs font-semibold text-[#CC6F5E]"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SMOOTH } },
            }}
          >
            Why us
          </motion.p>

          <motion.h2
            className="mt-0 text-3xl md:text-5xl font-extrabold tracking-tight text-[#1a1a1a]"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_SMOOTH } },
            }}
          >
            Built to help you get accepted.
          </motion.h2>

          <motion.p
            className="mt-1 text-xs md:text-sm text-black/60"
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SMOOTH, delay: 0.02 } },
            }}
          >
            (click on any card)
          </motion.p>

          {/* subtle underline reveal for polish */}
          <motion.div
            className="mt-3 h-px w-20 md:w-24 mx-auto bg-[#F8DCD4]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          />
        </motion.div>

        {/* Stage */}
        <div ref={ref} className="relative mx-auto max-w-[980px] -mt-4" onClick={mode === "grid" ? toFan : undefined}>
          <div className="relative h-[500px] md:h-[560px] overflow-visible flex items-center justify-center">
            {/* World origin at center */}
            <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%)" }}>
              {ALL.map((file, i) => {
                const { w, h } = sizeFor(i);
                return (
                  <motion.div
                    key={file}
                    className="absolute will-change-transform"
                    style={{
                      left: -w / 2,
                      top: -h / 2,
                      zIndex: zIndexFor(i),
                      cursor: mode === "grid" ? "default" : "pointer",
                    }}
                    custom={i}
                    initial={initialFor(i)}
                    animate={mode}
                    variants={variants}
                    whileHover={
                      mode === "grid"
                        ? { scale: 1.03, transition: { duration: 0.2, ease: EASE_BACK } }
                        : i === HERO_INDEX
                        ? { scale: 1.14, transition: { duration: 0.25, ease: EASE_BACK } }
                        : { scale: 1.02, transition: { duration: 0.2, ease: EASE_BACK } }
                    }
                    onClick={mode === "grid" ? undefined : toGrid}
                  >
                    <Card src={src(file)} w={w} h={h} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Simple card shell
function Card({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-white border border-[#E9E4E2] shadow-lg"
      style={{ width: w, height: h }}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
    </div>
  );
}
