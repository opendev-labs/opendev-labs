import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCityBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous elements if re-mounting
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Parameters & Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.innerWidth > 800) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 2, 14);

    // Scene & Objects
    const scene = new THREE.Scene();
    const city = new THREE.Object3D();
    const smoke = new THREE.Object3D();
    const town = new THREE.Object3D();

    // Theme Color (Cyber Red default #F02050)
    const savedTheme = localStorage.getItem('opendev_theme') || 'red';
    const themeHexMap: Record<string, number> = {
      red: 0xF02050,
      cyan: 0x00F2FE,
      purple: 0x7928CA,
      green: 0x00FF88,
      gold: 0xFF9900
    };
    const currentThemeColor = themeHexMap[savedTheme] || 0xF02050;

    scene.background = new THREE.Color(0x09090b); // Match shadcn dark background
    scene.fog = new THREE.Fog(currentThemeColor, 8, 16);

    const mathRandom = (num = 8) => -Math.random() * num + Math.random() * num;

    // Building Blocks Generator
    for (let i = 1; i < 100; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
      const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        wireframe: false,
        roughness: 0.4,
        metalness: 0.8,
        side: THREE.DoubleSide
      });

      const wmaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      });

      const cube = new THREE.Mesh(geometry, material);
      const wire = new THREE.Mesh(geometry, wmaterial);
      const floor = new THREE.Mesh(geometry, material);

      cube.add(wire);
      cube.castShadow = true;
      cube.receiveShadow = true;

      floor.scale.y = 0.05;
      cube.scale.y = 0.1 + Math.abs(mathRandom(8));

      const cubeWidth = 0.9;
      cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
      cube.position.x = Math.round(mathRandom());
      cube.position.z = Math.round(mathRandom());

      floor.position.set(cube.position.x, 0, cube.position.z);

      town.add(floor);
      town.add(cube);
    }

    // Smoke & Particles
    const gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
    const gparticular = new THREE.CircleGeometry(0.01, 3);
    for (let h = 1; h < 300; h++) {
      const particular = new THREE.Mesh(gparticular, gmaterial);
      particular.position.set(mathRandom(5), mathRandom(5), mathRandom(5));
      particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
      smoke.add(particular);
    }

    // Floor Base Grid
    const pmaterial = new THREE.MeshPhongMaterial({
      color: 0x09090b,
      side: THREE.DoubleSide,
      opacity: 0.95,
      transparent: true
    });
    const pgeometry = new THREE.PlaneGeometry(60, 60);
    const pelement = new THREE.Mesh(pgeometry, pmaterial);
    pelement.rotation.x = -90 * Math.PI / 180;
    pelement.position.y = -0.001;
    pelement.receiveShadow = true;
    city.add(pelement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
    const lightFront = new THREE.SpotLight(currentThemeColor, 25, 12);
    const lightBack = new THREE.PointLight(0xFFFFFF, 0.8);

    lightFront.rotation.x = 45 * Math.PI / 180;
    lightFront.rotation.z = -45 * Math.PI / 180;
    lightFront.position.set(5, 5, 5);
    lightFront.castShadow = true;
    lightBack.position.set(0, 6, 0);

    smoke.position.y = 2;

    scene.add(ambientLight);
    city.add(lightFront);
    scene.add(lightBack);
    scene.add(city);
    city.add(smoke);
    city.add(town);

    const gridHelper = new THREE.GridHelper(60, 120, currentThemeColor, 0x27272a);
    city.add(gridHelper);

    // Cars & Traffic Animation
    const cars: THREE.Mesh[] = [];
    const createCars = (cScale = 2, cPos = 20, cColor = 0xFFFF00) => {
      const cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
      const cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
      const cElem = new THREE.Mesh(cGeo, cMat);

      if (Math.random() > 0.5) {
        cElem.position.x = -cPos;
        cElem.position.z = mathRandom(3);
      } else {
        cElem.position.x = mathRandom(3);
        cElem.position.z = -cPos;
        cElem.rotation.y = 90 * Math.PI / 180;
      }
      cElem.position.y = Math.abs(mathRandom(5));
      city.add(cElem);
      cars.push(cElem);
    };

    for (let i = 0; i < 40; i++) {
      createCars(0.1, 20);
    }

    // Mouse Tracking
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      city.rotation.y -= (mouse.x * 4 - camera.rotation.y) * 0.001;
      city.rotation.x -= (-mouse.y * 2 - camera.rotation.x) * 0.001;

      if (city.rotation.x < -0.05) city.rotation.x = -0.05;
      else if (city.rotation.x > 1) city.rotation.x = 1;

      smoke.rotation.y += 0.008;
      smoke.rotation.x += 0.008;

      cars.forEach((car) => {
        car.position.x += 0.05;
        if (car.position.x > 20) car.position.x = -20;
      });

      camera.lookAt(city.position);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      id="canvas-container" 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
    />
  );
};

export default ThreeCityBackground;
