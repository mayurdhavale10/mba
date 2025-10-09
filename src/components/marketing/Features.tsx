// src/components/marketing/Features.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Features() {
  return (
    <section id="features" className="bg-[var(--paper,#FAFAFA)]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-16 md:py-24">
        {/* Header (animated) */}
        <motion.div
          className="text-center"
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
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            Features
          </motion.p>

          <motion.h2
            className="mt-2 text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A]"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            Unlock your acceptance letter.
          </motion.h2>

          {/* Header sentence with mobile-friendly wrapping */}
          <motion.p
            className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-[#333333] leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            {/* Line 1 */}
            <motion.span
              className="sm:whitespace-normal"
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
            >
              Here&apos;s how{" "}
            </motion.span>

            {/* Logo + brand kept together */}
            <motion.span
              className="inline-flex items-center gap-2 align-middle whitespace-nowrap"
              variants={{
                hidden: { opacity: 0, y: 8, scale: 0.98 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <Image
                src="/hompage/mbalogo.webp"
                alt="MBAMIRROR logo"
                width={22}
                height={22}
                className="rounded-sm"
              />
              <span className="font-semibold">MBAMIRROR</span>
            </motion.span>

            {/* Desktop/tablet single-line continuation */}
            <motion.span
              className="hidden sm:inline"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.45 } } }}
            >
              {" "}
              transforms your college admission essays from good to{" "}
              <span className="font-semibold text-[#FF6F4D] whitespace-nowrap">must-read</span>.
            </motion.span>

            {/* Mobile: forced calmer line breaks */}
            <motion.span
              className="block sm:hidden"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.45 } } }}
            >
              <br />
              transforms your college admission essays from good to
            </motion.span>
            <motion.span
              className="block sm:hidden font-semibold text-[#FF6F4D] whitespace-nowrap"
              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
            >
              must-read
            </motion.span>
            <span className="sm:hidden">.</span>
          </motion.p>

          {/* Divider reveal */}
          <motion.div
            className="mt-6 h-px mx-auto bg-[#F8DCD4]"
            style={{ width: "6rem" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </motion.div>

        {/* Body (cards fade-up subtly) */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: { opacity: 1 }, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {/* Left card */}
          <motion.div
            className="md:col-span-7 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm overflow-hidden min-w-0"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1A1A1A] leading-tight">
              Trained Beyond the Basics
            </h3>
            <p className="mt-2 text-[#333333]">
              Unlike normal AI, our custom model focuses on internal admissions rubrics.
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-5 md:gap-8">
              <IconCircle src="/left/centraltheme.webp" />
              <IconCircle src="/left/clarity.webp" />
              <IconCircle src="/left/auth.webp" />
              <IconCircle src="/left/substance.webp" />
              <IconCircle src="/left/writingstyle.webp" />
              <IconCircle src="/left/redflags.webp" />
            </div>
          </motion.div>

          {/* Right card */}
          <motion.div
            className="md:col-span-5 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm overflow-hidden min-w-0"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.05 } } }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1A1A1A] leading-tight">
              Trained by the Best
            </h3>
            <p className="mt-2 text-[#333333]">
              We don&apos;t rely on generic models. MBAMIRROR is custom-trained and validated by leading
              experts, including <span className="font-semibold">Akshay Goel</span> and{" "}
              <span className="font-semibold">Ashwin</span> (IIM-Ahmedabad, Thapar University).
              Your career is our priority.
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 min-w-0">
              <LogoTile src="/right/harvard.webp" alt="Harvard" />
              <LogoTile src="/right/iim.webp" alt="IIM Ahmedabad" />
              <LogoTile src="/right/mitlogo.webp" alt="MIT" />
              <LogoTile src="/right/Thapar-logo.webp" alt="Thapar University" />
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#product"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#FF6F4D] text-white font-medium hover:bg-[#CC6F5E] focus:outline-none focus:ring-2 focus:ring-[#FFD2BF] transition-colors shadow-sm"
          >
            Review essay
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */
function IconCircle({ src }: { src: string }) {
  return (
    <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-[#F8DCD4] shadow-sm border border-[#E9E4E2] overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 160px, (min-width: 768px) 144px, 96px"
        className="object-contain p-2 sm:p-3 md:p-4"
        aria-hidden
      />
    </div>
  );
}

function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[3/2] rounded-xl border border-[#E9E4E2] bg-white shadow-sm overflow-hidden min-w-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 360px, 100vw"
        className="object-contain p-2 sm:p-3"
      />
    </div>
  );
}
