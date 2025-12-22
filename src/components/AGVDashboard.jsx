/**
 * AGV 대시보드 - 메인 대시보드
 */

import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import MapCanvas from './MapCanvas';
import ControlPanel from './ControlPanel';
import '../styles/AGVDashboard.css';

const AGVDashboard = () => {
  const {
    connected,
    agvStatuses,
    error,
    setAGVGoal,
    changeAGVMode,
    stopAGV,
  } = useWebSocket();

  const [selectedAGV, setSelectedAGV] = useState(null);
  const [selectedMode, setSelectedMode] = useState('auto');

  const agvList = Object.entries(agvStatuses);
  const currentAGV = selectedAGV ? agvStatuses[selectedAGV] : null;

  const handleMapClick = (x, y) => {
    if (!selectedAGV) {
      alert('Please select an AGV first');
      return;
    }
    setAGVGoal(x, y, false);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    if (selectedAGV) {
      changeAGVMode(mode);
    }
  };

  const handleStop = () => {
    if (selectedAGV) {
      stopAGV();
    }
  };

  return (
    <div className="agv-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>🤖 AGV Dashboard</h1>
        <div className="status-indicator">
          <span className={`indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Panel - AGV Selection */}
        <aside className="agv-selector">
          <h2>🔍 AGVs ({agvList.length})</h2>
          <div className="agv-list">
            {agvList.length === 0 ? (
              <p className="no-agv">No AGVs connected</p>
            ) : (
              agvList.map(([id, status]) => (
                <div
                  key={id}
                  className={`agv-item ${selectedAGV === id ? 'selected' : ''}`}
                  onClick={() => setSelectedAGV(id)}
                >
                  <div className="agv-header">
                    <h3>{id}</h3>
                    <span className={`state-badge ${status.state}`}>
                      {status.state || 'unknown'}
                    </span>
                  </div>
                  <div className="agv-info">
                    <p>🔋 Battery: {Math.round(status.battery || 0)}%</p>
                    <p>🚶 Speed: {(status.speed || 0).toFixed(2)} m/s</p>
                    <p>📍 Mode: {status.mode || 'unknown'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Map */}
        <main className="map-container">
          <MapCanvas
            agvStatuses={agvStatuses}
            selectedAGV={selectedAGV}
            onMapClick={handleMapClick}
          />
        </main>

        {/* Right Panel - Control */}
        <aside className="control-panel">
          {currentAGV ? (
            <ControlPanel
              agv={currentAGV}
              agvId={selectedAGV}
              selectedMode={selectedMode}
              onModeChange={handleModeChange}
              onStop={handleStop}
            />
          ) : (
            <div className="no-selection">
              <p>Select an AGV to control</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AGVDashboard;
