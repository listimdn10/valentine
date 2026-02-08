import { useEffect, useRef } from "react";

export default function HeartCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 700);
    const height = (canvas.height = 700);

    const cx = width / 2;
    const cy = height / 2;
    const scale = 140;

    let t = 0;
    let progress = 0; // Tiến trình vẽ từ 0 đến 1

    function drawBackground() {
      // Gradient background
      const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, width/2);
      bgGradient.addColorStop(0, "#1a0a2e");
      bgGradient.addColorStop(0.5, "#16213e");
      bgGradient.addColorStop(1, "#0f3460");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawAxes() {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;

      // Ox
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(width - 20, cy);
      ctx.stroke();

      // Oy
      ctx.beginPath();
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, height - 20);
      ctx.stroke();

      // Labels với font đẹp hơn
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "bold 18px 'Courier New', monospace";
      ctx.fillText("x", width - 35, cy - 10);
      ctx.fillText("y", cx + 15, 35);
      ctx.fillText("O", cx + 10, cy + 20);

      // Vẽ các tick marks
      for (let i = -2; i <= 2; i++) {
        if (i !== 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.font = "12px 'Courier New', monospace";
          ctx.fillText(i.toString(), cx + i * scale - 5, cy + 20);
          ctx.fillText(i.toString(), cx + 10, cy - i * scale + 5);
        }
      }
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      for (let i = -5; i <= 5; i++) {
        // vertical
        ctx.beginPath();
        ctx.moveTo(cx + i * scale / 2, 0);
        ctx.lineTo(cx + i * scale / 2, height);
        ctx.stroke();

        // horizontal
        ctx.beginPath();
        ctx.moveTo(0, cy + i * scale / 2);
        ctx.lineTo(width, cy + i * scale / 2);
        ctx.stroke();
      }

      // Vẽ grid chính đậm hơn
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1.5;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * scale, 0);
        ctx.lineTo(cx + i * scale, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cy + i * scale);
        ctx.lineTo(width, cy + i * scale);
        ctx.stroke();
      }
    }

    function drawEquation() {
      // Vẽ công thức chính
      ctx.fillStyle = "#ff1493";
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ff1493";
      ctx.fillText("(x² + y² − 1)³ − x²y³ = 0", cx, 45);
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ff69b4";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("Phương trình trái tim Cartesian", cx, 70);
      
      // Hiển thị tham số
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "12px 'Courier New', monospace";
      ctx.fillText(`t = ${t.toFixed(2)} rad`, 20, height - 20);
      ctx.fillText(`progress = ${(progress * 100).toFixed(0)}%`, 20, height - 40);
    }

    function drawHeart() {
      // Tạo gradient cho trái tim
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.5);
      gradient.addColorStop(0, "#ff1493");
      gradient.addColorStop(0.5, "#ff69b4");
      gradient.addColorStop(1, "#ff85c0");

      const pulse = 1 + Math.sin(t * 2) * 0.1;

      // Vẽ trái tim với implicit equation - chỉ vẽ theo progress
      let pointsDrawn = 0;
      const totalPoints = [];
      
      // Thu thập tất cả các điểm trước
      for (let x = -1.5; x <= 1.5; x += 0.008) {
        for (let y = -1.5; y <= 1.5; y += 0.008) {
          const f = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);
          if (Math.abs(f) < 0.015) {
            // Tính góc từ tâm để vẽ theo chiều kim đồng hồ
            const angle = Math.atan2(-y, x);
            totalPoints.push({ x, y, angle });
          }
        }
      }

      // Sắp xếp các điểm theo góc để vẽ tuần tự
      totalPoints.sort((a, b) => b.angle - a.angle);
      
      // Chỉ vẽ số điểm theo progress
      const pointsToDraw = Math.floor(totalPoints.length * progress);
      
      for (let i = 0; i < pointsToDraw; i++) {
        const point = totalPoints[i];
        const screenX = cx + point.x * scale * pulse;
        const screenY = cy - point.y * scale * pulse;
        
        // Hiệu ứng đuôi - điểm mới vẽ sáng hơn
        const fadeRatio = i / pointsToDraw;
        const alpha = 0.3 + fadeRatio * 0.7;
        
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = i === pointsToDraw - 1 ? 25 : 10;
        ctx.shadowColor = "#ff1493";
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, i === pointsToDraw - 1 ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;

      // Vẽ thêm outline với parametric equation - cũng theo progress
      if (progress > 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff1493";
        ctx.strokeStyle = "#ff0080";
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const angleProgress = progress * Math.PI * 2;
        let started = false;
        
        for (let angle = 0; angle <= angleProgress; angle += 0.01) {
          const x = 16 * Math.pow(Math.sin(angle), 3);
          const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 
                    2 * Math.cos(3 * angle) - Math.cos(4 * angle);
          
          const screenX = cx + x * scale / 16 * pulse;
          const screenY = cy - y * scale / 16 * pulse;
          
          if (!started) {
            ctx.moveTo(screenX, screenY);
            started = true;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }
    }

    function animate() {
      drawBackground();
      drawGrid();
      drawAxes();
      drawHeart();
      drawEquation();

      t += 0.03;
      
      // Tăng progress để vẽ dần dần
      progress += 0.01;
      
      // Reset khi vẽ xong để lặp lại
      if (progress >= 1) {
        progress = 0;
      }
      
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ 
      display: 'inline-block', 
      position: 'relative',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(255, 20, 147, 0.4)',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          borderRadius: '20px',
          display: 'block'
        }} 
      />
    </div>
  );
}
