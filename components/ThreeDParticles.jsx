import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const getOptimalParticleCount = () => {
  if (typeof window === "undefined") return 6500;
  return window.innerWidth < 768 ? 3500 : 6500;
};

const PARTICLE_COUNT = getOptimalParticleCount();


// GLSL Vertex Shader
const vertexShader = `
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Attenuate point size so closer particles appear larger
    gl_PointSize = (11.0 / -mvPosition.z);
  }
`;

// GLSL Fragment Shader for crisp, solid, bright particles (no blurry halos)
const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    // Sharp edge transition for solid glowing dots and maximum logo definition
    float alpha = smoothstep(0.48, 0.36, dist) * 0.95;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Helper: Load image and extract particle coordinates and colors with edge-weighted sampling
function loadLogoParticles(url, count, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Scan resolution for high-definition shape details
    const size = 350;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    
    // Preserving original aspect ratio during drawing
    const imgAspect = img.width / img.height;
    let drawW = size;
    let drawH = size;
    if (imgAspect > 1) {
      drawH = size / imgAspect;
    } else {
      drawW = size * imgAspect;
    }
    ctx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
    const imgData = ctx.getImageData(0, 0, size, size).data;
    
    // Detect background color by sampling 4 corners
    const corners = [
      0,
      (size - 1) * 4,
      (size * (size - 1)) * 4,
      (size * size - 1) * 4
    ];
    let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
    corners.forEach(idx => {
      sumR += imgData[idx];
      sumG += imgData[idx + 1];
      sumB += imgData[idx + 2];
      sumA += imgData[idx + 3];
    });
    const bgR = sumR / 4;
    const bgG = sumG / 4;
    const bgB = sumB / 4;
    const bgA = sumA / 4;
    const hasSolidBg = bgA > 50;
    
    // Helper to get binary mask of foreground/background with clean threshold
    const getMask = (px, py) => {
      if (px < 0 || px >= size || py < 0 || py >= size) return 0;
      const idx = (py * size + px) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const alpha = imgData[idx + 3];
      
      // Strict alpha cutoff to prevent fuzzy semi-transparent edges
      if (alpha < 140) return 0;
      if (hasSolidBg) {
        const colorDiff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
        if (colorDiff < 55) return 0;
      }
      return 1;
    };

    // Clean structural mask checking neighbors to remove stray/isolated noise pixels
    const isSolidStructure = (px, py) => {
      let neighbors = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (getMask(px + dx, py + dy) === 1) {
            neighbors++;
          }
        }
      }
      return neighbors >= 8;
    };

    const allPixels = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (getMask(x, y) === 1 && isSolidStructure(x, y)) {
          const idx = (y * size + x) * 4;
          allPixels.push({
            x: x,
            y: -y, // Flip Y for WebGL
            r: imgData[idx] / 255,
            g: imgData[idx + 1] / 255,
            b: imgData[idx + 2] / 255
          });
        }
      }
    }
    
    // Fallback if list is empty
    if (allPixels.length === 0) {
      for (let i = 0; i < 200; i++) {
        allPixels.push({ x: (Math.random() - 0.5) * size, y: (Math.random() - 0.5) * -size, r: 1, g: 1, b: 1 });
      }
    }
    
    // Calculate Bounding Box across all valid pixels for centering
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    allPixels.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Fit-to-Bounds Target size: maximum 1.95 units in 3D viewport to fill the card
    const maxDimension = Math.max(width, height) || 1;
    const scaleFactor = 1.95 / maxDimension;
    
    const targetPositions = new Float32Array(count * 3);
    const targetColors = new Float32Array(count * 3);
    
    const step = allPixels.length / count;
    for (let i = 0; i < count; i++) {
      // Sample evenly across all available pixels to prevent cropping and uneven density
      const pixelIndex = Math.floor(i * step) % allPixels.length;
      const pixel = allPixels[pixelIndex];
      const i3 = i * 3;
      
      // Scale coordinates relative to center
      const scaledX = (pixel.x - centerX) * scaleFactor;
      const scaledY = (pixel.y - centerY) * scaleFactor;
      
      // Tiny noise to keep edges crisp and sharp (reduced to 0.003 for high-definition clarity)
      const noise = 0.003;
      targetPositions[i3] = scaledX + (Math.random() - 0.5) * noise;
      targetPositions[i3 + 1] = scaledY + (Math.random() - 0.5) * noise;
      targetPositions[i3 + 2] = (Math.random() - 0.5) * 0.005; // extremely flat depth for maximum clarity during rotation
      
      let r = pixel.r;
      let g = pixel.g;
      let b = pixel.b;

      // Boost brightness for dark logo colors (e.g. the dark 'node' text) to ensure clarity against dark backgrounds
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness < 0.45) {
        const maxC = Math.max(r, g, b);
        if (maxC > 0.02) {
          // Boost and saturate the existing tone
          const boostFactor = 0.8 / maxC;
          r = Math.min(r * boostFactor, 1.0);
          g = Math.min(g * boostFactor, 1.0);
          b = Math.min(b * boostFactor, 1.0);
        } else {
          // For near-black pixels, use a bright off-white/light-green tone
          r = 0.8;
          g = 0.9;
          b = 0.8;
        }
      }

      targetColors[i3] = r;
      targetColors[i3 + 1] = g;
      targetColors[i3 + 2] = b;
    }
    
    callback({ positions: targetPositions, colors: targetColors });
  };
  
  img.onerror = () => {
    console.error("Failed to load particle image logo: " + url);
  };
  img.src = url;
}

