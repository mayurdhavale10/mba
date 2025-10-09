"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 1 },
        show: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {/* Headline */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold leading-tight text-white"
        variants={{
          hidden: { opacity: 0, y: 18 },
          show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
        }}
      >
        Stop Guessing.{" "}
        <motion.span
          className="text-[var(--salmon,#ff6f4d)] inline-block"
          variants={{
            hidden: { opacity: 0, y: 12, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.7, ease: EASE, delay: 0.05 },
            },
          }}
        >
          Start Nailing
        </motion.span>{" "}
        Your MBA Essays.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="mt-4 md:mt-6 text-lg md:text-2xl text-white/90 max-w-2xl"
        variants={{
          hidden: { opacity: 0, y: 14 },
          show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: 0.05 } },
        }}
      >
        Get the competitive edge. Our AI analyzes your draft and delivers instant, expert-level feedback.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="mt-8 flex gap-3"
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
        }}
      >
        <a
          href="#product"
          className="px-5 py-3 rounded-full bg-[var(--salmon,#ff6f4d)] text-white font-medium hover:opacity-90"
        >
          Review essay
        </a>
        <a
          href="#features"
          className="px-5 py-3 rounded-full border border-white/70 text-white font-medium hover:bg-white/10"
        >
          Features
        </a>
      </motion.div>
    </motion.div>
  );
}
