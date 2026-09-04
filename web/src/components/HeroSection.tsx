"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, RefreshCw, Calculator, TrendingUp } from "lucide-react";
import EMICalculator from "./EMICalculator";
import LiveRates from "./LiveRates";
import LeadForm from "./LeadForm";

const cards = [
  {
    id: "home-loan",
    title: "Need a Home Loan?",
    description: "A Khatha & B Khatha properties. Lowest rates in Bangalore.",
    icon: Home,
    action: "lead",
    service: "Home Loan",
  },
  {
    id: "personal-loan",
    title: "Need a Personal Loan?",
    description: "Quick approvals, minimal documentation, doorstep service.",
    icon: User,
    action: "lead",
    service: "Personal Loan",
  },
  {
    id: "balance-transfer",
    title: "Balance Transfer",
    description: "Existing loan? Our RMs negotiate lower ROI for you.",
    icon: RefreshCw,
    action: "lead",
    service: "Balance Transfer",
  },
  {
    id: "calculator",
    title: "Loan Calculators",
    description: "EMI, eligibility & balance transfer — all in one place.",
    icon: Calculator,
    action: "calculator",
    service: "",
  },
  {
    id: "live-rates",
    title: "Live Interest Rates",
    description: "Rates segmented by A/B Khatha & CIBIL score tiers.",
    icon: TrendingUp,
    action: "rates",
    service: "",
  },
];

type Modal = "calculator" | "rates" | "lead" | null;

export default function HeroSection() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [defaultService, setDefaultService] = useState("Home Loan");

  const handleCardClick = (card: (typeof cards)[0]) => {
    if (card.action === "calculator") setActiveModal("calculator");
    else if (card.action === "rates") setActiveModal("rates");
    else {
      setDefaultService(card.service);
      setActiveModal("lead");
    }
  };

  return (
    <>
      <section className="relative w-full bg-[var(--background)] overflow-hidden">
        {/* ═══ HERO — Minimalist Apple Style ═══ */}
        <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--surface-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
                Your one-stop <br className="hidden lg:block"/>
                <span className="text-[var(--brand-blue)]">property</span>
                <span> & </span>
                <span className="text-[#F58220]">loan</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0066cc] to-[#F58220]"> destination.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 max-w-xl leading-relaxed font-medium tracking-tight">
                Whether you're buying a property, looking for a home loan, reviewing an existing loan, or simply trying to understand your options — BPL Arena is here to help.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mb-10">
                {["No Pressure", "No Spam", "Just Genuine Help"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-[var(--surface)] px-4 py-2.5 rounded-full border border-[var(--surface-border)]">
                    <span className="text-[var(--brand-blue)]">✓</span> {item}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => { setActiveModal("lead"); setDefaultService("Home Loan"); }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--foreground)] text-white rounded-full font-bold text-base hover:scale-[1.02] transition-transform"
                >
                  Talk to BPL Arena
                </button>
                <a
                  href="tel:+917406088871"
                  className="inline-flex items-center gap-2 px-8 py-4 text-[var(--foreground)] rounded-full font-bold text-base bg-[var(--surface)] hover:bg-gray-200 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </motion.div>

            {/* Right Column — Apple Style Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--surface-border)] overflow-hidden">
                <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center border border-[var(--surface-border)]">
                      <span className="text-xl">🤝</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">WE HELP. YOU DECIDE.</h2>
                      <p className="text-sm text-gray-500 font-medium">The BPL Arena Promise</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    {[
                      { icon: "✓", text: "100% Transparent", sub: "No hidden charges, ever" },
                      { icon: "✓", text: "Multiple Lender Options", sub: "Compare & choose the best rate" },
                      { icon: "✓", text: "One Dedicated RM", sub: "Your single point of contact" },
                      { icon: "✓", text: "₹0 Customer Service Fee", sub: "Our service is completely free" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-[var(--brand-blue)] flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-base font-bold text-[var(--foreground)]">{item.text}</p>
                          <p className="text-sm text-gray-500">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══ Cards Grid Section ═══ */}
        <div id="services" className="scroll-mt-24 bg-[var(--surface)] px-6 py-24 lg:px-8 w-full border-b border-[var(--surface-border)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-5 tracking-tight">Our Services</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                Comprehensive financial solutions tailored for your property and loan needs across Bangalore.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  id={card.id}
                  onClick={() => handleCardClick(card)}
                  className="group text-left w-full bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[var(--surface-border)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl mb-6 text-[var(--foreground)] group-hover:bg-[var(--brand-blue)] group-hover:text-white group-hover:border-[var(--brand-blue)] transition-colors duration-300"
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 tracking-tight">{card.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed mb-6 font-medium">{card.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]">
                    {card.action === "calculator"
                      ? "Open Calculators"
                      : card.action === "rates"
                      ? "View Rates"
                      : "Apply Now"}{" "}
                    <span className="group-hover:translate-x-1 transition-transform block">→</span>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "calculator" && (
          <EMICalculator onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "rates" && (
          <LiveRates onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "lead" && (
          <LeadForm
            onClose={() => setActiveModal(null)}
            defaultService={defaultService}
          />
        )}
      </AnimatePresence>
    </>
  );
}
