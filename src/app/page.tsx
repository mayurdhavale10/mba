// src/app/page.tsx
import Image from "next/image";
import InPageNavbar from "@/components/marketing/InPageNavbar";
import Product from "@/components/marketing/Product";
import Features from "@/components/marketing/Features";
import WhyUs from "@/components/marketing/WhyUs";
import Footer from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper,#ffffff)] text-[var(--ink,#111)]">
      <InPageNavbar />

      {/* HERO */}
      <section className="relative w-full h-[78vh] md:h-[86vh] overflow-hidden">
        <Image
          src="/hompage/mbaheroschool.webp"
          alt="MBA campus hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
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
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT (core tool) */}
      <Product />

      {/* FEATURES */}
      <Features />

      <WhyUs />
      <Footer />

      <footer className="border-t border-black/5 py-8 text-center text-sm text-black/60">
        © {new Date().getFullYear()} MBA Mirror
      </footer>
    </div>
  );
}
