/**
 * WebSocket 훅 - AGV 대시보드용
 * 
 * 기능:
 * - WebSocket 연결/재연결
 * - AGV 상태 수신
 * - 명령 전송
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const useWebSocket = (serverUrl = 'ws://tolelom.xyz:3000/websocket/web') => {
  const [connected, setConnected] = useState(false);
  const [agvStatuses, setAgvStatuses] = useState({});
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttemptsRef = useRef(5);
  const reconnectDelayRef = useRef(2000);

  // WebSocket 연결
  const connect = useCallback(() => {
    try {
      console.log('[WebSocket] Connecting to', serverUrl);
      wsRef.current = new WebSocket(serverUrl);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] ✅ Connected');
        setConnected(true);
        reconnectAttemptsRef.current = 0;
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('[WebSocket] Message:', msg.type);

          // 상태 메시지 처리
          if (msg.type === 'status') {
            const { agent_id, data } = msg;
            setAgvStatuses((prev) => ({
              ...prev,
              [agent_id]: {
                ...data,
                lastUpdate: new Date().toISOString(),
              },
            }));
          }

          // 시스템 메시지
          if (msg.type === 'system_info') {
            console.log('[WebSocket] System:', msg.data);
          }

          // 메시지 히스토리
          setMessages((prev) => [...prev.slice(-49), msg]);
        } catch (err) {
          console.error('[WebSocket] Message parse error:', err);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('[WebSocket] Error:', err);
        setError('WebSocket error');
      };

      wsRef.current.onclose = () => {
        console.warn('[WebSocket] Closed');
        setConnected(false);
        handleReconnect();
      };
    } catch (err) {
      console.error('[WebSocket] Connection failed:', err);
      setError(err.message);
      handleReconnect();
    }
  }, [serverUrl]);

  // 재연결 처리
  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
      reconnectAttemptsRef.current += 1;
      const delay = reconnectDelayRef.current * reconnectAttemptsRef.current;
      console.log(`[WebSocket] Reconnecting in ${delay}ms (${reconnectAttemptsRef.current}/${maxReconnectAttemptsRef.current})`);
      setTimeout(connect, delay);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
      setError('Connection failed after max retries');
    }
  }, [connect]);

  // 메시지 전송
  const sendMessage = useCallback((type, data = {}) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Not connected');
      return false;
    }

    try {
      const message = {
        type,
        data,
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(message));
      console.log('[WebSocket] Sent:', type);
      return true;
    } catch (err) {
      console.error('[WebSocket] Send failed:', err);
      return false;
    }
  }, []);

  // 목표 설정
  const setAGVGoal = useCallback((x, y, isEnemy = false) => {
    return sendMessage('set_goal', {
      target_pos: { x, y },
      is_enemy_goal: isEnemy,
    });
  }, [sendMessage]);

  // 모드 변경
  const changeAGVMode = useCallback((mode) => {
    return sendMessage('set_mode', { mode });
  }, [sendMessage]);

  // 정지
  const stopAGV = useCallback(() => {
    return sendMessage('stop');
  }, [sendMessage]);

  // 초기화
  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    connected,
    agvStatuses,
    error,
    messages,
    sendMessage,
    setAGVGoal,
    changeAGVMode,
    stopAGV,
    connect,
  };
};

export default useWebSocket;
