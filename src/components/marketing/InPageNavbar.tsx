// src/components/marketing/InPageNavbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const SECTIONS = [
  { id: "contact", label: "Contact" },
  { id: "features", label: "Features" },
  { id: "product", label: "Review essay" },
];

export default function InPageNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
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

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-colors",
        scrolled
          ? "backdrop-blur bg-white/60 border-b border-black/5"
          : "bg-transparent", // colorless on top of hero
      ].join(" ")}
    >
      <nav className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">MBA Mirror</Link>

        <div className="hidden sm:flex items-center gap-6 text-sm">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                "hover:opacity-80",
                active === s.id ? "text-[var(--salmon,#ff6f4d)] font-medium" : "",
              ].join(" ")}
            >
              {s.label}
            </a>
          ))}

          {/* Auth: use next-auth/react signIn() instead of linking to /api/auth/signin */}
          <button
            type="button"
            onClick={() => signIn("github")} // or signIn() to show provider page
            className="px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5"
          >
            Log in
          </button>
        </div>
      </nav>
    </header>
  );
}
