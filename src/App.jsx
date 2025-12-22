import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useWebSocket from './hooks/useWebSocket';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import AGVDashboard from './components/AGVDashboard';

function App() {
  // Web Socket 연결
  const WS_URL = 'ws://sion.tolelom.xyz:3000/websocket/web';
  const { isConnected, lastMessage, sendMessage } = useWebSocket(WS_URL);

  // AGV 데이터 상태
  const [agvData, setAgvData] = useState({
    position: { x: 0, y: 0, angle: 0 },
    status: { battery: 100, speed: 0, mode: 'auto' },
    detectedEnemies: [],
    targetEnemy: null,
  });

  // 맵 데이터
  const [mapData, setMapData] = useState({
    obstacles: [],
    width: 20,
    height: 20,
  });

  // Web Socket 메시지 처리
  useEffect(() => {
    if (!lastMessage) return;

    console.log('Received:', lastMessage);

    switch (lastMessage.type) {
      case 'position':
        setAgvData((prev) => ({
          ...prev,
          position: lastMessage.data,
        }));
        break;

      case 'status':
        const statusData = lastMessage.data;
        setAgvData((prev) => ({
          ...prev,
          status: {
            battery: statusData.battery,
            speed: statusData.speed,
            mode: statusData.mode,
            state: statusData.state,
          },
          detectedEnemies: statusData.detected_enemies || prev.detectedEnemies,
          targetEnemy: statusData.target_enemy || prev.targetEnemy,
        }));
        break;

      case 'target_found':
        setAgvData((prev) => ({
          ...prev,
          detectedEnemies: lastMessage.data.enemies || [],
          targetEnemy: lastMessage.data.target || null,
        }));
        console.log('Target found:', lastMessage.data);
        break;

      case 'map_update':
        setMapData((prev) => ({
          ...prev,
          obstacles: lastMessage.data.obstacles || prev.obstacles,
          width: lastMessage.data.width || prev.width,
          height: lastMessage.data.height || prev.height,
        }));
        console.log('Map updated:', lastMessage.data);
        break;

      case 'chat_response':
        if (window.chatPanel && window.chatPanel.addAIMessage) {
          window.chatPanel.addAIMessage(lastMessage.data.message);
        }
        break;

      case 'agv_event':
        if (window.chatPanel && window.chatPanel.addAIMessage) {
          window.chatPanel.addAIMessage(lastMessage.data.explanation);
        }
        break;

      default:
        console.log('Unknown message:', lastMessage);
    }
  }, [lastMessage]);

  return (
    <BrowserRouter>
      <Routes>
        {/* AGV Dashboard */}
        <Route path="/" element={<AGVDashboard />} />
        <Route path="/dashboard" element={<AGVDashboard />} />

        {/* Original Dashboard */}
        <Route
          path="/legacy"
          element={
            <Dashboard
              agvData={agvData}
              mapData={mapData}
              isConnected={isConnected}
              onSendCommand={sendMessage}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
