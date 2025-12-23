import React, { useEffect, useRef } from 'react';
import '../../styles/TacticalMap.css';

const TacticalMap = ({ mapData, agvPosition, agvMode, detectedEnemies, onCellClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / mapData.width;

    // 배경 그리기
    ctx.fillStyle = '#0f1a35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 그리드 그리기
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= mapData.width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j <= mapData.height; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * cellSize);
      ctx.lineTo(canvas.width, j * cellSize);
      ctx.stroke();
    }

    // 장애물 그리기
    ctx.fillStyle = '#ff3333';
    mapData.obstacles?.forEach(obstacle => {
      ctx.fillRect(
        obstacle.x * cellSize,
        obstacle.y * cellSize,
        cellSize,
        cellSize
      );
    });

    // AGV 그리기 (파란색 원)
    ctx.fillStyle = '#0099ff';
    ctx.beginPath();
    ctx.arc(
      (agvPosition.x + 0.5) * cellSize,
      (agvPosition.y + 0.5) * cellSize,
      cellSize * 0.3,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // 적 그리기 (빠간색 별)
    detectedEnemies?.forEach(enemy => {
      ctx.fillStyle = '#ff6666';
      ctx.beginPath();
      const ex = (enemy.x + 0.5) * cellSize;
      const ey = (enemy.y + 0.5) * cellSize;
      const r = cellSize * 0.2;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const x = ex + r * Math.cos(angle);
        const y = ey + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    });
  }, [mapData, agvPosition, detectedEnemies]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (canvas.width / mapData.width));
    const y = Math.floor((e.clientY - rect.top) / (canvas.height / mapData.height));
    
    if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) {
      onCellClick(x, y);
    }
  };

  return (
    <div className="panel tactical-map">
      <div className="panel-header">
        <h3>🗺️ 전술 맵</h3>
      </div>
      <div className="map-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="map-canvas"
          onClick={handleCanvasClick}
        />
      </div>
      <div className="map-info">
        <div>위치: ({agvPosition.x.toFixed(1)}, {agvPosition.y.toFixed(1)})</div>
        <div>적: {detectedEnemies?.length || 0}</div>
      </div>
    </div>
  );
};

export default TacticalMap;
