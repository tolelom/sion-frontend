/**
 * Canvas 맵 - AGV 위치, 맵 그리드, 장애물, 목표 렌더링
 */

import React, { useRef, useEffect, useState } from 'react';

const MapCanvas = ({ agvList, selectedAGV, onMapClick, mapData, goals }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [hoveredGoal, setHoveredGoal] = useState(null);

  // 기본값 (맵 데이터가 없을 때)
  const DEFAULT_CELL_SIZE = 20;
  const DEFAULT_MAP_WIDTH = 30;
  const DEFAULT_MAP_HEIGHT = 20;

  // 맵 데이터에서 가져오기
  const mapWidth = mapData?.width || DEFAULT_MAP_WIDTH;
  const mapHeight = mapData?.height || DEFAULT_MAP_HEIGHT;
  const cellSize = mapData?.cell_size || 0.5; // 미터 단위
  const obstacles = mapData?.obstacles || [];
  const mapGoals = goals || mapData?.goals || [];

  // 픽셀 변환 스케일 (1미터 = 20픽셀)
  const PIXELS_PER_METER = 20;

  // 월드 좌표 → 캔버스 좌표 변환
  const worldToCanvas = (x, y) => {
    return {
      canvasX: x * PIXELS_PER_METER,
      canvasY: y * PIXELS_PER_METER,
    };
  };

  // 캔버스 좌표 → 월드 좌표 변환
  const canvasToWorld = (canvasX, canvasY) => {
    return {
      x: canvasX / PIXELS_PER_METER,
      y: canvasY / PIXELS_PER_METER,
    };
  };

  // 캔버스 크기 업데이트
  useEffect(() => {
    const width = mapWidth * PIXELS_PER_METER;
    const height = mapHeight * PIXELS_PER_METER;
    setCanvasSize({ width, height });
  }, [mapWidth, mapHeight]);

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

    // 🗺️ 그리드 (1미터 간격)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= mapWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(i * PIXELS_PER_METER, 0);
      ctx.lineTo(i * PIXELS_PER_METER, height);
      ctx.stroke();
    }
    for (let j = 0; j <= mapHeight; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * PIXELS_PER_METER);
      ctx.lineTo(width, j * PIXELS_PER_METER);
      ctx.stroke();
    }

    // 🚧 장애물 렌더링
    obstacles.forEach((obstacle) => {
      const { canvasX, canvasY } = worldToCanvas(
        obstacle.position.x,
        obstacle.position.y
      );
      const radiusPixels = obstacle.radius * PIXELS_PER_METER;

      // 장애물 원형
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; // 빨간색 반투명
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radiusPixels, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 장애물 ID 표시
      ctx.fillStyle = '#7f1d1d';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obstacle.id || 'obstacle', canvasX, canvasY + 4);
    });

    // 🎯 목표 지점 렌더링
    mapGoals.forEach((goal) => {
      const { canvasX, canvasY } = worldToCanvas(
        goal.position.x,
        goal.position.y
      );
      const radiusPixels = (goal.radius || 0.5) * PIXELS_PER_METER;

      // 목표 영역 (초록색)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // 점선
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radiusPixels, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]); // 점선 해제

      // 목표 마커 (깃발)
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY - 15);
      ctx.lineTo(canvasX + 12, canvasY - 10);
      ctx.lineTo(canvasX, canvasY - 5);
      ctx.closePath();
      ctx.fill();

      // 깃대
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY - 15);
      ctx.lineTo(canvasX, canvasY + 5);
      ctx.stroke();

      // 목표 ID
      ctx.fillStyle = '#166534';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOAL', canvasX, canvasY + 18);

      // 상태 표시
      if (goal.status) {
        ctx.fillStyle = goal.status === 'completed' ? '#22c55e' : '#eab308';
        ctx.font = '9px sans-serif';
        ctx.fillText(goal.status, canvasX, canvasY + 28);
      }
    });

    // ★ AGV 그리기
    if (Array.isArray(agvList)) {
      agvList.forEach((agv) => {
        if (!agv.position) {
          console.warn('[MapCanvas] AGV has no position:', agv.id || agv.agent_id);
          return;
        }

        const agvId = agv.id || agv.agent_id;
        const { canvasX, canvasY } = worldToCanvas(
          agv.position.x,
          agv.position.y
        );

        const isSelected = selectedAGV === agvId;
        const radius = 10;

        // AGV 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(canvasX + 2, canvasY + 2, radius, 0, Math.PI * 2);
        ctx.fill();

        // AGV 배경 원
        ctx.fillStyle = isSelected ? '#2563eb' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        ctx.fill();

        // 선택 표시
        if (isSelected) {
          ctx.strokeStyle = '#1e40af';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 방향 표시 (화살표)
        const angle = (agv.position.angle || 0);
        const arrowLength = 16;
        const arrowX = canvasX + Math.cos(angle) * arrowLength;
        const arrowY = canvasY + Math.sin(angle) * arrowLength;

        ctx.strokeStyle = isSelected ? '#1e40af' : '#0891b2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY);
        ctx.lineTo(arrowX, arrowY);
        ctx.stroke();

        // 화살표 끝
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
        ctx.fill();

        // ID 라벨
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(agvId.slice(0, 4), canvasX, canvasY);

        // AGV 이름 (하단)
        ctx.fillStyle = '#000';
        ctx.font = '10px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(agv.name || agvId, canvasX, canvasY + radius + 8);
      });
    }

    // 테두리
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  }, [agvList, selectedAGV, obstacles, mapGoals, mapWidth, mapHeight]);

  // 마우스 클릭 - 목표 설정
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const { x, y } = canvasToWorld(canvasX, canvasY);

    // 범위 체크
    if (x >= 0 && x <= mapWidth && y >= 0 && y <= mapHeight) {
      console.log(`[MapCanvas] Goal set: (${x.toFixed(2)}, ${y.toFixed(2)})`);
      if (onMapClick) {
        onMapClick(x, y);
      }
    }
  };

  return (
    <div className="map-canvas-container">
      <div className="map-info">
        <h3>🗺️ Virtual Map</h3>
        <div className="map-stats">
          <span className="stat-item">📏 {mapWidth}m × {mapHeight}m</span>
          <span className="stat-item">🚧 {obstacles.length} obstacles</span>
          <span className="stat-item">🎯 {mapGoals.length} goals</span>
          <span className="stat-item">🤖 {agvList?.length || 0} AGVs</span>
        </div>
        <p className="map-hint">💡 Click on map to set goal position</p>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        style={{
          border: '2px solid #333',
          cursor: 'crosshair',
          backgroundColor: '#fff',
          borderRadius: '4px',
        }}
      />
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#2563eb' }}></span>
          <span>Selected AGV</span>
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#06b6d4' }}></span>
          <span>Other AGV</span>
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#ef4444', opacity: 0.5 }}></span>
          <span>Obstacle</span>
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ backgroundColor: '#22c55e', opacity: 0.3 }}></span>
          <span>Goal Area</span>
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
