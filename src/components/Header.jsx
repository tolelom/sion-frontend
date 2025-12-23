import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Sion Logo with Glow */}
        <div className="header-logo-wrapper">
          <div className="header-logo">SION</div>
          <div className="logo-glow"></div>
        </div>

        {/* Sion Character Portrait */}
        <div className="sion-portrait-container">
          <div className="sion-portrait-frame">
            {/* SVG-based Sion Mecha Portrait */}
            <svg
              className="sion-portrait"
              viewBox="0 0 200 240"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Background Head Shape */}
              <defs>
                <radialGradient id="sionHeadGradient" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" style={{ stopColor: '#0099ff', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#0066cc', stopOpacity: 0.1 }} />
                </radialGradient>

                <linearGradient id="sionEyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00ffff' }} />
                  <stop offset="100%" style={{ stopColor: '#0099ff' }} />
                </linearGradient>
              </defs>

              {/* Head */}
              <ellipse cx="100" cy="80" rx="50" ry="60" fill="url(#sionHeadGradient)" />
              <path d="M 60 100 Q 50 120, 60 140 L 140 140 Q 150 120, 140 100" fill="#0a0e27" opacity="0.8" />

              {/* Left Eye (Cyan/Blue Glow) */}
              <circle cx="75" cy="70" r="12" fill="url(#sionEyeGlow)" />
              <circle cx="75" cy="70" r="8" fill="#00ffff" opacity="0.9" />
              <circle cx="77" cy="68" r="3" fill="white" opacity="0.6" />

              {/* Right Eye */}
              <circle cx="125" cy="70" r="12" fill="url(#sionEyeGlow)" />
              <circle cx="125" cy="70" r="8" fill="#00ffff" opacity="0.9" />
              <circle cx="127" cy="68" r="3" fill="white" opacity="0.6" />

              {/* Cyber Face Lines */}
              <line x1="60" y1="90" x2="140" y2="90" stroke="#0099ff" strokeWidth="2" opacity="0.6" />
              <line x1="70" y1="110" x2="130" y2="110" stroke="#0099ff" strokeWidth="1.5" opacity="0.4" />

              {/* Mecha Jaw */}
              <path d="M 70 140 L 65 160 L 75 170 L 125 170 L 135 160 L 130 140" fill="#0066cc" opacity="0.6" />

              {/* Shoulder/Armor */}
              <path d="M 40 150 Q 30 170, 40 190 L 160 190 Q 170 170, 160 150" fill="#0099ff" opacity="0.2" />
              <path d="M 50 160 Q 45 175, 50 185 M 150 160 Q 155 175, 150 185" stroke="#0099ff" strokeWidth="2" />

              {/* Tech Details - Circuit Board Pattern */}
              <circle cx="85" cy="75" r="2" fill="#00ff99" opacity="0.8" />
              <circle cx="115" cy="75" r="2" fill="#00ff99" opacity="0.8" />
              <line x1="75" y1="95" x2="125" y2="95" stroke="#00ff99" strokeWidth="1" opacity="0.5" />

              {/* Glow Effect Around Head */}
              <circle cx="100" cy="80" r="65" fill="none" stroke="#0099ff" strokeWidth="2" opacity="0.3" />
              <circle cx="100" cy="80" r="70" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.2" />
            </svg>
            <div className="portrait-glow"></div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="header-status">
          <div className="status-indicator connected"></div>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Right Side - System Info */}
      <div className="header-right">
        <div className="system-info">
          <div className="info-item">
            <span className="info-label">SYSTEM</span>
            <span className="info-value">ACTIVE</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-label">MODE</span>
            <span className="info-value">COMBAT</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
