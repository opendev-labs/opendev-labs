import React, { useEffect, useRef } from 'react';

interface WhiteLedUnderglowProps {
  className?: string;
}

/**
 * 💡 WHITE LED UNDERGLOW
 * Simulates a high-intensity pure white LED light bar mounted directly under the input section.
 * Casts a crisp, radiant white downlight and specular hotspot on the pitch-black surface,
 * dynamically reacting and gliding with the user's mouse position.
 */
export const WhiteLedUnderglow: React.FC<WhiteLedUnderglowProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Hotspot X tracking mouse relative to input box
    let currentX = 0;
    let targetX = 0;
    let mouseProximity = 0.5;
    let isHovering = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentX === 0) {
        currentX = width / 2;
        targetX = width / 2;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      // Mouse X relative to this underglow container
      const relX = e.clientX - rect.left;
      targetX = Math.max(20, Math.min(width - 20, relX));

      // Calculate distance to input section for intensity flare
      const distY = Math.abs(e.clientY - rect.top);
      const distX = Math.max(0, Math.abs(e.clientX - (rect.left + rect.width / 2)) - rect.width / 2);
      const dist = Math.hypot(distX, distY);

      mouseProximity = Math.max(0.3, Math.min(1.0, 1 - dist / 500));
      isHovering = dist < 220;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.03;

      // Smooth lerp to mouse hotspot
      currentX += (targetX - currentX) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Idle breathing pulse
      const pulse = Math.sin(time) * 0.08;
      const intensity = Math.min(1.0, mouseProximity + pulse);

      // 1. BROAD DOWNWARD RADIANT WHITE LED CONE CAST ONTO PITCH BLACK FLOOR
      const coneGrad = ctx.createRadialGradient(
        currentX,
        4,
        0,
        currentX,
        35,
        Math.min(width * 0.55, 360)
      );
      coneGrad.addColorStop(0, `rgba(255, 255, 255, ${0.42 * intensity})`);
      coneGrad.addColorStop(0.18, `rgba(255, 255, 255, ${0.28 * intensity})`);
      coneGrad.addColorStop(0.45, `rgba(255, 255, 255, ${0.12 * intensity})`);
      coneGrad.addColorStop(0.80, `rgba(255, 255, 255, ${0.03 * intensity})`);
      coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = coneGrad;
      // Draw downward expanding light trapezoid/ellipse
      ctx.beginPath();
      ctx.ellipse(currentX, 45, Math.min(width * 0.52, 340), 55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. HORIZONTAL WIDE UNDER-EDGE DIFFUSION (Spans the entire bottom seam)
      const seamGrad = ctx.createLinearGradient(0, 0, width, 0);
      seamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      seamGrad.addColorStop(0.15, `rgba(255, 255, 255, ${0.15 * intensity})`);
      seamGrad.addColorStop(currentX / width, `rgba(255, 255, 255, ${0.75 * intensity})`);
      seamGrad.addColorStop(0.85, `rgba(255, 255, 255, ${0.15 * intensity})`);
      seamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.save();
      ctx.fillStyle = seamGrad;
      // Soft vertical blur under edge
      ctx.fillRect(0, 0, width, 18);
      ctx.restore();

      // 3. INTENSE WHITE LED HOTSPOT CORE (Directly at current mouse X)
      const spotGrad = ctx.createRadialGradient(
        currentX,
        1,
        0,
        currentX,
        1,
        isHovering ? 130 : 90
      );
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      spotGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.70)');
      spotGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(currentX, 1, isHovering ? 130 : 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. RAZOR-SHARP WHITE LED EMITTER LINE ALONG SEAM
      const lineGrad = ctx.createLinearGradient(
        Math.max(0, currentX - 160),
        0,
        Math.min(width, currentX + 160),
        0
      );
      lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      lineGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
      lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      lineGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.7)');
      lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.save();
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, currentX - 160), 1);
      ctx.lineTo(Math.min(width, currentX + 160), 1);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute -bottom-16 left-0 right-0 h-28 pointer-events-none overflow-visible z-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        style={{
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};
