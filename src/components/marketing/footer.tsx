// src/components/marketing/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-[var(--paper,#ffffff)] text-[var(--ink,#333333)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand / short value prop */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/hompage/mbalogo.webp"
                alt="MBA Mirror"
                width={28}
                height={28}
                className="rounded-sm"
              />
              <span className="text-lg font-semibold">MBA Mirror</span>
            </Link>
            <p className="mt-3 text-sm text-black/70 max-w-sm">
              AI essay review calibrated to admissions rubrics—clarity, structure, and story, with concrete, actionable feedback.
            </p>

            {/* Socials */}
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon ariaLabel="Twitter" href="#" icon="twitter" />
              <SocialIcon ariaLabel="LinkedIn" href="#" icon="linkedin" />
              <SocialIcon ariaLabel="YouTube" href="#" icon="youtube" />
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <NavGroup
              title="Product"
              links={[
                { label: "Review essay", href: "#product" },
                { label: "Features", href: "#features" },
                { label: "Why us", href: "#why-us" },
              ]}
            />
            <NavGroup
              title="Company"
              links={[
                { label: "About", href: "#" },
                { label: "Contact", href: "mailto:hello@mbamirror.com" },
                { label: "Careers", href: "#" },
              ]}
            />
            <NavGroup
              title="Resources"
              links={[
                { label: "Blog", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Support", href: "#" },
              ]}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-[#F8DCD4]" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-black/60">
            © {new Date().getFullYear()} MBA Mirror. All rights reserved.
          </div>

          {/* Small actions */}
          <div className="flex items-center gap-4 text-xs">
            <Link href="#" className="text-black/70 hover:text-[var(--salmon,#FF6F4D)] transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-black/70 hover:text-[var(--salmon,#FF6F4D)] transition-colors">
              Privacy
            </Link>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-xs hover:bg-[#F8DCD4]/60 transition-colors"
            >
              <span>Review essay</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------- small presentational helpers --------- */
function NavGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#1a1a1a]">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-black/70 hover:text-[var(--salmon,#FF6F4D)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  ariaLabel,
  href,
  icon,
}: {
  ariaLabel: string;
  href: string;
  icon: "twitter" | "linkedin" | "youtube";
}) {
  return (
    <a
      aria-label={ariaLabel}
      href={href}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-[#F8DCD4]/60 transition-colors"
    >
      {icon === "twitter" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#333333]">
          <path
            d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.6.8-2.5 1-1.4-1.5-3.8-1.5-5.3 0-1.1 1.1-1.4 2.7-.9 4.1-3-.2-5.7-1.6-7.5-3.9-1 1.8-.5 4 1.2 5.2-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.6 3.2 4-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.7 2.7-1.4 1.1-3.1 1.7-4.9 1.7H2c1.8 1.1 3.9 1.8 6.2 1.8 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.4-1.2 2.1-2z"
            fill="currentColor"
          />
        </svg>
      )}
      {icon === "linkedin" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#333333]">
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5H4.5V23H.5V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6V23h-4V15c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V23h-4V8.5z" fill="currentColor"/>
        </svg>
      )}
      {icon === "youtube" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#333333]">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.4.6A3 3 0 0 0 .5 6.2C0 7.8 0 12 0 12s0 4.2.5 5.8a3 3 0 0 0 2.1 2.1c1.6.6 9.4.6 9.4.6s7.8 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.6.5-5.8.5-5.8s0-4.2-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" fill="currentColor"/>
        </svg>
      )}
    </a>
  );
}
