import React from 'react';
import '../../styles/StatusPanel.css';

const StatusPanel = ({ agvData, isConnected }) => {
  return (
    <div className="panel status-panel">
      <div className="panel-header">
        <h3>📊 상태</h3>
      </div>

      <div className="status-content">
        {/* 연결 상태 */}
        <div className="status-group">
          <div className="status-item">
            <span className="label">연결</span>
            <span className={`badge ${isConnected ? 'success' : 'danger'}`}>
              {isConnected ? '연결됨' : '끝김'}
            </span>
          </div>
        </div>

        {/* 위치 정보 */}
        <div className="status-group">
          <div className="label-header">위치</div>
          <div className="coordinate">
            <div>X: {agvData.position.x.toFixed(2)}</div>
            <div>Y: {agvData.position.y.toFixed(2)}</div>
            <div>Θ: {(agvData.position.angle || 0).toFixed(1)}°</div>
          </div>
        </div>

        {/* 성능 지표 */}
        <div className="status-group">
          <div className="label-header">성능</div>
          <div className="metrics">
            <div className="metric-item">
              <span className="label">배터리</span>
              <span className="value">{agvData.status.battery}%</span>
            </div>
            <div className="metric-item">
              <span className="label">속도</span>
              <span className="value">{(agvData.status.speed || 0).toFixed(1)}m/s</span>
            </div>
          </div>
        </div>

        {/* 적 감지 */}
        {agvData.detectedEnemies?.length > 0 && (
          <div className="status-group danger">
            <div className="label-header">⚠️ 적 감지</div>
            <div className="enemy-list">
              {agvData.detectedEnemies.map((enemy, idx) => (
                <div key={idx} className="enemy-item">
                  적 #{idx + 1}: ({enemy.x.toFixed(1)}, {enemy.y.toFixed(1)})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;
