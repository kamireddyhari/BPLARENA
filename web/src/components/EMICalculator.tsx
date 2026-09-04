"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calculator,
  Home,
  ArrowLeftRight,
} from "lucide-react";

/* ─── Helpers ─── */
const BANKS = [
  { name: "SBI", homeRate: { A: { "825+": 8.40, "800-824": 8.50, "750-799": 8.65, "700-749": 9.10, "650-699": 9.50, "below650": 0 }, B: { "825+": 0, "800-824": 0, "750-799": 0, "700-749": 0, "650-699": 0, "below650": 0 } } },
  { name: "HDFC Bank", homeRate: { A: { "825+": 8.50, "800-824": 8.60, "750-799": 8.75, "700-749": 9.25, "650-699": 9.65, "below650": 0 }, B: { "825+": 10.50, "800-824": 10.75, "750-799": 0, "700-749": 0, "650-699": 0, "below650": 0 } } },
  { name: "ICICI Bank", homeRate: { A: { "825+": 8.65, "800-824": 8.75, "750-799": 8.90, "700-749": 9.40, "650-699": 9.80, "below650": 0 }, B: { "825+": 10.75, "800-824": 10.85, "750-799": 11.00, "700-749": 0, "650-699": 0, "below650": 0 } } },
  { name: "Axis Bank", homeRate: { A: { "825+": 8.70, "800-824": 8.80, "750-799": 8.95, "700-749": 9.50, "650-699": 9.90, "below650": 10.50 }, B: { "825+": 10.80, "800-824": 10.95, "750-799": 11.10, "700-749": 11.50, "650-699": 11.90, "below650": 0 } } },
  { name: "LIC HFL", homeRate: { A: { "825+": 8.60, "800-824": 8.70, "750-799": 8.80, "700-749": 9.30, "650-699": 9.70, "below650": 10.30 }, B: { "825+": 10.60, "800-824": 10.75, "750-799": 10.90, "700-749": 11.30, "650-699": 11.70, "below650": 0 } } },
  { name: "PNB Housing", homeRate: { A: { "825+": 8.75, "800-824": 8.85, "750-799": 9.00, "700-749": 9.60, "650-699": 10.00, "below650": 10.60 }, B: { "825+": 10.90, "800-824": 11.05, "750-799": 11.20, "700-749": 11.75, "650-699": 12.10, "below650": 0 } } },
  { name: "Kotak Mahindra", homeRate: { A: { "825+": 8.80, "800-824": 8.90, "750-799": 9.05, "700-749": 9.65, "650-699": 10.10, "below650": 0 }, B: { "825+": 0, "800-824": 0, "750-799": 0, "700-749": 0, "650-699": 0, "below650": 0 } } },
  { name: "Bank of Baroda", homeRate: { A: { "825+": 8.45, "800-824": 8.55, "750-799": 8.70, "700-749": 9.20, "650-699": 9.60, "below650": 0 }, B: { "825+": 0, "800-824": 0, "750-799": 0, "700-749": 0, "650-699": 0, "below650": 0 } } },
];

type KhathaKey = "A" | "B";
type CibilKey = "825+" | "800-824" | "750-799" | "700-749" | "650-699" | "below650" | "dontknow";

const CIBIL_OPTIONS: { value: CibilKey; label: string }[] = [
  { value: "825+", label: "825+" },
  { value: "800-824", label: "800–824" },
  { value: "750-799", label: "750–799" },
  { value: "700-749", label: "700–749" },
  { value: "650-699", label: "650–699" },
  { value: "below650", label: "Below 650" },
  { value: "dontknow", label: "Don't Know" },
];

function calcEMI(principal: number, annualRate: number, tenureMonths: number) {
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  if (r === 0 || n === 0) return { emi: 0, total: 0, interest: 0 };
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  return { emi, total, interest: total - principal };
}

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

function getRate(bank: string, khatha: KhathaKey, cibil: CibilKey): number {
  const b = BANKS.find((x) => x.name === bank);
  if (!b) return 8.5;
  // "Don't Know" defaults to 750-799 range as a safe midpoint
  const effectiveCibil: Exclude<CibilKey, "dontknow"> = cibil === "dontknow" ? "750-799" : cibil;
  return b.homeRate[khatha][effectiveCibil] || 0;
}

