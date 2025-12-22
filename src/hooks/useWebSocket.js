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
  const [agvList, setAgvList] = useState([]);
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
          console.log('[WebSocket] Message received:', msg.type, msg.data);

          // ★ 핵심: Go 백엔드에서 보내는 "agv_status_update" 메시지 처리
          if (msg.type === 'agv_status_update') {
            console.log('[WebSocket] AGV statuses update received:', msg.data.agvs);
            if (msg.data && Array.isArray(msg.data.agvs)) {
              setAgvList(msg.data.agvs);
              console.log('[WebSocket] Updated AGV list:', msg.data.agvs.length, 'AGVs');
            }
          }

          // 기존 status 메시지도 지원 (호환성)
          if (msg.type === 'status') {
            const { agent_id, data } = msg;
            setAgvList((prev) => {
              const existing = prev.find(a => a.id === agent_id);
              if (existing) {
                return prev.map(a => a.id === agent_id ? { ...a, ...data } : a);
              }
              return [...prev, { id: agent_id, ...data }];
            });
          }

          // 시스템 메시지
          if (msg.type === 'system_info') {
            console.log('[WebSocket] System info:', msg.data);
            if (msg.data.event === 'agv_registered') {
              console.log('[WebSocket] AGV registered:', msg.data.agv_id);
            }
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
    agvList,           // ← 이름 변경: agvStatuses → agvList
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
