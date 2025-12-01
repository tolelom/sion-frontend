const StatusPanel = ({agvData}) => {
    const position = agvData?.position || {x: 0, y: 0, angle: 0};
    const status = agvData?.status || {battery: 0, speed: 0, mode: 'auto'};

    return (
        <div className="card">
            <h2 className="card-title">AGV 상태</h2>

            <div>
                {/* 위치 */}
                <div className="status-item">
                    <div className="status-icon blue">
                        📍
                    </div>
                    <div className="status-content">
                        <p className="status-label">위치</p>
                        <p className="status-value">
                            ({position.x?.toFixed(2)}, {position.y?.toFixed(2)})
                        </p>
                    </div>
                </div>
            </div>

            {/* 배터리 */}
            <div className="status-item">
                <div className="status-icon green">
                    🔋
                </div>
                <div className="status-content">
                    <p className="status-label">배터리</p>
                    <div className="battery-container">
                        <div className="battery-fill" style={{width: `${status.battery || 0}%`}}/>
                    </div>
                    <span className="battery-percentage">
                            {status.battery || 0}%
                        </span>
                </div>
            </div>

            {/* 속도 */}
            <div className="status-item">
                <div className="status-icon orange">
                    ⚡
                </div>
                <div className="status-content">
                    <p className="status-label">속도</p>
                    <p className="status-value">{status.speed || 0} m/s</p>
                </div>
            </div>

            {/* 모드 */}
            <div className="status-item">
                <div className="status-content">
                    <p className="status-label">모드</p>
                    <span className={`mode-badge ${status.mode || 'auto'}`}>
              {status.mode === 'auto' ? '🤖 자동' : '🎮 수동'}
            </span>
                </div>
            </div>
        </div>
    );
};

export default StatusPanel;