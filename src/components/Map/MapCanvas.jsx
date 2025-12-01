import {useRef, useEffect} from "react";

const MapCanvas = ({agvPosition, targets, onMapClick}) => {
    const canvasRef = useRef(null);

    const MAP_SIZE = 20; // 20m * 20m
    const CELL_SIZE = 30; // pixel

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStype = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 격자 그리기
        drawGrid(ctx, width, height);

        // 좌표 라벨
        drawLabels(ctx, width, height);

        // 목표물 그리기
        if (targets && targets.length > 0) {
            targets.forEach(target => {
                drawTarget(ctx, target);
            });
        }

        // agv 그리기
        if (agvPosition) {
            drawAGV(ctx, agvPosition);
        }

    }, [agvPosition, targets]);

    // 격자 그리는 함수
    const drawGrid = (ctx, width, height) => {
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;

        for (let i = 0; i <= MAP_SIZE; i++) {
            const x = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let i = 0; i <= MAP_SIZE; i++) {
            const y = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    };

    // 좌표 라벨 그리기
    const drawLabels = (ctx, width, height) => {
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        for (let i = 0; i <= MAP_SIZE; i += 5) {
            const x = i * CELL_SIZE;
            ctx.fillText(i + 'm', x, height - 5);
        }

        ctx.textAlign = 'right';
        for (let i = 0; i <= MAP_SIZE; i += 5) {
            const y = height - i * CELL_SIZE;
            ctx.fillText(i + 'm', 25, y);
        }
    };

    // AGV 그리기
    const drawAGV = (ctx, position) => {
        const x = position.x * CELL_SIZE;
        const y = (MAP_SIZE - position.y) / CELL_SIZE;

        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();

        // 방향 표시
        const angle = (position.angle || 0) * Math.PI / 180;
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * 20,
            y + Math.sin(angle) * 20,
        );
        ctx.stroke();

        // 라벨
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AGV', x, y - 25);
    };

    // 목표물 그리기
    const drawTarget = (ctx, target) => {
        const x = target.x * CELL_SIZE;
        const y = (MAP_SIZE - target.y) / CELL_SIZE;

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 라벨
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('아리', x, y + 25);
    };

    // 캔버스 클릭 핸들러
    const handleCanvasClick = e => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const mapX = x / CELL_SIZE;
        const mapY = MAP_SIZE - y / CELL_SIZE;

        if (onMapClick) {
            onMapClick({x: mapX, y: mapY});
        }
    };

    return (
        <div className="map-container">
            <canvas
                ref={canvasRef}
                width={MAP_SIZE * CELL_SIZE}
                height={MAP_SIZE * CELL_SIZE}
                onClick={handleCanvasClick}
                className="map-canvas"
            />
        </div>
    );
};

export default MapCanvas;