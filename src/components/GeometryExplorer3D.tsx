import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GeometryExplorer3DProps {
  className?: string;
}

type ShapeType = 'cube' | 'sphere' | 'cylinder';

export default function GeometryExplorer3D({ className }: GeometryExplorer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [shape, setShape] = useState<ShapeType>('cube');
  const [color, setColor] = useState('#22c55e');
  const [scale, setScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  // Crear geometría según el tipo
  const createGeometry = (type: ShapeType): THREE.BufferGeometry => {
    switch (type) {
      case 'cube':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'sphere':
        return new THREE.SphereGeometry(0.5, 32, 32);
      case 'cylinder':
        return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  };

  // Inicializar escena
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(2, 2, 3);
    cameraRef.current = camera;

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Mesh inicial
    const geometry = createGeometry(shape);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.4,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.setScalar(scale);
    scene.add(mesh);
    meshRef.current = mesh;

    // Plano para sombras
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    scene.add(plane);

    // Función de animación
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && isAnimating && meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.01;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Manejar resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Actualizar forma
  useEffect(() => {
    if (!meshRef.current || !sceneRef.current) return;

    const scene = sceneRef.current;
    const oldMesh = meshRef.current;

    // Remover mesh anterior
    scene.remove(oldMesh);
    oldMesh.geometry.dispose();
    if (Array.isArray(oldMesh.material)) {
      oldMesh.material.forEach(mat => mat.dispose());
    } else {
      oldMesh.material.dispose();
    }

    // Crear nueva geometría
    const geometry = createGeometry(shape);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.4,
      metalness: 0.1
    });
    const newMesh = new THREE.Mesh(geometry, material);
    newMesh.castShadow = true;
    newMesh.receiveShadow = true;
    newMesh.scale.setScalar(scale);
    scene.add(newMesh);
    meshRef.current = newMesh;
  }, [shape]);

  // Actualizar color
  useEffect(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.color.set(color);
  }, [color]);

  // Actualizar escala
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(scale);
  }, [scale]);

  // Actualizar rotación automática
  useEffect(() => {
    setIsAnimating(autoRotate);
  }, [autoRotate]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        {/* Selector de forma */}
        <div>
          <label htmlFor="shape-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Forma
          </label>
          <select
            id="shape-select"
            value={shape}
            onChange={(e) => setShape(e.target.value as ShapeType)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="cube">Cubo</option>
            <option value="sphere">Esfera</option>
            <option value="cylinder">Cilindro</option>
          </select>
        </div>

        {/* Selector de color */}
        <div>
          <label htmlFor="color-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Color
          </label>
          <input
            id="color-input"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer"
          />
        </div>

        {/* Control de escala */}
        <div>
          <label htmlFor="scale-range" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Escala: {scale.toFixed(1)}
          </label>
          <input
            id="scale-range"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Control de rotación */}
        <div className="flex items-end">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-pressed={autoRotate}
          >
            {autoRotate ? 'Pausar Rotación' : 'Reanudar Rotación'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={mountRef}
        className="w-full h-96 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
        role="img"
        aria-label={`Visualización 3D de ${shape} con rotación ${autoRotate ? 'automática' : 'manual'}`}
      />
    </div>
  );
}