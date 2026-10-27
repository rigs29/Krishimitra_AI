import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ScanEye,
  CloudSun,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getCurrentWeather } from "../api/weatherAPI";
import "./TopHeader.css";

function TopHeader({ toggleMobileSidebar, isSidebarCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();

  const [weatherSummary, setWeatherSummary] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "Weather Advisory Active",
      desc: "High humidity predicted today. Monitor tomatoes for early blight signs.",
      time: "10m ago",
      type: "warning",
      icon: AlertTriangle,
    },
    {
      id: 2,
      title: "Mandi Price Rally",
      desc: "Tomato rates up +3.3% across regional mandis.",
      time: "1h ago",
      type: "success",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Diagnostic Engine Updated",
      desc: "MobileNetV2 high-confidence model ready for leaf scans.",
      time: "2h ago",
      type: "info",
      icon: CheckCircle2,
    },
  ]);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch quick weather indicator
  useEffect(() => {
    let mounted = true;
    getCurrentWeather()
      .then((data) => {
        if (mounted && data) {
          setWeatherSummary(data);
        }
      })
      .catch((err) => console.log("Header weather fetch silently handled:", err));

    return () => {
      mounted = false;
    };
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute page title from path
  const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
        return { title: "Farm Intelligence Dashboard", crumb: "Home / Overview" };
      case "/disease-detection":
        return { title: "Plant Pathology & Disease AI", crumb: "Diagnostics / Disease Lab" };
      case "/weather":
        return { title: "Weather Intelligence & Agromet", crumb: "Analytics / Meteorology" };
      case "/market":
        return { title: "Mandi Market Terminal", crumb: "Commodities / Live Mandi" };
      case "/advisor":
        return { title: "AI Agronomist Assistant", crumb: "Conversational AI / Farming Copilot" };
      case "/profile":
        return { title: "Farmer Profile & Farm Records", crumb: "Management / Profile" };
      default:
        return { title: "KrishiMitra AI", crumb: "Platform" };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className={`km-top-header ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="km-header-left">
        <button
          className="km-mobile-menu-trigger"
          onClick={toggleMobileSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="km-header-title-block">
          <div className="km-header-breadcrumb">{pageInfo.crumb}</div>
          <h1 className="km-header-page-title">{pageInfo.title}</h1>
        </div>
      </div>

      {/* Right: Weather Pill, Quick Scan, Theme, Notifications, User */}
      <div className="km-header-right">
        {/* Live Weather Pill */}
        {weatherSummary && (
          <Link to="/weather" className="km-header-weather-pill" title="View detailed weather intelligence">
            <CloudSun size={16} className="km-weather-pill-icon" />
            <span className="km-weather-pill-temp">{weatherSummary.temperature}°C</span>
            <span className="km-weather-pill-condition">{weatherSummary.condition}</span>
          </Link>
        )}

        {/* Quick Diagnostic Button */}
        {location.pathname !== "/disease-detection" && (
          <button
            onClick={() => navigate("/disease-detection")}
            className="km-btn km-btn-emerald km-btn-sm km-header-quick-action"
          >
            <ScanEye size={15} />
            <span>Scan Leaf</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="km-header-icon-btn"
          title={isDarkMode ? "Switch to daylight mode" : "Switch to night mode"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} className="km-theme-sun" /> : <Moon size={18} />}
        </button>

        {/* Notifications Popover */}
        <div className="km-header-popover-anchor" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="km-header-icon-btn km-notif-btn"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="km-notif-badge-dot" />
          </button>

          {showNotifications && (
            <div className="km-notifications-dropdown km-animate-fade-in">
              <div className="km-dropdown-header">
                <h3>Agricultural Alerts</h3>
                <span className="km-badge km-badge-forest">{notifications.length} New</span>
              </div>
              <div className="km-notifications-list">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className={`km-notif-card ${n.type}`}>
                      <div className="km-notif-icon-wrap">
                        <Icon size={16} />
                      </div>
                      <div className="km-notif-content">
                        <h4>{n.title}</h4>
                        <p>{n.desc}</p>
                        <span className="km-notif-time">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Account Popover */}
        <div className="km-header-popover-anchor" ref={userMenuRef}>
          {user ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="km-user-pill-btn"
            >
              <div className="km-user-avatar">
                {user.name ? user.name[0].toUpperCase() : "K"}
              </div>
              <span className="km-user-pill-name">{user.name || "Farmer"}</span>
              <ChevronDown size={14} className="km-user-pill-caret" />
            </button>
          ) : (
            <div className="km-header-auth-links">
              <Link to="/login" className="km-btn km-btn-outline km-btn-sm">
                Login
              </Link>
              <Link to="/register" className="km-btn km-btn-primary km-btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {user && showUserMenu && (
            <div className="km-user-dropdown km-animate-fade-in">
              <div className="km-user-dropdown-header">
                <strong>{user.name || "Farmer"}</strong>
                <span>{user.email || "farmer@krishimitra.ai"}</span>
              </div>
              <div className="km-user-dropdown-actions">
                <Link
                  to="/profile"
                  className="km-user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} />
                  <span>Farm Profile & History</span>
                </Link>
                <button
                  className="km-user-menu-item km-logout-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;

