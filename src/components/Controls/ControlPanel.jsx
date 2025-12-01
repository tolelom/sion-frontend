import { useState } from 'react';

const ControlPanel = ({ onSendCommand }) => {
    const [mode, setMode] = useState('auto');

    const handleModeToggle = () => {
        const newMode = mode === 'auto' ? 'manual' : 'auto';
        setMode(newMode);

        onSendCommand({
            type: 'status',
            data: { mode: newMode },
        });
    };

    return (
        <div className="card">
            <h2 className="card-title">제어</h2>

            <div className="control-buttons">
                {/* 모드 전환 */}
                <button
                    onClick={handleModeToggle}
                    className="control-btn primary"
                >
                    {mode === 'auto' ? '▶️ 자동 모드' : '⏸️ 수동 모드'}
                </button>

                {/* 긴급 정지 */}
                <button className="control-btn danger">
                    ⏹️ 긴급 정지
                </button>

                {/* 초기화 */}
                <button className="control-btn secondary">
                    🔄 초기화
                </button>
            </div>

            <div className="info-box">
                <p>💡 맵을 클릭하면 AGV가 해당 위치로 이동합니다</p>
            </div>
        </div>
    );
};

export default ControlPanel;