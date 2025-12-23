import React, { useState } from 'react';

const ControlPanel = () => {
  const [battery, setBattery] = useState(85);
  const [mode, setMode] = useState('AUTO');

  return (
    <div className="panel control-panel">
      <div className="panel-header">
        <h3>⚙️ 제어</h3>
      </div>

      <div className="control-content">
        {/* Status Info */}
        <div className="status-info">
          <div className="status-item">
            <div className="label">상태</div>
            <div className="value state">활성</div>
          </div>
          <div className="status-item">
            <div className="label">모드</div>
            <div className="value state">{mode}</div>
          </div>
        </div>

        {/* Battery Bar */}
        <div className="status-item">
          <div className="label">배터리</div>
          <div className="battery-bar">
            <div className="battery-bar-container">
              <div 
                className={`battery-fill ${battery < 30 ? 'danger' : battery < 50 ? 'warning' : ''}`}
                style={{ width: `${battery}%` }}
              ></div>
            </div>
            <div className="battery-percent">{battery}%</div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector">
          <div className="label">작동 모드</div>
          <div className="mode-buttons">
            <button 
              className={`mode-btn ${mode === 'AUTO' ? 'active' : ''}`}
              onClick={() => setMode('AUTO')}
            >
              자동
            </button>
            <button 
              className={`mode-btn ${mode === 'MANUAL' ? 'active' : ''}`}
              onClick={() => setMode('MANUAL')}
            >
              수동
            </button>
          </div>
        </div>

        {/* Command Buttons */}
        <div className="command-buttons">
          <button className="btn btn-primary">🎯 타겟팅</button>
          <button className="btn btn-success">✓ 실행</button>
          <button className="btn btn-danger">⚠️ 긴급 정지</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
