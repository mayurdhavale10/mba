// src/components/marketing/Features.tsx
"use client";

import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="bg-[var(--paper,#FAFAFA)]">
      {/* Wider container + slightly less side padding = boxes visually shift left */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center">
          <p className="uppercase tracking-wider text-xs font-semibold text-[#CC6F5E]">
            Features
          </p>
          <h2 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A]">
            Unlock your acceptance letter.
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-[#333333] inline-flex items-center gap-2 justify-center">
            Here&apos;s how
            <span className="inline-flex items-center gap-2">
              <Image
                src="/hompage/mbalogo.webp"
                alt="MBAMIRROR logo"
                width={28}
                height={28}
                className="rounded-sm align-middle"
              />
              <span className="font-semibold">MBAMIRROR</span>
            </span>
            transforms your college admission essays from good to{" "}
            <span className="font-semibold text-[#FF6F4D]">must-read</span>.
          </p>
          <div className="mt-6 h-px w-24 mx-auto bg-[#F8DCD4]" />
        </div>

        {/* Layout: 12-col with tighter gap so cards sit closer together (visually more left) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Trained Beyond the Basics (span 7) */}
          <div className="md:col-span-7 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A]">
              Trained Beyond the Basics
            </h3>
            <p className="mt-2 text-[#333333]">
              Unlike normal AI, our custom model focuses on internal admissions rubrics.
            </p>

            {/* Symmetric 3×2 icon grid — larger chips, no labels */}
            <div className="mt-8 grid grid-cols-3 gap-6 md:gap-8">
              <IconCircle src="/left/centraltheme.webp" />
              <IconCircle src="/left/clarity.webp" />
              <IconCircle src="/left/auth.webp" />
              <IconCircle src="/left/substance.webp" />
              <IconCircle src="/left/writingstyle.webp" />
              <IconCircle src="/left/redflags.webp" />
            </div>
          </div>

          {/* Right: Trained by the Best (span 5) */}
          <div className="md:col-span-5 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A]">
              Trained by the Best
            </h3>
            <p className="mt-2 text-[#333333]">
              We don&apos;t rely on generic models. MBAMIRROR is custom-trained and validated by leading
              experts, including <span className="font-semibold">Akshay Goel</span> and{" "}
              <span className="font-semibold">Ashwin</span> (IIM-Ahmedabad, Thapar University).
              Your career is our priority.
            </p>

            {/* Bigger, symmetric 2×2 logos; reduced inner padding so logos appear larger */}
            <div className="mt-8 grid grid-cols-2 gap-5 md:gap-6">
              <LogoTile src="/right/harvard.webp" alt="Harvard" />
              <LogoTile src="/right/iim.webp" alt="IIM Ahmedabad" />
              <LogoTile src="/right/mitlogo.webp" alt="MIT" />
              <LogoTile src="/right/Thapar-logo.webp" alt="Thapar University" />
            </div>
          </div>
        </div>

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
// Larger circular chip with image filling the space (keeps symmetry)
function IconCircle({ src }: { src: string }) {
  return (
    <div className="relative mx-auto w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-[#F8DCD4] shadow-sm border border-[#E9E4E2] overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 160px, (min-width: 768px) 144px, 112px"
        className="object-contain p-3 md:p-4"
        aria-hidden
      />
    </div>
  );
}

// Fixed-aspect logo tile so all four look identical in size
function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl border border-[#E9E4E2] bg-white shadow-sm overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 360px, 100vw"
        className="object-contain p-3 md:p-4"
      />
    </div>
  );
}
