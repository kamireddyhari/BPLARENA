"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Lightbulb } from "lucide-react";

// Local fallback trivia so the modal ALWAYS works even if backend is offline
const LOCAL_TRIVIA = [
  {
    id: 1,
    question: "What is an 'A Khatha' in Bangalore?",
    options: [
      "A legally approved property document by BBMP",
      "A temporary tax receipt",
      "A property demolition certificate",
      "A rental deed",
    ],
    answer: "A legally approved property document by BBMP",
    explanation:
      "A Khatha means the property is fully approved by BBMP, legally built, and eligible for home loans from all major banks at the best rates.",
  },
  {
    id: 2,
    question: "What is a 'B Khatha' property?",
    options: [
      "A property with pending regularisation with BBMP",
      "A fully approved luxury property",
      "A heritage listed building",
      "A government-owned property",
    ],
    answer: "A property with pending regularisation with BBMP",
    explanation:
      "B Khatha properties haven't fully complied with BBMP rules yet. Fewer banks lend on B Khatha, and at higher interest rates.",
  },
  {
    id: 3,
    question: "What is a CIBIL score and what's a good score for a home loan?",
    options: [
      "A 3-digit credit score; 750+ is ideal for best rates",
      "A property valuation index; 500+ is good",
      "A government tax ID; any score above 300 is fine",
      "A bank rating; 650+ is the minimum for any loan",
    ],
    answer: "A 3-digit credit score; 750+ is ideal for best rates",
    explanation:
      "CIBIL score (300–900) measures your creditworthiness. A score above 750 unlocks the lowest interest rates. BPL Arena can help you fix CIBIL issues.",
  },
  {
    id: 4,
    question: "What is the primary benefit of a Balance Transfer on a home loan?",
    options: [
      "Lower the Rate of Interest (ROI)",
      "Increase the loan amount automatically",
      "Change the property's Khatha type",
      "Get a payment holiday for 6 months",
    ],
    answer: "Lower the Rate of Interest (ROI)",
    explanation:
      "A Balance Transfer moves your outstanding loan to a bank offering a lower rate, which can save lakhs over the loan tenure.",
  },
  {
    id: 5,
    question: "What does DSA stand for in banking?",
    options: [
      "Direct Selling Agent",
      "Deposit Savings Account",
      "Daily Settlement Allowance",
      "Digital Services Application",
    ],
    answer: "Direct Selling Agent",
    explanation:
      "A DSA is an intermediary between banks and customers. BPL Arena is a DSA for multiple banks, securing the best deals for Bangalore borrowers.",
  },
  {
    id: 6,
    question: "What does BBMP stand for?",
    options: [
      "Bruhat Bengaluru Mahanagara Palike",
      "Bangalore Builders and Property Management Panel",
      "Bruhat Bangalore Metro Project",
      "Bangalore Banking and Mortgage Portal",
    ],
    answer: "Bruhat Bengaluru Mahanagara Palike",
    explanation:
      "BBMP is the civic governing body of Greater Bangalore. All property Khatha transfers, tax payments, and building approvals go through BBMP.",
  },
  {
    id: 7,
    question: "What is 'stamp duty' on a property in Karnataka?",
    options: [
      "A government tax (~5% of value) paid when registering a property",
      "A fee for property valuation by the bank",
      "A bank processing charge for the loan",
      "A builder registration fee",
    ],
    answer: "A government tax (~5% of value) paid when registering a property",
    explanation:
      "In Karnataka, stamp duty is typically 5% of the property value, paid to the government at the sub-registrar office during registration.",
  },
  {
    id: 8,
    question: "What is FOIR in loan eligibility?",
    options: [
      "Fixed Obligation to Income Ratio — banks prefer below 50%",
      "Final Outstanding Interest Rate",
      "Fixed Order of Income Repayment",
      "First Outstanding Installment Ratio",
    ],
    answer: "Fixed Obligation to Income Ratio — banks prefer below 50%",
    explanation:
      "FOIR is total monthly obligations ÷ gross monthly income. Banks prefer FOIR below 50–55% to ensure you can comfortably repay the new EMI.",
  },
];

type TriviaQuestion = (typeof LOCAL_TRIVIA)[0];

export default function TriviaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Only show once per session to prevent annoying re-triggers
    if (typeof window !== "undefined" && sessionStorage.getItem("bpl_trivia_shown")) {
      return;
    }

    const timer = setTimeout(() => {
      loadTrivia();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const loadTrivia = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bpl_trivia_shown", "true");
    }

    // Try to fetch from backend; fall back to local data
    let questions: TriviaQuestion[] = LOCAL_TRIVIA;
    try {
      const res = await fetch(`/api/trivia`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) questions = data;
      }
    } catch {
      // backend not available — use local fallback silently
    }
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setTrivia(randomQ);
    setIsOpen(true);
  };

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
  };

  if (!isOpen || !trivia) return null;

  const isCorrect = selected === trivia.answer;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          className="relative w-full max-w-lg bg-[var(--background)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--surface-border)]"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[var(--surface)] p-6 sm:p-8 border-b border-[var(--surface-border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[var(--surface-border)] shadow-sm">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  BPL Financial Trivia
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[var(--foreground)] p-2 bg-white rounded-full border border-[var(--surface-border)] shadow-sm hover:scale-105 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] leading-snug tracking-tight">
              {trivia.question}
            </h2>
          </div>

          {/* Options */}
          <div className="p-6 sm:p-8 space-y-3 bg-white">
            {trivia.options.map((option) => {
              const isThisCorrect = option === trivia.answer;
              const isThisSelected = option === selected;
              let cls =
                "w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-200 flex items-center justify-between gap-3 ";
              if (!showResult) {
                cls +=
                  "border-[var(--surface-border)] text-gray-600 hover:border-[var(--brand-blue)] hover:bg-[var(--surface)] cursor-pointer";
              } else if (isThisCorrect) {
                cls += "border-emerald-500 bg-emerald-50 text-emerald-800";
              } else if (isThisSelected && !isThisCorrect) {
                cls += "border-red-400 bg-red-50 text-red-800";
              } else {
                cls += "border-[var(--surface-border)] text-gray-400 opacity-50 bg-[var(--surface)]";
              }

              return (
                <button
                  key={option}
                  className={cls}
                  onClick={() => handleSelect(option)}
                  disabled={showResult}
                >
                  <span className="leading-snug">{option}</span>
                  {showResult && isThisCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {showResult && isThisSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-6 pb-6 sm:px-8 sm:pb-8 bg-white"
              >
                <div
                  className={`p-5 rounded-2xl mb-6 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}
                >
                  <p className="text-sm font-bold mb-1 text-gray-800 flex items-center gap-2">
                    {isCorrect ? "🎉 Correct!" : "💡 Good to know!"}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{trivia.explanation}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-white font-bold bg-[var(--foreground)] rounded-full hover:scale-[1.02] transition-transform text-base tracking-wide"
                >
                  Continue to BPL Arena →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
