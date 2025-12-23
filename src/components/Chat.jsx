import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: '⚡ Sion AI System Initialized' },
    { id: 2, type: 'ai', text: '안녕하세요. 저는 사이온(Sion) AI 전술 시스템입니다. 어떻게 도와드릴까요?' },
    { id: 3, type: 'user', text: '현재 상황을 분석해줘' },
    { id: 4, type: 'ai', text: '분석 중... 👁️\n\n현재 3개의 적 목표를 감지했습니다.\n거리: 150m, 280m, 420m\n전술 권장사항: 방어 태세 유지' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [
      ...messages,
      { id: messages.length + 1, type: 'user', text: input },
    ];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '상황을 계속 모니터링 중입니다. 모든 시스템이 정상입니다.',
        '현재 전술 데이터를 분석했습니다. 추가 정보가 필요하신가요?',
        '확인했습니다. 다음 조치를 권장합니다:',
        '🎯 목표 설정 완료. 실행을 준비 중입니다.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, type: 'ai', text: randomResponse },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Commentary Panel */}
      <div className="commentary-panel-container">
        <div className="commentary-panel">
          {messages.map((msg) => (
            <div key={msg.id} className={`commentary-item ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
