import React, { useEffect, useRef } from 'react';

/**
 * 🌌 STUDIO LIVE BACKGROUND
 *
 * Pitch-black canvas with 5 large, soft, blurred light orbs that:
 *  - Float slowly across the screen with sine-wave drift
 *  - React to mouse position (gently attracted)
 *  - Breathe (pulse opacity/size)
 *  - Each orb is a radial gradient — pure CSS-style glow rendered via canvas
 *
 * Colours: cool white, ice blue, warm white — all very low opacity
 * to keep the dark aesthetic. No colour overload.
 */

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  phase: number;    // phase offset for breathing
  phaseSpeed: number;
  color: [number, number, number]; // RGB
  baseAlpha: number;
}

export const StudioBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalised 0-1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let time = 0;

    /* ── ORBS DEFINITION ────────────────────────────────────────────────── */
    const orbs: Orb[] = [
      // Large dominant orb — cool ice white, upper-left drift
      {
        x: 0.25, y: 0.35,
        vx: 0.00012, vy: 0.00008,
        baseRadius: 0.40,
        phase: 0, phaseSpeed: 0.006,
        color: [200, 220, 255],
        baseAlpha: 0.10,
      },
      // Warm white orb — lower-right
      {
        x: 0.75, y: 0.65,
        vx: -0.00010, vy: -0.00006,
        baseRadius: 0.38,
        phase: 1.8, phaseSpeed: 0.007,
        color: [255, 248, 235],
        baseAlpha: 0.09,
      },
      // Small sharp orb — top-right accent
      {
        x: 0.80, y: 0.20,
        vx: -0.00014, vy: 0.00010,
        baseRadius: 0.22,
        phase: 3.5, phaseSpeed: 0.009,
        color: [180, 210, 255],
        baseAlpha: 0.12,
      },
      // Small orb — bottom-left accent
      {
        x: 0.18, y: 0.78,
        vx: 0.00010, vy: -0.00012,
        baseRadius: 0.20,
        phase: 5.2, phaseSpeed: 0.008,
        color: [255, 255, 255],
        baseAlpha: 0.08,
      },
      // Centre ambient — very large, very soft
      {
        x: 0.50, y: 0.50,
        vx: 0.00004, vy: 0.00005,
        baseRadius: 0.55,
        phase: 2.5, phaseSpeed: 0.004,
        color: [200, 215, 255],
        baseAlpha: 0.045,
      },
    ];

    /* ── RESIZE HANDLER ─────────────────────────────────────────────────── */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── MOUSE ──────────────────────────────────────────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── RENDER LOOP ────────────────────────────────────────────────────── */
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, W, H);

      // Fill pitch black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      orbs.forEach(orb => {
        // Advance position
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Soft mouse attraction — pull gently toward cursor
        const dx = mx - orb.x;
        const dy = my - orb.y;
        orb.vx += dx * 0.000003;
        orb.vy += dy * 0.000003;

        // Velocity damping (keeps them slow)
        orb.vx *= 0.998;
        orb.vy *= 0.998;

        // Wrap / bounce at edges
        if (orb.x < -0.1) orb.vx += 0.00008;
        if (orb.x > 1.1)  orb.vx -= 0.00008;
        if (orb.y < -0.1) orb.vy += 0.00008;
        if (orb.y > 1.1)  orb.vy -= 0.00008;

        // Breathing
        orb.phase += orb.phaseSpeed;
        const breath = 1 + Math.sin(orb.phase) * 0.12 + Math.sin(orb.phase * 1.7) * 0.06;

        // World-space position
        const cx = orb.x * W;
        const cy = orb.y * H;
        const r = orb.baseRadius * Math.min(W, H) * breath;
        const alpha = orb.baseAlpha * breath;

        // Draw radial gradient orb
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [R, G, B] = orb.color;
        grad.addColorStop(0,   `rgba(${R},${G},${B},${alpha.toFixed(4)})`);
        grad.addColorStop(0.35,`rgba(${R},${G},${B},${(alpha * 0.55).toFixed(4)})`);
        grad.addColorStop(0.70,`rgba(${R},${G},${B},${(alpha * 0.18).toFixed(4)})`);
        grad.addColorStop(1,   `rgba(${R},${G},${B},0)`);

        ctx.save();
        ctx.globalCompositeOperation = 'screen'; // additive blending for light
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      // Subtle noise layer — very faint grid of tiny sparks that drift
      if (time % 3 === 0) {
        const sparkCount = 6;
        for (let i = 0; i < sparkCount; i++) {
          const sx = Math.random() * W;
          const sy = Math.random() * H;
          const sa = Math.random() * 0.08 + 0.01;
          const sr = Math.random() * 1.5 + 0.5;
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,220,255,${sa})`;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};
