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

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-colors",
        "pt-[max(0px,env(safe-area-inset-top))]",
        scrolled ? "backdrop-blur bg-white/70 border-b border-black/5" : "bg-transparent",
      ].join(" ")}
    >
      <nav className="w-full px-0 py-5 md:py-6 flex items-center justify-between">
        {/* brand: a bit more to the right from the very edge */}
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

        {/* menu: a bit more to the left */}
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

          {/* Auth: open provider chooser (shows Google if configured) */}
          <button type="button" onClick={() => signIn()} className={chipGlassy}>
            Log in
          </button>
          {/* Or, use a custom page: <Link href="/login" className={chipGlassy}>Log in</Link> */}
        </div>
      </nav>
    </header>
  );
}
