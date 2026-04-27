import { useEffect, useRef } from 'react';

import { useStore } from '../../store';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentColor = useStore(s => s.accentColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const dotGap = 20;

    // Pulse class to manage "energy" moving through the grid
    class Pulse {
      x!: number;
      y!: number;
      history: { x: number, y: number }[];
      vx!: number;
      vy!: number;
      life!: number;
      maxLife!: number;
      speed!: number;

      constructor() {
        this.history = [];
        this.reset();
      }

      reset() {
        this.x = Math.floor(Math.random() * (width / dotGap)) * dotGap;
        this.y = Math.floor(Math.random() * (height / dotGap)) * dotGap;
        this.speed = dotGap / 6;
        
        // Randomly choose fixed axis: Horizontal or Vertical
        const isHorizontal = Math.random() > 0.5;
        if (isHorizontal) {
          this.vx = Math.random() > 0.5 ? this.speed : -this.speed;
          this.vy = 0;
        } else {
          this.vx = 0;
          this.vy = Math.random() > 0.5 ? this.speed : -this.speed;
        }
        
        this.maxLife = 300 + Math.random() * 300; // Longer life for continuous feel
        this.life = this.maxLife;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Fluid opacity: Fade in at start, fade out at end (Bell curve)
        const progress = 1 - (this.life / this.maxLife);
        const fluidOpacity = Math.sin(progress * Math.PI) * 0.7;

        ctx.shadowBlur = 20;
        ctx.shadowColor = accentColor;
        ctx.fillStyle = accentColor;

        // Larger radius to light up more dots per group
        const radius = dotGap * 3.5; 
        const startX = Math.floor((this.x - radius) / dotGap) * dotGap;
        const endX = Math.ceil((this.x + radius) / dotGap) * dotGap;
        const startY = Math.floor((this.y - radius) / dotGap) * dotGap;
        const endY = Math.ceil((this.y + radius) / dotGap) * dotGap;

        for (let gx = startX; gx <= endX; gx += dotGap) {
          for (let gy = startY; gy <= endY; gy += dotGap) {
            const dx = gx - this.x;
            const dy = gy - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < radius) {
              const dotAlpha = Math.pow(1 - dist / radius, 2) * fluidOpacity;
              ctx.globalAlpha = dotAlpha;
              ctx.beginPath();
              ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
    }

    const pulses = [...Array(5)].map(() => new Pulse());

    const render = () => {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, width, height);

      // Draw Base Grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let x = 0; x < width; x += dotGap) {
        for (let y = 0; y < height; y += dotGap) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Glowing Pulses
      pulses.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0, pointerEvents: 'none',
        background: '#0a0a0a'
      }}
    />
  );
};
