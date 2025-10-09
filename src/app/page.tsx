import Image from "next/image";
import InPageNavbar from "@/components/marketing/InPageNavbar";
import Product from "@/components/marketing/Product";
import Features from "@/components/marketing/Features";
import WhyUs from "@/components/marketing/WhyUs";
import Footer from "@/components/marketing/footer";
import Hero from "@/components/marketing/Hero"; // ← add

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
            <Hero /> {/* ← animated text lives in a client component */}
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
