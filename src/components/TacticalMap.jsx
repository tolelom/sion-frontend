import React, { useEffect, useRef } from 'react';

const TacticalMap = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f1a35';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.2)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let i = 0; i <= width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw center point (Sion position)
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw Sion (player)
    ctx.fillStyle = '#0099ff';
    ctx.shadowColor = 'rgba(0, 153, 255, 0.6)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw direction indicator
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 30, centerY - 20);
    ctx.stroke();

    // Draw some dummy enemies
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = 'rgba(255, 0, 85, 0.6)';
    const enemies = [
      { x: centerX + 80, y: centerY - 60 },
      { x: centerX - 100, y: centerY + 50 },
      { x: centerX + 120, y: centerY + 80 },
    ];

    enemies.forEach((enemy) => {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw some obstacles
    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.fillRect(centerX - 150, centerY - 100, 60, 60);
    ctx.fillRect(centerX + 100, centerY, 50, 80);

    ctx.shadowColor = 'transparent';
  }, []);

  return (
    <div className="panel tactical-map">
      <div className="panel-header">
        <h3>🗺️ 전술 맵</h3>
      </div>

      <div className="map-container">
        <canvas
          ref={canvasRef}
          className="map-canvas"
          width={400}
          height={400}
        />
      </div>

      <div className="map-info">
        <div>👁 ⬭ X: 1240 Y: 560</div>
        <div>🔍 Zoom: 1.0x</div>
      </div>
    </div>
  );
};

export default TacticalMap;
