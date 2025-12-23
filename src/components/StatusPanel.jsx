import React, { useState, useEffect } from 'react';

const StatusPanel = () => {
  const [coordinates, setCoordinates] = useState({ x: 1240.5, y: 560.3 });
  const [metrics, setMetrics] = useState({ distance: 23.5, angle: 45 });

  useEffect(() => {
    // Simulate real-time coordinate updates
    const interval = setInterval(() => {
      setCoordinates(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel status-panel">
      <div className="panel-header">
        <h3>📊 상태</h3>
      </div>

      <div className="status-content">
        {/* Connection Status */}
        <div className="status-group">
          <div className="label-header">연결 상태</div>
          <div className="status-item">
            <div className="label">서버</div>
            <span className="badge success">✓ Connected</span>
          </div>
          <div className="status-item">
            <div className="label">API</div>
            <span className="badge success">✓ Active</span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="status-group">
          <div className="label-header">좌표</div>
          <div className="coordinate">
            <div>X: {coordinates.x.toFixed(1)}</div>
            <div>Y: {coordinates.y.toFixed(1)}</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="status-group">
          <div className="label-header">메트릭</div>
          <div className="metrics">
            <div className="metric-item">
              <div className="label">거리</div>
              <div className="value">{metrics.distance.toFixed(1)}m</div>
            </div>
            <div className="metric-item">
              <div className="label">각도</div>
              <div className="value">{metrics.angle}°</div>
            </div>
          </div>
        </div>

        {/* Enemy Detection */}
        <div className="status-group danger">
          <div className="label-header">적 감지</div>
          <div className="enemy-list">
            <div className="enemy-item">💀 Enemy #1 - 150m</div>
            <div className="enemy-item">💀 Enemy #2 - 280m</div>
            <div className="enemy-item">💀 Enemy #3 - 420m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
