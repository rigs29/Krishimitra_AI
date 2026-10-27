import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  Search,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Calendar,
  Building2,
  MapPin,
  Crown,
  ChevronRight,
  Info,
  Layers,
  X,
  LineChart,
  Lightbulb,
  Clock,
  PackageCheck,
  Scale,
} from "lucide-react";
import { getMarketPrices, getPriceTrends, getCropPriceDetails } from "../api/marketAPI";
import "./CropMarket.css";

function CropMarket() {
  const [marketResponse, setMarketResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("crop");

  // Selected crop for trend deep-dive drawer
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropTrends, setCropTrends] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const categories = ["All", "Grains", "Pulses", "Vegetables", "Fruits", "Cash Crops"];

  useEffect(() => {
    fetchPrices();
  }, [selectedCategory, sortBy]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await getMarketPrices({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        sort_by: sortBy,
      });
      setMarketResponse(data);
    } catch (err) {
      console.error("Market fetch error:", err);
      toast.error("Failed to load live mandi data.");
    } finally {
      setLoading(false);
    }
  };

  // Open Crop Trend Modal / Deep Dive
  const handleOpenCropDetails = async (cropName) => {
    setSelectedCrop(cropName);
    setLoadingTrends(true);
    setCropTrends(null);
    setCropDetails(null);

    try {
      const [trendData, detailData] = await Promise.allSettled([
        getPriceTrends(cropName, 14, "daily"),
        getCropPriceDetails(cropName),
      ]);

      if (trendData.status === "fulfilled") setCropTrends(trendData.value);
      if (detailData.status === "fulfilled") setCropDetails(detailData.value);
    } catch (err) {
      console.error("Trend load error:", err);
      toast.error(`Could not load trend data for ${cropName}`);
    } finally {
      setLoadingTrends(false);
    }
  };

  const closeCropDrawer = () => {
    setSelectedCrop(null);
    setCropTrends(null);
    setCropDetails(null);
  };

  // Filtered by local search query
  const displayedPrices = (marketResponse?.prices || []).filter((item) => {
    return (
      item.crop.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.market.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.state.toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  const highestPriceToday = marketResponse?.summary?.highest_price || 0;

  return (
    <div className="km-market-page km-animate-fade-in">
      {/* Header */}
      <div className="km-page-header">
        <div className="km-page-header-text">
          <div className="km-badge km-badge-forest km-header-pill">
            <Sparkles size={13} />
            <span>Real-Time APMC Mandi Feeds</span>
          </div>
          <h2>Agricultural Commodity Price Terminal</h2>
          <p>
            Real-time mandi modal prices, daily percentage deltas, and predictive market
            sentiments across major national and regional APMC markets.
          </p>
        </div>

        {/* Global summary stats banner */}
        {marketResponse?.summary && (
          <div className="km-market-summary-bar">
            <div className="km-sum-col">
              <span className="km-sum-lbl">Average Modal Rate</span>
              <span className="km-sum-val mono-number">
                ₹{Math.round(marketResponse.summary.average_price).toLocaleString("en-IN")}/qtl
              </span>
            </div>
            <div className="km-sum-divider" />
            <div className="km-sum-col">
              <span className="km-sum-lbl">Peak Commodity Rate</span>
              <span className="km-sum-val mono-number text-emerald">
                ₹{Math.round(marketResponse.summary.highest_price).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="km-sum-divider" />
            <div className="km-sum-col">
              <span className="km-sum-lbl">Tracked Commodities</span>
              <span className="km-sum-val mono-number">
                {marketResponse.total_crops} Crops
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="km-card km-market-controls-card">
        {/* Category Pills */}
        <div className="km-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`km-cat-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="km-controls-row">
          <div className="km-search-box">
            <Search size={16} className="km-search-icon" />
            <input
              type="text"
              placeholder="Filter by crop (e.g. Wheat, Tomato) or Mandi (e.g. APMC Mumbai)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="km-input km-market-search-input"
            />
            {searchInput && (
              <button
                type="button"
                className="km-clear-search-btn"
                onClick={() => setSearchInput("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="km-sort-group">
            <ArrowUpDown size={15} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="km-input km-select km-sort-select"
            >
              <option value="crop">Sort Alphabetical (A-Z)</option>
              <option value="price">Highest Price First</option>
              <option value="change">Highest Price Gain First</option>
            </select>

            <button
              type="button"
              onClick={fetchPrices}
              className="km-btn km-btn-outline"
              title="Refresh prices"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MANDI TABLE
          ==================================================================== */}
      <div className="km-card km-table-container-card">
        <div className="km-table-header-bar">
          <div className="km-table-title-wrap">
            <h3>Live Spot Market Quotations</h3>
            <span className="km-date-badge">
              Feed Date: {marketResponse?.date || new Date().toISOString().split("T")[0]}
            </span>
          </div>
          <span className="km-results-count">
            Showing <strong>{displayedPrices.length}</strong> commodities
          </span>
        </div>

        {loading ? (
          <div className="km-table-skeleton-wrap">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="km-skeleton" style={{ height: "46px", margin: "8px 0" }} />
            ))}
          </div>
        ) : displayedPrices.length > 0 ? (
          <div className="km-table-scroll-area">
            <table className="km-market-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Primary Mandi</th>
                  <th>State Jurisdiction</th>
                  <th className="text-right">Spot Price</th>
                  <th className="text-right">24h Delta</th>
                  <th>Market Trend</th>
                  <th className="text-center">Analytics</th>
                </tr>
              </thead>
              <tbody>
                {displayedPrices.map((item, idx) => {
                  const isTopPrice = item.price === highestPriceToday;
                  return (
                    <tr
                      key={idx}
                      className={isTopPrice ? "km-top-price-row" : ""}
                      onClick={() => handleOpenCropDetails(item.crop)}
                    >
                      <td className="km-td-crop">
                        <div className="km-crop-name-cell">
                          <strong>{item.crop}</strong>
                          {isTopPrice && (
                            <span className="km-crown-badge" title="Highest price commodity today">
                              <Crown size={13} />
                              <span>Top Mandi Rate</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="km-mandi-cell">
                          <Building2 size={14} className="text-muted" />
                          <span>{item.market}</span>
                        </div>
                      </td>

                      <td>
                        <div className="km-state-cell">
                          <MapPin size={14} className="text-muted" />
                          <span>{item.state}</span>
                        </div>
                      </td>

                      <td className="text-right">
                        <span className="km-price-val mono-number">
                          ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="km-unit-label">/ quintal</span>
                      </td>

                      <td className="text-right">
                        <span
                          className={`km-badge ${
                            item.change > 0
                              ? "km-badge-success"
                              : item.change < 0
                              ? "km-badge-danger"
                              : "km-badge-info"
                          }`}
                        >
                          {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                        </span>
                      </td>

                      <td>
                        <div className="km-trend-cell">
                          {item.trend === "up" ? (
                            <TrendingUp size={15} className="text-emerald" />
                          ) : item.trend === "down" ? (
                            <TrendingDown size={15} className="text-danger" />
                          ) : (
                            <span className="text-muted">&bull;</span>
                          )}
                          <span className="km-trend-text">{item.trend || "Stable"}</span>
                        </div>
                      </td>

                      <td className="text-center">
                        <button
                          type="button"
                          className="km-btn km-btn-ghost km-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCropDetails(item.crop);
                          }}
                        >
                          <LineChart size={15} />
                          <span>Trends</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="km-no-market-data">
            <Search size={32} className="text-muted" />
            <p>No agricultural commodities matched your query "{searchInput}"</p>
            <button
              type="button"
              className="km-btn km-btn-outline km-btn-sm"
              onClick={() => {
                setSearchInput("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Selling Advice & Mandi Intelligence Section */}
      <section className="km-card km-mandi-strategy-card">
        <div className="km-strategy-header">
          <Lightbulb size={22} className="text-emerald" />
          <div>
            <h3>Agronomic Mandi Trading Strategy</h3>
            <p>Maximize realizations by understanding market dynamics and arrivals</p>
          </div>
        </div>

        <div className="km-strategy-grid">
          <div className="km-strategy-item">
            <Clock size={18} className="text-warning" />
            <div>
              <strong>Timing the Mandi Auction</strong>
              <p>Arrivals between 07:30 AM – 10:00 AM receive highest wholesale commission bids. Avoid afternoon heat offloading.</p>
            </div>
          </div>

          <div className="km-strategy-item">
            <PackageCheck size={18} className="text-emerald" />
            <div>
              <strong>Quality Grading Premium</strong>
              <p>Segregating produce into Grade A (uniform color, pest-free) and Grade B yields 12–18% higher aggregate net price.</p>
            </div>
          </div>

          <div className="km-strategy-item">
            <Scale size={18} className="text-info" />
            <div>
              <strong>Cross-Mandi Arbitrage</strong>
              <p>Compare terminal prices in adjacent districts. Mandis within 35 km often exhibit ₹150–₹300/quintal price spread.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          DEEP-DIVE TREND MODAL / DRAWER
          ==================================================================== */}
      {selectedCrop && (
        <div className="km-modal-backdrop" onClick={closeCropDrawer}>
          <div className="km-trend-modal km-animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="km-modal-header">
              <div className="km-modal-title-group">
                <span className="km-badge km-badge-forest">Commodity Analytics</span>
                <h2>{selectedCrop} Price Intelligence</h2>
              </div>
              <button type="button" className="km-modal-close-btn" onClick={closeCropDrawer}>
                <X size={20} />
              </button>
            </div>

            {loadingTrends ? (
              <div className="km-modal-loading">
                <div className="km-spinner-dot" />
                <p>Retrieving historical trends and predictive forecast...</p>
              </div>
            ) : cropTrends ? (
              <div className="km-modal-body">
                {/* Stats row */}
                <div className="km-modal-stats-row">
                  <div className="km-mstat-box">
                    <span className="lbl">Average Price</span>
                    <span className="val mono-number">
                      ₹{cropTrends.statistics?.average_price?.toLocaleString("en-IN") || "—"}
                    </span>
                  </div>
                  <div className="km-mstat-box">
                    <span className="lbl">Highest Observed</span>
                    <span className="val mono-number text-emerald">
                      ₹{cropTrends.statistics?.highest_price?.toLocaleString("en-IN") || "—"}
                    </span>
                  </div>
                  <div className="km-mstat-box">
                    <span className="lbl">Lowest Observed</span>
                    <span className="val mono-number text-danger">
                      ₹{cropTrends.statistics?.lowest_price?.toLocaleString("en-IN") || "—"}
                    </span>
                  </div>
                  <div className="km-mstat-box">
                    <span className="lbl">Price Volatility</span>
                    <span className="val mono-number">
                      {cropTrends.statistics?.volatility || 0}%
                    </span>
                  </div>
                </div>

                {/* SVG Visual Price Trend Chart */}
                <div className="km-chart-container">
                  <h4>14-Day Modal Price Trajectory</h4>
                  <div className="km-svg-chart-wrap">
                    <svg viewBox="0 0 600 180" className="km-trend-svg">
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2e8b57" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#2e8b57" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Plot path */}
                      {(() => {
                        const trends = cropTrends.trends || [];
                        if (trends.length < 2) return null;
                        const prices = trends.map((t) => t.price);
                        const min = Math.min(...prices) * 0.95;
                        const max = Math.max(...prices) * 1.05;
                        const range = max - min || 1;

                        const points = trends.map((t, idx) => {
                          const x = (idx / (trends.length - 1)) * 560 + 20;
                          const y = 160 - ((t.price - min) / range) * 130;
                          return { x, y, price: t.price, date: t.date };
                        });

                        const dPath = points.reduce(
                          (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                          ""
                        );
                        const areaPath = `${dPath} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

                        return (
                          <>
                            <path d={areaPath} fill="url(#trendGrad)" />
                            <path d={dPath} fill="none" stroke="#2e8b57" strokeWidth="3" />
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle cx={p.x} cy={p.y} r="4" fill="#163b2a" stroke="#ffffff" strokeWidth="2" />
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Date labels under chart */}
                  <div className="km-chart-x-labels">
                    {cropTrends.trends?.map((t, i) => (
                      <span key={i} className="km-x-label mono-number">
                        {new Date(t.date).toLocaleDateString([], { month: "numeric", day: "numeric" })}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Predictive Outlook Box */}
                {cropTrends.prediction && (
                  <div className="km-prediction-box">
                    <div className="km-pred-header">
                      <Sparkles size={16} className="text-emerald" />
                      <strong>AI Next-Period Forecast Outlook:</strong>
                    </div>
                    <div className="km-pred-row">
                      <span>
                        Next 7 Days Expected:{" "}
                        <strong className="mono-number text-forest">
                          ₹{cropTrends.prediction.next_week}/qtl
                        </strong>
                      </span>
                      <span>
                        Next Month Range:{" "}
                        <strong className="mono-number text-forest">
                          ₹{cropTrends.prediction.next_month}/qtl
                        </strong>
                      </span>
                      <span className="km-badge km-badge-forest">
                        {cropTrends.prediction.confidence} Confidence
                      </span>
                    </div>
                  </div>
                )}

                {/* Crop Specific Advice */}
                {cropDetails?.farming_advice && (
                  <div className="km-crop-mkt-advice">
                    <Info size={16} />
                    <p>{cropDetails.farming_advice}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>No trend history available for {selectedCrop}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CropMarket;
