/**
 * WebSocket 훅 - AGV 대시보드용
 * 
 * 기능:
 * - WebSocket 연결/재연결
 * - AGV 상태 수신
 * - 맵 데이터 수신
 * - 목표 설정
 * - 명령 전송
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const useWebSocket = (serverUrl = 'ws://tolelom.xyz:3000/websocket/web') => {
  const [connected, setConnected] = useState(false);
  const [agvList, setAgvList] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [systemReady, setSystemReady] = useState(false);
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

          // ★ AGV 상태 업데이트
          if (msg.type === 'agv_status_update') {
            console.log('[WebSocket] AGV statuses update received:', msg.data.agvs);
            if (msg.data && Array.isArray(msg.data.agvs)) {
              setAgvList(msg.data.agvs);
              console.log('[WebSocket] Updated AGV list:', msg.data.agvs.length, 'AGVs');
            }
          }

          // 🗺️ 맵 데이터 업데이트
          if (msg.type === 'map_grid') {
            console.log('[WebSocket] Map data received:', msg.data);
            setMapData({
              width: msg.data.width,
              height: msg.data.height,
              cell_size: msg.data.cell_size,
              obstacles: msg.data.obstacles || [],
            });
          }

          // 🎯 목표 설정
          if (msg.type === 'goal_set') {
            console.log('[WebSocket] Goal set:', msg.data);
            setGoals((prev) => {
              const goalId = msg.data.goal_id || `goal_${Date.now()}`;
              const existingIndex = prev.findIndex(g => g.id === goalId);
              
              const newGoal = {
                id: goalId,
                position: msg.data.position,
                radius: msg.data.radius || 0.5,
                status: msg.data.status || 'active',
              };

              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newGoal;
                return updated;
              }
              return [...prev, newGoal];
            });
          }

          // 🎮 맵 생성 완료
          if (msg.type === 'map_generated') {
            console.log('[WebSocket] Map generated successfully');
          }

          // ✅ 시스템 준비 완료
          if (msg.type === 'system_ready') {
            console.log('[WebSocket] System ready');
            setSystemReady(true);
          }

          // 기존 status 메시지 (호환성)
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

  // 🎯 목표 설정 (WebSocket 방식)
  const setAGVGoal = useCallback((x, y, isEnemy = false) => {
    return sendMessage('set_goal', {
      target_pos: { x, y },
      is_enemy_goal: isEnemy,
    });
  }, [sendMessage]);

  // 🎯 목표 설정 (REST API 방식)
  const setMapGoal = useCallback(async (x, y, radius = 0.5) => {
    try {
      const response = await fetch('http://tolelom.xyz:3000/api/map/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position: { x, y },
          radius,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('[API] Goal set successfully:', result);
      return true;
    } catch (err) {
      console.error('[API] Failed to set goal:', err);
      setError(`Failed to set goal: ${err.message}`);
      return false;
    }
  }, []);

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
    agvList,
    mapData,
    goals,
    systemReady,
    error,
    messages,
    sendMessage,
    setAGVGoal,
    setMapGoal,
    changeAGVMode,
    stopAGV,
    connect,
  };
};

export default useWebSocket;
