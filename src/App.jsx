import React, { useEffect, useState, useRef } from 'react';
import './styles/LoLTheme.css';
import Header from './components/Header/Header';
import ControlPanel from './components/ControlPanel/ControlPanel';
import TacticalMap from './components/Map/TacticalMap';
import StatusPanel from './components/Status/StatusPanel';
import CommentaryPanel from './components/Commentary/CommentaryPanel';
import ChatInput from './components/Chat/ChatInput';
import useWebSocket from './hooks/useWebSocket';

function App() {
  const WS_URL = 'ws://tolelom.xyz:3000/websocket/web';
  const { isConnected, lastMessage, sendMessage } = useWebSocket(WS_URL);
  
  const [agvData, setAgvData] = useState({
    id: 'SION-001',
    position: { x: 10, y: 10, angle: 0 },
    status: { battery: 100, speed: 0, mode: 'auto', state: 'idle' },
    detectedEnemies: [],
    targetEnemy: null,
  });

  const [mapData, setMapData] = useState({
    obstacles: [],
    width: 20,
    height: 20,
    target: null,
  });

  const [commentary, setCommentary] = useState([]);
  const commentaryPanelRef = useRef(null);

  // WebSocket 메시지 처리
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[App] Received:', lastMessage.type);

    switch (lastMessage.type) {
      case 'agv_status_update':
        if (lastMessage.data?.agvs?.length > 0) {
          const agv = lastMessage.data.agvs[0];
          setAgvData(prev => ({
            ...prev,
            position: agv.position || prev.position,
            status: {
              battery: agv.battery || prev.status.battery,
              speed: agv.speed || prev.status.speed,
              mode: agv.mode || prev.status.mode,
              state: agv.state || prev.status.state,
            },
            detectedEnemies: agv.detected_enemies || [],
            targetEnemy: agv.target_enemy || null,
          }));
        }
        break;

      case 'chat_response':
        if (lastMessage.data?.message) {
          addCommentary(lastMessage.data.message, 'ai');
        }
        break;

      case 'agv_event':
        if (lastMessage.data?.explanation) {
          addCommentary(lastMessage.data.explanation, 'system');
        }
        break;

      case 'map_update':
        setMapData(prev => ({
          ...prev,
          obstacles: lastMessage.data?.obstacles || prev.obstacles,
          width: lastMessage.data?.width || prev.width,
          height: lastMessage.data?.height || prev.height,
        }));
        break;

      case 'tts':
        // 음성 재생
        if (lastMessage.data?.audio_url) {
          const audio = new Audio(lastMessage.data.audio_url);
          audio.play().catch(err => console.error('Audio play error:', err));
        }
        break;

      default:
        console.log('[App] Unknown message type:', lastMessage.type);
    }
  }, [lastMessage]);

  const addCommentary = (text, type = 'ai') => {
    const id = Date.now();
    const newCommentary = { id, text, type, timestamp: new Date() };
    setCommentary(prev => [...prev, newCommentary].slice(-10)); // 최근 10개만 유지
    
    // 자동 스크롤
    setTimeout(() => {
      if (commentaryPanelRef.current) {
        commentaryPanelRef.current.scrollTop = commentaryPanelRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleSetGoal = (x, y) => {
    const message = {
      type: 'set_goal',
      data: {
        target_pos: { x, y },
        is_enemy_goal: false,
      },
      timestamp: Date.now(),
    };
    sendMessage(message);
    addCommentary(`목표 설정: (${x}, ${y})`, 'user');
  };

  const handleModeChange = (mode) => {
    const message = {
      type: 'set_mode',
      data: { mode },
      timestamp: Date.now(),
    };
    sendMessage(message);
    addCommentary(`모드 변경: ${mode === 'auto' ? '자동' : '수동'}`, 'user');
  };

  const handleStop = () => {
    const message = {
      type: 'stop',
      data: {},
      timestamp: Date.now(),
    };
    sendMessage(message);
    addCommentary('긴급 정지!', 'system');
  };

  const handleChat = (text) => {
    addCommentary(text, 'user');
    const message = {
      type: 'chat',
      data: { message: text },
      timestamp: Date.now(),
    };
    sendMessage(message);
  };

  return (
    <div className="app lol-theme">
      {/* 배경 격자 효과 */}
      <div className="grid-background"></div>
      
      {/* 헤더 */}
      <Header isConnected={isConnected} agvId={agvData.id} />

      {/* 메인 콘테늤트 영역 */}
      <div className="main-content">
        {/* 왼쫼 제어 패널 */}
        <div className="left-panel">
          <ControlPanel
            agvData={agvData}
            onModeChange={handleModeChange}
            onStop={handleStop}
          />
        </div>

        {/* 중앙 전술 맵 */}
        <div className="center-panel">
          <TacticalMap
            mapData={mapData}
            agvPosition={agvData.position}
            agvMode={agvData.status.mode}
            detectedEnemies={agvData.detectedEnemies}
            onCellClick={handleSetGoal}
          />
        </div>

        {/* 오른쉽 상태 패널 */}
        <div className="right-panel">
          <StatusPanel
            agvData={agvData}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* 해설가 패널 */}
      <div className="commentary-panel-container">
        <CommentaryPanel
          ref={commentaryPanelRef}
          commentaries={commentary}
        />
      </div>

      {/* 채팅 입력 */}
      <div className="chat-input-container">
        <ChatInput onSend={handleChat} />
      </div>
    </div>
  );
}

export default App;
