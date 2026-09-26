import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class CustomKnotCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }

  getPoint(percent: number, optionalTarget = new THREE.Vector3()) {
    const length = 30;
    const radius = 5.6;
    const pi2 = Math.PI * 2;
    const x = length * Math.sin(pi2 * percent);
    const y = radius * Math.cos(pi2 * 3 * percent);
    let t = (percent % 0.25) / 0.25;
    t = (percent % 0.25) - (2 * (1 - t) * t * -0.0185 + t * t * 0.25);
    if (Math.floor(percent / 0.25) === 0 || Math.floor(percent / 0.25) === 2) {
      t *= -1;
    }
    const z = radius * Math.sin(pi2 * 2 * (percent - t));
    return optionalTarget.set(x, y, z);
  }
}

interface ThreeLoadingAnimationProps {
  size?: number;
  className?: string;
  speed?: number;
  color?: number | string;
}

export const ThreeLoadingAnimation: React.FC<ThreeLoadingAnimationProps> = ({
  size = 80,
  className = '',
  speed = 0.035,
  color,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
    camera.position.z = 100; // Balanced camera view

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Determine color from prop, or computed CSS color from container, or fallback white
    let activeColor = 0xffffff;
    if (color) {
      activeColor = typeof color === 'string' ? parseInt(color.replace('#', '0x'), 16) : color;
    } else {
      const computedColor = window.getComputedStyle(container).color;
      if (computedColor) {
        const rgbMatch = computedColor.match(/\d+/g);
        if (rgbMatch && rgbMatch.length >= 3) {
          const r = parseInt(rgbMatch[0], 10);
          const g = parseInt(rgbMatch[1], 10);
          const b = parseInt(rgbMatch[2], 10);
          activeColor = (r << 16) + (g << 8) + b;
        }
      }
    }

    const curve = new CustomKnotCurve();
    const geometry = new THREE.TubeGeometry(curve, 200, 1.25, 8, true);
    const material = new THREE.MeshBasicMaterial({
      color: activeColor,
      transparent: true,
      opacity: 0.95,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Inner ring accent
    const ringGeo = new THREE.RingGeometry(4.3, 5.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: activeColor,
      opacity: 0.6,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.x = 31;
    ring.rotation.y = Math.PI / 2;
    group.add(ring);

    const animate = () => {
      mesh.rotation.x += speed; // Tube internal flow, no Y rotation of group
      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size, speed, color]);

  return (
    <div
      ref={mountRef}
      className={`inline-flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default ThreeLoadingAnimation;
