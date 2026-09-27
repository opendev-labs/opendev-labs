import React, { useEffect, useRef } from 'react';

interface Live2DMonochromeLightCanvasProps {
  className?: string;
}

/**
 * 🌑 LIVE 2D PITCH-BLACK VOID WITH WHITE RGB/LED LIGHT
 * Pure pitch black (#000000) canvas background with a radiant, crisp white LED light
 * radiating from directly behind and under the input section.
 * Does NOT wash out the screen with grey; retains deep pitch-black shadows.
 */
export const Live2DMonochromeLightCanvas: React.FC<Live2DMonochromeLightCanvasProps> = ({
  className = 'absolute inset-0 pointer-events-none z-0',
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
    let time = 0;

    // Mouse coordinates with smooth interpolation
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      isMouseActive = true;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic wave ribbons positioned tightly behind the input section
    const waves = [
      { freq: 0.0035, amp: 30, speed: 0.014, color: 'rgba(255, 255, 255, 0.16)', width: 1.6, yOffset: -15 },
      { freq: 0.0060, amp: 22, speed: 0.020, color: 'rgba(255, 255, 255, 0.11)', width: 1.2, yOffset: 20 },
      { freq: 0.0020, amp: 40, speed: 0.009, color: 'rgba(255, 255, 255, 0.08)', width: 2.0, yOffset: -5 },
    ];

    const render = () => {
      time += 1;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 🎯 ANCHORED BEHIND / UNDER INPUT SECTION (Horizontally centered)
      const anchorX = width * 0.5;
      const anchorY = Math.max(220, height * 0.41);

      // Subtle parallax tilt: light shifts slightly with perspective (max 35px), NOT following cursor
      const maxParallax = 35;
      const dx = mouseX - anchorX;
      const dy = mouseY - anchorY;
      const dist = Math.hypot(dx, dy);

      const tiltX = Math.max(-maxParallax, Math.min(maxParallax, dx * 0.05));
      const tiltY = Math.max(-maxParallax, Math.min(maxParallax, dy * 0.035));

      const lightX = anchorX + tiltX;
      const lightY = anchorY + tiltY;

      // Proximity flare when mouse interacts near input section
      const proximity = Math.max(0, 1 - dist / (width * 0.55));
      const breath = Math.sin(time * 0.03) * 12;

      // 1. BRILLIANT PURE WHITE LED AMBIENT AURA BEHIND INPUT SECTION
      const radiusX = Math.min(width * 0.48, 520) + proximity * 65 + breath;
      const radiusY = Math.min(height * 0.28, 240) + proximity * 40 + breath * 0.4;

      ctx.save();
      ctx.translate(lightX, lightY);
      ctx.scale(1, Math.max(0.2, radiusY / radiusX));

      // Pure radiant white LED falloff directly into pitch-black void (no grey)
      const coreAlpha = 0.16 + proximity * 0.12;
      const lightGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
      lightGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
      lightGrad.addColorStop(0.25, `rgba(255, 255, 255, ${coreAlpha * 0.6})`);
      lightGrad.addColorStop(0.55, `rgba(255, 255, 255, ${coreAlpha * 0.2})`);
      lightGrad.addColorStop(0.85, `rgba(255, 255, 255, ${coreAlpha * 0.04})`);
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. LIVE 2D WHITE HARMONIC LIGHT RIBBONS BEHIND INPUT SECTION
      waves.forEach((w, wIdx) => {
        ctx.save();
        ctx.beginPath();

        const baseLine = anchorY + w.yOffset;
        const waveStep = time * w.speed;
        const reactiveAmp = w.amp + proximity * 15;

        for (let x = 0; x <= width; x += 12) {
          const distToMouseX = Math.abs(x - mouseX);
          // Ripple subtly if mouse moves near
          const ripple = isMouseActive && distToMouseX < 280
            ? Math.cos((distToMouseX / 280) * (Math.PI / 2)) * ((mouseY - baseLine) * 0.10)
            : 0;

          const y =
            baseLine +
            Math.sin(x * w.freq + waveStep + wIdx) * reactiveAmp +
            Math.cos(x * (w.freq * 0.55) - waveStep * 0.5) * (reactiveAmp * 0.35) +
            ripple;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        filter: 'blur(14px)',
      }}
    />
  );
};
