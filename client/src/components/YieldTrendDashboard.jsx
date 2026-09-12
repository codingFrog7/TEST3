import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CloudRain,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { crops } from "../data/siteContent.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function YieldTrendDashboard() {
  const { isDark } = useTheme();
  const [selectedCropName, setSelectedCropName] = useState("Chilli");
  const [unit, setUnit] = useState("q_ha"); // 'q_ha' or 'kg_acre'
  const [showBenchmark, setShowBenchmark] = useState(true);

  const selectedCrop = useMemo(() => {
    return crops.find(c => c.name === selectedCropName) || crops[0];
  }, [selectedCropName]);

  const rawData = selectedCrop.historicalYields || [];

  // Conversion: 1 quintal / hectare ≈ 40.47 kg / acre
  const unitFactor = unit === "kg_acre" ? 40.47 : 1;
  const unitLabel = unit === "kg_acre" ? "kg / acre" : "q / ha";

  const chartData = useMemo(() => {
    return rawData.map(item => ({
      year: item.year,
      yield: Number((item.yield * unitFactor).toFixed(1)),
      benchmark: Number((item.benchmark * unitFactor).toFixed(1)),
      rainfall: item.rainfall,
      condition: item.condition,
      note: item.note,
      rawYield: item.yield,
      rawBenchmark: item.benchmark,
    }));
  }, [rawData, unitFactor]);

  // Calculations for summary metrics
  const stats = useMemo(() => {
    if (!chartData.length) return null;
    const yields = chartData.map(d => d.yield);
    const avgYield = yields.reduce((a, b) => a + b, 0) / yields.length;
    const latest = chartData[chartData.length - 1].yield;
    const first = chartData[0].yield;
    const fiveYearChange = Number(
      (((latest - first) / first) * 100).toFixed(1)
    );
    const highestItem = [...chartData].sort((a, b) => b.yield - a.yield)[0];
    const latestDiffVsBenchmark = Number(
      (latest - chartData[chartData.length - 1].benchmark).toFixed(1)
    );

    return {
      avgYield: avgYield.toFixed(1),
      latest: latest.toFixed(1),
      fiveYearChange,
      highestYear: highestItem.year,
      highestYield: highestItem.yield.toFixed(1),
      latestDiffVsBenchmark,
    };
  }, [chartData]);

  // Color values adaptive to dark / light modes
  const chartColors = useMemo(() => {
    if (isDark) {
      return {
        primary: "#d8fb75",
        primaryFill: "#345c25",
        benchmark: "#82a893",
        grid: "rgba(255, 255, 255, 0.08)",
        text: "#a4beae",
        tooltipBg: "#15241c",
        tooltipBorder: "#2a4235",
      };
    }
    return {
      primary: "#1c563d",
      primaryFill: "#edf5d9",
      benchmark: "#849a8d",
      grid: "rgba(24, 54, 40, 0.08)",
      text: "#6b7d72",
      tooltipBg: "#ffffff",
      tooltipBorder: "#e4e8df",
    };
  }, [isDark]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const diff = Number((data.yield - data.benchmark).toFixed(1));
      const diffPercent = Number(((diff / data.benchmark) * 100).toFixed(1));

      return (
        <div className="yield-chart-tooltip" role="tooltip">
          <div className="tooltip-header">
            <span className="tooltip-year">
              <Calendar size={12} /> {label} Season
            </span>
            <span className="tooltip-condition">{data.condition}</span>
          </div>
          <div className="tooltip-values">
            <div className="tooltip-row farm-val">
              <span>{selectedCrop.name} Yield:</span>
              <strong>
                {data.yield} {unitLabel}
              </strong>
            </div>
            {showBenchmark && (
              <div className="tooltip-row benchmark-val">
                <span>Regional Avg:</span>
                <span>
                  {data.benchmark} {unitLabel}
                </span>
              </div>
            )}
            <div
              className={`tooltip-row variance ${diff >= 0 ? "positive" : "negative"}`}
            >
              <span>Advantage:</span>
              <span>
                {diff >= 0 ? "+" : ""}
                {diff} {unitLabel} ({diffPercent > 0 ? "+" : ""}
                {diffPercent}%)
              </span>
            </div>
          </div>
          <div className="tooltip-footer">
            <div className="tooltip-rain">
              <CloudRain size={11} />
              <span>{data.rainfall}</span>
            </div>
            <p className="tooltip-note">{data.note}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="yield-trend-section"
      className="yield-trend-dashboard"
      aria-labelledby="yield-trend-heading"
    >
      <div className="yield-header">
        <div>
          <div className="yield-badge">
            <TrendingUp size={14} />
            <span>5-YEAR HISTORICAL YIELD ANALYTICS</span>
          </div>
          <h2 id="yield-trend-heading">
            Historical Productivity: {selectedCrop.name} ({selectedCrop.local})
          </h2>
          <p className="yield-subtext">
            Track multi-season yield stability against regional benchmarks and
            weather anomalies to guide your crop rotation and inputs.
          </p>
        </div>

        <div className="yield-controls">
          <div
            className="unit-toggle"
            role="group"
            aria-label="Measurement units"
          >
            <button
              type="button"
              className={unit === "q_ha" ? "active" : ""}
              onClick={() => setUnit("q_ha")}
            >
              Quintal/Ha
            </button>
            <button
              type="button"
              className={unit === "kg_acre" ? "active" : ""}
              onClick={() => setUnit("kg_acre")}
            >
              Kg/Acre
            </button>
          </div>

          <label className="benchmark-toggle">
            <input
              type="checkbox"
              checked={showBenchmark}
              onChange={e => setShowBenchmark(e.target.checked)}
            />
            <span>Show Regional Avg</span>
          </label>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div
        className="crop-selector-tabs"
        role="tablist"
        aria-label="Select crop for yield trend"
      >
        {crops.map(c => {
          const isSelected = c.name === selectedCropName;
          return (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`crop-tab-btn ${isSelected ? "is-selected" : ""}`}
              onClick={() => setSelectedCropName(c.name)}
            >
              <span className="crop-tab-name">{c.name}</span>
              <span className="crop-tab-local">{c.local}</span>
              <span
                className={`crop-tab-status-dot ${
                  c.status === "Watch" ? "watch" : "healthy"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Stat Metric Cards */}
      {stats && (
        <div className="yield-stats-row">
          <div className="yield-stat-card">
            <span className="stat-label">2025 LATEST HARVEST</span>
            <div className="stat-value-group">
              <strong>{stats.latest}</strong>
              <small>{unitLabel}</small>
            </div>
            <span className="stat-sub positive">
              <ArrowUpRight size={13} />+{stats.latestDiffVsBenchmark}{" "}
              {unitLabel} vs regional avg
            </span>
          </div>

          <div className="yield-stat-card">
            <span className="stat-label">5-YEAR ROLLING AVERAGE</span>
            <div className="stat-value-group">
              <strong>{stats.avgYield}</strong>
              <small>{unitLabel}</small>
            </div>
            <span className="stat-sub neutral">
              <BarChart3 size={13} /> Stable baseline across 5 seasons
            </span>
          </div>

          <div className="yield-stat-card">
            <span className="stat-label">PEAK HISTORIC SEASON</span>
            <div className="stat-value-group">
              <strong>{stats.highestYear}</strong>
              <small>
                ({stats.highestYield} {unitLabel})
              </small>
            </div>
            <span className="stat-sub highlight">
              <Sparkles size={13} /> Optimal management & timely rain
            </span>
          </div>

          <div className="yield-stat-card">
            <span className="stat-label">5-YEAR TREND GROWTH</span>
            <div className="stat-value-group">
              <strong>
                {stats.fiveYearChange >= 0 ? "+" : ""}
                {stats.fiveYearChange}%
              </strong>
            </div>
            <span
              className={`stat-sub ${
                stats.fiveYearChange >= 0 ? "positive" : "negative"
              }`}
            >
              {stats.fiveYearChange >= 0 ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              Compound yield progression
            </span>
          </div>
        </div>
      )}

      {/* Recharts Chart Canvas */}
      <div className="yield-chart-container">
        <div className="chart-wrapper" style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id={`yieldGrad-${selectedCrop.name}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors.primary}
                    stopOpacity={isDark ? 0.45 : 0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.primary}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.grid}
                vertical={false}
              />

              <XAxis
                dataKey="year"
                stroke={chartColors.text}
                tick={{ fill: chartColors.text, fontSize: 11 }}
                axisLine={{ stroke: chartColors.grid }}
                tickLine={false}
              />

              <YAxis
                stroke={chartColors.text}
                tick={{ fill: chartColors.text, fontSize: 11 }}
                axisLine={{ stroke: chartColors.grid }}
                tickLine={false}
                unit={` ${unitLabel.split(" ")[0]}`}
                domain={["auto", "auto"]}
              />

              <Tooltip content={<CustomTooltip />} />

              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Regional Average"
                  stroke={chartColors.benchmark}
                  strokeDasharray="5 4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: chartColors.benchmark }}
                  activeDot={{ r: 5 }}
                />
              )}

              <Area
                type="monotone"
                dataKey="yield"
                name={`${selectedCrop.name} Farm Yield`}
                stroke={chartColors.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#yieldGrad-${selectedCrop.name})`}
                dot={{ r: 4, fill: chartColors.primary, strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  stroke: chartColors.primary,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend & Context Note */}
        <div className="chart-legend-strip">
          <div className="legend-items">
            <span className="legend-indicator farm">
              <span
                className="dot"
                style={{ backgroundColor: chartColors.primary }}
              />
              <b>{selectedCrop.name} Farm Yield</b>
            </span>
            {showBenchmark && (
              <span className="legend-indicator benchmark">
                <span
                  className="dash"
                  style={{ borderColor: chartColors.benchmark }}
                />
                <span>
                  Regional Benchmark ({selectedCrop.season.split("·")[0]})
                </span>
              </span>
            )}
          </div>
          <span className="legend-hint">
            Hover or tap data points to inspect seasonal rainfall & agronomic
            factors.
          </span>
        </div>
      </div>

      {/* Historical Context Takeaway */}
      <div className="yield-takeaway-box">
        <div className="takeaway-badge">
          <Info size={15} />
          <span>HISTORICAL RESILIENCE SUMMARY</span>
        </div>
        <p>
          Over the past 5 seasons, <strong>{selectedCrop.name}</strong>{" "}
          delivered an average of{" "}
          <strong>
            {stats?.avgYield} {unitLabel}
          </strong>
          , outperforming the district benchmark by an average of{" "}
          <strong>
            +{stats?.latestDiffVsBenchmark} {unitLabel}
          </strong>{" "}
          in optimal weather. The 2022 excess rainfall dip underscores the
          necessity of raised-bed drainage, which cushioned yields during
          subsequent wet monsoons.
        </p>
      </div>
    </section>
  );
}
