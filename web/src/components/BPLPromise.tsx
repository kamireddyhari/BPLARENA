"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, PhoneCall } from "lucide-react";
import LiveRates from "./LiveRates";
import LeadForm from "./LeadForm";

export default function BPLPromise() {
  const [activeModal, setActiveModal] = useState<"promise" | "rates" | "consult" | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Only update state if the user scrolled more than 80px (requires a longer deliberate scroll)
    if (Math.abs(currentScrollY - lastScrollY) > 80) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div 
        className={`fixed bottom-8 right-0 z-40 flex flex-col items-end gap-3 transition-transform duration-700 ease-in-out hover:translate-x-0 ${
          isVisible ? "translate-x-0" : "translate-x-[calc(100%-15px)] opacity-50 hover:opacity-100"
        }`}
      >
        {/* 1) Live Rates */}
        <button
          onClick={() => setActiveModal("rates")}
          className="flex items-center px-5 py-3.5 bg-[var(--brand-blue)] text-white rounded-l-full shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transform-gpu transition-all duration-300 font-bold text-sm whitespace-nowrap"
          aria-label="Live ROI"
        >
          <TrendingUp className="w-4 h-4 flex-shrink-0" />
          <span className="ml-2.5">Live ROI</span>
        </button>

        {/* 2) BPL Promise */}
        <button
          onClick={() => setActiveModal("promise")}
          className="flex items-center px-5 py-3.5 bg-[var(--foreground)] text-[var(--background)] rounded-l-full shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transform-gpu transition-all duration-300 font-bold text-sm whitespace-nowrap"
          aria-label="BPL Promise"
        >
          <span className="text-base leading-none flex-shrink-0">🤝</span>
          <span className="ml-2.5">BPL Promise</span>
        </button>

        {/* 3) Free Consultation */}
        <button
          onClick={() => setActiveModal("consult")}
          className="flex items-center px-5 py-3.5 bg-emerald-600 text-white rounded-l-full shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transform-gpu transition-all duration-300 font-bold text-sm whitespace-nowrap"
          aria-label="Free Consultation"
        >
          <PhoneCall className="w-4 h-4 animate-pulse flex-shrink-0" />
          <span className="ml-2.5">Free Consultation</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "promise" && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="relative w-full max-w-md bg-[var(--background)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--surface-border)]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[var(--surface)] p-8 border-b border-[var(--surface-border)] flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-3">
                    <span className="text-3xl">🤝</span> The BPL Promise
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-[var(--foreground)] p-2 bg-white rounded-full border border-[var(--surface-border)] shadow-sm hover:scale-105 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6 bg-white">
                <p className="text-xl font-bold text-[var(--foreground)] leading-snug">
                  🏆 No Pressure. No Spam.<br/>
                  <span className="text-[var(--brand-blue)]">Just Genuine Help.</span>
                </p>
                <p className="text-gray-500 text-base leading-relaxed font-medium">
                  At <strong>BPL Arena</strong>, our goal is to help you make the right decision — not to force you into an application.
                </p>
                <p className="text-gray-500 text-base leading-relaxed font-medium">
                  We don't make false promises, we don't guarantee approvals, and we don't compromise your interests just to close a loan.
                </p>
                
                <div className="bg-[var(--surface)] border border-[var(--surface-border)] p-6 rounded-2xl">
                  <p className="font-bold text-[var(--foreground)] mb-4">Our commitment is simple:</p>
                  <ul className="space-y-3 text-[var(--foreground)] font-medium text-sm">
                    <li className="flex items-center gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-blue)] text-white flex items-center justify-center text-xs font-bold">✓</span> Help as much as we can.</li>
                    <li className="flex items-center gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-blue)] text-white flex items-center justify-center text-xs font-bold">✓</span> Stay transparent.</li>
                    <li className="flex items-center gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--brand-blue)] text-white flex items-center justify-center text-xs font-bold">✓</span> Never compromise on trust.</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-2 py-4 bg-[var(--foreground)] text-white font-bold rounded-full hover:scale-[1.02] transition-transform text-base"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Existing modals */}
        {activeModal === "rates" && <LiveRates onClose={() => setActiveModal(null)} />}
        {activeModal === "consult" && <LeadForm defaultService="30 Mins Free Consultation" onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </>
  );
}
