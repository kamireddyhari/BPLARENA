"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, RefreshCw, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

const CIBIL_TIERS = ["825+", "800+", "750+", "700-749", "650-699"] as const;
type CibilTier = typeof CIBIL_TIERS[number];

interface HomeLoanRates {
  A_Khatha: Record<CibilTier, string>;
  B_Khatha: Record<CibilTier, string>;
  note: string;
}

interface PersonalLoanRates {
  rates: Record<CibilTier, string>;
  note: string;
}

interface Bank {
  name: string;
  logo: string;
  homeLoan: HomeLoanRates;
  personalLoan: PersonalLoanRates;
}

const emptyBank = (): Bank => ({
  name: "",
  logo: "",
  homeLoan: {
    A_Khatha: { "825+": "N/A", "800+": "N/A", "750+": "N/A", "700-749": "N/A", "650-699": "N/A" },
    B_Khatha: { "825+": "N/A", "800+": "N/A", "750+": "N/A", "700-749": "N/A", "650-699": "N/A" },
    note: "",
  },
  personalLoan: {
    rates: { "825+": "N/A", "800+": "N/A", "750+": "N/A", "700-749": "N/A", "650-699": "N/A" },
    note: "",
  },
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedBank, setExpandedBank] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Record<number, "home" | "personal">>({});

  const fetchBanks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/banks`, { cache: "no-store" });
      const data = await res.json();
      setBanks(data);
    } catch {
      alert("Could not connect to backend. Make sure it is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("bpl_admin_auth") === "true";
      if (isAuth) setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBanks();
    }
  }, [fetchBanks, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "broshark007" && password === "wantpappu007") {
      setIsAuthenticated(true);
      setAuthError("");
      localStorage.setItem("bpl_admin_auth", "true");
    } else {
      setAuthError("Invalid username or password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Login</h1>
            <p className="text-gray-400 font-medium text-sm mt-1">BPL Arena Dashboard</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                required
              />
            </div>
          </div>
          
          {authError && <p className="text-red-500 text-xs font-bold mb-4 text-center">{authError}</p>}
          
          <button type="submit" className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/banks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banks),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save. Check backend is running.");
    } finally {
      setSaving(false);
    }
  };

  const addBank = () => {
    const newIdx = banks.length;
    setBanks((prev) => [...prev, emptyBank()]);
    setExpandedBank(newIdx);
    setActiveTab((prev) => ({ ...prev, [newIdx]: "home" }));
  };

  const removeBank = (index: number) => {
    if (!confirm(`Delete "${banks[index].name || "this bank"}"?`)) return;
    setBanks((prev) => prev.filter((_, i) => i !== index));
    if (expandedBank === index) setExpandedBank(null);
  };

  const updateField = (idx: number, path: string[], value: string) => {
    setBanks((prev) => {
      const updated: Bank[] = JSON.parse(JSON.stringify(prev));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = updated[idx];
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return updated;
    });
  };

  const getTab = (idx: number) => activeTab[idx] ?? "home";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">BPL Arena · Admin</h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              {banks.length} bank{banks.length !== 1 ? "s" : ""} configured
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("bpl_admin_auth");
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              Logout
            </button>
            <button
              onClick={fetchBanks}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reload
            </button>
            <button
              onClick={addBank}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-700 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Bank
            </button>
            <button
              onClick={save}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-70 ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saved ? (
                <><CheckCircle className="w-4 h-4" /> Saved!</>
              ) : saving ? (
                <><Save className="w-4 h-4 animate-pulse" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {loading ? (
          <div className="text-center py-24 text-gray-400 font-medium text-lg">
            Loading bank data from backend...
          </div>
        ) : (
          <>
            {banks.map((bank, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Collapsed row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all select-none"
                  onClick={() => setExpandedBank(expandedBank === idx ? null : idx)}
                >
                  <div className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center p-1.5 shrink-0">
                    {bank.logo ? (
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-300 text-[10px] font-bold">LOGO</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base truncate">
                      {bank.name || (
                        <span className="text-gray-400 font-normal italic">Unnamed Bank</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                      {bank.logo || "No logo path set"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBank(idx);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedBank === idx ? (
                    <ChevronUp className="w-5 h-5 text-gray-300 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                </div>

                {/* Expanded editor */}
                {expandedBank === idx && (
                  <div className="border-t border-gray-100 px-6 py-6 space-y-6 bg-white">
                    {/* Name + Logo */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bank.name}
                          onChange={(e) => updateField(idx, ["name"], e.target.value)}
                          placeholder="e.g. HDFC Bank"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                          Logo Path
                        </label>
                        <input
                          type="text"
                          value={bank.logo}
                          onChange={(e) => updateField(idx, ["logo"], e.target.value)}
                          placeholder="/banks/hdfc.png or /banks/sbi.svg"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    {/* Loan type tabs */}
                    <div className="flex gap-2">
                      {(["home", "personal"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setActiveTab((prev) => ({ ...prev, [idx]: t }))
                          }
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                            getTab(idx) === t
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {t === "home" ? "🏠 Home Loan" : "💳 Personal Loan"}
                        </button>
                      ))}
                    </div>

                    {getTab(idx) === "home" ? (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                            Note (shown to users)
                          </label>
                          <input
                            type="text"
                            value={bank.homeLoan.note}
                            onChange={(e) =>
                              updateField(idx, ["homeLoan", "note"], e.target.value)
                            }
                            placeholder="e.g. Active in B Khatha"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          />
                        </div>

                        {(["A_Khatha", "B_Khatha"] as const).map((khatha) => (
                          <div key={khatha}>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                              {khatha.replace("_", " ")} — Rate by CIBIL
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                              {CIBIL_TIERS.map((tier) => (
                                <div key={tier}>
                                  <label className="text-xs text-gray-400 font-semibold block mb-1.5">
                                    {tier}
                                  </label>
                                  <input
                                    type="text"
                                    value={bank.homeLoan[khatha][tier]}
                                    onChange={(e) =>
                                      updateField(
                                        idx,
                                        ["homeLoan", khatha, tier],
                                        e.target.value
                                      )
                                    }
                                    placeholder="8.50% or N/A"
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                            Note (shown to users)
                          </label>
                          <input
                            type="text"
                            value={bank.personalLoan.note}
                            onChange={(e) =>
                              updateField(idx, ["personalLoan", "note"], e.target.value)
                            }
                            placeholder="e.g. Min salary ₹25,000"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                            Personal Loan Rate by CIBIL
                          </p>
                          <div className="grid grid-cols-4 gap-3">
                            {CIBIL_TIERS.map((tier) => (
                              <div key={tier}>
                                <label className="text-xs text-gray-400 font-semibold block mb-1.5">
                                  {tier}
                                </label>
                                <input
                                  type="text"
                                  value={bank.personalLoan.rates[tier]}
                                  onChange={(e) =>
                                    updateField(
                                      idx,
                                      ["personalLoan", "rates", tier],
                                      e.target.value
                                    )
                                  }
                                  placeholder="10.50% or N/A"
                                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {banks.length === 0 && !loading && (
              <div className="text-center py-24 text-gray-400">
                <p className="text-xl font-bold mb-2">No banks configured</p>
                <p className="text-sm">Click "Add Bank" to add your first bank.</p>
              </div>
            )}

            {banks.length > 0 && (
              <button
                onClick={save}
                disabled={saving}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-70 ${
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saved ? "✅ All Changes Saved!" : saving ? "Saving..." : "💾 Save All Changes"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
