import React from 'react';

const Header = ({ isConnected, agvId }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">⚠️ SION</div>
        <div className="header-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'CONNECTED' : 'OFFLINE'}</span>
        </div>
      </div>
      
      <div className="header-right">
        <div>AGV: {agvId}</div>
      </div>
    </header>
  );
};

export default Header;
