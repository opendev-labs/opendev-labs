import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const shaderNoise = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
`;

export const NeuralBioelectricCanvas: React.FC<{ className?: string }> = ({
  className = 'absolute inset-0 z-0 overflow-hidden pointer-events-auto',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // HUD Telemetry State Variables
  const [membraneV, setMembraneV] = useState(-70.0);
  const [dendriteState, setDendriteState] = useState('CALM');
  const [axonLoad, setAxonLoad] = useState(2);
  const [signalPhase, setSignalPhase] = useState('RESTING');
  const [synapticCoh, setSynapticCoh] = useState(24);

  const [camPos, setCamPos] = useState({ x: '0.00', y: '0.00', z: '0.00' });
  const [isFiring, setIsFiring] = useState(false);

  const triggerImpulseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const CONFIG = {
      somaRadius: 4.0,
      dendriteTrees: 14,
      axonTrees: 4,
      maxDistDendrite: 35.0,
      maxDistAxon: 50.0,
      colors: {
        cyan: new THREE.Color('#00e5ff'),
        blue: new THREE.Color('#0033aa'),
        gold: new THREE.Color('#ffaa00'),
        orange: new THREE.Color('#ff4400'),
        magenta: new THREE.Color('#ff0066'),
        violet: new THREE.Color('#6600ff'),
      },
    };

    const STATE = {
      phase: 0,
      progress: 0,
      membraneV: -70.0,
      axonLoad: 2,
      sync: 24,
      isAnimating: false,
    };

    const uniforms: Record<string, { value: any }> = {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uProgress: { value: 0 },
      uColCyan: { value: CONFIG.colors.cyan },
      uColBlue: { value: CONFIG.colors.blue },
      uColGold: { value: CONFIG.colors.gold },
      uColOrange: { value: CONFIG.colors.orange },
      uColMagenta: { value: CONFIG.colors.magenta },
      uColViolet: { value: CONFIG.colors.violet },
      uSomaRadius: { value: CONFIG.somaRadius },
      uMaxDistDendrite: { value: CONFIG.maxDistDendrite },
      uMaxDistAxon: { value: CONFIG.maxDistAxon },
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010204, 0.015);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const desktopCameraPosition = new THREE.Vector3(30, 20, 40);
    const mobileCameraPosition = new THREE.Vector3(34, 24, 62);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.copy(desktopCameraPosition);

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.8, 0.6, 0.1);
    composer.addPass(bloomPass);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enablePan = false;
    controls.minDistance = 15;
    controls.maxDistance = 120;

    function isCompactViewport() {
      return window.innerWidth <= 720 || window.matchMedia('(pointer: coarse)').matches;
    }

    function applyResponsiveScene(resetCamera = false) {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const compact = isCompactViewport();
      const targetPosition = compact ? mobileCameraPosition : desktopCameraPosition;

      camera.aspect = w / h;
      camera.fov = compact ? 52 : 45;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 2));
      renderer.setSize(w, h, false);
      composer.setSize(w, h);

      controls.minDistance = compact ? 24 : 15;
      controls.maxDistance = compact ? 140 : 120;

      if (resetCamera) {
        camera.position.copy(targetPosition);
      } else if (compact && camera.position.length() < targetPosition.length() * 0.8) {
        camera.position.setLength(targetPosition.length());
      }

      controls.update();
    }

    applyResponsiveScene(true);

    const somaMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: `
          ${shaderNoise}
          uniform float uTime;
          uniform int uPhase;
          uniform float uProgress;
          
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying float vNoise;

          void main() {
              vec3 pos = position;
              float noise = snoise(pos * 0.5 + uTime * 0.3) * 0.5;
              float burst = 0.0;
              if(uPhase == 2) {
                  burst = sin(uProgress * 3.14159) * 0.4;
              }
              pos += normal * (noise + burst);
              vNoise = noise;
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              vViewPosition = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
          }
      `,
      fragmentShader: `
          uniform int uPhase;
          uniform float uProgress;
          uniform float uTime;
          
          uniform vec3 uColCyan;
          uniform vec3 uColBlue;
          uniform vec3 uColGold;
          uniform vec3 uColMagenta;

          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying float vNoise;

          void main() {
              vec3 normal = normalize(vNormal);
              vec3 viewDir = normalize(vViewPosition);
              float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
              vec3 color = mix(uColBlue * 0.2, uColCyan, fresnel);
              color += uColCyan * (vNoise * 0.5 + 0.5) * 0.3;
              if(uPhase == 2) {
                  float intensity = sin(uProgress * 3.14159);
                  color = mix(color, uColGold * 2.0 + uColCyan, intensity * fresnel * 2.0);
                  color += uColGold * intensity * (1.0 - fresnel);
              } else if(uPhase == 4) {
                  float intensity = 1.0 - uProgress;
                  color = mix(color, uColMagenta, intensity * fresnel * 1.5);
              }
              gl_FragColor = vec4(color, 0.8 * fresnel + 0.2);
          }
      `,
    });

    const branchMaterial = new THREE.ShaderMaterial({
      uniforms: Object.assign({}, uniforms, { uIsAxon: { value: 0 } }),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
          ${shaderNoise}
          uniform float uTime;
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec2 vUv;

          void main() {
              vUv = uv;
              vec3 pos = position;
              float wiggle = snoise(pos * 0.2 + uTime * 0.5) * 0.1;
              pos += normal * wiggle;
              vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
              vWorldPos = worldPosition.xyz;
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = viewMatrix * worldPosition;
              vViewPosition = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
          }
      `,
      fragmentShader: `
          ${shaderNoise}
          uniform float uTime;
          uniform int uPhase;
          uniform float uProgress;
          uniform int uIsAxon;
          
          uniform vec3 uColCyan;
          uniform vec3 uColBlue;
          uniform vec3 uColGold;
          uniform vec3 uColOrange;
          uniform vec3 uColMagenta;
          uniform vec3 uColViolet;
          
          uniform float uSomaRadius;
          uniform float uMaxDistDendrite;
          uniform float uMaxDistAxon;

          varying vec3 vWorldPos;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec2 vUv;

          void main() {
              vec3 normal = normalize(vNormal);
              vec3 viewDir = normalize(vViewPosition);
              float edge = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0); 
              float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
              float dist = length(vWorldPos);
              vec3 baseColor = mix(uColBlue * 0.1, uColCyan * 0.5, fresnel * edge);
              vec3 pulseColor = vec3(0.0);
              float flowNoise = snoise(vec3(vUv.x * 20.0 - uTime * 2.0, vUv.y * 10.0, uTime)) * 0.5 + 0.5;
              float axialFlow = 0.65 + 0.35 * sin(vUv.x * 34.0 - uTime * 8.0);
              if (uIsAxon == 0) {
                  if (uPhase == 1) {
                      float currentWaveDist = mix(uMaxDistDendrite, uSomaRadius, uProgress);
                      float head = 1.0 - smoothstep(0.0, 2.3, abs(dist - currentWaveDist));
                      float outerTrail = step(currentWaveDist, dist) * exp(-(dist - currentWaveDist) * 0.18);
                      float mergeGlow = (1.0 - smoothstep(uSomaRadius, uSomaRadius + 8.0, dist)) * smoothstep(0.65, 1.0, uProgress);
                      float pulse = max(head * 1.6, outerTrail * 0.65) + mergeGlow * 0.8;
                      pulseColor = uColGold * pulse * flowNoise * axialFlow * 3.2;
                  }
              } else {
                  if (uPhase == 3) {
                      float currentWaveDist = mix(uSomaRadius, uMaxDistAxon + 18.0, uProgress);
                      float head = 1.0 - smoothstep(0.0, 3.4, abs(dist - currentWaveDist));
                      float innerTrail = step(dist, currentWaveDist) * exp(-(currentWaveDist - dist) * 0.1);
                      float somaLaunch = (1.0 - smoothstep(uSomaRadius, uSomaRadius + 7.0, dist)) * (1.0 - smoothstep(0.0, 0.28, uProgress));
                      float pulse = max(head * 2.0, innerTrail * 0.9) + somaLaunch * 1.2;
                      pulseColor = (uColOrange + uColGold * 0.45) * pulse * flowNoise * axialFlow * 4.6;
                  }
              }
              if (uPhase == 4) {
                  float intensity = 1.0 - uProgress;
                  pulseColor += uColViolet * intensity * edge * 1.5;
              }
              gl_FragColor = vec4(baseColor + pulseColor, 1.0);
          }
      `,
    });

    const axonMaterial = branchMaterial.clone();
    Object.keys(uniforms).forEach((key) => {
      axonMaterial.uniforms[key] = uniforms[key];
    });
    axonMaterial.uniforms.uIsAxon = { value: 1 };

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const somaGeo = new THREE.IcosahedronGeometry(CONFIG.somaRadius, 32);
    const somaMesh = new THREE.Mesh(somaGeo, somaMaterial);
    networkGroup.add(somaMesh);

    const coreGeo = new THREE.IcosahedronGeometry(CONFIG.somaRadius * 0.8, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.cyan,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    networkGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const synapsePositions: number[] = [];

    function buildBranch(
      startPt: THREE.Vector3,
      dir: THREE.Vector3,
      length: number,
      radius: number,
      level: number,
      maxLevels: number,
      isAxon: boolean
    ) {
      const segments = 12;
      const points = [startPt.clone()];
      let cur = startPt.clone();
      let cDir = dir.clone();

      for (let i = 0; i < segments; i++) {
        let curl = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).multiplyScalar(isAxon ? 0.3 : 0.8);
        cDir.add(curl).normalize();
        cur.add(cDir.clone().multiplyScalar(length / segments));
        points.push(cur.clone());
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, segments * 2, radius, 6, false);
      const mesh = new THREE.Mesh(tubeGeo, isAxon ? axonMaterial : branchMaterial);
      networkGroup.add(mesh);

      if (level < maxLevels) {
        const childCount = isAxon ? (Math.random() > 0.3 ? 1 : 2) : Math.random() > 0.2 ? 2 : 3;
        for (let j = 0; j < childCount; j++) {
          let splitDir = cDir
            .clone()
            .add(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.8))
            .normalize();

          buildBranch(cur, splitDir, length * (0.6 + Math.random() * 0.3), radius * 0.65, level + 1, maxLevels, isAxon);
        }
      } else {
        synapsePositions.push(cur.x, cur.y, cur.z);
      }
    }

    for (let i = 0; i < CONFIG.dendriteTrees; i++) {
      let dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      if (dir.z > 0.3) dir.z -= 0.8;
      dir.normalize();
      let start = dir.clone().multiplyScalar(CONFIG.somaRadius - 0.5);
      buildBranch(start, dir, 12 + Math.random() * 5, 0.4, 0, 2, false);
    }

    for (let i = 0; i < CONFIG.axonTrees; i++) {
      let dir = new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 1.0).normalize();
      let start = dir.clone().multiplyScalar(CONFIG.somaRadius - 0.5);
      buildBranch(start, dir, 25 + Math.random() * 10, 0.6, 0, 2, true);
    }

    const synGeo = new THREE.BufferGeometry();
    synGeo.setAttribute('position', new THREE.Float32BufferAttribute(synapsePositions, 3));

    const synSizes = new Float32Array(synapsePositions.length / 3);
    for (let i = 0; i < synSizes.length; i++) synSizes[i] = Math.random();
    synGeo.setAttribute('aSize', new THREE.BufferAttribute(synSizes, 1));

    const synMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
          attribute float aSize;
          uniform float uTime;
          varying float vSize;
          void main() {
              vSize = aSize;
              vec3 pos = position;
              pos.y += sin(uTime * 2.0 + pos.x) * 0.5;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = (20.0 + aSize * 15.0) * (100.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
          }
      `,
      fragmentShader: `
          uniform int uPhase;
          uniform float uProgress;
          uniform vec3 uColCyan;
          uniform vec3 uColGold;
          uniform vec3 uColMagenta;
          varying float vSize;
          
          void main() {
              vec2 coord = gl_PointCoord - vec2(0.5);
              float dist = length(coord);
              if (dist > 0.5) discard;
              float alpha = (0.5 - dist) * 2.0;
              vec3 color = uColCyan * 0.5;
              if (uPhase == 1 || uPhase == 3) {
                  float spark = step(0.8, fract(vSize * 10.0 + uProgress * 5.0));
                  color = mix(color, uColGold, spark * 2.0);
              } else if (uPhase == 4) {
                  color = mix(color, uColMagenta, (1.0 - uProgress));
              }
              gl_FragColor = vec4(color, alpha);
          }
      `,
    });
    const synapses = new THREE.Points(synGeo, synMat);
    networkGroup.add(synapses);

    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 800;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPos[i] = (Math.random() - 0.5) * 150;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: CONFIG.colors.cyan,
      size: 0.2,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Trigger impulse handler
    const fireImpulse = () => {
      if (STATE.isAnimating) return;
      STATE.isAnimating = true;
      STATE.phase = 1;
      STATE.progress = 0;
      setIsFiring(true);
    };

    triggerImpulseRef.current = fireImpulse;

    const clock = new THREE.Clock();

    let animationFrameId: number;

    const updateUIState = () => {
      setCamPos({
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2),
      });

      let targetMembrane = -70.0;
      let targetAxon = 2;
      let targetSync = 24 + Math.sin(uniforms.uTime.value * 2) * 5;

      let stateText = 'RESTING';
      let denText = 'CALM';

      switch (STATE.phase) {
        case 1:
          stateText = 'INCOMING STIMULUS';
          denText = 'ACTIVE LOAD';
          targetMembrane = -55.0;
          targetSync = 45;
          break;
        case 2:
          stateText = 'SOMA MERGE';
          denText = 'CONVERGED';
          targetMembrane = 40.0;
          targetSync = 85;
          break;
        case 3:
          stateText = 'AXON OUTFLOW';
          targetMembrane = 20.0;
          targetAxon = 98;
          targetSync = 99;
          break;
        case 4:
          stateText = 'REFRACTORY PERIOD';
          targetMembrane = -80.0;
          targetAxon = 15;
          targetSync = 15;
          break;
      }

      STATE.membraneV += (targetMembrane - STATE.membraneV) * 0.15;
      STATE.axonLoad += (targetAxon - STATE.axonLoad) * 0.15;
      STATE.sync += (targetSync - STATE.sync) * 0.15;

      setMembraneV(Number(STATE.membraneV.toFixed(1)));
      setAxonLoad(Math.round(STATE.axonLoad));
      setSynapticCoh(Math.round(STATE.sync));
      setSignalPhase(stateText);
      setDendriteState(denText);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = clock.getDelta();
      const time = clock.getElapsedTime();
      uniforms.uTime.value = time;

      controls.update();

      dust.rotation.y = time * 0.02;
      dust.rotation.x = Math.sin(time * 0.01) * 0.05;

      if (STATE.isAnimating) {
        let speed = 1.0;
        if (STATE.phase === 1) speed = 0.8;
        if (STATE.phase === 2) speed = 2.5;
        if (STATE.phase === 3) speed = 0.95;
        if (STATE.phase === 4) speed = 0.5;

        STATE.progress += dt * speed;

        if (STATE.progress >= 1.0) {
          STATE.progress = 0.0;
          STATE.phase++;

          if (STATE.phase === 2) {
            const target = camera.position.clone().multiplyScalar(0.85);
            camera.position.lerp(target, 0.5);
            bloomPass.strength = 2.5;
          }
          if (STATE.phase === 3) {
            const target = camera.position.clone().multiplyScalar(1.2);
            camera.position.lerp(target, 0.5);
          }

          if (STATE.phase > 4) {
            STATE.phase = 0;
            STATE.isAnimating = false;
            setIsFiring(false);
          }
        }
      } else {
        bloomPass.strength += (1.8 - bloomPass.strength) * 0.05;
      }

      uniforms.uPhase.value = STATE.phase;
      uniforms.uProgress.value = STATE.progress;

      updateUIState();
      composer.render();
    };

    const handleResize = () => {
      applyResponsiveScene();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {/* HUD Telemetry Left Panel */}
      <div className="absolute top-4 left-4 z-20 p-4 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-2xl max-w-[240px] hidden sm:block pointer-events-auto">
        <div className="border-b border-white/10 dark:border-zinc-800 pb-2 mb-3">
          <h2 className="text-[11px] font-extrabold tracking-widest text-cyan-500 uppercase">Neural Cathedral</h2>
          <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">ID: NC-09 // BIOELECTRIC ENGINE</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Membrane V</span>
            <span className="font-bold text-cyan-400">{membraneV > 0 ? `+${membraneV}` : membraneV} mV</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Dendrites</span>
            <span className="font-bold text-cyan-400">{dendriteState}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Axon Load</span>
            <span className="font-bold text-cyan-400">{axonLoad.toString().padStart(2, '0')}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Signal Phase</span>
            <span className="font-bold text-amber-400">{signalPhase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 uppercase">Synaptic Coh</span>
            <span className="font-bold text-cyan-400">{synapticCoh.toString().padStart(2, '0')}%</span>
          </div>
        </div>

        <button
          onClick={() => triggerImpulseRef.current?.()}
          disabled={isFiring}
          className="mt-3 w-full py-2 px-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-extrabold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isFiring ? 'FIRING SEQUENCE...' : 'MANUAL OVERRIDE'}
        </button>
      </div>

      {/* HUD Telemetry Right Panel */}
      <div className="absolute bottom-4 right-4 z-20 p-3 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800 text-zinc-900 dark:text-white text-[10px] font-mono space-y-1 text-right hidden sm:block pointer-events-auto shadow-2xl">
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 dark:text-zinc-400">CAM X</span>
          <span className="text-cyan-400 font-bold">{camPos.x}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 dark:text-zinc-400">CAM Y</span>
          <span className="text-cyan-400 font-bold">{camPos.y}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 dark:text-zinc-400">CAM Z</span>
          <span className="text-cyan-400 font-bold">{camPos.z}</span>
        </div>
      </div>
    </div>
  );
};
