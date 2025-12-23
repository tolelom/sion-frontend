import React, { useState } from 'react';
import '../../styles/Chat.css';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form className="chat-input-wrapper" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="메시지를 입력하세요... (Enter로 전송)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button type="submit" className="btn btn-primary">
        전송
      </button>
    </form>
  );
};

export default ChatInput;
