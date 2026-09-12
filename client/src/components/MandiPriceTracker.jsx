import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Coins,
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
  const [activeFilter, setActiveFilter] = useState("all"); // all | up | high-value
  const [calcCrop, setCalcCrop] = useState("chilli");
  const [calcQuantity, setCalcQuantity] = useState(10); // in quintals
  const [showCalculator, setShowCalculator] = useState(false);

  const mandiList = Object.keys(MANDI_DATA);
  const crops = MANDI_DATA[selectedMandi] || [];

  const filteredCrops = crops.filter(c => {
    if (activeFilter === "up") return c.trend === "up";
    if (activeFilter === "high-value") return c.price > 5000;
    return true;
  });

  // Calculator computations
  const activeCropObj =
    crops.find(c => c.id === calcCrop) || crops[0] || MANDI_DATA.Karimnagar[0];
  const grossIncome = activeCropObj.price * calcQuantity;
  const mspBaseline = activeCropObj.msp * calcQuantity;
  const mandiFee = Math.round(grossIncome * 0.01); // 1% APMC cess
  const netEarnings = grossIncome - mandiFee;
  const profitOverMSP = grossIncome - mspBaseline;

  return (
    <div className="mandi-tracker-card" id="mandi-bhav-section">
      {/* Header with live ticker */}
      <div className="mandi-header">
        <div className="mandi-title-wrap">
          <div className="mandi-badge">
            <span className="live-ping-dot" />
            <span>Mandi Bhav · Live APMC Rates</span>
          </div>
          <h2>Today's Market Rates & Sell Advisory</h2>
          <p>
            Real-time auction rates from Telangana APMC markets with Agromet
            sell/store guidance.
          </p>
        </div>

        {/* Mandi Yard Selector */}
        <div className="mandi-selector-box">
          <label htmlFor="mandi-select">
            <Building2 size={15} /> Select Market:
          </label>
          <select
            id="mandi-select"
            value={selectedMandi}
            onChange={e => {
              setSelectedMandi(e.target.value);
              // reset calc crop if needed
              const nextCrops = MANDI_DATA[e.target.value] || [];
              if (nextCrops.length > 0) setCalcCrop(nextCrops[0].id);
            }}
            className="mandi-dropdown"
          >
            {mandiList.map(m => (
              <option key={m} value={m}>
                {m} APMC Yard
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs & Quick Calculator Toggle */}
      <div className="mandi-subbar">
        <div className="mandi-filter-chips">
          <button
            type="button"
            className={`mandi-chip ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Crops ({crops.length})
          </button>
          <button
            type="button"
            className={`mandi-chip ${activeFilter === "up" ? "active" : ""}`}
            onClick={() => setActiveFilter("up")}
          >
            <TrendingUp size={13} /> Trending Up
          </button>
          <button
            type="button"
            className={`mandi-chip ${activeFilter === "high-value" ? "active" : ""}`}
            onClick={() => setActiveFilter("high-value")}
          >
            Cash Crops (&gt; ₹5,000)
          </button>
        </div>

        <button
          type="button"
          className={`calculator-toggle-btn ${showCalculator ? "active" : ""}`}
          onClick={() => setShowCalculator(!showCalculator)}
        >
          <Calculator size={15} />
          <span>
            {showCalculator ? "Hide Calculator" : "Profit Calculator"}
          </span>
        </button>
      </div>

      {/* Interactive Mandi Profit Calculator Drawer */}
      {showCalculator && (
        <div className="mandi-calculator-panel">
          <div className="calc-header">
            <div className="calc-title">
              <Coins size={18} className="text-amber-500" />
              <strong>Farmer Lot Earnings & Net Payout Calculator</strong>
            </div>
            <span className="calc-hint">
              Calculate your truckload or tractor return
            </span>
          </div>

          <div className="calc-inputs-grid">
            <div className="calc-input-group">
              <label htmlFor="calc-crop-select">Select Crop</label>
              <select
                id="calc-crop-select"
                value={calcCrop}
                onChange={e => setCalcCrop(e.target.value)}
                className="calc-select"
              >
                {crops.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (₹{c.price.toLocaleString("en-IN")}/qtl)
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-input-group">
              <label htmlFor="calc-qty-input">
                Harvest Quantity (Quintals)
              </label>
              <div className="qty-input-wrap">
                <input
                  id="calc-qty-input"
                  type="number"
                  min="1"
                  max="1000"
                  value={calcQuantity}
                  onChange={e =>
                    setCalcQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="calc-input"
                />
                <span className="unit-label">Qtl</span>
              </div>
            </div>

            {/* Quick Quantity Presets */}
            <div className="calc-presets">
              <span className="preset-label">Quick:</span>
              {[5, 10, 20, 50].map(q => (
                <button
                  key={q}
                  type="button"
                  className={`preset-btn ${calcQuantity === q ? "active" : ""}`}
                  onClick={() => setCalcQuantity(q)}
                >
                  {q} Qtl
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Breakdown Cards */}
          <div className="calc-results-row">
            <div className="calc-stat-box primary-stat">
              <span className="calc-label">Estimated Gross Value</span>
              <strong className="calc-value">
                ₹{grossIncome.toLocaleString("en-IN")}
              </strong>
              <small>
                @ ₹{activeCropObj.price.toLocaleString("en-IN")} per Quintal
              </small>
            </div>

            <div className="calc-stat-box">
              <span className="calc-label">Est. Net Take-Home</span>
              <strong className="calc-value text-green-600">
                ₹{netEarnings.toLocaleString("en-IN")}
              </strong>
              <small>
                After ~1% APMC cess (₹{mandiFee.toLocaleString("en-IN")})
              </small>
            </div>

            <div className="calc-stat-box">
              <span className="calc-label">Gain Above MSP</span>
              <strong
                className={`calc-value ${profitOverMSP >= 0 ? "text-emerald-500" : "text-amber-500"}`}
              >
                {profitOverMSP >= 0 ? "+" : ""}₹
                {profitOverMSP.toLocaleString("en-IN")}
              </strong>
              <small>
                Govt. MSP: ₹{activeCropObj.msp.toLocaleString("en-IN")}/qtl
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Crop Cards */}
      <div className="mandi-cards-grid">
        {filteredCrops.map(crop => {
          const isAboveMsp = crop.price >= crop.msp;
          const diffMsp = crop.price - crop.msp;

          return (
            <div key={crop.id} className="mandi-crop-card">
              <div className="crop-card-top">
                <div className="crop-identity">
                  <h3>{crop.name}</h3>
                  <span className="crop-local-name">{crop.localName}</span>
                </div>
                <div
                  className={`action-pill ${crop.action === "SELL NOW" ? "pill-sell" : crop.action === "HOLD / STORE" ? "pill-hold" : "pill-stable"}`}
                >
                  {crop.action}
                </div>
              </div>

              {/* Price Row */}
              <div className="crop-price-row">
                <div className="price-display">
                  <span className="currency-symbol">₹</span>
                  <span className="price-num">
                    {crop.price.toLocaleString("en-IN")}
                  </span>
                  <span className="price-unit">/ {crop.unit}</span>
                </div>

                <div
                  className={`trend-badge ${crop.trend === "up" ? "trend-up" : "trend-down"}`}
                >
                  {crop.trend === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {crop.trend === "up" ? "+" : ""}₹{crop.change}
                  </span>
                </div>
              </div>

              {/* Quality & Yard Arrivals */}
              <div className="crop-market-meta">
                <span>
                  <strong>Quality:</strong> {crop.quality}
                </span>
                <span>
                  <strong>Today's Arrivals:</strong> {crop.arrivals}
                </span>
              </div>

              {/* MSP comparison strip */}
              <div className="crop-msp-strip">
                <span className="msp-tag">
                  MSP: ₹{crop.msp.toLocaleString("en-IN")}
                </span>
                <span
                  className={`msp-diff ${isAboveMsp ? "diff-positive" : "diff-negative"}`}
                >
                  {isAboveMsp
                    ? `+₹${diffMsp.toLocaleString("en-IN")} above MSP`
                    : `At baseline`}
                </span>
              </div>

              {/* Agromet Action Advisory Box */}
              <div className="crop-advisory-box">
                <Sparkles
                  size={14}
                  className="flex-shrink-0 text-amber-500 mt-0.5"
                />
                <p>{crop.advisory}</p>
              </div>

              {/* Quick 1-tap lot calculate for this crop */}
              <button
                type="button"
                className="crop-calc-link"
                onClick={() => {
                  setCalcCrop(crop.id);
                  setShowCalculator(true);
                  const el = document.getElementById("mandi-bhav-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Calculator size={13} /> Calculate lot price &rarr;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
