import React, { useEffect, useRef, useState } from 'react';

interface ScreenBarBiasLightProps {
  className?: string;
}

/**
 * 🖥️ MONITOR BIAS LIGHT — "BACKLIGHT HALO" EFFECT
 *
 * The light element is SMALLER than the input card and sits BEHIND it (z-0).
 * Only the glow bleeding outward around all 4 edges is visible — the light
 * source itself is completely hidden beneath the card, exactly like an LED
 * strip taped to the back of a monitor panel.
 *
 * Technique: Pure CSS div with box-shadow + filter:blur, no canvas needed.
 * The div is inset ~16px on all sides so it's smaller than the card above it.
 * Mouse parallax adds subtle depth.
 */
export const ScreenBarBiasLight: React.FC<ScreenBarBiasLightProps> = ({
  className = '',
}) => {
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 });
  const [breath, setBreath] = useState(1);
  const animRef = useRef<number | undefined>(undefined);
  const startTime = useRef(Date.now());

  // Organic breathing pulse
  useEffect(() => {
    const animate = () => {
      const t = (Date.now() - startTime.current) / 1000;
      const b = 0.82 + Math.sin(t * 0.7) * 0.08 + Math.sin(t * 1.4) * 0.04;
      setBreath(b);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseNorm({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Subtle parallax shift — the light drifts slightly with mouse
  const shiftX = (mouseNorm.x - 0.5) * 10;
  const shiftY = (mouseNorm.y - 0.5) * 6;

  // LED white glow — pure cool white
  const a1 = (0.90 * breath).toFixed(3); // innermost intense core
  const a2 = (0.55 * breath).toFixed(3); // mid bloom
  const a3 = (0.25 * breath).toFixed(3); // outer soft halo
  const a4 = (0.10 * breath).toFixed(3); // far ambient bleed

  return (
    /*
     * OUTER WRAPPER: matches the card container (position:absolute, inset-0)
     * This element itself is invisible — it's just a reference frame.
     */
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/*
       * THE ACTUAL LIGHT SOURCE — smaller than the card, centred, behind everything.
       * inset: 20px means it's 20px inward from every edge of the parent,
       * making it narrower and shorter than the card sitting above it (z-10).
       * The box-shadow + filter:blur creates the glow that bleeds beyond its own edges.
       */}
      <div
        style={{
          position: 'absolute',
          // Pull inward so this div is SMALLER than the card above
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          borderRadius: '20px',
          // The light itself — invisible fill, pure glow via box-shadow
          backgroundColor: 'transparent',
          boxShadow: [
            // Tight core glow (crisp LED strip edge light)
            `0 0 6px 2px rgba(255,253,255,${a1})`,
            // Mid bloom
            `0 0 20px 8px rgba(255,252,255,${a2})`,
            // Wide soft halo
            `0 0 50px 20px rgba(240,245,255,${a3})`,
            // Far ambient bleed
            `0 0 90px 40px rgba(220,230,255,${a4})`,
          ].join(', '),
          // Extra softness — blur the whole element slightly so edges aren't harsh
          filter: `blur(2px)`,
          transform: `translate(${shiftX}px, ${shiftY}px)`,
          transition: 'transform 0.3s ease-out, box-shadow 0.1s ease-out',
          // Must be LOWER than the card's z-10
          zIndex: 0,
        }}
      />
    </div>
  );
};
