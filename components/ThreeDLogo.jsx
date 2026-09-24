import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeDLogo({ progress = 0 }) {
  const mountRef = useRef(null);
  const progressRef = useRef(progress);

  // Sync progress prop to ref without recreating the Three.js scene
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.0;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 25, 50);
    cyanLight.position.set(-3, 2, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7b61ff, 25, 50);
    purpleLight.position.set(3, -2, 3);
    scene.add(purpleLight);

    // 5. Draw "M", "S", "R" using precise vector shapes
    const extrudeSettings = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const mMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x7b61ff,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.1,
    });

    const sMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.1,
    });

    const rMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xec4899,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.1,
    });

    const letterGroup = new THREE.Group();

    // -- Letter M Shape --
    const mShape = new THREE.Shape();
    mShape.moveTo(-0.45, -0.45);
    mShape.lineTo(-0.45, 0.45);
    mShape.lineTo(-0.3, 0.45);
    mShape.lineTo(0, -0.05);
    mShape.lineTo(0.3, 0.45);
    mShape.lineTo(0.45, 0.45);
    mShape.lineTo(0.45, -0.45);
    mShape.lineTo(0.32, -0.45);
    mShape.lineTo(0.32, 0.18);
    mShape.lineTo(0, -0.22);
    mShape.lineTo(-0.32, 0.18);
    mShape.lineTo(-0.32, -0.45);
    mShape.closePath();

    const mGeo = new THREE.ExtrudeGeometry(mShape, extrudeSettings);
    mGeo.center();
    const mMesh = new THREE.Mesh(mGeo, mMaterial);
    mMesh.position.x = -1.1;
    letterGroup.add(mMesh);

    // -- Letter S Shape --
    const sShape = new THREE.Shape();
    sShape.moveTo(-0.35, -0.45);
    sShape.lineTo(0.35, -0.45);
    sShape.lineTo(0.35, -0.15);
    sShape.lineTo(-0.15, -0.15);
    sShape.lineTo(-0.15, -0.05);
    sShape.lineTo(0.35, -0.05);
    sShape.lineTo(0.35, 0.45);
    sShape.lineTo(-0.35, 0.45);
    sShape.lineTo(-0.35, 0.15);
    sShape.lineTo(0.15, 0.15);
    sShape.lineTo(0.15, 0.05);
    sShape.lineTo(-0.35, 0.05);
    sShape.closePath();

    const sGeo = new THREE.ExtrudeGeometry(sShape, extrudeSettings);
    sGeo.center();
    const sMesh = new THREE.Mesh(sGeo, sMaterial);
    sMesh.position.x = 0;
    letterGroup.add(sMesh);

    // -- Letter R Shape --
    const rShape = new THREE.Shape();
    rShape.moveTo(-0.38, -0.45);
    rShape.lineTo(-0.38, 0.45);
    rShape.lineTo(0.38, 0.45);
    rShape.lineTo(0.38, 0.0);
    rShape.lineTo(0.1, 0.0);
    rShape.lineTo(0.38, -0.45);
    rShape.lineTo(0.16, -0.45);
    rShape.lineTo(-0.08, 0.0);
    rShape.lineTo(-0.2, 0.0);
    rShape.lineTo(-0.2, -0.45);
    rShape.closePath();

    const rHole = new THREE.Path();
    rHole.moveTo(-0.2, 0.15);
    rHole.lineTo(0.2, 0.15);
    rHole.lineTo(0.2, 0.3);
    rHole.lineTo(-0.2, 0.3);
    rHole.closePath();
    rShape.holes.push(rHole);

    const rGeo = new THREE.ExtrudeGeometry(rShape, extrudeSettings);
    rGeo.center();
    const rMesh = new THREE.Mesh(rGeo, rMaterial);
    rMesh.position.x = 1.1;
    letterGroup.add(rMesh);

    scene.add(letterGroup);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let lastRotationY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentProgress = progressRef.current;

      if (letterGroup) {
        if (currentProgress < 75) {
          // Dynamic slow spin while loading
          letterGroup.rotation.y = elapsedTime * 1.6;
          letterGroup.rotation.x = Math.sin(elapsedTime * 1.5) * 0.12;
          letterGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.08;
          lastRotationY = letterGroup.rotation.y;
        } else {
          // Progress is 75-100: Align to the nearest multiple of 2*PI (so it stops flat facing forward)
          const targetY = Math.round(lastRotationY / (Math.PI * 2)) * (Math.PI * 2);
          const t = (currentProgress - 75) / 25; // 0 to 1
          const easeT = t * t * (3 - 2 * t); // Smooth step ease

          letterGroup.rotation.y = lastRotationY + (targetY - lastRotationY) * easeT;
          letterGroup.rotation.x = (Math.sin(elapsedTime * 1.5) * 0.12) * (1 - easeT);
          letterGroup.position.y = (Math.sin(elapsedTime * 2.0) * 0.08) * (1 - easeT);
        }
      }

      // Emissive pulse
      const pulseIntensity = 0.5 + Math.sin(elapsedTime * 3.0) * 0.2;
      mMaterial.emissiveIntensity = pulseIntensity;
      sMaterial.emissiveIntensity = pulseIntensity;
      rMaterial.emissiveIntensity = pulseIntensity;

      // Orbit point lights
      cyanLight.position.x = Math.sin(elapsedTime * 1.5) * 4;
      cyanLight.position.z = Math.cos(elapsedTime * 1.5) * 4;

      purpleLight.position.x = -Math.sin(elapsedTime * 1.5) * 4;
      purpleLight.position.z = -Math.cos(elapsedTime * 1.5) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      mGeo.dispose();
      sGeo.dispose();
      rGeo.dispose();
      mMaterial.dispose();
      sMaterial.dispose();
      rMaterial.dispose();
      
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full absolute inset-0" />;
}
