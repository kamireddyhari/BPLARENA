"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import LeadForm from "./LeadForm";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-lg border-b border-[var(--surface-border)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left: Logo + Brand */}
            <a href="/" className="flex items-center gap-4 group">
              <img
                src="/logo-nav.jpg"
                alt="BPL Arena"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain rounded-lg"
              />
              <div className="flex flex-col justify-center">
                <p className="text-[15px] sm:text-xl lg:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  Bangalore Property & Loan
                </p>
                <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-500 uppercase mt-0.5">
                  Your Trusted Financial Partner
                </p>
              </div>
            </a>

            {/* Middle: Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: "/", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "#banks", label: "Partners" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[var(--foreground)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right: CTAs (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:+917406088871"
                className="text-sm font-medium text-gray-600 hover:text-[var(--foreground)] transition-colors"
              >
                +91 74060 88871
              </a>
              <button
                onClick={() => setShowLeadForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--brand-blue)] rounded-full hover:bg-[var(--brand-blue-hover)] transition-colors"
              >
                Free RM Visit
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-[var(--foreground)] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[var(--surface-border)] shadow-xl">
            <div className="px-6 py-4 flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "#services", label: "Our Services" },
                { href: "#banks", label: "Bank Partners" },
                { href: "#contact", label: "Contact Us" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-100 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="tel:+917406088871"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-base font-semibold text-[var(--brand-blue)] bg-blue-50 rounded-xl"
                >
                  <Phone className="w-5 h-5" />
                  +91 74060 88871
                </a>
                <button
                  onClick={() => { setMobileOpen(false); setShowLeadForm(true); }}
                  className="w-full py-3.5 bg-[var(--brand-blue)] text-white rounded-xl text-base font-bold flex items-center justify-center gap-2"
                >
                  Request Free RM Visit
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <AnimatePresence>
        {showLeadForm && (
          <LeadForm onClose={() => setShowLeadForm(false)} defaultService="Home Loan" />
        )}
      </AnimatePresence>
    </>
  );
}
