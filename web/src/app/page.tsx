import type { Metadata } from "next";
import TriviaModal from "@/components/TriviaModal";
import HeroSection from "@/components/HeroSection";
import BankMarquee from "@/components/BankMarquee";
import ServicesShowcase from "@/components/ServicesShowcase";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BPL Arena | Best Home & Personal Loans in Bangalore",
  description:
    "Bangalore Property and Loan Arena — VIP doorstep service for Home Loans, Personal Loans, Balance Transfers, Khatha transfers & BBMP assistance in Bangalore.",
  keywords:
    "home loan bangalore, B khatha loan, A khatha property, BBMP khatha transfer, personal loan bangalore, DSA bangalore, balance transfer bangalore",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Entry Gate Trivia — pops up on load with local fallback */}
      <TriviaModal />

      {/* Sticky Navbar */}
      <Navbar />

      {/* TOP LAYER: 5 action cards (Home Loan, Personal Loan, Balance Transfer, EMI Calc, Live Rates) */}
      <HeroSection />

      {/* MIDDLE LAYER: Auto-scrolling partner bank marquee with search & rate popups */}
      <BankMarquee />

      {/* BOTTOM LAYER: Services showcase with lead form CTA */}
      <ServicesShowcase />

      {/* FOOTER */}
      <footer className="bg-[var(--surface)] border-t border-[var(--surface-border)] text-gray-500 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center mb-5 w-fit">
                <img src="/logo.png" alt="BPL Arena" className="h-10 w-auto object-contain mix-blend-multiply" />
              </div>
              <p className="text-sm leading-relaxed font-medium">
                Bangalore&apos;s premier DSA for Home Loans, Personal Loans & Property Services.
                VIP doorstep service across Bangalore.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <p className="text-[var(--foreground)] font-bold mb-4">Services</p>
                <ul className="space-y-3 font-medium">
                  {["Home Loan", "Personal Loan", "Balance Transfer", "CIBIL Help", "Khatha Transfer"].map(
                    (s) => (
                      <li key={s}>
                        <a href="#services" className="hover:text-[var(--brand-blue)] transition-colors">
                          {s}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <p className="text-[var(--foreground)] font-bold mb-4">Contact</p>
                <ul className="space-y-3 font-medium">
                  <li>📞 +91 74060 88871</li>
                  <li>📧 hari.krishna119@gmail.com</li>
                  <li>📍 Bangalore, Karnataka</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-8 text-xs text-center text-gray-400 font-medium">
            © {new Date().getFullYear()} BPL Arena. All rights reserved. | Serving Bangalore
            with VIP Doorstep Service. | Rates are indicative and subject to change.
          </div>
        </div>
      </footer>
    </div>
  );
}
