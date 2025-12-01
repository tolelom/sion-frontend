import {useState} from 'react';
import MapCanvas from '../Map/MapCanvas';
import StatusPanel from '../Status/StatusPanel';
import ControlPanel from '../Controls/ControlPanel';
import "../../styles/dashboard.css"

const Dashboard = ({agvData, isConnected, onSendCommand}) => {
    const [targets] = useState([
        {id: 1, x: 15, y: 12, name: '아리'}
    ]);

    const handleMapClick = (position) => {
        console.log('맵 클릭: ', position);

        onSendCommand({
            type: 'command',
            data: {
                target_x: position.x,
                target_y: position.y,
                mode: 'manual'
            }
        });
    };

    return (
        <div className="dashboard">
            {/* 헤더 */}
            <header className="dashboard-header">
                <h1 className="dashboard-title">AGV 실시간 모니터링</h1>
                <div className="connection-status">
                    <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}/>
                    <span className="status-text">
                        {isConnected ? "서버 연결됨" : "서버 연결 끊김"}
                    </span>
                </div>
            </header>

            <div className="dashboard-grid">
                <div className="card">
                    <h2 className="card-title">실시간 맵</h2>
                    <MapCanvas
                        agvPosition={agvData?.position}
                        targets={targets}
                        onMapClick={handleMapClick}
                    />
                </div>

                <div className="sidebar">
                    <StatusPanel agvData={agvData}/>
                    <ControlPanel onSendCommand={onSendCommand}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;