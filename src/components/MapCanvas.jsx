/**
 * Canvas 맵 - AGV 위치 렌더링
 */

import React, { useRef, useEffect, useState } from 'react';

const MapCanvas = ({ agvStatuses, selectedAGV, onMapClick }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  const CELL_SIZE = 20; // 픽셀
  const MAP_WIDTH = 30;  // 셀
  const MAP_HEIGHT = 20; // 셀

  // 월드 좌표 → 캔버스 좌표 변환
  const worldToCanvas = (x, y) => {
    return {
      canvasX: x * CELL_SIZE,
      canvasY: y * CELL_SIZE,
    };
  };

  // 캔버스 좌표 → 월드 좌표 변환
  const canvasToWorld = (canvasX, canvasY) => {
    return {
      x: Math.round(canvasX / CELL_SIZE),
      y: Math.round(canvasY / CELL_SIZE),
    };
  };

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 배경
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // 그리드
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= MAP_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, height);
      ctx.stroke();
    }
    for (let j = 0; j <= MAP_HEIGHT; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL_SIZE);
      ctx.lineTo(width, j * CELL_SIZE);
      ctx.stroke();
    }

    // 테두리
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // AGV 그리기
    Object.entries(agvStatuses).forEach(([id, status]) => {
      if (!status.position) return;

      const { canvasX, canvasY } = worldToCanvas(
        status.position.x,
        status.position.y
      );

      const isSelected = selectedAGV === id;
      const radius = 8;

      // 배경 원
      ctx.fillStyle = isSelected ? '#2563eb' : '#06b6d4';
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 선택 표시
      if (isSelected) {
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 방향 표시
      const angle = (status.position.angle || 0) * (Math.PI / 180);
      const arrowLength = 12;
      const arrowX = canvasX + Math.cos(angle) * arrowLength;
      const arrowY = canvasY + Math.sin(angle) * arrowLength;

      ctx.strokeStyle = isSelected ? '#1e40af' : '#0891b2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY);
      ctx.lineTo(arrowX, arrowY);
      ctx.stroke();

      // ID 라벨
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(id, canvasX, canvasY + radius + 12);
    });
  }, [agvStatuses, selectedAGV]);

  // 마우스 클릭
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const { x, y } = canvasToWorld(canvasX, canvasY);

    // 범위 체크
    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      console.log(`[MapCanvas] Goal set: (${x}, ${y})`);
      onMapClick(x, y);
    }
  };

  return (
    <div className="map-canvas-container">
      <div className="map-info">
        <h3>🗺️ Map</h3>
        <p className="map-hint">Click to set goal</p>
      </div>
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH * CELL_SIZE}
        height={MAP_HEIGHT * CELL_SIZE}
        onClick={handleCanvasClick}
        style={{
          border: '1px solid #999',
          cursor: 'crosshair',
          backgroundColor: '#fff',
        }}
      />
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-circle selected"></span>
          <span>Selected AGV</span>
        </div>
        <div className="legend-item">
          <span className="legend-circle unselected"></span>
          <span>Other AGV</span>
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