// Procedural generator for the React Logo (nucleus + 3 smooth orbits)
function generateReactShape(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const reactColor = new THREE.Color("#00e5ff");

  // Nucleus: 15% of total particles
  const nucleusCount = Math.round(count * 0.15);
  // Orbitals: 85% of total particles divided equally among 3 rings
  const ringCount = Math.floor((count - nucleusCount) / 3);

  // Nucleus: dense central sphere
  for (let i = 0; i < nucleusCount; i++) {
    const i3 = i * 3;
    // Uniform sphere distribution
    const phi = Math.acos(1.0 - 2.0 * Math.random());
    const theta = Math.random() * Math.PI * 2.0;
    const r = Math.pow(Math.random(), 0.6) * 0.18; // dense sphere core

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi) * 0.15; // thin depth layer

    colors[i3] = reactColor.r;
    colors[i3 + 1] = reactColor.g;
    colors[i3 + 2] = reactColor.b;
  }

  // 3 Elliptical Rings
  const a = 1.05; // semi-major axis (scale width)
  const b = 0.38; // semi-minor axis (scale height)
  const ringAngles = [0, Math.PI / 3, (2 * Math.PI) / 3]; // 0, 60, 120 degrees

  let particleIdx = nucleusCount;

  for (let ringIdx = 0; ringIdx < 3; ringIdx++) {
    const ringAngle = ringAngles[ringIdx];

    for (let j = 0; j < ringCount; j++) {
      const i3 = particleIdx * 3;

      // Uniform angular step for perfect spacing
      const theta = (j / ringCount) * Math.PI * 2.0;

      // Ellipse formula
      const localX = a * Math.cos(theta);
      const localY = b * Math.sin(theta);
      const localZ = (Math.random() - 0.5) * 0.002;

      // Rotate around Z axis by ringAngle
      const rotatedX = localX * Math.cos(ringAngle) - localY * Math.sin(ringAngle);
      const rotatedY = localX * Math.sin(ringAngle) + localY * Math.cos(ringAngle);

      positions[i3] = rotatedX;
      positions[i3 + 1] = rotatedY;
      positions[i3 + 2] = localZ;

      colors[i3] = reactColor.r;
      colors[i3 + 1] = reactColor.g;
      colors[i3 + 2] = reactColor.b;

      particleIdx++;
    }
  }

  // Padding rest to prevent unallocated buffer
  while (particleIdx < count) {
    const i3 = particleIdx * 3;
    positions[i3] = 0;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = 0;
    colors[i3] = reactColor.r;
    colors[i3 + 1] = reactColor.g;
    colors[i3 + 2] = reactColor.b;
    particleIdx++;
  }

  return { positions, colors };
}

// Math generator for default idle shape (Double-armed logarithmic spiral galaxy)
function generateVmrShape(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const purple = new THREE.Color("#a855f7");
  const cyan = new THREE.Color("#00e5ff");

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Double-armed logarithmic spiral galaxy
    const arm = i % 2;
    const theta = Math.pow(Math.random(), 1.5) * Math.PI * 4.0; // tight spiral wrapping
    const rRadius = 0.15 + 2.2 * (theta / (Math.PI * 4.0)); // radius increases along spiral
    
    // Add arm angle offset (180 degrees difference between arms)
    const armOffset = arm * Math.PI;
    const finalAngle = theta + armOffset + (Math.random() - 0.5) * 0.18 / rRadius; // random dispersion decreases outwards
    
    const x = rRadius * Math.cos(finalAngle);
    const y = rRadius * Math.sin(finalAngle);
    const z = (Math.random() - 0.5) * 0.22 * Math.exp(-rRadius * 0.8); // thicker center, thin arms

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // Radial gradient colors
    const ratio = rRadius / 2.35;
    const lerpedColor = cyan.clone().lerp(purple, Math.min(ratio, 1.0));
    colors[i3] = lerpedColor.r;
    colors[i3 + 1] = lerpedColor.g;
    colors[i3 + 2] = lerpedColor.b;
  }

  return { positions, colors };
}

