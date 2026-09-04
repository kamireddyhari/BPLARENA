"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, TrendingUp, RefreshCw } from "lucide-react";

type KhathaType = "A_Khatha" | "B_Khatha";
type CibilTier = "825+" | "800+" | "750+" | "700-749" | "650-699";
type LoanType = "Home Loan" | "Personal Loan";

const CIBIL_LABELS: Record<CibilTier, string> = {
  "825+": "Exceptional (825+)",
  "800+": "Excellent (800+)",
  "750+": "Good (750+)",
  "700-749": "Fair (700–749)",
  "650-699": "Low (650–699)",
};

interface Bank {
  name: string;
  logo: string;
  homeLoan: {
    A_Khatha: Record<CibilTier, string>;
    B_Khatha: Record<CibilTier, string>;
    note: string;
  };
  personalLoan: {
    rates: Record<CibilTier, string>;
    note: string;
  };
}

export default function LiveRates({ onClose }: { onClose: () => void }) {
  const [loanType, setLoanType] = useState<LoanType>("Home Loan");
  const [khathaType, setKhathaType] = useState<KhathaType>("A_Khatha");
  const [cibilTier, setCibilTier] = useState<CibilTier>("800+");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/banks`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setBanks(data))
      .catch(() => setBanks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl bg-[var(--background)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--surface-border)] max-h-[92vh] flex flex-col"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[var(--surface)] px-8 py-6 border-b border-[var(--surface-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[var(--surface-border)] shadow-sm">
              <TrendingUp className="w-6 h-6 text-[var(--brand-blue)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">Live ROI Rates</h2>
              <p className="text-gray-400 font-medium text-sm mt-0.5">Compare interest rates across top banks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[var(--foreground)] p-2.5 bg-white rounded-full border border-[var(--surface-border)] shadow-sm hover:scale-105 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-8 py-7 bg-white space-y-6">

            {/* Loan Type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Loan Type</p>
              <div className="flex gap-3">
                {(["Home Loan", "Personal Loan"] as LoanType[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLoanType(l)}
                    className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                      loanType === l
                        ? "border-[var(--brand-blue)] bg-blue-50 text-[var(--brand-blue)]"
                        : "border-[var(--surface-border)] text-gray-500 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type — Home Loan only */}
            {loanType === "Home Loan" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Property Type</p>
                <div className="flex gap-3">
                  {(["A_Khatha", "B_Khatha"] as KhathaType[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setKhathaType(k)}
                      className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                        khathaType === k
                          ? "border-[var(--brand-blue)] bg-blue-50 text-[var(--brand-blue)]"
                          : "border-[var(--surface-border)] text-gray-500 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {k.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CIBIL Score */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">CIBIL Score</p>
              <div className="flex flex-wrap gap-3">
                {(["825+", "800+", "750+", "700-749", "650-699"] as CibilTier[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCibilTier(c)}
                    className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-2xl text-sm font-bold border-2 transition-all text-left ${
                      cibilTier === c
                        ? "border-[var(--brand-blue)] bg-blue-50 text-[var(--brand-blue)]"
                        : "border-[var(--surface-border)] text-gray-500 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {CIBIL_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rates List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Loading rates...</span>
                </div>
              ) : banks.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-medium">
                  Could not load rates. Backend may be offline.
                </div>
              ) : (
                banks.map((bank) => {
                  const rate =
                    loanType === "Home Loan"
                      ? bank.homeLoan[khathaType][cibilTier]
                      : bank.personalLoan.rates[cibilTier];
                  const note =
                    loanType === "Home Loan" ? bank.homeLoan.note : bank.personalLoan.note;
                  const isNA = rate === "N/A";

                  return (
                    <div
                      key={bank.name}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                        isNA
                          ? "border-gray-100 bg-gray-50 opacity-40"
                          : "border-[var(--surface-border)] bg-white hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--foreground)] text-base tracking-tight">{bank.name}</p>
                          <p className="text-xs font-medium text-gray-400 mt-0.5">{note}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isNA ? (
                          <span className="text-gray-300 text-sm font-bold">Not Available</span>
                        ) : (
                          <>
                            <span
                              className={`text-2xl font-black tracking-tight ${
                                loanType === "Personal Loan"
                                  ? "text-emerald-600"
                                  : "text-[var(--brand-blue)]"
                              }`}
                            >
                              {rate}
                            </span>
                            <p className="text-xs text-gray-400 font-medium">per year</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 text-sm">
              <p className="font-bold text-amber-800 mb-1">⚠️ Indicative Rates</p>
              <p className="text-amber-700 font-medium leading-relaxed">
                Rates are subject to change based on your income, employer, and bank policy.
                Contact BPL Arena for your exact personalised quote.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-[var(--foreground)] text-white font-bold rounded-full hover:scale-[1.02] transition-transform text-base tracking-wide"
            >
              Get My Best Rate →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
