import {useRef, useEffect, useState} from "react";

const MapCanvas = ({agvPosition, targets, path, onMapClick}) => {
    const canvasRef = useRef(null);
    const [hoveredCell, setHoveredCell] = useState(null);

    const MAP_SIZE = 20; // 20m x 20m
    const CELL_SIZE = 30; // pixel per meter
    const CANVAS_WIDTH = MAP_SIZE * CELL_SIZE;
    const CANVAS_HEIGHT = MAP_SIZE * CELL_SIZE;

    // 격자 그리기
    const drawGrid = (ctx) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= MAP_SIZE; i++) {
            const x = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= MAP_SIZE; i++) {
            const y = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // Major grid lines (every 5m)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        for (let i = 0; i <= MAP_SIZE; i += 5) {
            const x = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();

            const y = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
    };

    // 좌표 라벨
    const drawCoordinates = (ctx) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';

        // X axis
        for (let i = 0; i <= MAP_SIZE; i += 5) {
            const x = i * CELL_SIZE;
            ctx.fillText(`${i}m`, x, CANVAS_HEIGHT - 8);
        }

        // Y axis
        ctx.textAlign = 'right';
        for (let i = 0; i <= MAP_SIZE; i += 5) {
            const y = CANVAS_HEIGHT - i * CELL_SIZE;
            ctx.fillText(`${i}m`, 25, y + 4);
        }
    };

    // 경로 그리기
    const drawPath = (ctx, pathPoints) => {
        if (pathPoints.length < 2) return;

        ctx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        pathPoints.forEach((point, index) => {
            const x = point.x * CELL_SIZE;
            const y = (MAP_SIZE - point.y) * CELL_SIZE;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // 목표 지점 표시
        const lastPoint = pathPoints[pathPoints.length - 1];
        const targetX = lastPoint.x * CELL_SIZE;
        const targetY = (MAP_SIZE - lastPoint.y) * CELL_SIZE;

        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 20, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    // 체력 바 그리기
    const drawHealthBar = (ctx, x, y, hp) => {
        const barWidth = 40;
        const barHeight = 5;

        // 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

        // HP
        const hpColor = hp > 50 ? '#2ecc71' : hp > 25 ? '#f39c12' : '#e74c3c';
        ctx.fillStyle = hpColor;
        ctx.fillRect(x - barWidth / 2, y, (barWidth * hp) / 100, barHeight);

        // 테두리
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
    };

    // AGV 그리기
    const drawAGV = (ctx, position) => {
        const x = position.x * CELL_SIZE;
        const y = (MAP_SIZE - position.y) * CELL_SIZE;
        const angle = position.angle || 0;

        // AGV 본체 (파란색 원)
        ctx.fillStyle = '#3498db';
        ctx.shadowColor = 'rgba(52, 152, 219, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // AGV 테두리
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 방향 화살표
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const arrowLength = 15;
        const arrowX = x + Math.cos(angle) * arrowLength;
        const arrowY = y + Math.sin(angle) * arrowLength;

        ctx.moveTo(x, y);
        ctx.lineTo(arrowX, arrowY);
        ctx.stroke();

        // 화살표 머리
        const arrowHeadSize = 6;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
            arrowX - Math.cos(angle - Math.PI / 6) * arrowHeadSize,
            arrowY - Math.sin(angle - Math.PI / 6) * arrowHeadSize
        );
        ctx.lineTo(
            arrowX - Math.cos(angle + Math.PI / 6) * arrowHeadSize,
            arrowY - Math.sin(angle + Math.PI / 6) * arrowHeadSize
        );
        ctx.closePath();
        ctx.fill();

        // AGV 라벨
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AGV', x, y - 28);

        // 좌표 표시
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(
            `(${position.x.toFixed(1)}, ${position.y.toFixed(1)})`,
            x,
            y + 35
        );
    };

    // 적(아리) 그리기
    const drawTarget = (ctx, target) => {
        const x = target.x * CELL_SIZE;
        const y = (MAP_SIZE - target.y) * CELL_SIZE;

        // 타겟 본체 (빨간색 원)
        ctx.fillStyle = '#e74c3c';
        ctx.shadowColor = 'rgba(231, 76, 60, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 테두리
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 십자 표시
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 8, y);
        ctx.lineTo(x + 8, y);
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x, y + 8);
        ctx.stroke();

        // 라벨
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(target.name || '아리', x, y + 30);

        // HP 바 (옵션)
        if (target.hp !== undefined) {
            drawHealthBar(ctx, x, y - 25, target.hp);
        }
    };

    // 호버 셀 하이라이트
    const drawHoveredCell = (ctx, cell) => {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fillRect(
            cell.x * CELL_SIZE,
            cell.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        ctx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            cell.x * CELL_SIZE,
            cell.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Background
        ctx.fillStyle = '#1a1d23';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid
        drawGrid(ctx);

        // Coordinates
        drawCoordinates(ctx);

        // Path (if exists)
        if (path && path.length > 0) {
            drawPath(ctx, path);
        }

        // Targets
        if (targets && targets.length > 0) {
            targets.forEach(target => {
                drawTarget(ctx, target);
            });
        }

        // AGV
        if (agvPosition) {
            drawAGV(ctx, agvPosition);
        }

        // Hovered cell highlight
        if (hoveredCell) {
            drawHoveredCell(ctx, hoveredCell);
        }

    }, [agvPosition, targets, path, hoveredCell]);

    // 마우스 호버
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        setHoveredCell({x, y});
    };

    // 마우스 나가기
    const handleMouseLeave = () => {
        setHoveredCell(null);
    };

    // 캔버스 클릭
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX - rect.left) / CELL_SIZE;
        const y = MAP_SIZE - (e.clientY - rect.top) / CELL_SIZE;

        if (onMapClick) {
            onMapClick({x, y});
        }
    };

    return (
        <div className="map-container" style={{
            background: '#0f1115',
            borderRadius: '12px',
            padding: '20px',
            display: 'inline-block'
        }}>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    cursor: 'crosshair',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
            />
        </div>
    );
};

export default MapCanvas;
