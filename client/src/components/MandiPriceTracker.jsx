import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Building2,
  AlertCircle,
  Sparkles,
  Coins,
  MapPin
} from "lucide-react";

export const MANDI_DATA = {
  Karimnagar: [
    {
      id: "chilli",
      name: "Chilli (Teja)",
      localName: "మిర్చి / मिर्च",
      price: 19850,
      unit: "Quintal",
      change: 350,
      trend: "up",
      msp: 16500,
      arrivals: "420 Bags",
      quality: "Grade-1 FAQ",
      advisory: "High demand from exporters. Sell dry produce within 48-72h.",
      action: "SELL NOW",
    },
    {
      id: "cotton",
      name: "Cotton (Shankar-6)",
      localName: "పత్తి / कपास",
      price: 7420,
      unit: "Quintal",
      change: 120,
      trend: "up",
      msp: 7121,
      arrivals: "850 Qtl",
      quality: "Medium Staple (28mm)",
      advisory: "Prices above MSP. Ensure moisture below 8% to get max bid.",
      action: "GOOD TO SELL",
    },
    {
      id: "paddy",
      name: "Paddy (Sona Masoori)",
      localName: "వరి / धान",
      price: 2320,
      unit: "Quintal",
      change: 45,
      trend: "up",
      msp: 2203,
      arrivals: "1,400 Qtl",
      quality: "Grade-A FAQ",
      advisory: "Government procurement centers active. MSP guaranteed.",
      action: "STABLE",
    },
    {
      id: "maize",
      name: "Maize (Yellow Corn)",
      localName: "మొక్కజొన్న / मक्का",
      price: 2150,
      unit: "Quintal",
      change: -30,
      trend: "down",
      msp: 2090,
      arrivals: "320 Qtl",
      quality: "Standard Feed",
      advisory: "Poultry demand steady. Hold if storage available for 10 days.",
      action: "HOLD / STORE",
    },
    {
      id: "turmeric",
      name: "Turmeric (Finger)",
      localName: "పసుపు / हल्दी",
      price: 14200,
      unit: "Quintal",
      change: 400,
      trend: "up",
      msp: 11500,
      arrivals: "180 Bags",
      quality: "Double Polished",
      advisory: "Festive season supply crunch. Prices expected to stay strong.",
      action: "SELL NOW",
    },
  ],
  Warangal: [
    {
      id: "chilli",
      name: "Chilli (Wonder Hot)",
      localName: "మిర్చి / मिर्च",
      price: 20400,
      unit: "Quintal",
      change: 480,
      trend: "up",
      msp: 16500,
      arrivals: "980 Bags",
      quality: "Super Red FAQ",
      advisory: "Warangal Enamamula yard records active international bids.",
      action: "SELL NOW",
    },
    {
      id: "cotton",
      name: "Cotton (Long Staple)",
      localName: "పత్తి / कपास",
      price: 7550,
      unit: "Quintal",
      change: 180,
      trend: "up",
      msp: 7121,
      arrivals: "1,200 Qtl",
      quality: "Long Staple 30mm",
      advisory: "Ginners bidding aggressively for dry lot.",
      action: "SELL NOW",
    },
    {
      id: "paddy",
      name: "Paddy (Common)",
      localName: "వరి / धान",
      price: 2280,
      unit: "Quintal",
      change: 20,
      trend: "up",
      msp: 2183,
      arrivals: "2,100 Qtl",
      quality: "Common FAQ",
      advisory: "Steady mill purchases.",
      action: "STABLE",
    },
    {
      id: "soybean",
      name: "Soybean (Yellow)",
      localName: "సోయాబీన్ / सोयाबीन",
      price: 4680,
      unit: "Quintal",
      change: 90,
      trend: "up",
      msp: 4600,
      arrivals: "260 Qtl",
      quality: "Oil Grade",
      advisory: "Crushing units offering bonus for low moisture.",
      action: "GOOD TO SELL",
    },
  ],
  Nizamabad: [
    {
      id: "turmeric",
      name: "Turmeric (Nizamabad Bulk)",
      localName: "పసుపు / हल्दी",
      price: 14850,
      unit: "Quintal",
      change: 520,
      trend: "up",
      msp: 11500,
      arrivals: "1,100 Bags",
      quality: "Curcumin > 3.5%",
      advisory: "Prime terminal market. Top rates for unpolished cured lots.",
      action: "SELL NOW",
    },
    {
      id: "maize",
      name: "Maize (Hybrid)",
      localName: "మొక్కజొన్న / मक्का",
      price: 2180,
      unit: "Quintal",
      change: 40,
      trend: "up",
      msp: 2090,
      arrivals: "540 Qtl",
      quality: "Export Grade",
      advisory: "Starch manufacturers actively buying.",
      action: "GOOD TO SELL",
    },
    {
      id: "paddy",
      name: "Paddy (BPT 5204)",
      localName: "వరి / धान",
      price: 2450,
      unit: "Quintal",
      change: 60,
      trend: "up",
      msp: 2203,
      arrivals: "900 Qtl",
      quality: "Fine Grain",
      advisory: "High demand from rice millers.",
      action: "SELL NOW",
    },
  ],
};

