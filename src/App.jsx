import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import TacticalMap from './components/TacticalMap';
import StatusPanel from './components/StatusPanel';
import Chat from './components/Chat';

// Import all stylesheets
import './styles/LoLTheme.css';
import './styles/Header.css';
import './styles/ControlPanel.css';
import './styles/TacticalMap.css';
import './styles/StatusPanel.css';
import './styles/Chat.css';
import './styles/SionCharacter.css';

function App() {
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const [selectedMode, setSelectedMode] = useState('AUTO');

  useEffect(() => {
    // System initialization
    console.log('🤖 Sion AI System Initialized');
  }, []);

  return (
    <div className="app lol-theme">
      {/* Grid Background Effect */}
      <div className="grid-background"></div>

      {/* Header with Sion Portrait */}
      <Header />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Panel - Control */}
        <div className="left-panel">
          <ControlPanel />
        </div>

        {/* Center Panel - Tactical Map */}
        <div className="center-panel">
          <TacticalMap />
        </div>

        {/* Right Panel - Status */}
        <div className="right-panel">
          <StatusPanel />
        </div>
      </div>

      {/* Chat Section */}
      <Chat />
    </div>
  );
}

export default App;
