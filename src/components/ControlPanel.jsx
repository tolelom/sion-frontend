/**
 * Control Panel - AGV 제어 패널
 */

import React from 'react';

const ControlPanel = ({
  agv,
  agvId,
  selectedMode,
  onModeChange,
  onStop,
}) => {
  const batteryLevel = agv?.battery || 0;
  const batteryColor =
    batteryLevel > 50 ? '#22c55e' : batteryLevel > 20 ? '#eab308' : '#ef4444';

  const formatPosition = (pos) => {
    if (!pos) return 'N/A';
    return `(${pos.x?.toFixed(1)}, ${pos.y?.toFixed(1)})`;
  };

  const formatAngle = (angle) => {
    if (angle === undefined || angle === null) return 'N/A';
    return `${(angle * (180 / Math.PI)).toFixed(1)}°`;
  };

  return (
    <div className="control-panel-container">
      {/* AGV Info */}
      <section className="control-section info-section">
        <h3>📊 Status</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>ID</label>
            <span className="info-value">{agvId}</span>
          </div>
          <div className="info-item">
            <label>State</label>
            <span className="info-value">{agv?.state || 'unknown'}</span>
          </div>
          <div className="info-item">
            <label>Mode</label>
            <span className="info-value">{agv?.mode || 'unknown'}</span>
          </div>
          <div className="info-item">
            <label>Speed</label>
            <span className="info-value">
              {(agv?.speed || 0).toFixed(2)} m/s
            </span>
          </div>
        </div>
      </section>

      {/* Position */}
      <section className="control-section position-section">
        <h3>📍 Position</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Coordinate</label>
            <span className="info-value">
              {formatPosition(agv?.position)}
            </span>
          </div>
          <div className="info-item">
            <label>Angle</label>
            <span className="info-value">
              {formatAngle(agv?.position?.angle)}
            </span>
          </div>
        </div>
      </section>

      {/* Battery */}
      <section className="control-section battery-section">
        <h3>🔋 Battery</h3>
        <div className="battery-container">
          <div className="battery-bar">
            <div
              className="battery-fill"
              style={{
                width: `${batteryLevel}%`,
                backgroundColor: batteryColor,
              }}
            />
          </div>
          <span className="battery-text">{batteryLevel.toFixed(0)}%</span>
        </div>
      </section>

      {/* Mode Control */}
      <section className="control-section mode-section">
        <h3>⚙️ Mode</h3>
        <div className="mode-buttons">
          <button
            className={`mode-btn ${selectedMode === 'auto' ? 'active' : ''}`}
            onClick={() => onModeChange('auto')}
          >
            🤖 Auto
          </button>
          <button
            className={`mode-btn ${selectedMode === 'manual' ? 'active' : ''}`}
            onClick={() => onModeChange('manual')}
          >
            🎮 Manual
          </button>
        </div>
      </section>

      {/* Actions */}
      <section className="control-section action-section">
        <h3>🎯 Actions</h3>
        <button className="action-btn stop-btn" onClick={onStop}>
          ⏹️ Stop
        </button>
      </section>
    </div>
  );
};

export default ControlPanel;