/* ─── Tenure Helper ─── */
function TenureInput({
  tenureMonths,
  setTenureMonths,
}: {
  tenureMonths: number;
  setTenureMonths: (v: number) => void;
}) {
  const [unit, setUnit] = useState<"years" | "months">("years");
  const displayVal = unit === "years" ? Math.round(tenureMonths / 12) : tenureMonths;

  function handleChange(val: number) {
    if (unit === "years") setTenureMonths(val * 12);
    else setTenureMonths(val);
  }

  return (
    <div className="flex gap-2 h-12">
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as "years" | "months")}
        className="flex-1 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors"
      >
        <option value="years">Years</option>
        <option value="months">Months</option>
      </select>
      <input
        type="number"
        value={displayVal}
        onChange={(e) => handleChange(Number(e.target.value) || 1)}
        min={1}
        className="w-24 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors text-center"
      />
    </div>
  );
}

/* ─── Khatha + CIBIL Selectors ─── */
function BankSelectors({
  bank,
  setBank,
  khatha,
  setKhatha,
  cibil,
  setCibil,
}: {
  bank: string;
  setBank: (v: string) => void;
  khatha: KhathaKey | "dontknow";
  setKhatha: (v: KhathaKey | "dontknow") => void;
  cibil: CibilKey;
  setCibil: (v: CibilKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bank</label>
        <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors">
          {BANKS.map((b) => <option key={b.name}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Khatha Type</label>
        <select value={khatha} onChange={(e) => setKhatha(e.target.value as KhathaKey | "dontknow")} className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors">
          <option value="A">A Khatha</option>
          <option value="B">B Khatha</option>
          <option value="dontknow">Don&apos;t Know</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">CIBIL Profile</label>
        <select value={cibil} onChange={(e) => setCibil(e.target.value as CibilKey)} className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors">
          {CIBIL_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ─── Tabs Config ─── */
const TABS = [
  { id: "eligibility", label: "Eligibility", icon: Home },
  { id: "emi", label: "EMI Calculator", icon: Calculator },
  { id: "bt", label: "Switch & Save", icon: ArrowLeftRight },
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function EMICalculator({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("emi");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-[var(--background)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--surface-border)] max-h-[95vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─ Header ─ */}
        <div className="bg-[var(--surface)] p-6 sm:p-8 border-b border-[var(--surface-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-[var(--surface-border)] shadow-sm rounded-2xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[var(--foreground)]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">BPL Arena Calculators</h2>
                <p className="text-gray-500 font-medium text-sm">Plan your finances with precision</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-[var(--foreground)] p-2 bg-white rounded-full border border-[var(--surface-border)] shadow-sm hover:scale-105 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white text-[var(--foreground)] shadow-sm"
                      : "text-gray-500 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─ Tab Content ─ */}
        <div className="p-6 sm:p-8 bg-white">
          {activeTab === "eligibility" && <EligibilityTab />}
          {activeTab === "emi" && <EMITab />}
          {activeTab === "bt" && <BalanceTransferTab />}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB 1: Home Loan Eligibility
   ════════════════════════════════════════════════════════════════ */
function EligibilityTab() {
  const [salary, setSalary] = useState("");
  const [otherIncome, setOtherIncome] = useState<"No" | "Yes">("No");
  const [otherAmount, setOtherAmount] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [tenureMonths, setTenureMonths] = useState(240);
  const [rateMode, setRateMode] = useState<"bank" | "manual">("bank");
  const [bank, setBank] = useState("SBI");
  const [khatha, setKhatha] = useState<KhathaKey | "dontknow">("A");
  const [cibil, setCibil] = useState<CibilKey>("825+");
  const [manualRate, setManualRate] = useState("");
  const [result, setResult] = useState<{ eligible: number; emi: number; rate: number } | null>(null);

  const effectiveKhatha: KhathaKey = khatha === "dontknow" ? "A" : khatha;
  const rate = rateMode === "bank" ? getRate(bank, effectiveKhatha, cibil) : parseFloat(manualRate) || 0;

  function calculate() {
    const monthlyIncome = (parseFloat(salary) || 0) + (otherIncome === "Yes" ? parseFloat(otherAmount) || 0 : 0);
    const obligations = parseFloat(existingEMI) || 0;
    const maxEMI = monthlyIncome * 0.5 - obligations;
    if (maxEMI <= 0 || rate <= 0) {
      setResult({ eligible: 0, emi: 0, rate });
      return;
    }
    const r = rate / 12 / 100;
    const n = tenureMonths;
    const eligible = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    setResult({ eligible, emi: maxEMI, rate });
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Monthly Salary (₹)</label>
          <input type="number" placeholder="e.g. 75000" value={salary} onChange={(e) => setSalary(e.target.value)}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Other Monthly Income?</label>
          <select value={otherIncome} onChange={(e) => setOtherIncome(e.target.value as "No" | "Yes")}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors">
            <option>No</option><option>Yes</option>
          </select>
          {otherIncome === "Yes" && (
            <input type="number" placeholder="Amount per month" value={otherAmount} onChange={(e) => setOtherAmount(e.target.value)}
              className="w-full h-12 mt-3 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Existing Monthly EMI (₹)</label>
          <input type="number" placeholder="0" value={existingEMI} onChange={(e) => setExistingEMI(e.target.value)}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Tenure</label>
          <TenureInput tenureMonths={tenureMonths} setTenureMonths={setTenureMonths} />
        </div>
      </div>

      {/* Interest Rate / ROI */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-[var(--foreground)] mb-3">Interest Rate / ROI</label>
        <div className="flex items-center gap-6 mb-5">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="eligRateMode" checked={rateMode === "bank"} onChange={() => setRateMode("bank")} className="accent-[var(--foreground)] w-4 h-4" /> Choose Bank
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="eligRateMode" checked={rateMode === "manual"} onChange={() => setRateMode("manual")} className="accent-[var(--foreground)] w-4 h-4" /> Enter ROI
          </label>
        </div>
        {rateMode === "bank" ? (
          <BankSelectors bank={bank} setBank={setBank} khatha={khatha} setKhatha={setKhatha} cibil={cibil} setCibil={setCibil} />
        ) : (
          <input type="number" step="0.01" placeholder="e.g. 8.50" value={manualRate} onChange={(e) => setManualRate(e.target.value)}
            className="w-full sm:w-48 h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        )}
      </div>

      {/* Indicative ROI */}
      {rate > 0 && (
        <div className="inline-block bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--foreground)] text-sm font-bold px-5 py-3 rounded-xl mb-6">
          Indicative ROI: <span className="text-[var(--brand-blue)]">{rate.toFixed(2)}%</span>
        </div>
      )}
      {rate === 0 && rateMode === "bank" && (
        <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-3 rounded-xl mb-6">
          ⚠️ Not available for this Khatha/CIBIL combination
        </div>
      )}

      <button onClick={calculate}
        className="w-full sm:w-auto px-10 py-4 bg-[var(--foreground)] text-white font-bold rounded-full hover:scale-[1.02] transition-transform shadow-lg">
        Calculate Eligibility
      </button>

      {result && result.eligible > 0 && (
        <div className="mt-8 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 md:p-8">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">You are eligible for</p>
          <p className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-3 tracking-tight">{fmt(result.eligible)}</p>
          <p className="text-base text-gray-600 font-medium">at <strong className="text-[var(--foreground)]">{result.rate.toFixed(2)}%</strong> p.a. | Max EMI: <strong className="text-[var(--foreground)]">{fmt(result.emi)}</strong>/month</p>
        </div>
      )}
      {result && result.eligible <= 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-base font-medium">
          Your existing obligations exceed your eligible EMI capacity. Try reducing existing EMIs or increasing income.
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB 2: EMI Calculator
   ════════════════════════════════════════════════════════════════ */
function EMITab() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [rateMode, setRateMode] = useState<"bank" | "manual">("bank");
  const [bank, setBank] = useState("SBI");
  const [khatha, setKhatha] = useState<KhathaKey | "dontknow">("A");
  const [cibil, setCibil] = useState<CibilKey>("825+");
  const [manualRate, setManualRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(240);

  const effectiveKhatha: KhathaKey = khatha === "dontknow" ? "A" : khatha;
  const interestRate = rateMode === "bank" ? getRate(bank, effectiveKhatha, cibil) : manualRate;
  const { emi, total, interest } = calcEMI(loanAmount, interestRate, tenureMonths);
  const principalPct = total > 0 ? Math.round((loanAmount / total) * 100) : 0;
  const interestPct = 100 - principalPct;

  return (
    <div>
      {/* EMI Result */}
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-3xl p-6 mb-8 text-center">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Your Monthly EMI</p>
        <p className="text-5xl font-black text-[var(--brand-blue)] tracking-tight">{interestRate > 0 ? fmt(emi) : "—"}</p>
        <p className="text-sm font-medium text-gray-500 mt-2">per month</p>
      </div>

      {/* Loan Amount Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-[var(--foreground)]">Loan Amount</label>
          <span className="text-sm font-black text-[var(--foreground)] bg-gray-100 px-4 py-1.5 rounded-lg">{fmt(loanAmount)}</span>
        </div>
        <input type="range" min={500000} max={50000000} step={100000} value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--foreground)]" />
        <div className="flex justify-between text-xs font-bold text-gray-400 mt-2"><span>₹5L</span><span>₹5 Cr</span></div>
      </div>

      {/* Interest Rate / ROI */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-[var(--foreground)] mb-3">Interest Rate / ROI</label>
        <div className="flex items-center gap-6 mb-5">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="emiRateMode" checked={rateMode === "bank"} onChange={() => setRateMode("bank")} className="accent-[var(--foreground)] w-4 h-4" /> Choose Bank
          </label>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="radio" name="emiRateMode" checked={rateMode === "manual"} onChange={() => setRateMode("manual")} className="accent-[var(--foreground)] w-4 h-4" /> Enter ROI
          </label>
        </div>
        {rateMode === "bank" ? (
          <BankSelectors bank={bank} setBank={setBank} khatha={khatha} setKhatha={setKhatha} cibil={cibil} setCibil={setCibil} />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Manual Rate</span>
              <span className="text-sm font-black text-[var(--foreground)] bg-gray-100 px-4 py-1.5 rounded-lg">{manualRate.toFixed(2)}%</span>
            </div>
            <input type="range" min={7} max={18} step={0.05} value={manualRate}
              onChange={(e) => setManualRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--foreground)]" />
            <div className="flex justify-between text-xs font-bold text-gray-400 mt-2"><span>7%</span><span>18%</span></div>
          </div>
        )}
      </div>

      {/* Indicative ROI badge */}
      {rateMode === "bank" && interestRate > 0 && (
        <div className="inline-block bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--foreground)] text-sm font-bold px-5 py-3 rounded-xl mb-6">
          Indicative ROI: <span className="text-[var(--brand-blue)]">{interestRate.toFixed(2)}%</span>
        </div>
      )}
      {rateMode === "bank" && interestRate === 0 && (
        <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-3 rounded-xl mb-6">
          ⚠️ Not available for this Khatha/CIBIL combination
        </div>
      )}

      {/* Tenure */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-[var(--foreground)] mb-3">Tenure</label>
        <TenureInput tenureMonths={tenureMonths} setTenureMonths={setTenureMonths} />
      </div>

      {/* Breakdown */}
      {interestRate > 0 && (
        <div className="pt-4 border-t border-[var(--surface-border)]">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-[var(--surface)] rounded-2xl p-4 sm:p-6 text-center border border-[var(--surface-border)]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Principal</p>
              <p className="text-xl sm:text-2xl font-black text-[var(--foreground)]">{fmt(loanAmount)}</p>
              <p className="text-xs font-bold text-[var(--brand-blue)] mt-1">{principalPct}% of total</p>
            </div>
            <div className="bg-[var(--surface)] rounded-2xl p-4 sm:p-6 text-center border border-[var(--surface-border)]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Interest</p>
              <p className="text-xl sm:text-2xl font-black text-[var(--foreground)]">{fmt(interest)}</p>
              <p className="text-xs font-bold text-orange-500 mt-1">{interestPct}% of total</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
              <div className="bg-[var(--brand-blue)] transition-all duration-500" style={{ width: `${principalPct}%` }} />
              <div className="bg-orange-500 transition-all duration-500" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)] inline-block" />Principal</span>
              <span className="text-[var(--foreground)]">Total: {fmt(total)}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />Interest</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-4 sm:p-5 text-sm font-medium text-gray-600">
        <p className="font-bold text-[var(--foreground)] mb-1">💡 BPL Arena Tip:</p>
        <p>A Balance Transfer to a lower-rate bank can save you lakhs. Talk to our RM today!</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB 3: Balance Transfer
   ════════════════════════════════════════════════════════════════ */
function BalanceTransferTab() {
  const [outstanding, setOutstanding] = useState("");
  const [currentROI, setCurrentROI] = useState("");
  const [newROI, setNewROI] = useState("");
  const [tenureMonths, setTenureMonths] = useState(240);
  const [result, setResult] = useState<{
    currentEMI: number; newEMI: number; monthlySaving: number; totalSaving: number;
  } | null>(null);

  function compare() {
    const loan = parseFloat(outstanding) || 0;
    const oldRate = parseFloat(currentROI) || 0;
    const newRate = parseFloat(newROI) || 0;
    if (loan <= 0 || oldRate <= 0 || newRate <= 0) return;
    const current = calcEMI(loan, oldRate, tenureMonths);
    const newCalc = calcEMI(loan, newRate, tenureMonths);
    setResult({
      currentEMI: current.emi, newEMI: newCalc.emi,
      monthlySaving: current.emi - newCalc.emi, totalSaving: current.total - newCalc.total,
    });
  }

  return (
    <div>
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-5 mb-8 text-sm font-medium text-gray-600">
        <p className="font-bold text-[var(--foreground)] mb-1">🔄 Already have a loan?</p>
        <p>Let&apos;s try your existing bank first. If the rate cannot be improved suitably, compare a balance transfer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Outstanding Loan (₹)</label>
          <input type="number" placeholder="e.g. 3500000" value={outstanding} onChange={(e) => setOutstanding(e.target.value)}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Current ROI (%)</label>
          <input type="number" step="0.01" placeholder="e.g. 9.50" value={currentROI} onChange={(e) => setCurrentROI(e.target.value)}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Possible New ROI (%)</label>
          <input type="number" step="0.01" placeholder="e.g. 8.50" value={newROI} onChange={(e) => setNewROI(e.target.value)}
            className="w-full h-12 px-4 border border-[var(--surface-border)] bg-[var(--surface)] rounded-xl text-sm font-medium focus:border-[var(--brand-blue)] focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Remaining Tenure</label>
          <TenureInput tenureMonths={tenureMonths} setTenureMonths={setTenureMonths} />
        </div>
      </div>

      <button onClick={compare}
        className="w-full sm:w-auto px-10 py-4 bg-[var(--foreground)] text-white font-bold rounded-full hover:scale-[1.02] transition-transform shadow-lg">
        Compare EMI
      </button>

      {result && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current EMI</p>
            <p className="text-3xl font-black text-[var(--foreground)]">{fmt(result.currentEMI)}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--brand-blue)] rounded-2xl p-6 text-center shadow-[0_0_15px_rgba(0,113,227,0.1)]">
            <p className="text-xs font-bold text-[var(--brand-blue)] uppercase tracking-wider mb-2">New EMI</p>
            <p className="text-3xl font-black text-[var(--brand-blue)]">{fmt(result.newEMI)}</p>
          </div>
          {result.monthlySaving > 0 && (
            <div className="sm:col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 text-center mt-2">
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">You save</p>
              <p className="text-4xl font-black text-emerald-700 mb-2 tracking-tight">{fmt(result.monthlySaving)}<span className="text-base font-bold text-emerald-600/70"> / month</span></p>
              <p className="text-base text-emerald-800 font-medium">Total savings: <strong className="font-black">{fmt(result.totalSaving)}</strong> over the tenure</p>
            </div>
          )}
          {result.monthlySaving <= 0 && (
            <div className="sm:col-span-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 text-center text-gray-600 text-base font-medium mt-2">
              The new rate doesn&apos;t offer savings. Your current rate may already be competitive!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
