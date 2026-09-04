"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import LeadForm from "./LeadForm";

type BankType = {
  name: string;
  logo: string;
  homeLoan: string;
  personalLoan: string;
  khathaNote: string;
};

export default function BankMarquee() {
  const [banks, setBanks] = useState<BankType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);

  useEffect(() => {
    fetch(`/api/banks`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: any[]) => {
        const mapped = data.map((b) => ({
          name: b.name,
          logo: b.logo,
          homeLoan: b.homeLoan.A_Khatha["825+"] !== "N/A" ? b.homeLoan.A_Khatha["825+"] : b.homeLoan.B_Khatha["825+"],
          personalLoan: b.personalLoan.rates["825+"],
          khathaNote: b.homeLoan.note
        }));
        setBanks(mapped);
      })
      .catch(() => setBanks([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="scroll-mt-24 py-20 bg-[var(--background)] border-b border-[var(--surface-border)]" id="banks">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">Partner Banks</h2>
          <p className="text-xl text-gray-500 mb-8 font-medium">Select any bank to view current rates and offers.</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl text-base text-[var(--foreground)] focus:border-[var(--brand-blue)] focus:ring-1 focus:ring-[var(--brand-blue)] focus:outline-none transition-all shadow-sm"
              placeholder="Search for a bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 font-medium">Loading partner banks...</div>
        ) : !searchTerm ? (
          <div className="relative overflow-hidden py-4">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-5 w-max"
              animate={{ x: ["0px", `-${banks.length * 240}px`] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[...banks, ...banks].map((bank, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedBank(bank)}
                  className="flex items-center gap-4 px-6 py-5 bg-white border border-[var(--surface-border)] rounded-3xl hover:border-[var(--brand-blue)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer transition-all shrink-0 w-[230px]"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                    <img src={bank.logo} alt={bank.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=' + bank.name.substring(0, 3) }} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[var(--foreground)] text-base">{bank.name}</p>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">from <span className="text-emerald-600 font-bold">{bank.homeLoan}</span></p>
                  </div>
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-center gap-5">
            {filteredBanks.map((bank, i) => (
              <button
                key={i}
                onClick={() => setSelectedBank(bank)}
                className="flex items-center gap-4 px-6 py-5 bg-white border border-[var(--surface-border)] rounded-3xl hover:border-[var(--brand-blue)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer transition-all w-[230px]"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                  <img src={bank.logo} alt={bank.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=' + bank.name.substring(0, 3) }} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[var(--foreground)] text-base">{bank.name}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">from <span className="text-emerald-600 font-bold">{bank.homeLoan}</span></p>
                </div>
              </button>
            ))}
            {filteredBanks.length === 0 && (
              <p className="text-gray-400 py-12 text-lg font-medium">No banks found matching "{searchTerm}"</p>
            )}
          </div>
        )}
      </section>

      {/* Bank Detail Popup */}
      <AnimatePresence>
        {selectedBank && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBank(null)}
          >
            <motion.div
              className="relative w-full max-w-sm bg-[var(--background)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--surface-border)]"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--surface)] px-8 py-10 border-b border-[var(--surface-border)] text-center relative">
                <button
                  onClick={() => setSelectedBank(null)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[var(--foreground)] bg-white rounded-full border border-[var(--surface-border)] shadow-sm hover:scale-105 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3">
                  <img src={selectedBank.logo} alt={selectedBank.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=' + selectedBank.name.substring(0, 3) }} />
                </div>
                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{selectedBank.name}</h3>
                <p className="text-gray-500 text-sm font-medium mt-2">{selectedBank.khathaNote}</p>
              </div>

              <div className="p-8 space-y-4 bg-white">
                <div className="flex items-center justify-between p-5 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">Home Loan</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Starting rate p.a.</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">{selectedBank.homeLoan}</p>
                </div>

                <div className="flex items-center justify-between p-5 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">Personal Loan</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Starting rate p.a.</p>
                  </div>
                  <p className="text-2xl font-black text-[var(--brand-blue)]">{selectedBank.personalLoan}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedBank(null);
                    setShowLeadForm(true);
                  }}
                  className="w-full mt-4 py-4 bg-[var(--foreground)] text-white font-bold rounded-full hover:scale-[1.02] transition-transform text-base"
                >
                  Apply via BPL Arena
                </button>
                <p className="text-xs text-center text-gray-400 font-medium pt-2">
                  Our RM will negotiate the best rate for you
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeadForm && (
          <LeadForm onClose={() => setShowLeadForm(false)} defaultService="Home Loan" />
        )}
      </AnimatePresence>
    </>
  );
}
