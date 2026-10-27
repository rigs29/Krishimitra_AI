import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  CloudSun,
  Sun,
  CloudRain,
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherByCity,
  getDailyAdvisory,
} from "../api/weatherAPI";
import "./WeatherForecast.css";

function WeatherForecast() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecastDays, setForecastDays] = useState(5);
  const [locationInput, setLocationInput] = useState("");
  const [activeLocation, setActiveLocation] = useState("Sample Farm, India");

  const agriHubs = ["Pune", "Nashik", "Punjab", "Delhi", "Bengaluru", "Indore"];

  // Initial load
  useEffect(() => {
    fetchFullWeatherData(activeLocation, forecastDays);
  }, []);

  const fetchFullWeatherData = async (loc, days) => {
    setLoading(true);
    try {
      const [currRes, foreRes, advRes] = await Promise.allSettled([
        loc === "Sample Farm, India" ? getCurrentWeather(loc) : getWeatherByCity(loc),
        getWeatherForecast(days, loc),
        getDailyAdvisory(),
      ]);

      if (currRes.status === "fulfilled") {
        setCurrentWeather(currRes.value);
        if (currRes.value?.location) {
          setActiveLocation(currRes.value.location);
        }
      }
      if (foreRes.status === "fulfilled") {
        setForecast(foreRes.value?.forecast || []);
      }
      if (advRes.status === "fulfilled") {
        setAdvisory(advRes.value);
      }
    } catch (err) {
      console.error("Weather fetch failed:", err);
      toast.error("Could not fetch meteorological data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    const target = locationInput.trim();
    setActiveLocation(target);
    fetchFullWeatherData(target, forecastDays);
    toast.success(`Loading agromet data for ${target}`);
  };

  const handleHubClick = (city) => {
    setLocationInput(city);
    setActiveLocation(city);
    fetchFullWeatherData(city, forecastDays);
  };

  const handleDaysChange = (days) => {
    setForecastDays(days);
    fetchFullWeatherData(activeLocation, days);
  };

  // Weather Condition Icon selector
  const renderWeatherIcon = (condition, size = 28) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("rain")) return <CloudRain size={size} className="km-weather-icon-rain" />;
    if (c.includes("cloud") && c.includes("part"))
      return <CloudSun size={size} className="km-weather-icon-partly" />;
    if (c.includes("cloud")) return <Cloud size={size} className="km-weather-icon-cloud" />;
    return <Sun size={size} className="km-weather-icon-sun" />;
  };

  return (
    <div className="km-weather-page km-animate-fade-in">
      {/* Header */}
      <div className="km-page-header">
        <div className="km-page-header-text">
          <div className="km-badge km-badge-forest km-header-pill">
            <Sparkles size={13} />
            <span>Real-Time Agrometeorology Intelligence</span>
          </div>
          <h2>Micro-Climate Telemetry & Weather Forecast</h2>
          <p>
            Hyper-localized weather telemetry tailored for farm operations. Calculate
            fungal infection risks, schedule irrigation cycles, and optimize pesticide
            spray windows.
          </p>
        </div>

        {/* Search & Location Bar */}
        <form onSubmit={handleSearch} className="km-weather-search-form">
          <div className="km-search-input-wrap">
            <Search size={16} className="km-search-icon" />
            <input
              type="text"
              placeholder="Search agricultural district (e.g. Pune, Nashik)"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="km-input km-weather-search-input"
            />
          </div>
          <button type="submit" className="km-btn km-btn-emerald">
            Locate
          </button>
          <button
            type="button"
            onClick={() => fetchFullWeatherData(activeLocation, forecastDays)}
            className="km-btn km-btn-outline"
            title="Refresh weather data"
          >
            <RotateCcw size={16} />
          </button>
        </form>
      </div>

      {/* Quick Agri-Hub Selector Chips */}
      <div className="km-agri-hubs-bar">
        <span className="km-hubs-label">Regional Mandi Hubs:</span>
        <div className="km-hubs-chips">
          {agriHubs.map((city) => (
            <button
              key={city}
              type="button"
              className={`km-hub-chip ${activeLocation.toLowerCase().includes(city.toLowerCase()) ? "active" : ""}`}
              onClick={() => handleHubClick(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================================
          CURRENT CONDITIONS HERO CARD
          ==================================================================== */}
      {currentWeather && (
        <section className="km-card km-current-weather-hero">
          <div className="km-weather-hero-top">
            <div className="km-hero-loc-info">
              <span className="km-loc-caption">Station Location</span>
              <h3>{currentWeather.location || activeLocation}</h3>
              <span className="km-telemetry-timestamp mono-number">
                Observed: {new Date(currentWeather.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="km-hero-temp-cluster">
              <div className="km-hero-icon-box">
                {renderWeatherIcon(currentWeather.condition, 48)}
              </div>
              <div className="km-hero-temps">
                <span className="km-hero-deg mono-number">
                  {currentWeather.temperature}°C
                </span>
                <span className="km-hero-condition-text">
                  {currentWeather.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological Metric Gauges */}
          <div className="km-weather-metrics-grid">
            <div className="km-weather-gauge-card">
              <div className="km-gauge-header">
                <Droplets size={16} className="text-info" />
                <span>Relative Humidity</span>
              </div>
              <span className="km-gauge-val mono-number">{currentWeather.humidity}%</span>
              <span className="km-gauge-sub">
                {currentWeather.humidity > 75
                  ? "Elevated &bull; Fungal Risk"
                  : "Normal ambient moisture"}
              </span>
            </div>

            <div className="km-weather-gauge-card">
              <div className="km-gauge-header">
                <CloudRain size={16} className="text-info" />
                <span>Precipitation Prob.</span>
              </div>
              <span className="km-gauge-val mono-number">
                {currentWeather.rain_chance || 0}%
              </span>
              <span className="km-gauge-sub">
                {currentWeather.rainfall || 0} mm expected
              </span>
            </div>

            <div className="km-weather-gauge-card">
              <div className="km-gauge-header">
                <Wind size={16} className="text-emerald" />
                <span>Wind Velocity</span>
              </div>
              <span className="km-gauge-val mono-number">
                {currentWeather.wind_speed} <small>km/h</small>
              </span>
              <span className="km-gauge-sub">
                {currentWeather.wind_speed > 20
                  ? "Breezy &bull; Halt spraying"
                  : "Calm &bull; Safe for spraying"}
              </span>
            </div>

            <div className="km-weather-gauge-card">
              <div className="km-gauge-header">
                <ShieldCheck size={16} className="text-emerald" />
                <span>Field Safety Index</span>
              </div>
              <span className="km-gauge-val text-emerald">Optimal</span>
              <span className="km-gauge-sub">Standard seasonal cycle</span>
            </div>
          </div>

          {/* Real Backend Farming Advice Pill */}
          {currentWeather.advice && (
            <div className="km-hero-advice-alert">
              <div className="km-hero-advice-icon">
                <Info size={18} />
              </div>
              <div className="km-hero-advice-content">
                <strong>Agronomic Telemetry Recommendation:</strong>
                <p>{currentWeather.advice}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ====================================================================
          TODAY'S FARMING ADVISORY
          ==================================================================== */}
      {advisory && (
        <section className="km-card km-weather-advisory-section">
          <div className="km-section-heading-bar">
            <div>
              <h3>Daily Field Operations Advisory</h3>
              <span className="km-sub-date">
                Valid for {new Date(advisory.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <span className="km-badge km-badge-forest">
              Summary: {advisory.weather_summary}
            </span>
          </div>

          <div className="km-advisory-dual-cards">
            {/* Recommended Tasks */}
            <div className="km-advisory-action-card">
              <div className="km-advisory-card-title positive">
                <CheckCircle2 size={18} />
                <h4>Recommended Agronomic Tasks</h4>
              </div>
              <ul className="km-advisory-bullets">
                {advisory.farming_tasks?.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>

            {/* Weather Cautions */}
            <div className="km-advisory-action-card cautions">
              <div className="km-advisory-card-title warning">
                <AlertTriangle size={18} />
                <h4>Field Alerts & Weather Cautions</h4>
              </div>
              <ul className="km-advisory-bullets caution">
                {advisory.cautions?.map((caution, i) => (
                  <li key={i}>{caution}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          MULTI-DAY FORECAST GRID
          ==================================================================== */}
      <section className="km-card km-forecast-section">
        <div className="km-forecast-header-row">
          <div>
            <h3>Multi-Day Micro-Climate Outlook</h3>
            <p>Predictive day-by-day parameters for agricultural scheduling</p>
          </div>

          <div className="km-forecast-day-pills">
            {[3, 5, 7].map((days) => (
              <button
                key={days}
                type="button"
                className={`km-day-pill ${forecastDays === days ? "active" : ""}`}
                onClick={() => handleDaysChange(days)}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <div className="km-forecast-cards-grid">
          {forecast.map((day, idx) => (
            <div key={idx} className="km-forecast-card km-card-interactive">
              <div className="km-fcard-date">
                <Calendar size={13} />
                <span>
                  {new Date(day.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="km-fcard-icon">
                {renderWeatherIcon(day.condition, 32)}
              </div>

              <div className="km-fcard-temps">
                <span className="km-fcard-max mono-number">{day.max_temp}°</span>
                <span className="km-fcard-min mono-number">{day.min_temp}°</span>
              </div>

              <span className="km-fcard-condition">{day.condition}</span>

              <div className="km-fcard-details">
                <div className="km-fcard-detail-item">
                  <Droplets size={12} />
                  <span>{day.humidity}%</span>
                </div>
                <div className="km-fcard-detail-item">
                  <CloudRain size={12} />
                  <span>{day.rain_chance}%</span>
                </div>
                <div className="km-fcard-detail-item">
                  <Wind size={12} />
                  <span>{day.wind_speed}km/h</span>
                </div>
              </div>

              {day.advice && (
                <div className="km-fcard-advice" title={day.advice}>
                  <p>{day.advice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Weather Operations Guide */}
      <section className="km-card km-agri-guide-card">
        <h3>Weather-Driven Farm Protocol Matrix</h3>
        <div className="km-guide-grid">
          <div className="km-guide-item">
            <Sun size={20} className="text-warning" />
            <div>
              <strong>Solar Peak (Sunny &gt; 32°C)</strong>
              <p>Ideal for harvesting and drying grains. Irrigate early morning or evening to avoid root shock.</p>
            </div>
          </div>
          <div className="km-guide-item">
            <CloudRain size={20} className="text-info" />
            <div>
              <strong>Precipitation Window</strong>
              <p>Ensure field drainage furrows are cleared. Do not apply foliar sprays or nitrogen top-dressing.</p>
            </div>
          </div>
          <div className="km-guide-item">
            <Droplets size={20} className="text-info" />
            <div>
              <strong>High Humidity (&gt; 80%)</strong>
              <p>Critical threshold for fungal blight. Inspect potato and tomato crops for dark sporulation spots.</p>
            </div>
          </div>
          <div className="km-guide-item">
            <Wind size={20} className="text-emerald" />
            <div>
              <strong>High Wind (&gt; 20 km/h)</strong>
              <p>Halt high-pressure spraying to prevent chemical drift. Stake tall crops like tomato and banana.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WeatherForecast;
