// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import Product from "@/components/marketing/Product";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper,#ffffff)] text-[var(--ink,#111)]">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-black/5">
        <nav className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/hompage/mbalogo.webp" alt="MBA Mirror" width={32} height={32} />
            <span className="font-semibold">MBA Mirror</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#why-us" className="hover:opacity-80">Why us</a>
            <a href="#features" className="hover:opacity-80">Features</a>
            <a href="#product" className="px-3 py-1.5 rounded-full bg-[var(--salmon,#ff6f4d)] text-white hover:opacity-90">
              Review essay
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative w-full h-[78vh] md:h-[86vh] overflow-hidden">
        <Image src="/hompage/mbaheroschool.webp" alt="MBA campus hero" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full">
          <div className="mx-auto max-w-[1100px] h-full px-6 md:px-8 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Stop Guessing. <span className="text-[var(--salmon,#ff6f4d)]">Start Nailing</span> Your MBA Essays.
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-2xl text-white/90 max-w-2xl">
              Get the competitive edge. Our AI analyzes your draft and delivers instant, expert-level feedback.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="#product" className="px-5 py-3 rounded-full bg-[var(--salmon,#ff6f4d)] text-white font-medium hover:opacity-90">
                Review essay
              </a>
              <a href="#why-us" className="px-5 py-3 rounded-full border border-white/70 text-white font-medium hover:bg-white/10">
                Why us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section id="why-us" className="mx-auto max-w-[1100px] px-6 md:px-8 py-20">
        <h2 className="text-2xl font-semibold mb-4">Why us</h2>
        <p className="text-sm text-black/70">Add your value props here.</p>
      </section>

      <section id="features" className="mx-auto max-w-[1100px] px-6 md:px-8 py-20">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-black/80">
          <li>Paste or OCR</li>
          <li>Clarity / Structure / Storytelling scores</li>
          <li>Rewrite examples and summary</li>
          <li>Export to PDF/TXT</li>
        </ul>
      </section>

      {/* Render the real product tool HERE (it already has id="product") */}
      <Product />

      <footer className="border-t border-black/5 py-8 text-center text-sm text-black/60">
        © {new Date().getFullYear()} MBA Mirror
      </footer>
    </div>
  );
}
