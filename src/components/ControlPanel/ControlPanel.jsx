import React, { useState } from 'react';
import '../../styles/ControlPanel.css';

const ControlPanel = ({ agvData, onModeChange, onStop }) => {
  const [selectedMode, setSelectedMode] = useState(agvData.status.mode || 'auto');

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onModeChange(mode);
  };

  const getStateLabel = (state) => {
    const stateMap = {
      'idle': '대기 중',
      'moving': '이동 중',
      'charging': '충전 중',
      'obstacle_avoidance': '장애물 회피',
    };
    return stateMap[state] || state;
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return 'success';
    if (battery > 30) return 'warning';
    return 'danger';
  };

  return (
    <div className="panel control-panel">
      <div className="panel-header">
        <h3>⚔️ 제어 패널</h3>
      </div>

      <div className="control-content">
        {/* 상태 정보 */}
        <div className="status-info">
          <div className="status-item">
            <span className="label">상태</span>
            <span className="value state">{getStateLabel(agvData.status.state)}</span>
          </div>
          
          <div className="status-item">
            <span className="label">배터리</span>
            <div className="battery-bar">
              <div 
                className={`battery-fill ${getBatteryColor(agvData.status.battery)}`}
                style={{ width: `${agvData.status.battery}%` }}
              ></div>
            </div>
            <span className="value percent">{agvData.status.battery}%</span>
          </div>
          
          <div className="status-item">
            <span className="label">속도</span>
            <span className="value">{(agvData.status.speed || 0).toFixed(1)} m/s</span>
          </div>
        </div>

        {/* 모드 선택 */}
        <div className="mode-selector">
          <span className="label">모드</span>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${selectedMode === 'auto' ? 'active' : ''}`}
              onClick={() => handleModeChange('auto')}
            >
              🤖 자동
            </button>
            <button
              className={`mode-btn ${selectedMode === 'manual' ? 'active' : ''}`}
              onClick={() => handleModeChange('manual')}
            >
              🎮 수동
            </button>
          </div>
        </div>

        {/* 명령 버튼 */}
        <div className="command-buttons">
          <button className="btn btn-danger" onClick={onStop}>
            🛑 긴급 정지
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
