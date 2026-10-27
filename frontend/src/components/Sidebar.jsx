import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanEye,
  CloudSun,
  TrendingUp,
  BotMessageSquare,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Activity,
  Layers,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }) {
  const location = useLocation();

  const navItems = [
    {
      group: "INTELLIGENCE SUITE",
      links: [
        {
          path: "/",
          label: "Farm Dashboard",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          path: "/disease-detection",
          label: "Disease Diagnostic AI",
          icon: ScanEye,
          badge: "MobileNetV2",
        },
        {
          path: "/weather",
          label: "Weather Intelligence",
          icon: CloudSun,
          badge: "7-Day",
        },
        {
          path: "/market",
          label: "Mandi Market Terminal",
          icon: TrendingUp,
          badge: "Live",
        },
        {
          path: "/advisor",
          label: "AI Agronomist Assistant",
          icon: BotMessageSquare,
          badge: "24/7",
        },
      ],
    },
    {
      group: "ACCOUNT & SETTINGS",
      links: [
        {
          path: "/profile",
          label: "Farmer Profile & Farm",
          icon: UserCheck,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="km-sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      <aside
        className={`km-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Header / Logo */}
        <div className="km-sidebar-header">
          <NavLink
            to="/"
            className="km-sidebar-brand"
            onClick={closeMobileSidebar}
          >
            <div className="km-brand-icon">
              <Sprout size={24} className="km-brand-sprout" />
            </div>
            {!isCollapsed && (
              <div className="km-brand-text">
                <span className="km-brand-title">KrishiMitra</span>
                <span className="km-brand-subtitle">Smart Agri-OS</span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            className="km-sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="km-sidebar-nav">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="km-nav-group">
              {!isCollapsed && (
                <div className="km-nav-group-title">{group.group}</div>
              )}
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`km-nav-item ${isActive ? "active" : ""}`}
                    onClick={closeMobileSidebar}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <div className="km-nav-icon-wrap">
                      <Icon size={19} className="km-nav-icon" />
                    </div>
                    {!isCollapsed && (
                      <span className="km-nav-label">{link.label}</span>
                    )}
                    {!isCollapsed && link.badge && (
                      <span className="km-nav-badge">{link.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* System Diagnostics / Telemetry Card at bottom */}
        {!isCollapsed && (
          <div className="km-sidebar-status-card">
            <div className="km-status-header">
              <span className="km-pulse-dot" />
              <span className="km-status-title">FastAPI AI Engine</span>
            </div>
            <p className="km-status-sub">Inference Core: Port 8000</p>
            <div className="km-status-meta">
              <span>MobileNetV2: Ready</span>
              <span>Model Acc: 95%</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;

