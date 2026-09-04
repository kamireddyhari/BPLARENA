"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ShieldCheck, MapPin, Truck, Award, CreditCard, Scale, Building2 } from "lucide-react";
import LeadForm from "./LeadForm";

const services = [
  {
    title: "VIP Doorstep Collection",
    description:
      "Our dedicated RMs travel to your home or office to collect all documents. No Bangalore traffic, no office queues — we handle the running around.",
    icon: Truck,
  },
  {
    title: "Khatha Transfer & BBMP",
    description:
      "End-to-end Khatha transfer from the seller's name to yours at BBMP. We handle A Khatha, B Khatha, and BBMP regularisation processes.",
    icon: Building2,
  },
  {
    title: "Legal & Technical Opinion",
    description:
      "Our empanelled lawyers verify property title and ownership history. Our engineers assess construction quality and valuation for the bank.",
    icon: ShieldCheck,
  },
  {
    title: "Sale Agreement & Registration",
    description:
      "From drafting the sale agreement to coordinating the sub-registrar appointment and stamp duty payment, we oversee the entire registration process.",
    icon: FileText,
  },
  {
    title: "CIBIL Issue Resolution",
    description:
      "Low or inaccurate CIBIL score? Our specialists raise disputes, guide you on improving your credit profile, and help you secure the loan you deserve.",
    icon: CreditCard,
  },
  {
    title: "Auction Property Assistance",
    description:
      "Interested in bank-auctioned properties? We assist with due diligence, legal checks, and securing financing for SARFAESI auction properties.",
    icon: Award,
  },
  {
    title: "Financial Planning",
    description:
      "Not sure if this is the right time to buy? Our RMs offer free financial planning sessions covering EMI vs rent analysis, tax benefits, and investment timing.",
    icon: Scale,
  },
  {
    title: "Dedicated RM Updates",
    description:
      "One dedicated Relationship Manager for your entire journey — from document collection to final disbursement. WhatsApp updates at every stage.",
    icon: MapPin,
  },
];

export default function ServicesShowcase() {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <>
      <section className="py-24 bg-[var(--background)] border-t border-[var(--surface-border)]" id="contact">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block mb-5 px-4 py-1.5 bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--foreground)] text-xs font-bold rounded-full uppercase tracking-[0.15em]">
              Why Choose BPL Arena
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] mb-6 tracking-tight">
              End-to-End VIP Doorstep Services
            </h2>
            <p className="text-xl text-gray-500 font-medium">
              Why run around government offices and banks in Bangalore traffic when our expert
              team does it all for you — completely free of charge?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl border border-[var(--surface-border)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--surface)] text-[var(--foreground)] border border-[var(--surface-border)] mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-3 tracking-tight">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{service.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Banner - Pristine Dark Mode (Apple Style) */}
          <div className="bg-[var(--foreground)] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Ready for Your VIP Experience?
              </h3>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
                Leave your number and our dedicated Relationship Manager will call you within 30
                minutes. We come to YOU — no bank visits needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="px-8 py-4 bg-white text-[var(--foreground)] font-bold rounded-full hover:scale-[1.02] transition-transform text-base"
                >
                  Request a Free RM Visit
                </button>
                <a
                  href="tel:+917406088871"
                  className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-base"
                >
                  Call Us: +91 74060 88871
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showLeadForm && (
          <LeadForm onClose={() => setShowLeadForm(false)} defaultService="Home Loan" />
        )}
      </AnimatePresence>
    </>
  );
}
