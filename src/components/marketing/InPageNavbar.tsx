// src/components/marketing/InPageNavbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const SECTIONS = [
  { id: "product", label: "Review essay", primary: true },
  { id: "features", label: "Features", primary: false },
];

export default function InPageNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll / active section tracking
  useEffect(() => {
    const THRESHOLD = 80;
    const onScroll = () => {
      setScrolled(window.scrollY > THRESHOLD);
      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 90) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on wider screens and lock body scroll while open
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMobileOpen(false); // sm breakpoint
    };
    window.addEventListener("resize", onResize);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navText = scrolled ? "text-[var(--ink,#111)]" : "text-white";

  const chipBase = "px-3 py-1.5 rounded-full border transition-colors text-sm";
  const chipGlassy = [
    chipBase,
    scrolled
      ? "border-black/15 bg-white/60 hover:bg-white/70"
      : "border-white/25 bg-white/10 hover:bg-white/15",
    navText,
  ].join(" ");
  const chipPrimary = [
    chipBase,
    "bg-[var(--salmon,#ff6f4d)] text-white border-transparent hover:opacity-90",
  ].join(" ");

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-colors",
        "pt-[max(0px,env(safe-area-inset-top))]",
        scrolled ? "backdrop-blur bg-white/70 border-b border-black/5" : "bg-transparent",
      ].join(" ")}
    >
      <nav className="w-full px-0 py-5 md:py-6 flex items-center justify-between">
        {/* Brand */}
        <div className="pl-5 md:pl-6">
          <Link href="/" className={`flex items-center gap-2 ${navText}`}>
            <Image
              src="/hompage/mbalogo.webp"
              alt="MBA Mirror"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="font-semibold">MBA Mirror</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-3 pr-3 md:pr-5 w-full justify-end max-w-[1060px] ml-auto">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                s.primary ? chipPrimary : chipGlassy,
                !s.primary && active === s.id ? "ring-1 ring-[var(--salmon,#ff6f4d)]/50" : "",
              ].join(" ")}
            >
              {s.label}
            </a>
          ))}

          {/* Auth */}
          <button type="button" onClick={() => signIn("google")} className={chipGlassy}>
            Log in
          </button>
        </div>

        {/* Mobile: hamburger */}
        <div className="sm:hidden pr-4">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={[
              "inline-flex items-center justify-center rounded-full p-2",
              scrolled ? "bg-white/70 border border-black/10" : "bg-white/15 border border-white/20",
              navText,
            ].join(" ")}
          >
            {/* Icon */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={[
          "sm:hidden transition-all duration-200 ease-out overflow-hidden",
          mobileOpen ? "max-h-96" : "max-h-0",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div
          className={[
            "mx-4 mb-4 rounded-2xl border shadow-sm backdrop-blur",
            scrolled ? "bg-white/80 border-black/10" : "bg-white/20 border-white/25",
          ].join(" ")}
        >
          <div className="p-3 flex flex-col gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={closeMobile}
                className={[
                  "w-full text-center",
                  s.primary ? chipPrimary : chipGlassy,
                  !s.primary && active === s.id ? "ring-1 ring-[var(--salmon,#ff6f4d)]/50" : "",
                ].join(" ")}
              >
                {s.label}
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                closeMobile();
                signIn("google");
              }}
              className={[chipGlassy, "w-full"].join(" ")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