export default function MandiPriceTracker() {
  const [selectedMandi, setSelectedMandi] = useState("Karimnagar");
  const [activeFilter, setActiveFilter] = useState("all");
  const [calcCrop, setCalcCrop] = useState("chilli");
  const [calcQuantity, setCalcQuantity] = useState(10);
  const [showCalculator, setShowCalculator] = useState(false);

  const [livePrices, setLivePrices] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveLocation, setLiveLocation] = useState("");

  const mandiList = Object.keys(MANDI_DATA);
  const crops = livePrices ? livePrices : (MANDI_DATA[selectedMandi] || []);

  const filteredCrops = crops.filter(c => {
    if (activeFilter === "up") return c.trend === "up";
    if (activeFilter === "high-value") return c.price > 5000;
    return true;
  });

  const activeCropObj = crops.find(c => c.id === calcCrop) || crops[0] || MANDI_DATA.Karimnagar[0];
  const grossIncome = activeCropObj ? (activeCropObj.price * calcQuantity) : 0;
  const mspBaseline = activeCropObj ? ((activeCropObj.msp || 0) * calcQuantity) : 0;
  const mandiFee = Math.round(grossIncome * 0.01);
  const netEarnings = grossIncome - mandiFee;
  const profitOverMSP = grossIncome - mspBaseline;

  const fetchLivePrices = async () => {
    setLoadingLive(true);
    try {
      let payload = {};
      
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          payload = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        } catch(e) {
          console.warn("GPS failed, using IP fallback");
        }
      }

      const res = await fetch("/api/mandi-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch prices");
      
      if (data.prices && data.prices.length > 0) {
        setLivePrices(data.prices);
        setLiveLocation(data.location || "Your Location");
        setCalcCrop(data.prices[0].id);
      }
    } catch (e) {
      alert("Could not fetch live prices right now. Using default data.\nError: " + e.message);
    } finally {
      setLoadingLive(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_#0f172a] p-6 lg:p-10 relative overflow-hidden font-sans" id="mandi-bhav-section">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b-4 border-slate-900 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#b6f022] text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-slate-900 mb-4 shadow-[2px_2px_0px_0px_#0f172a]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Mandi Bhav · Live APMC Rates</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Today's Market Rates & Sell Advisory</h2>
          <p className="text-slate-700 font-medium text-lg max-w-xl">
            Real-time auction rates from {liveLocation || "Telangana"} APMC markets with Agromet guidance.
          </p>
        </div>

        {/* Mandi Selector */}
        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
          <label htmlFor="mandi-select" className="flex items-center gap-2 font-bold text-slate-900">
            <Building2 size={18} /> Select Market:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <select
              id="mandi-select"
              value={liveLocation ? "custom" : selectedMandi}
              onChange={e => {
                if (e.target.value !== "custom") {
                  setLivePrices(null);
                  setLiveLocation("");
                  setSelectedMandi(e.target.value);
                  const nextCrops = MANDI_DATA[e.target.value] || [];
                  if (nextCrops.length > 0) setCalcCrop(nextCrops[0].id);
                }
              }}
              className="appearance-none border-4 border-slate-900 rounded-xl px-4 py-3 font-bold bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#b6f022] shadow-[4px_4px_0px_0px_#0f172a] cursor-pointer flex-1"
            >
              {liveLocation && <option value="custom">📍 {liveLocation}</option>}
              {mandiList.map(m => (
                <option key={m} value={m}>
                  {m} APMC Yard
                </option>
              ))}
            </select>
            
            <button 
              onClick={fetchLivePrices}
              disabled={loadingLive}
              className="flex items-center justify-center gap-2 border-4 border-slate-900 rounded-xl px-5 py-3 font-black bg-[#b6f022] text-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <MapPin size={18} />
              {loadingLive ? "Searching..." : "Live Near Me"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Calculator Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-5 py-2 rounded-full border-2 border-slate-900 font-bold transition-all ${
              activeFilter === "all" 
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_#b6f022]" 
                : "bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#0f172a]"
            }`}
          >
            All Crops ({crops.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("up")}
            className={`px-5 py-2 rounded-full border-2 border-slate-900 font-bold flex items-center gap-2 transition-all ${
              activeFilter === "up" 
                ? "bg-[#b6f022] text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#0f172a]"
            }`}
          >
            <TrendingUp size={16} /> Trending Up
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("high-value")}
            className={`px-5 py-2 rounded-full border-2 border-slate-900 font-bold transition-all ${
              activeFilter === "high-value" 
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_#b6f022]" 
                : "bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#0f172a]"
            }`}
          >
            Cash Crops (&gt; ₹5,000)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCalculator(!showCalculator)}
          className={`flex justify-center items-center gap-2 px-5 py-2 border-4 border-slate-900 font-black uppercase rounded-xl transition-all shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-[4px] active:shadow-none ${
            showCalculator ? "bg-slate-900 text-white" : "bg-white text-slate-900"
          }`}
        >
          <Calculator size={18} />
          {showCalculator ? "Hide Calculator" : "Profit Calculator"}
        </button>
      </div>

      {/* Interactive Calculator Drawer */}
      {showCalculator && (
        <div className="bg-[#eff0eb] border-4 border-slate-900 p-6 lg:p-8 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] mb-10">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                <Coins size={24} className="text-emerald-600" />
                Farmer Lot Earnings Calculator
              </h3>
              <p className="text-slate-600 font-medium mt-1">Calculate your net truckload or tractor return after Mandi cess.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-900 uppercase text-xs tracking-wider">Select Crop</label>
              <select
                value={calcCrop}
                onChange={e => setCalcCrop(e.target.value)}
                className="border-2 border-slate-900 rounded-lg px-4 py-3 font-bold bg-white focus:ring-4 focus:ring-[#b6f022] outline-none"
              >
                {crops.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (₹{c.price.toLocaleString("en-IN")}/qtl)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-900 uppercase text-xs tracking-wider">Harvest Quantity</label>
              <div className="flex items-stretch">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={calcQuantity}
                  onChange={e => setCalcQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="flex-1 border-2 border-r-0 border-slate-900 rounded-l-lg px-4 py-3 font-bold bg-white focus:ring-4 focus:ring-[#b6f022] outline-none"
                />
                <div className="bg-slate-900 text-white font-bold px-4 flex items-center justify-center rounded-r-lg border-2 border-slate-900">
                  Qtl
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-900 uppercase text-xs tracking-wider">Quick Presets</label>
              <div className="flex flex-wrap gap-2 h-full items-center">
                {[5, 10, 20, 50].map(q => (
                  <button
                    key={q}
                    onClick={() => setCalcQuantity(q)}
                    className={`px-4 py-3 rounded-lg border-2 border-slate-900 font-black transition-all ${
                      calcQuantity === q ? "bg-slate-900 text-[#b6f022]" : "bg-white text-slate-900 hover:bg-slate-200 hover:-translate-y-0.5"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="text-slate-600 font-bold mb-1 uppercase text-sm tracking-wider">Gross Value</div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2 truncate">₹{grossIncome.toLocaleString("en-IN")}</div>
              <div className="text-sm font-semibold text-slate-500">@ ₹{activeCropObj?.price.toLocaleString("en-IN")} / Qtl</div>
            </div>
            
            <div className="bg-[#b6f022] border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="text-slate-800 font-black mb-1 uppercase text-sm tracking-wider">Net Take-Home</div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2 truncate">₹{netEarnings.toLocaleString("en-IN")}</div>
              <div className="text-sm font-bold text-slate-700/80">After ~1% APMC cess (-₹{mandiFee.toLocaleString("en-IN")})</div>
            </div>

            <div className="bg-white border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="text-slate-600 font-bold mb-1 uppercase text-sm tracking-wider">Gain Above MSP</div>
              <div className={`text-3xl md:text-4xl font-black mb-2 truncate ${profitOverMSP >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {profitOverMSP >= 0 ? "+" : ""}₹{profitOverMSP.toLocaleString("en-IN")}
              </div>
              <div className="text-sm font-semibold text-slate-500">MSP: ₹{(activeCropObj?.msp || 0).toLocaleString("en-IN")}/Qtl</div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredCrops.map(crop => {
          const isAboveMsp = crop.price >= crop.msp;
          const diffMsp = crop.price - crop.msp;

          return (
            <div key={crop.id} className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_0px_#0f172a] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_#0f172a] transition-all flex flex-col justify-between group duration-300">
              
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{crop.name}</h3>
                    <span className="text-slate-500 font-bold px-2 py-0.5 bg-slate-100 rounded text-sm">{crop.localName}</span>
                  </div>
                  <div className={`px-3 py-1.5 border-2 border-slate-900 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#0f172a] flex-shrink-0 ${
                    crop.action === "SELL NOW" ? "bg-[#b6f022] text-slate-900" :
                    crop.action === "HOLD / STORE" ? "bg-amber-300 text-amber-900" :
                    "bg-slate-200 text-slate-800"
                  }`}>
                    {crop.action}
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-xl font-bold text-slate-400 mt-1 mr-1">₹</span>
                    <span className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tighter">{crop.price.toLocaleString("en-IN")}</span>
                    <span className="text-sm font-bold text-slate-500 ml-2 mb-1 self-end">/ {crop.unit}</span>
                  </div>
                  <div className={`flex items-center gap-1 font-black px-2 py-1 rounded border-2 shadow-[2px_2px_0px_0px_#0f172a] ${
                    crop.trend === "up" ? "bg-[#b6f022] text-slate-900 border-slate-900" : "bg-red-100 text-red-700 border-red-300"
                  }`}>
                    {crop.trend === "up" ? <TrendingUp size={16} strokeWidth={3} /> : <TrendingDown size={16} strokeWidth={3} />}
                    {crop.trend === "up" ? "+" : ""}₹{crop.change}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                  <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2">
                    <span className="text-slate-500">Quality</span>
                    <span className="text-right text-slate-900 font-bold truncate max-w-[60%]">{crop.quality}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500">Today's Arrivals</span>
                    <span className="text-right text-slate-900 font-bold truncate max-w-[60%]">{crop.arrivals}</span>
                  </div>
                </div>

                <div className="bg-slate-100 border-2 border-slate-900 rounded-xl p-3 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-slate-900" />
                  <div className="pl-2">
                    <div className="flex justify-between items-center font-black text-sm mb-1">
                      <span className="text-slate-500">MSP BASELINE</span>
                      <span className="text-slate-900">₹{crop.msp?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isAboveMsp ? "text-emerald-600" : "text-red-600"}`}>
                      {isAboveMsp ? `+₹${diffMsp.toLocaleString("en-IN")} Above MSP` : "At or below baseline"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-4 flex items-start gap-3 relative">
                  <Sparkles size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-amber-900 leading-snug">
                    {crop.advisory}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCalcCrop(crop.id);
                    setShowCalculator(true);
                    const el = document.getElementById("mandi-bhav-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3.5 border-4 border-slate-900 rounded-xl font-black uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-900 hover:text-[#b6f022] transition-colors flex items-center justify-center gap-2 group-hover:shadow-[4px_4px_0px_0px_#0f172a] active:shadow-none active:translate-y-[2px]"
                >
                  <Calculator size={18} /> Calculate Lot
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
