// src/components/marketing/Features.tsx
"use client";

import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="bg-[var(--paper,#FAFAFA)]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center">
          <p className="uppercase tracking-wider text-xs font-semibold text-[#CC6F5E]">
            Features
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A]">
            Unlock your acceptance letter.
          </h2>

          {/* Mobile-optimized copy */}
          <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-[#333333] leading-relaxed">
            {/* Line 1 (always) */}
            <span className="sm:whitespace-normal">Here&apos;s how </span>

            {/* Keep logo + brand together */}
            <span className="inline-flex items-center gap-2 align-middle whitespace-nowrap">
              <Image
                src="/hompage/mbalogo.webp"
                alt="MBAMIRROR logo"
                width={22}
                height={22}
                className="rounded-sm"
              />
              <span className="font-semibold">MBAMIRROR</span>
            </span>

            {/* Desktop/tablet single-line continuation */}
            <span className="hidden sm:inline">
              {" "}
              transforms your college admission essays from good to{" "}
              <span className="font-semibold text-[#FF6F4D] whitespace-nowrap">
                must-read
              </span>
              .
            </span>

            {/* Mobile: force calmer line breaks */}
            <span className="block sm:hidden">
              <br />
              transforms your college admission essays from good to
            </span>
            <span className="block sm:hidden font-semibold text-[#FF6F4D] whitespace-nowrap">
              must-read
            </span>
            <span className="sm:hidden">.</span>
          </p>

          <div className="mt-6 h-px w-24 mx-auto bg-[#F8DCD4]" />
        </div>

        {/* Body */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left card */}
          <div className="md:col-span-7 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm overflow-hidden min-w-0">
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
          </div>

          {/* Right card */}
          <div className="md:col-span-5 rounded-2xl border border-[#E9E4E2] bg-white p-6 md:p-8 shadow-sm overflow-hidden min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1A1A1A] leading-tight">
              Trained by the Best
            </h3>
            <p className="mt-2 text-[#333333]">
              We don&apos;t rely on generic models. MBAMIRROR is custom-trained and validated by leading
              experts, including <span className="font-semibold">Akshay Goel</span> and{" "}
              <span className="font-semibold">Ashwin</span> (IIM-Ahmedabad, Thapar University).
              Your career is our priority.
            </p>

            {/* Ensure no overflow on small screens */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 min-w-0">
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
