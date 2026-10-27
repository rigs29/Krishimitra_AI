import React from "react";
import { Link } from "react-router-dom";
import { Sprout, ShieldCheck, Cpu, HeartHandshake } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="km-footer">
      <div className="km-footer-inner">
        <div className="km-footer-brand-col">
          <div className="km-footer-logo">
            <div className="km-footer-logo-badge">
              <Sprout size={18} />
            </div>
            <span>KrishiMitra AI</span>
          </div>
          <p className="km-footer-tagline">
            Autonomous agricultural intelligence powered by MobileNetV2 vision models, 
            meteorological agromet heuristics, and live mandi price feeds.
          </p>
          <div className="km-footer-pills">
            <span className="km-footer-pill">
              <Cpu size={13} /> MobileNetV2 Core
            </span>
            <span className="km-footer-pill">
              <ShieldCheck size={13} /> Data Integrity
            </span>
            <span className="km-footer-pill">
              <HeartHandshake size={13} /> Farmer First
            </span>
          </div>
        </div>

        <div className="km-footer-links-grid">
          <div className="km-footer-col">
            <h4>AI Solutions</h4>
            <Link to="/disease-detection">Disease Diagnostic Lab</Link>
            <Link to="/weather">Weather Intelligence</Link>
            <Link to="/market">Mandi Market Terminal</Link>
            <Link to="/advisor">AI Agronomist Copilot</Link>
          </div>

          <div className="km-footer-col">
            <h4>Supported Crops</h4>
            <span>Tomato &bull; Solanum lycopersicum</span>
            <span>Potato &bull; Solanum tuberosum</span>
            <span>Rice &bull; Oryza sativa</span>
            <span>Wheat &bull; Triticum</span>
            <span>Corn &bull; Zea mays</span>
          </div>

          <div className="km-footer-col">
            <h4>Security & Standards</h4>
            <span>FastAPI REST Layer</span>
            <span>CORS Enabled</span>
            <span>Local Machine Inference</span>
            <span>Open Data Mandis</span>
          </div>
        </div>
      </div>

      <div className="km-footer-bottom">
        <div className="km-footer-copy">
          &copy; {new Date().getFullYear()} KrishiMitra AI Platform. Designed for modern Indian agriculture.
        </div>
        <div className="km-footer-legal">
          <span>AI Advisory Disclaimer: Always cross-verify with local Krishi Vigyan Kendra (KVK).</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