// Particle Mesh Component
function ParticleMesh({ activeSkill, mouseRef, loadedShapes }) {
  const pointsRef = useRef(null);

  const vmrData = useMemo(() => generateVmrShape(PARTICLE_COUNT), []);
  const velocities = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const currentPositions = useMemo(() => {
    // Initial random particle burst
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() * 20 - 10);
    }
    return arr;
  }, []);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = 1.0;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const elapsedTime = state.clock.getElapsedTime();
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;

    let targetPositions = vmrData.positions;
    let targetColors = vmrData.colors;

    if (activeSkill !== "vmr" && loadedShapes && loadedShapes[activeSkill]) {
      targetPositions = loadedShapes[activeSkill].positions;
      targetColors = loadedShapes[activeSkill].colors;
    }

    // Smooth, cinematic slow transition physics
    const springStrength = 0.024;
    const damping = 0.88;

    const timeVal = elapsedTime * 0.6;
    const targetMouseX = mouseRef.current.x * 0.4;
    const targetMouseY = mouseRef.current.y * 0.4;

    const isIdle = activeSkill === "vmr";
    const floatAmp = isIdle ? 0.0045 : 0.0003;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const dx = targetPositions[i3] - currentPositions[i3];
      const dy = targetPositions[i3 + 1] - currentPositions[i3 + 1];
      const dz = targetPositions[i3 + 2] - currentPositions[i3 + 2];

      const vx = (velocities[i3] = (velocities[i3] + dx * springStrength) * damping);
      const vy = (velocities[i3 + 1] = (velocities[i3 + 1] + dy * springStrength) * damping);
      const vz = (velocities[i3 + 2] = (velocities[i3 + 2] + dz * springStrength) * damping);

      const px = (currentPositions[i3] += vx);
      const py = (currentPositions[i3 + 1] += vy);
      const pz = (currentPositions[i3 + 2] += vz);

      const floatX = Math.sin(timeVal + i) * floatAmp;
      const floatY = Math.cos(timeVal * 0.9 + i) * floatAmp;
      const floatZ = Math.sin(timeVal * 1.2 + i * 0.5) * (floatAmp * 0.7);

      posAttr.array[i3] = px + floatX;
      posAttr.array[i3 + 1] = py + floatY;
      posAttr.array[i3 + 2] = pz + floatZ;

      colorAttr.array[i3] += (targetColors[i3] - colorAttr.array[i3]) * 0.14;
      colorAttr.array[i3 + 1] += (targetColors[i3 + 1] - colorAttr.array[i3 + 1]) * 0.14;
      colorAttr.array[i3 + 2] += (targetColors[i3 + 2] - colorAttr.array[i3 + 2]) * 0.14;
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Slow and gentle wobbles to maintain perfect visibility (avoiding side-views)
    if (activeSkill === "vmr") {
      pointsRef.current.rotation.y = elapsedTime * 0.12;
      pointsRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.08;
    } else {
      pointsRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.18; // Wobble left/right
      pointsRef.current.rotation.x = Math.cos(elapsedTime * 0.4) * 0.08; // Wobble up/down
    }

    // Smooth cursor parallax offsets
    pointsRef.current.rotation.y += (targetMouseX - pointsRef.current.rotation.y) * 0.05;
    pointsRef.current.rotation.x += (targetMouseY - pointsRef.current.rotation.x) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      />
    </points>
  );
}

export default function ThreeDParticles({ activeSkill }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loadedShapes, setLoadedShapes] = useState(null);

  // Load logo png templates on mount
  useEffect(() => {
    const urls = {
      node: "/images/node-logo.png",
      mysql: "/images/mysql-logo.png",
      java: "/images/java-logo.png",
      tools: "/images/tools-logo.png"
    };

    const loaded = {};
    
    // Generate React logo procedurally for perfect orbits and nucleus definition
    loaded.react = generateReactShape(PARTICLE_COUNT);

    let loadCount = 0;
    const keys = Object.keys(urls);

    keys.forEach((key) => {
      loadLogoParticles(urls[key], PARTICLE_COUNT, (data) => {
        loaded[key] = data;
        loadCount++;
        if (loadCount === keys.length) {
          setLoadedShapes({ ...loaded });
        }
      });
    });
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const w = window.innerWidth;
    const h = window.innerHeight;
    mouseRef.current.x = (clientX / w) * 2 - 1;
    mouseRef.current.y = -(clientY / h) * 2 + 1;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[350px] relative select-none rounded-[1.25rem] overflow-hidden">
      {/* Dark backdrop specifically for light mode contrast */}
      <div className="absolute inset-0 opacity-0 particle-canvas-backdrop transition-opacity duration-500 pointer-events-none z-0" />
      
      {/* Accent glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        className="w-full h-full relative z-10"
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#00e5ff" />
        <pointLight position={[-5, -5, 5]} intensity={2} color="#7b61ff" />
        <ParticleMesh activeSkill={activeSkill} mouseRef={mouseRef} loadedShapes={loadedShapes} />
      </Canvas>
    </div>
  );
}

