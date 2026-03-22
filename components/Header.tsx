"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/for-sale", label: "For Sale" },
  { href: "/about", label: "About Us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-martha-cream/95 backdrop-blur border-b border-martha-sand pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 min-h-[3.25rem]">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 touch-manipulation"
          onClick={() => setOpen(false)}
        >
          <Image
            src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1773632695/Realtor_Martha_Logo_Final.Black_n1rad7.png"
            alt="Realtor Martha"
            width={140}
            height={44}
            className="h-8 w-auto max-h-9 sm:h-9"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-martha-charcoal hover:text-martha-warm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="ml-2 px-4 py-2 bg-martha-black text-martha-cream text-sm font-medium rounded hover:bg-martha-charcoal transition-colors"
          >
            Book a viewing
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          id="mobile-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-martha-black touch-manipulation active:bg-martha-sand/80"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="navigation"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-martha-sand bg-martha-cream pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="px-4 sm:px-5 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-martha-charcoal hover:text-martha-warm font-medium py-3 px-1 min-h-[44px] flex items-center rounded-lg active:bg-martha-sand/60 touch-manipulation"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="mt-2 py-3 px-4 text-center bg-martha-black text-martha-cream font-medium rounded-lg min-h-[44px] flex items-center justify-center touch-manipulation"
                onClick={() => setOpen(false)}
              >
                Book a viewing
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
