import React, { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout Components
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

// Page Components
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import WeatherForecast from "./pages/WeatherForecast";
import CropMarket from "./pages/CropMarket";
import AIAdvisor from "./pages/AIAdvisor";

// Auth & Profile Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="km-app-shell">
      {/* Toast Notification Container with Nature Theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "var(--km-surface)",
            color: "var(--km-text-primary)",
            border: "1px solid var(--km-border)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(16, 43, 32, 0.15)",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "0.875rem",
            fontWeight: "500",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#2e8b57",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* Desktop & Mobile Responsive Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`km-main-wrapper ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <TopHeader
          toggleMobileSidebar={toggleMobileSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="km-content-viewport">
          <Routes>
            {/* Core Application Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/weather" element={<WeatherForecast />} />
            <Route path="/market" element={<CropMarket />} />
            <Route path="/advisor" element={<AIAdvisor />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="km-not-found-container km-animate-fade-in">
                  <span className="km-not-found-code">404</span>
                  <h2 className="km-not-found-title">Crop Field Not Found</h2>
                  <p className="km-not-found-desc">
                    The requested agricultural module or view could not be located in our index.
                  </p>
                  <Link to="/" className="km-btn km-btn-primary">
                    Return to Dashboard
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* Persistent Global Floating Chat Copilot */}
      <ChatWidget />
    </div>
  );
}

export default App;
