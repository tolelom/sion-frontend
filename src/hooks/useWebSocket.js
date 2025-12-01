import {useState, useEffect, useRef, useCallback} from "react";

export const useWebSocket = (url) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const webSocketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        const connect = () => {
            // 이미 연결 중이면 중단
            if (webSocketRef.current?.readyState === WebSocket.OPEN ||
                webSocketRef.current?.readyState === WebSocket.CONNECTING) {
                return;
            }

            try {
                console.log('🔌 WebSocket 연결 시도:', url);
                const ws = new WebSocket(url);
                webSocketRef.current = ws;

                ws.onopen = () => {
                    console.log('✅ WebSocket 연결 성공');
                    setIsConnected(true);

                    // 재연결 타임아웃 클리어
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                        reconnectTimeoutRef.current = null;
                    }
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('📩 수신:', data);
                        setLastMessage(data);
                    } catch (error) {
                        console.error('메시지 파싱 오류:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('❌ WebSocket 에러:', error);
                };

                ws.onclose = (event) => {
                    console.log('❌ WebSocket 연결 종료:', event.code, event.reason);
                    setIsConnected(false);
                    webSocketRef.current = null;

                    // 컴포넌트가 마운트되어 있을 때만 재연결
                    if (mountedRef.current && !reconnectTimeoutRef.current) {
                        reconnectTimeoutRef.current = setTimeout(() => {
                            reconnectTimeoutRef.current = null;
                            console.log('🔄 재연결 시도...');
                            connect();
                        }, 3000);
                    }
                };

            } catch (error) {
                console.error('WebSocket 생성 실패:', error);
                setIsConnected(false);

                // 재연결 시도
                if (mountedRef.current && !reconnectTimeoutRef.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectTimeoutRef.current = null;
                        console.log('🔄 재연결 시도...');
                        connect();
                    }, 3000);
                }
            }
        };

        // 첫 연결
        connect();

        // 클린업
        return () => {
            mountedRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
        };
    }, [url]); // url만 의존성

    const sendMessage = useCallback((message) => {
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message));
            console.log('📤 전송:', message);
            return true;
        }

        console.warn('⚠️ WebSocket 연결되지 않음');
        return false;
    }, []);

    return {
        isConnected,
        lastMessage,
        sendMessage,
    };
};
