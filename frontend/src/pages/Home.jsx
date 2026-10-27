import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ScanEye,
  CloudSun,
  TrendingUp,
  BotMessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Sprout,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Wind,
  Droplets,
  Activity,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getCurrentWeather, getDailyAdvisory } from "../api/weatherAPI";
import { getMarketPrices } from "../api/marketAPI";
import { getDiseaseInfo } from "../api/diseaseAPI";
import "./Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for live backend data
  const [weatherData, setWeatherData] = useState(null);
  const [advisoryData, setAdvisoryData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [diseaseMeta, setDiseaseMeta] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      try {
        // Fetch in parallel from real backend endpoints
        const [weatherRes, advisoryRes, marketRes, diseaseRes] = await Promise.allSettled([
          getCurrentWeather("Sample Farm, India"),
          getDailyAdvisory(),
          getMarketPrices({ sort_by: "change" }),
          getDiseaseInfo(),
        ]);

        if (isMounted) {
          if (weatherRes.status === "fulfilled") setWeatherData(weatherRes.value);
          if (advisoryRes.status === "fulfilled") setAdvisoryData(advisoryRes.value);
          if (marketRes.status === "fulfilled") setMarketData(marketRes.value);
          if (diseaseRes.status === "fulfilled") setDiseaseMeta(diseaseRes.value);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    // Load recent scan history from localStorage
    try {
      const saved = localStorage.getItem("km_recent_scans");
      if (saved) {
        setRecentScans(JSON.parse(saved).slice(0, 4));
      }
    } catch (e) {
      console.warn("Could not read recent scans", e);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="km-dashboard km-animate-fade-in">
      {/* ====================================================================
          1. HERO SECTION — Premium Ag-Tech Aesthetics
          ==================================================================== */}
      <section className="km-dash-hero">
        <div className="km-hero-gradient-overlay" />
        <div className="km-hero-content">
          <div className="km-hero-badge">
            <Sparkles size={14} className="km-sparkle-icon" />
            <span>Autonomous Agricultural Operating System</span>
          </div>

          <h1 className="km-hero-title">
            Grow Smarter. <span className="km-title-highlight">Farm Better.</span>
          </h1>

          <p className="km-hero-subtitle">
            Your intelligent farming companion for healthier crops, better decisions,
            and a more productive future. Powered by deep vision models, live agromet
            telemetry, and dynamic mandi analytics.
          </p>

          <div className="km-hero-actions">
            <button
              onClick={() => navigate("/disease-detection")}
              className="km-btn km-btn-emerald km-btn-lg km-hero-primary-btn"
            >
              <ScanEye size={20} />
              <span>Analyze a Plant</span>
            </button>

            <button
              onClick={() => navigate("/market")}
              className="km-btn km-btn-secondary km-btn-lg"
            >
              <TrendingUp size={20} />
              <span>Explore Mandi Insights</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="km-hero-metrics">
            <div className="km-metric-card">
              <span className="km-metric-value mono-number">
                {diseaseMeta?.supported_crops?.length || 5} Crops
              </span>
              <span className="km-metric-label">Trained ML Profiles</span>
            </div>
            <div className="km-metric-divider" />
            <div className="km-metric-card">
              <span className="km-metric-value mono-number">
                {marketData?.total_crops || 24} Mandis
              </span>
              <span className="km-metric-label">Commodity Price Feeds</span>
            </div>
            <div className="km-metric-divider" />
            <div className="km-metric-card">
              <span className="km-metric-value mono-number">
                {weatherData ? `${weatherData.temperature}°C` : "Live"}
              </span>
              <span className="km-metric-label">Micro-Climate Data</span>
            </div>
            <div className="km-metric-divider" />
            <div className="km-metric-card">
              <span className="km-metric-value mono-number">95%</span>
              <span className="km-metric-label">MobileNetV2 Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CORE LIVE WIDGETS GRID
          ==================================================================== */}
      <section className="km-dash-grid">
        {/* WIDGET 1: Plant Pathology AI Quick Access */}
        <div className="km-card km-widget-card km-card-interactive">
          <div className="km-widget-header">
            <div className="km-widget-icon-wrap emerald">
              <ScanEye size={22} />
            </div>
            <div>
              <h3 className="km-widget-title">Plant Pathology AI</h3>
              <span className="km-widget-caption">MobileNetV2 Leaf Diagnostics</span>
            </div>
            <span className="km-badge km-badge-success">Ready</span>
          </div>

          <p className="km-widget-desc">
            Instantly diagnose leaf diseases, calculate neural confidence, and retrieve
            split chemical vs. organic treatment protocols.
          </p>

          <div className="km-leaf-quick-tags">
            {["Tomato", "Potato", "Rice", "Wheat", "Corn"].map((crop) => (
              <span key={crop} className="km-crop-tag">
                <Sprout size={12} /> {crop}
              </span>
            ))}
          </div>

          <div className="km-widget-footer">
            <Link to="/disease-detection" className="km-widget-link">
              <span>Open Diagnostic Lab</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* WIDGET 2: Weather Intelligence Snapshot */}
        <div className="km-card km-widget-card km-card-interactive">
          <div className="km-widget-header">
            <div className="km-widget-icon-wrap forest">
              <CloudSun size={22} />
            </div>
            <div>
              <h3 className="km-widget-title">Agromet Telemetry</h3>
              <span className="km-widget-caption">
                {weatherData?.location || "Field Station"}
              </span>
            </div>
            <span className="km-badge km-badge-forest">Live</span>
          </div>

          {weatherData ? (
            <div className="km-weather-summary-box">
              <div className="km-weather-temp-row">
                <span className="km-weather-big-temp mono-number">
                  {weatherData.temperature}°C
                </span>
                <div className="km-weather-condition-pill">
                  <span>{weatherData.condition}</span>
                </div>
              </div>

              <div className="km-weather-mini-stats">
                <div className="km-mini-stat">
                  <Droplets size={14} className="stat-icon" />
                  <span>Humidity: <strong>{weatherData.humidity}%</strong></span>
                </div>
                <div className="km-mini-stat">
                  <Wind size={14} className="stat-icon" />
                  <span>Wind: <strong>{weatherData.wind_speed} km/h</strong></span>
                </div>
                <div className="km-mini-stat">
                  <Activity size={14} className="stat-icon" />
                  <span>Rain: <strong>{weatherData.rain_chance}%</strong></span>
                </div>
              </div>

              {weatherData.advice && (
                <div className="km-weather-advice-banner">
                  <Info size={14} />
                  <p>{weatherData.advice}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="km-skeleton-loader" style={{ height: "120px" }} />
          )}

          <div className="km-widget-footer">
            <Link to="/weather" className="km-widget-link">
              <span>View 7-Day Forecast</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* WIDGET 3: Mandi Commodity Terminal */}
        <div className="km-card km-widget-card km-card-interactive">
          <div className="km-widget-header">
            <div className="km-widget-icon-wrap warning">
              <TrendingUp size={22} />
            </div>
            <div>
              <h3 className="km-widget-title">Mandi Market Terminal</h3>
              <span className="km-widget-caption">Live APMC Price Feeds</span>
            </div>
            <span className="km-badge km-badge-info">Active</span>
          </div>

          {marketData && marketData.prices?.length > 0 ? (
            <div className="km-market-mini-list">
              {marketData.prices.slice(0, 3).map((item, idx) => (
                <div key={idx} className="km-market-mini-item">
                  <div className="km-mkt-info">
                    <strong>{item.crop}</strong>
                    <span>{item.market}</span>
                  </div>
                  <div className="km-mkt-rates">
                    <span className="mono-number font-semibold">
                      ₹{item.price.toLocaleString("en-IN")}/qtl
                    </span>
                    <span
                      className={`km-mkt-change ${
                        item.change >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {item.change >= 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="km-skeleton-loader" style={{ height: "120px" }} />
          )}

          <div className="km-widget-footer">
            <Link to="/market" className="km-widget-link">
              <span>Mandi Price Terminal</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* WIDGET 4: AI Agronomist Copilot */}
        <div className="km-card km-widget-card km-card-interactive">
          <div className="km-widget-header">
            <div className="km-widget-icon-wrap info">
              <BotMessageSquare size={22} />
            </div>
            <div>
              <h3 className="km-widget-title">AI Agronomist Copilot</h3>
              <span className="km-widget-caption">Instant Agronomic Guidance</span>
            </div>
            <span className="km-badge km-badge-success">Online</span>
          </div>

          <p className="km-widget-desc">
            Ask targeted questions about fertilizer dosages (Urea/DAP/NPK), organic pest
            defense, or optimal sowing calendar.
          </p>

          <div className="km-chat-sample-prompts">
            <button
              onClick={() => navigate("/advisor")}
              className="km-sample-prompt-chip"
            >
              "How to treat early blight in potato?"
            </button>
            <button
              onClick={() => navigate("/advisor")}
              className="km-sample-prompt-chip"
            >
              "Recommended fertilizer for wheat sowing"
            </button>
          </div>

          <div className="km-widget-footer">
            <Link to="/advisor" className="km-widget-link">
              <span>Chat with AI Copilot</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. TODAY'S AGRONOMIC ADVISORY & RECENT SCANS SECTION
          ==================================================================== */}
      <section className="km-dash-two-col">
        {/* Left Column: Today's Agronomic Tasks & Cautions */}
        <div className="km-card km-advisory-panel">
          <div className="km-panel-title-row">
            <div className="km-panel-title-group">
              <Calendar size={20} className="text-emerald" />
              <h3>Today's Agronomic Action Plan</h3>
            </div>
            <span className="km-date-badge">
              {advisoryData?.date || new Date().toISOString().split("T")[0]}
            </span>
          </div>

          {advisoryData ? (
            <div className="km-advisory-columns">
              <div className="km-advisory-col">
                <h4 className="km-sub-heading positive">
                  <CheckCircle2 size={16} /> Recommended Operations
                </h4>
                <ul className="km-action-list">
                  {advisoryData.farming_tasks?.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                  {(!advisoryData.farming_tasks ||
                    advisoryData.farming_tasks.length === 0) && (
                    <li>Maintain regular farm monitoring and check irrigation channels.</li>
                  )}
                </ul>
              </div>

              <div className="km-advisory-col">
                <h4 className="km-sub-heading caution">
                  <AlertCircle size={16} /> Weather & Field Cautions
                </h4>
                <ul className="km-caution-list">
                  {advisoryData.cautions?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {(!advisoryData.cautions ||
                    advisoryData.cautions.length === 0) && (
                    <li>No severe weather warnings flagged for this sector.</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="km-loading-text">Loading agricultural advisory...</p>
          )}
        </div>

        {/* Right Column: Recent Scans / Diagnostic History */}
        <div className="km-card km-history-panel">
          <div className="km-panel-title-row">
            <div className="km-panel-title-group">
              <Activity size={20} className="text-forest" />
              <h3>Recent Diagnostics</h3>
            </div>
            <Link to="/disease-detection" className="km-text-link">
              New Scan &rarr;
            </Link>
          </div>

          {recentScans.length > 0 ? (
            <div className="km-recent-scans-list">
              {recentScans.map((scan, i) => (
                <div key={i} className="km-recent-scan-item">
                  <div className="km-scan-thumb">
                    {scan.previewUrl ? (
                      <img src={scan.previewUrl} alt="Leaf" />
                    ) : (
                      <Sprout size={18} />
                    )}
                  </div>
                  <div className="km-scan-info">
                    <strong>{scan.disease || "Crop Diagnosis"}</strong>
                    <div className="km-scan-meta">
                      <span>{scan.cropType || "Plant leaf"}</span>
                      <span>&bull;</span>
                      <span className="mono-number font-semibold">
                        {Math.round(scan.confidence * 100)}% conf
                      </span>
                    </div>
                  </div>
                  <span
                    className={`km-badge ${
                      scan.severity === "High"
                        ? "km-badge-danger"
                        : scan.severity === "Moderate"
                        ? "km-badge-warning"
                        : "km-badge-success"
                    }`}
                  >
                    {scan.severity || "Verified"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="km-empty-history">
              <Sprout size={36} className="km-empty-sprout" />
              <p className="km-empty-heading">No diagnostic scans performed yet</p>
              <p className="km-empty-sub">
                Upload a plant leaf photo in the Diagnostic Lab to detect fungal or
                bacterial conditions.
              </p>
              <button
                onClick={() => navigate("/disease-detection")}
                className="km-btn km-btn-outline km-btn-sm"
              >
                Launch First Scan
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
