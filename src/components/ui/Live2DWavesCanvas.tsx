import React, { useEffect, useRef } from 'react';

interface WaveConfig {
  freq: number;
  amp: number;
  speed: number;
  colorLight: string;
  colorDark: string;
  width: number;
}

interface Live2DWavesCanvasProps {
  className?: string;
  waveCount?: number;
  interactive?: boolean;
  verticalBaseStart?: number;
  verticalBaseStep?: number;
}

const DEFAULT_WAVES: WaveConfig[] = [
  { freq: 0.007, amp: 55, speed: 0.022, colorLight: 'rgba(37, 99, 235, 0.35)', colorDark: 'rgba(59, 130, 246, 0.45)', width: 2.2 },
  { freq: 0.013, amp: 38, speed: 0.016, colorLight: 'rgba(99, 102, 241, 0.30)', colorDark: 'rgba(129, 140, 248, 0.40)', width: 1.6 },
  { freq: 0.004, amp: 72, speed: 0.010, colorLight: 'rgba(139, 92, 246, 0.25)', colorDark: 'rgba(168, 85, 247, 0.35)', width: 2.6 },
  { freq: 0.019, amp: 24, speed: 0.032, colorLight: 'rgba(6, 182, 212, 0.28)', colorDark: 'rgba(34, 211, 238, 0.38)', width: 1.2 },
  { freq: 0.011, amp: 44, speed: 0.018, colorLight: 'rgba(236, 72, 153, 0.20)', colorDark: 'rgba(244, 114, 182, 0.30)', width: 1.5 }
];

export const Live2DWavesCanvas: React.FC<Live2DWavesCanvasProps> = ({
  className = 'absolute inset-0 pointer-events-none z-0',
  waveCount = 5,
  interactive = true,
  verticalBaseStart = 0.30,
  verticalBaseStep = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let step = 0;

    let mouseOffset = 0;
    let targetOffset = 0;

    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      targetOffset = (x - 0.5) * 2.0;
    };

    const handleMouseLeave = () => {
      targetOffset = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !canvas) return;
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      targetOffset = (x - 0.5) * 2.0;
    };

    const handleTouchEnd = () => {
      targetOffset = 0;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
    }

    const wavesToRender = DEFAULT_WAVES.slice(0, Math.min(waveCount, DEFAULT_WAVES.length));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const centerY = height * (verticalBaseStart ?? 0.5);

      // Smooth mouse lerp physics
      mouseOffset += (targetOffset - mouseOffset) * 0.045;

      // Draw each frequency wave with sine interference & wave superposition
      wavesToRender.forEach((wave, idx) => {
        ctx.beginPath();
        ctx.lineWidth = wave.width;
        ctx.strokeStyle = isDark ? wave.colorDark : wave.colorLight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const phaseShift = mouseOffset * (0.35 + idx * 0.10);
        const yOffset = idx * (verticalBaseStep ? height * verticalBaseStep : 0);

        for (let x = 0; x <= width; x += 3) {
          // Primary + harmonic overtones for rich wave curve
          const y =
            centerY +
            yOffset +
            Math.sin(x * wave.freq + step * wave.speed + phaseShift) * wave.amp +
            Math.sin(x * wave.freq * 0.5 + step * wave.speed * 0.65 + phaseShift * 0.45) * wave.amp * 0.35 +
            Math.sin(x * wave.freq * 0.22 + step * wave.speed * 0.28 + phaseShift * 0.18) * wave.amp * 0.12;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Subtle glow accent
      const glowX = width * 0.25 + Math.sin(step * 0.004) * width * 0.2;
      const glowY = height * 0.35 + Math.cos(step * 0.003) * height * 0.12;
      const grad = ctx.createRadialGradient(glowX, glowY, 8, glowX, glowY, Math.min(width, height) * 0.4);

      if (isDark) {
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      } else {
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.05)');
        grad.addColorStop(1, 'rgba(248, 250, 255, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      step += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [waveCount, interactive, verticalBaseStart, verticalBaseStep]);

  return <canvas ref={canvasRef} className={className} />;
};

