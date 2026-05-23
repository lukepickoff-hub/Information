import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Grid, Line, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboardStore, DashboardId } from '../store/useDashboardStore';
import { useAtomicStore } from '../store/useAtomicStore';
import { ELEMENTS } from '../data/elements';
import { 
  createProceduralEarthTexture,
  createProceduralMoonTexture,
  createProceduralSunTexture,
  createProceduralMercuryTexture,
  createProceduralVenusTexture,
  createProceduralMarsTexture,
  createProceduralJupiterTexture,
  createProceduralSaturnTexture,
  createProceduralUranusTexture,
  createProceduralNeptuneTexture
} from '../utils/proceduralTextures';

export const ATOM_IDS: DashboardId[] = [
  'hydrogen', 'helium', 'lithium', 'beryllium', 'boron',
  'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon',
  'sodium', 'magnesium', 'aluminum', 'silicon', 'phosphorus',
  'sulfur', 'chlorine', 'argon', 'potassium', 'calcium'
];

// Unified 3D coordinates for all scales in the single spacetime continuum
export const OBJECT_COORDS: Record<DashboardId, [number, number, number]> = {
  sun: [0, 0, 0],
  mercury: [140, 0, 0],
  venus: [190, 0, 0],
  earth: [260, 0, 0],
  moon: [275, 0, 0],
  mars: [330, 0, 0],
  jupiter: [440, 0, 0],
  saturn: [560, 0, 0],
  uranus: [680, 0, 0],
  neptune: [790, 0, 0],
  skeleton: [262, 0, 0],
  cell: [262, 1.2, 0],
  mitochondria: [262, 1.2, 0.8],
  carbon: [262, 1.2, -0.8],
  oxygen: [262, 1.2, -1.2],
  hydrogen: [262, 1.2, -1.5],
  helium: [262, 1.2, -1.5],
  lithium: [262, 1.2, -1.5],
  beryllium: [262, 1.2, -1.5],
  boron: [262, 1.2, -1.5],
  nitrogen: [262, 1.2, -1.5],
  fluorine: [262, 1.2, -1.5],
  neon: [262, 1.2, -1.5],
  sodium: [262, 1.2, -1.5],
  magnesium: [262, 1.2, -1.5],
  aluminum: [262, 1.2, -1.5],
  silicon: [262, 1.2, -1.5],
  phosphorus: [262, 1.2, -1.5],
  sulfur: [262, 1.2, -1.5],
  chlorine: [262, 1.2, -1.5],
  argon: [262, 1.2, -1.5],
  potassium: [262, 1.2, -1.5],
  calcium: [262, 1.2, -1.5]
};

// Custom camerawork angles and focal zoom bounds for each physical structure scale
export const OBJECT_OFFSETS: Record<DashboardId, [number, number, number]> = {
  sun: [0, 80, 280],
  mercury: [0, 1.5, 2.5],
  venus: [0, 3, 5],
  earth: [0, 3, 5],
  moon: [0, 0.8, 1.5],
  mars: [0, 2, 3.5],
  jupiter: [0, 20, 35],
  saturn: [0, 18, 30],
  uranus: [0, 8, 15],
  neptune: [0, 8, 15],
  cell: [0, 0.008, 0.016],
  mitochondria: [0, 0.004, 0.008],
  skeleton: [0, 0.04, 0.08],
  hydrogen: [0, 0.0004, 0.0008],
  helium: [0, 0.0004, 0.0008],
  lithium: [0, 0.0004, 0.0008],
  beryllium: [0, 0.0004, 0.0008],
  boron: [0, 0.0004, 0.0008],
  carbon: [0, 0.0004, 0.0008],
  nitrogen: [0, 0.0004, 0.0008],
  oxygen: [0, 0.0004, 0.0008],
  fluorine: [0, 0.0004, 0.0008],
  neon: [0, 0.0004, 0.0008],
  sodium: [0, 0.0004, 0.0008],
  magnesium: [0, 0.0004, 0.0008],
  aluminum: [0, 0.0004, 0.0008],
  silicon: [0, 0.0004, 0.0008],
  phosphorus: [0, 0.0004, 0.0008],
  sulfur: [0, 0.0004, 0.0008],
  chlorine: [0, 0.0004, 0.0008],
  argon: [0, 0.0004, 0.0008],
  potassium: [0, 0.0004, 0.0008],
  calcium: [0, 0.0004, 0.0008]
};

const DynamicPosition = ({ id, children }: { id: DashboardId, children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  const interactMode = useDashboardStore(s => s.interactMode);
  const { simulationActive } = useDashboardStore();
  
  // Custom drag state
  const isDragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0,0,1), 0));
  const offset = useRef(new THREE.Vector3());
  const scaleRef = useRef(1);

  useFrame(() => {
    if (ref.current && !isDragging.current) {
      // Scale out standard items to prevent overlay when reaction simulation is active
      const targetScale = simulationActive ? 0 : 1;
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
      
      if (scaleRef.current < 0.001) {
        ref.current.visible = false;
      } else {
        ref.current.visible = true;
        ref.current.scale.setScalar(scaleRef.current);
      }

      ref.current.position.lerp(new THREE.Vector3(OBJECT_COORDS[id][0], OBJECT_COORDS[id][1], OBJECT_COORDS[id][2]), 0.2);
    }
  });

  const onPointerDown = (e: any) => {
    if (!interactMode || simulationActive) return;
    e.stopPropagation();
    isDragging.current = true;
    e.target.setPointerCapture(e.pointerId);

    // Create a plane facing the camera
    const cameraDir = e.camera.getWorldDirection(new THREE.Vector3());
    dragPlane.current.setFromNormalAndCoplanarPoint(cameraDir.clone().negate(), ref.current!.position);

    const intersection = new THREE.Vector3();
    e.ray.intersectPlane(dragPlane.current, intersection);
    if (intersection) {
      offset.current.copy(ref.current!.position).sub(intersection);
    }
  };

  const onPointerMove = (e: any) => {
    if (!isDragging.current || !interactMode || simulationActive) return;
    e.stopPropagation();

    const intersection = new THREE.Vector3();
    e.ray.intersectPlane(dragPlane.current, intersection);
    if (intersection) {
      ref.current?.position.copy(intersection.add(offset.current));
      
      if (ref.current) {
        OBJECT_COORDS[id] = [ref.current.position.x, ref.current.position.y, ref.current.position.z];
      }

      // Check CO2
      if (id === 'carbon' || id === 'oxygen') {
         const ox = OBJECT_COORDS.oxygen;
         const c = OBJECT_COORDS.carbon;
         const dist = Math.hypot(ox[0]-c[0], ox[1]-c[1], ox[2]-c[2]);
         if (dist < 1.0) {
            window.dispatchEvent(new CustomEvent('spacetime-reaction', { detail: 'CO2' }));
         }
      }
    }
  };

  const onPointerUp = (e: any) => {
    if (!interactMode) return;
    e.stopPropagation();
    isDragging.current = false;
    if (e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <group 
      ref={ref} 
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
    >
      {children}
    </group>
  );
};

const OrbitLine = ({ radius }: { radius: number }) => {
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      arr.push([radius * Math.cos(angle), 0, radius * Math.sin(angle)]);
    }
    return arr as any;
  }, [radius]);

  return <Line points={points} color="#ffffff" lineWidth={1} opacity={0.06} transparent />;
};

const MoonOrbitLine = ({ earthPos, radius }: { earthPos: [number, number, number]; radius: number }) => {
  const points = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      arr.push([radius * Math.cos(angle), 0, radius * Math.sin(angle)]);
    }
    return arr as any;
  }, [radius]);

  return (
    <group position={earthPos}>
      <Line points={points} color="#ffffff" lineWidth={1} opacity={0.12} transparent />
    </group>
  );
};

const OrbitalMechanics = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const interactMode = useDashboardStore.getState().interactMode;

    if (!interactMode) {
      // 1. Planetary orbitals spinning smoothly around the Sun
      // Mercury orbit
      const mercuryAngle = t * 0.40;
      OBJECT_COORDS.mercury = [Math.cos(mercuryAngle) * 140, 0, Math.sin(mercuryAngle) * 140];

      // Venus orbit
      const venusAngle = t * 0.28;
      OBJECT_COORDS.venus = [Math.cos(venusAngle) * 190, 0, Math.sin(venusAngle) * 190];

      // Earth orbit
      const earthAngle = t * 0.18;
      const ex = Math.cos(earthAngle) * 260;
      const ez = Math.sin(earthAngle) * 260;
      OBJECT_COORDS.earth = [ex, 0, ez];

      // Moon orbit around Earth
      const moonAngle = t * 1.1;
      OBJECT_COORDS.moon = [ex + Math.cos(moonAngle) * 15, 0, ez + Math.sin(moonAngle) * 15];

      // Mars orbit
      const marsAngle = t * 0.14;
      OBJECT_COORDS.mars = [Math.cos(marsAngle) * 330, 0, Math.sin(marsAngle) * 330];

      // Jupiter orbit
      const jupAngle = t * 0.09;
      OBJECT_COORDS.jupiter = [Math.cos(jupAngle) * 440, 0, Math.sin(jupAngle) * 440];

      // Saturn orbit
      const satAngle = t * 0.06;
      OBJECT_COORDS.saturn = [Math.cos(satAngle) * 560, 0, Math.sin(satAngle) * 560];

      // Uranus orbit
      const urAngle = t * 0.04;
      OBJECT_COORDS.uranus = [Math.cos(urAngle) * 680, 0, Math.sin(urAngle) * 680];

      // Neptune orbit
      const nepAngle = t * 0.025;
      OBJECT_COORDS.neptune = [Math.cos(nepAngle) * 790, 0, Math.sin(nepAngle) * 790];

      // 2. Microscopic & biologic objects travel alongside the Earth on its orbit!
      // Skeletal structure (represented on Earth's surface offset boundary)
      OBJECT_COORDS.skeleton = [ex + 2.0, 0, ez];

      // Cell
      OBJECT_COORDS.cell = [ex + 2.0, 1.2, ez];

      // Mitochondria nested near cell structures
      OBJECT_COORDS.mitochondria = [ex + 2.0, 1.2, ez + 0.8];

      // Arrange first 20 atoms in a beautiful micro-atomic spiral cluster revolving around the cell
      ATOM_IDS.forEach((atomId, index) => {
        const theta = (index / 20) * Math.PI * 2;
        const radius = 0.5 + (index * 0.06); // Spiral cluster dispersion
        OBJECT_COORDS[atomId] = [
          ex + 2.0 + Math.cos(theta) * radius,
          1.2 + Math.sin(theta * 1.5) * 0.1,
          ez + Math.sin(theta) * radius
        ];
      });
    }
  });

  const earthPos = OBJECT_COORDS.earth;

  return (
    <group>
      {/* Central Star Orbits */}
      <OrbitLine radius={140} />
      <OrbitLine radius={190} />
      <OrbitLine radius={260} />
      <OrbitLine radius={330} />
      <OrbitLine radius={440} />
      <OrbitLine radius={560} />
      <OrbitLine radius={680} />
      <OrbitLine radius={790} />

      {/* Lunar Satellite orbit */}
      <MoonOrbitLine earthPos={earthPos} radius={15} />

      {/* Direct Powers-of-Ten connecting guide beams in Earth scale space */}
      <Line 
        points={[
          [earthPos[0], earthPos[1], earthPos[2]],
          [OBJECT_COORDS.skeleton[0], OBJECT_COORDS.skeleton[1], OBJECT_COORDS.skeleton[2]]
        ]}
        color="#22d3ee"
        lineWidth={1.5}
        opacity={0.15}
        transparent
      />
      <Line 
        points={[
          [OBJECT_COORDS.skeleton[0], OBJECT_COORDS.skeleton[1], OBJECT_COORDS.skeleton[2]],
          [OBJECT_COORDS.cell[0], OBJECT_COORDS.cell[1], OBJECT_COORDS.cell[2]]
        ]}
        color="#38bdf8"
        lineWidth={1.5}
        opacity={0.15}
        transparent
      />
      <Line 
        points={[
          [OBJECT_COORDS.cell[0], OBJECT_COORDS.cell[1], OBJECT_COORDS.cell[2]],
          [OBJECT_COORDS.mitochondria[0], OBJECT_COORDS.mitochondria[1], OBJECT_COORDS.mitochondria[2]]
        ]}
        color="#a855f7"
        lineWidth={1.5}
        opacity={0.15}
        transparent
      />
    </group>
  );
};

// Sub-components:

// 1. Double-Accretion Star Glowing Shell (The Sun)
const SpacetimeSun = () => {
  const { activeTimelineStep, activeDashboardId } = useDashboardStore();
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  const isSunActive = activeDashboardId === 'sun';

  const texture = useMemo(() => {
    return createProceduralSunTexture(isSunActive ? activeTimelineStep : 3);
  }, [isSunActive, activeTimelineStep]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerRef.current) innerRef.current.rotation.y = t * 0.1;
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.15;
      outerRef.current.rotation.x = t * 0.05;
    }
  });

  const baseScale = isSunActive && activeTimelineStep === 5 ? 0.45 : isSunActive && activeTimelineStep === 4 ? 1.6 : 1.0;
  const sunColor = isSunActive && activeTimelineStep === 5 ? '#e2f8ff' : isSunActive && activeTimelineStep === 4 ? '#ff5555' : '#ffffff'; // white-base so texture colors register perfectly
  const emissiveColor = isSunActive && activeTimelineStep === 5 ? '#a5f3fc' : isSunActive && activeTimelineStep === 4 ? '#dc2626' : '#f59e0b';

  return (
    <group position={OBJECT_COORDS.sun} scale={[baseScale, baseScale, baseScale]}>
      {/* Prime Core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[109, 64, 64]} />
        <meshStandardMaterial 
          color={sunColor} 
          map={texture}
          roughness={0.1}
          emissive={new THREE.Color(emissiveColor)}
          emissiveIntensity={1.8}
        />
      </mesh>
      {/* Outer Corona Shield */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[112, 32, 32]} />
        <meshBasicMaterial 
          color={emissiveColor} 
          wireframe 
          transparent 
          opacity={activeTimelineStep === 1 ? 0.4 : 0.2} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
      {/* Extreme Thermal Nova Ring */}
      {activeTimelineStep === 5 && (
        <mesh>
          <sphereGeometry args={[180, 32, 32]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} wireframe />
        </mesh>
      )}
    </group>
  );
};

// Simple planet creator
const SpacetimePlanet = ({
  id,
  radius,
  color,
  hasRings = false,
  rotationSpeed = 0.05
}: {
  id: DashboardId;
  radius: number;
  color: string;
  hasRings?: boolean;
  rotationSpeed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    if (id === 'mercury') return createProceduralMercuryTexture();
    if (id === 'venus') return createProceduralVenusTexture();
    if (id === 'mars') return createProceduralMarsTexture();
    if (id === 'jupiter') return createProceduralJupiterTexture();
    if (id === 'saturn') return createProceduralSaturnTexture();
    if (id === 'uranus') return createProceduralUranusTexture();
    if (id === 'neptune') return createProceduralNeptuneTexture();
    return null;
  }, [id]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * rotationSpeed;
  });

  return (
    <DynamicPosition id={id}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={texture ? '#ffffff' : color} 
          map={texture || undefined}
          roughness={id === 'jupiter' || id === 'saturn' ? 0.2 : 0.6} 
          metalness={id === 'jupiter' || id === 'saturn' ? 0.05 : 0.1}
        />
      </mesh>
      {hasRings && (
        <mesh rotation={[Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshBasicMaterial color="#d4d4ca" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      )}
    </DynamicPosition>
  );
};

// 2. Biosphere Terran Mesh (The Earth)
const SpacetimeEarth = () => {
  const { activeTimelineStep, activeDashboardId } = useDashboardStore();
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const isEarthActive = activeDashboardId === 'earth';

  const texture = useMemo(() => {
    return createProceduralEarthTexture(isEarthActive ? activeTimelineStep : 3);
  }, [isEarthActive, activeTimelineStep]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.06;
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.08;
      cloudRef.current.rotation.x = t * 0.01;
    }
  });

  const earthColor = isEarthActive && activeTimelineStep === 1 ? '#ea580c' : isEarthActive && activeTimelineStep === 5 ? '#78716c' : '#ffffff'; // white-base to let map shine bright and clear

  return (
    <DynamicPosition id="earth">
      {/* Planet Globe */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial 
          color={earthColor}
          map={texture}
          roughness={0.4}
          metalness={0.15}
          emissive={new THREE.Color(isEarthActive && activeTimelineStep === 1 ? '#f97316' : '#000000')}
          emissiveIntensity={isEarthActive && activeTimelineStep === 1 ? 1.5 : 0}
        />
      </mesh>
      {/* Cloud & Atmosphere Layer */}
      {(!isEarthActive || (activeTimelineStep !== 1 && activeTimelineStep !== 5)) && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.02, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.25} 
            roughness={0.9}
          />
        </mesh>
      )}
      {/* Blue Atmospheric Aura */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial 
          color={isEarthActive && activeTimelineStep === 1 ? '#f97316' : '#38bdf8'} 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>
    </DynamicPosition>
  );
};

// 3. Lunar Satellite with Crater Geometry (The Moon)
const SpacetimeMoon = () => {
  const moonRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    return createProceduralMoonTexture();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (moonRef.current) moonRef.current.rotation.y = t * 0.02;
  });

  return (
    <DynamicPosition id="moon">
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial color="#ffffff" map={texture} roughness={0.9} />
      </mesh>
    </DynamicPosition>
  );
};

// 4. Dynamic, physics-accurate 3D Element Atom Model including electron shells and nuclei
const ElectronTrack = ({ shellRadius, speed, color, offset }: { shellRadius: number; speed: number; color: string; offset: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * shellRadius;
      ref.current.position.z = Math.sin(t) * shellRadius;
      ref.current.position.y = Math.sin(t * 1.2) * shellRadius * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

const SpacetimeAtom = ({ id, atomicNumber }: { id: DashboardId, atomicNumber: number }) => {
  const element = useMemo(() => ELEMENTS.find(e => e.atomicNumber === atomicNumber), [atomicNumber]);
  if (!element) return null;

  const nucleusParticles = useMemo(() => {
    const arr = [];
    const protons = element.atomicNumber;
    const neutrons = Math.round(element.mass) - protons;
    const total = protons + neutrons;
    const radius = 0.4 + (protons * 0.005);
    for (let i = 0; i < total; i++) {
      const isProton = i < protons;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.cbrt(Math.random()) * radius;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.push({ x, y, z, isProton });
    }
    return arr;
  }, [element]);

  return (
    <DynamicPosition id={id}>
      <group scale={0.0001}>
        {/* Dense Nucleus Core */}
        <group>
          {nucleusParticles.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color={p.isProton ? '#ef4444' : '#6b7280'} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* --- QUANTUM MECHANICS MODEL: Probability Electron Clouds --- */}
        {/* 1s spherical orbital cloud density */}
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color={element.color} transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* 2s spherical orbital cloud density (rendered for elements with elements in n=2 shell) */}
        {element.atomicNumber > 2 && (
          <mesh>
            <sphereGeometry args={[1.8, 20, 20]} />
            <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
          </mesh>
        )}

        {/* 2p dumbbell orbital clouds (dumbbell shapes along X, Y, Z coordinates for p-block elements) */}
        {element.atomicNumber >= 5 && (
          <group>
            {/* 2px orbital lobe pair along X axis */}
            <group rotation={[0, 0, 0]}>
              <mesh position={[-1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
              <mesh position={[1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
            </group>
            {/* 2py orbital lobe pair along Y axis */}
            <group rotation={[0, 0, Math.PI / 2]}>
              <mesh position={[-1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
              <mesh position={[1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
            </group>
            {/* 2pz orbital lobe pair along Z axis */}
            <group rotation={[0, Math.PI / 2, 0]}>
              <mesh position={[-1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
              <mesh position={[1.7, 0, 0]}>
                <sphereGeometry args={[0.42, 12, 12]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
              </mesh>
            </group>
          </group>
        )}

        {/* Bohr classical ring tracks for visual contrast indicator */}
        {element.electrons.map((count, shellIdx) => {
          const shellRadius = 1.4 + shellIdx * 0.9;
          return (
            <group key={shellIdx}>
              <mesh rotation={[Math.PI / 2 + (shellIdx * 0.15), (shellIdx * 0.2), 0]}>
                <ringGeometry args={[shellRadius, shellRadius + 0.02, 48]} />
                <meshBasicMaterial color={element.color} opacity={0.12 - shellIdx * 0.02} transparent side={THREE.DoubleSide} />
              </mesh>
              {Array.from({ length: count }).map((_, i) => (
                <ElectronTrack 
                  key={i} 
                  shellRadius={shellRadius} 
                  speed={4.0 / (shellIdx + 1)} 
                  color={element.color} 
                  offset={(i * Math.PI * 2) / count} 
                />
              ))}
            </group>
          );
        })}
      </group>
    </DynamicPosition>
  );
};

// 5. Organelles inside Eukaryotic Phospholipid Outer Shell
const SpacetimeCell = () => {
  const { activeTimelineStep } = useDashboardStore();
  const isDeath = activeTimelineStep === 5;

  return (
    <DynamicPosition id="mitochondria">
      <group scale={0.001}>
        {/* Outer Membrane with high-contrast scientific grid lines */}
        <mesh>
          <sphereGeometry args={[2.8, 24, 24]} />
          <meshStandardMaterial 
            color={isDeath ? '#475569' : '#0ea5e9'} 
            transparent 
            opacity={isDeath ? 0.04 : 0.15} 
            wireframe={true} 
            roughness={0.1}
          />
        </mesh>

        {/* Main Mitochondria Core */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group scale={[0.8, 0.8, 0.8]}>
            {/* Outer Capsule membrane */}
            <mesh>
              <capsuleGeometry args={[0.35, 1.0, 12, 16]} />
              <meshStandardMaterial color={isDeath ? '#475569' : '#f97316'} roughness={0.4} />
            </mesh>
            {/* Inner folded membrane representing CRISTAE geometry */}
            <mesh>
              <capsuleGeometry args={[0.3, 0.9, 12, 12]} />
              <meshStandardMaterial color={isDeath ? '#64748b' : '#fdba74'} wireframe opacity={0.3} transparent />
            </mesh>
            
            {/* Highly realistic internal folded cristae plates */}
            {!isDeath && (
              <group position={[0, -0.1, 0]}>
                <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.3]}>
                  <torusGeometry args={[0.22, 0.04, 8, 16]} />
                  <meshBasicMaterial color="#fdba74" />
                </mesh>
                <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.3]}>
                  <torusGeometry args={[0.22, 0.04, 8, 16]} />
                  <meshBasicMaterial color="#fdba74" />
                </mesh>
                <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.3]}>
                  <torusGeometry args={[0.22, 0.04, 8, 16]} />
                  <meshBasicMaterial color="#fdba74" />
                </mesh>
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.3]}>
                  <torusGeometry args={[0.22, 0.04, 8, 16]} />
                  <meshBasicMaterial color="#fdba74" />
                </mesh>
              </group>
            )}
          </group>
        </Float>

        {/* Cytoplasmic Lysosome Elements */}
        <Float speed={1.5} floatIntensity={0.3}>
          <mesh position={[1.2, -1.0, 0.8]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          <mesh position={[-1.2, 0.8, -0.6]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </Float>
      </group>
    </DynamicPosition>
  );
};

const SpacetimeEukaryoticCell = () => {
  const { activeTimelineStep } = useDashboardStore();
  const isDeath = activeTimelineStep === 5;

  return (
    <DynamicPosition id="cell">
      <group scale={0.001}>
        {/* Cell Plasma Membrane with glowing outer boundary wires */}
        <mesh>
          <sphereGeometry args={[3.2, 32, 16]} />
          <meshStandardMaterial 
            color={isDeath ? '#4b5563' : '#38bdf8'} 
            transparent 
            opacity={isDeath ? 0.05 : 0.18} 
            wireframe={true} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Nucleus Core inside the cell with inner nuclear chromatin wire and Nuclear Pores */}
        <group scale={[0.8, 0.8, 0.8]}>
          <mesh>
            <sphereGeometry args={[1.0, 24, 24]} />
            <meshStandardMaterial color={isDeath ? '#6b7280' : '#818cf8'} roughness={0.5} />
          </mesh>
          {/* Double membrane layer representation */}
          <mesh>
            <sphereGeometry args={[1.05, 24, 24]} />
            <meshStandardMaterial color={isDeath ? '#4b5563' : '#4f46e5'} transparent opacity={0.2} wireframe />
          </mesh>
          {/* Nuclear dot pores */}
          {!isDeath && (
            <group>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(angle) * 1.01, Math.sin(angle) * 0.4, Math.sin(angle) * 0.9]}>
                    <sphereGeometry args={[0.08, 6, 6]} />
                    <meshBasicMaterial color="#312e81" />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>

        {/* --- Endoplasmic Reticulum (ER) folded sheets surrounding the Nucleus --- */}
        {!isDeath && (
          <group scale={[0.8, 0.8, 0.8]}>
            <mesh rotation={[0.3, 0.2, 0]}>
              <torusGeometry args={[1.45, 0.05, 8, 24, Math.PI * 1.2]} />
              <meshStandardMaterial color="#ec4899" roughness={0.6} transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[-0.4, 0.5, 0.3]}>
              <torusGeometry args={[1.7, 0.04, 8, 24, Math.PI * 1.4]} />
              <meshStandardMaterial color="#ec4899" roughness={0.6} transparent opacity={0.3} />
            </mesh>
          </group>
        )}

        {/* --- Golgi Apparatus Stacks --- */}
        {!isDeath && (
          <group position={[1.5, -1.1, 0.6]} rotation={[0.4, 0.2, -0.3]}>
            <mesh position={[0, 0.14, 0]} scale={[1, 0.14, 0.4]}>
              <torusGeometry args={[0.5, 0.08, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.0, 0]} scale={[1, 0.14, 0.4]}>
              <torusGeometry args={[0.43, 0.08, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.14, 0]} scale={[1, 0.14, 0.4]}>
              <torusGeometry args={[0.36, 0.08, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* Floating Mitochondria organelles within the cytoplasm */}
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.2}>
          <group position={[1.4, 0.8, -0.5]} scale={[0.5, 0.5, 0.5]}>
            <mesh>
              <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
              <meshStandardMaterial color={isDeath ? '#4b5563' : '#f97316'} roughness={0.3} />
            </mesh>
            {/* folded inner mitochondria cristae stripes visual */}
            {!isDeath && (
              <mesh position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]}>
                <capsuleGeometry args={[0.25, 0.7, 8, 10]} />
                <meshStandardMaterial color="#fdba74" wireframe transparent opacity={0.5} />
              </mesh>
            )}
          </group>
          <group position={[-1.2, -1.0, 0.6]} scale={[0.4, 0.4, 0.4]}>
            <mesh>
              <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
              <meshStandardMaterial color={isDeath ? '#4b5563' : '#ef4444'} roughness={0.3} />
            </mesh>
          </group>
        </Float>

        {/* Small lysosome spheres and ribosomal dot particles */}
        <Float speed={1.2} floatIntensity={0.4}>
          <mesh position={[-1.5, 1.2, 0.4]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color={isDeath ? '#4b5563' : '#fcd34d'} />
          </mesh>
          <mesh position={[1.1, -1.3, -0.8]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color={isDeath ? '#4b5563' : '#ec4899'} />
          </mesh>
          {/* Ribosomal points */}
          {!isDeath && (
            <group>
              <mesh position={[-0.8, 1.2, -0.5]}>
                <sphereGeometry args={[0.05, 4, 4]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
              <mesh position={[0.5, 1.4, 0.6]}>
                <sphereGeometry args={[0.05, 4, 4]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
              <mesh position={[-0.6, -1.2, 0.8]}>
                <sphereGeometry args={[0.05, 4, 4]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
            </group>
          )}
        </Float>
      </group>
    </DynamicPosition>
  );
};

// 6. Stylized Skeletal Anatomy Nodes and connected Lines
const SpacetimeSkeleton = () => {
  const { activeTimelineStep } = useDashboardStore();
  const isDeath = activeTimelineStep === 5;

  // Static anatomical nodes layout centered locally
  const localNodes = useMemo(() => [
    { id: 'head', pos: [0, 2.2, 0], radius: 0.22 },
    { id: 'chest', pos: [0, 1.4, 0], radius: 0.15 },
    { id: 'pelvis', pos: [0, 0.5, 0], radius: 0.2 },
    { id: 'l_shoulder', pos: [-0.6, 1.4, 0], radius: 0.08 },
    { id: 'l_elbow', pos: [-0.9, 0.6, 0], radius: 0.06 },
    { id: 'l_hand', pos: [-1.0, -0.1, 0], radius: 0.05 },
    { id: 'r_shoulder', pos: [0.6, 1.4, 0], radius: 0.08 },
    { id: 'r_elbow', pos: [0.9, 0.6, 0], radius: 0.06 },
    { id: 'r_hand', pos: [1.0, -0.1, 0], radius: 0.05 },
    { id: 'l_hip', pos: [-0.3, 0.3, 0], radius: 0.09 },
    { id: 'l_knee', pos: [-0.4, -0.6, 0], radius: 0.07 },
    { id: 'l_foot', pos: [-0.4, -1.5, 0], radius: 0.06 },
    { id: 'r_hip', pos: [0.3, 0.3, 0], radius: 0.09 },
    { id: 'r_knee', pos: [0.4, -0.6, 0], radius: 0.07 },
    { id: 'r_foot', pos: [0.4, -1.5, 0], radius: 0.06 },
  ], []);

  const connections = useMemo(() => [
    ['head', 'chest'],
    ['chest', 'pelvis'],
    ['chest', 'l_shoulder'],
    ['l_shoulder', 'l_elbow'],
    ['l_elbow', 'l_hand'],
    ['chest', 'r_shoulder'],
    ['r_shoulder', 'r_elbow'],
    ['r_elbow', 'r_hand'],
    ['pelvis', 'l_hip'],
    ['l_hip', 'l_knee'],
    ['l_knee', 'l_foot'],
    ['pelvis', 'r_hip'],
    ['r_hip', 'r_knee'],
    ['r_knee', 'r_foot'],
  ], []);

  return (
    <DynamicPosition id="skeleton">
      <group scale={0.01}>
        {/* --- Skull Structure: Cranium + Mandible --- */}
        <group position={[0, 2.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#e2e8f0'} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.12, 0.08]} scale={[0.13, 0.1, 0.1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#cbd5e1'} roughness={0.7} />
          </mesh>
        </group>

        {/* --- Segmented Spinal Column (Vertebrae) --- */}
        <group>
          {Array.from({ length: 7 }).map((_, idx) => {
            const y = 0.5 + (idx / 6) * (1.45 - 0.5);
            return (
              <mesh key={idx} position={[0, y, 0]} scale={[0.12, 0.04, 0.08]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={isDeath ? '#475569' : '#f1f5f9'} roughness={0.7} />
              </mesh>
            );
          })}
        </group>

        {/* --- Horizontal Ribcage Hoops --- */}
        {!isDeath && (
          <group position={[0, 1.35, 0]}>
            <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
              <torusGeometry args={[0.3, 0.02, 6, 24]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, 0.10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
              <torusGeometry args={[0.35, 0.02, 6, 24]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.78, 1]}>
              <torusGeometry args={[0.36, 0.02, 6, 24]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
              <torusGeometry args={[0.28, 0.02, 6, 24]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.65} />
            </mesh>
          </group>
        )}

        {/* --- Pelvis bone girdle --- */}
        <group position={[0, 0.5, 0]} scale={[1.4, 0.4, 0.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.05, 6, 24]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#cbd5e1'} roughness={0.8} />
          </mesh>
        </group>

        {/* Node joint spheres */}
        {localNodes.map((n) => {
          // Skip drawing basic standard spheres for head, chest, pelvis since we built 3D anatomical models for them!
          if (n.id === 'head' || n.id === 'chest' || n.id === 'pelvis') return null;
          return (
            <mesh key={n.id} position={n.pos as [number, number, number]}>
              <sphereGeometry args={[n.radius, 12, 12]} />
              <meshBasicMaterial color={isDeath ? '#475569' : '#e2e8f0'} transparent opacity={isDeath ? 0.2 : 0.8} />
            </mesh>
          );
        })}

        {/* Structural bone polyline grids */}
        {connections.map((conn, i) => {
          const start = localNodes.find((n) => n.id === conn[0])!;
          const end = localNodes.find((n) => n.id === conn[1])!;
          return (
            <Line
              key={i}
              points={[start.pos as [number, number, number], end.pos as [number, number, number]]}
              color={isDeath ? '#475569' : '#e2e8f0'}
              lineWidth={3}
              transparent
              opacity={isDeath ? 0.1 : 0.5}
            />
          );
        })}
      </group>
    </DynamicPosition>
  );
};

// Smooth Camera Transition Controller that interpolates camera focus
const SpacetimeCameraController = ({ activeId }: { activeId: DashboardId }) => {
  const { camera, size } = useThree();
  const controlsRef = useRef<any>(null);
  const activeIdRef = useRef<DashboardId | null>(null);

  useEffect(() => {
    const handleZoomEvent = (e: any) => {
      if (!controlsRef.current) return;
      const target = controlsRef.current.target;
      const dir = camera.position.clone().sub(target);
      
      if (e.detail === 'in') {
        dir.multiplyScalar(0.75); // zoom in
      } else if (e.detail === 'out') {
        dir.multiplyScalar(1.33); // zoom out
      }
      
      // Enforce limits roughly
      const dist = dir.length();
      if (dist < 0.00001) dir.setLength(0.00001);
      if (dist > 15000) dir.setLength(15000);

      camera.position.copy(target).add(dir);
      controlsRef.current.update();
    };

    window.addEventListener('spacetime-zoom', handleZoomEvent as any);
    return () => window.removeEventListener('spacetime-zoom', handleZoomEvent as any);
  }, [camera]);

  useFrame(() => {
    const { simulationActive } = useDashboardStore.getState();
    const aspect = size.width / size.height;
    // Auto-detect narrower/portrait aspect ratios (typically mobile/portrait screens) and scale the zoom distance back to display fully without edge clipping!
    const aspectAdjustment = aspect < 1 ? Math.min(2.2, 1.1 / aspect) : 1;

    if (simulationActive) {
      if (controlsRef.current) {
        const targetCoordsVec = new THREE.Vector3(0, 0, 0);
        const currentTarget = controlsRef.current.target;
        currentTarget.lerp(targetCoordsVec, 0.1);

        const targetDist = 6.0 * aspectAdjustment;
        const currentDist = camera.position.distanceTo(currentTarget);
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.1);

        const dir = camera.position.clone().sub(currentTarget);
        if (dir.lengthSq() === 0) dir.set(0, 0, 1);
        dir.normalize();

        camera.position.copy(currentTarget).add(dir.multiplyScalar(newDist));
        controlsRef.current.update();
      }
      return;
    }

    const targetDistances: Record<string, number> = {
      sun: 200,
      jupiter: 25,
      saturn: 20,
      uranus: 10,
      neptune: 9,
      earth: 2.5,
      venus: 2.2,
      mars: 1.5,
      mercury: 1.0,
      moon: 0.8,
      skeleton: 0.08,
      cell: 0.025,
      mitochondria: 0.015,
      carbon: 0.0005,
      oxygen: 0.0005
    };

    if (controlsRef.current) {
      const targetCoordsVec = new THREE.Vector3(
        OBJECT_COORDS[activeId][0],
        OBJECT_COORDS[activeId][1],
        OBJECT_COORDS[activeId][2]
      );

      if (activeIdRef.current !== activeId) {
        // Transitional Lerp to lock onto the newly selected target's position
        const targetDist = (targetDistances[activeId] || 200) * aspectAdjustment;
        const currentTarget = controlsRef.current.target;
        currentTarget.lerp(targetCoordsVec, 0.08);

        const dir = camera.position.clone().sub(currentTarget);
        if (dir.lengthSq() === 0) dir.set(0, 0, 1);
        dir.normalize();

        const currentDist = camera.position.distanceTo(currentTarget);
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.08);
        camera.position.copy(currentTarget.clone().add(dir.multiplyScalar(newDist)));
        controlsRef.current.update();

        // Finish transition if close enough
        if (currentTarget.distanceTo(targetCoordsVec) < targetDist * 0.15 && Math.abs(currentDist - targetDist) < targetDist * 0.1) {
          activeIdRef.current = activeId;
        }
      } else {
        // Lock and Travel: Camera moves in sync with the orbital target's coordinates
        const currentTarget = controlsRef.current.target;
        const delta = targetCoordsVec.clone().sub(currentTarget);
        
        // Translate camera with the planet/object’s orbit
        camera.position.add(delta);
        currentTarget.copy(targetCoordsVec);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={0.00001}
      maxDistance={15000}
      enableDamping
      dampingFactor={0.05}
    />
  );
};

const LABEL_OFFSETS: Record<DashboardId, [number, number, number]> = {
  sun: [0, -120, 0],
  mercury: [0, -0.8, 0],
  venus: [0, -1.2, 0],
  earth: [0, -1.2, 0],
  moon: [0, -0.4, 0],
  mars: [0, -0.8, 0],
  jupiter: [0, -14, 0],
  saturn: [0, -11, 0],
  uranus: [0, -5, 0],
  neptune: [0, -5, 0],
  cell: [0, -0.05, 0],
  mitochondria: [0, -0.05, 0],
  skeleton: [0, -0.05, 0],
  hydrogen: [0, -0.05, 0],
  helium: [0, -0.05, 0],
  lithium: [0, -0.05, 0],
  beryllium: [0, -0.05, 0],
  boron: [0, -0.05, 0],
  carbon: [0, -0.05, 0],
  nitrogen: [0, -0.05, 0],
  oxygen: [0, -0.05, 0],
  fluorine: [0, -0.05, 0],
  neon: [0, -0.05, 0],
  sodium: [0, -0.05, 0],
  magnesium: [0, -0.05, 0],
  aluminum: [0, -0.05, 0],
  silicon: [0, -0.05, 0],
  phosphorus: [0, -0.05, 0],
  sulfur: [0, -0.05, 0],
  chlorine: [0, -0.05, 0],
  argon: [0, -0.05, 0],
  potassium: [0, -0.05, 0],
  calcium: [0, -0.05, 0]
};

const RANGES: Record<string, [number, number]> = {
  sun: [50, 15000],
  jupiter: [50, 15000],
  saturn: [50, 15000],
  uranus: [20, 15000],
  neptune: [20, 15000],
  mercury: [2, 100],
  venus: [2, 100],
  earth: [0.5, 100],
  mars: [1, 100],
  moon: [0.1, 5],
  skeleton: [0.01, 0.5],
  cell: [0.001, 0.08],
  mitochondria: [0.001, 0.05],
  hydrogen: [0.00001, 0.002],
  helium: [0.00001, 0.002],
  lithium: [0.00001, 0.002],
  beryllium: [0.00001, 0.002],
  boron: [0.00001, 0.002],
  carbon: [0.00001, 0.002],
  nitrogen: [0.00001, 0.002],
  oxygen: [0.00001, 0.002],
  fluorine: [0.00001, 0.002],
  neon: [0.00001, 0.002],
  sodium: [0.00001, 0.002],
  magnesium: [0.00001, 0.002],
  aluminum: [0.00001, 0.002],
  silicon: [0.00001, 0.002],
  phosphorus: [0.00001, 0.002],
  sulfur: [0.00001, 0.002],
  chlorine: [0.00001, 0.002],
  argon: [0.00001, 0.002],
  potassium: [0.00001, 0.002],
  calcium: [0.00001, 0.002]
};

const ScaleTracker = ({ activeId }: { activeId: DashboardId }) => {
  useFrame(({ camera }) => {
    const el = document.getElementById('scale-label-text');
    if (el) {
      const targetCoordsVec = new THREE.Vector3(
        OBJECT_COORDS[activeId][0],
        OBJECT_COORDS[activeId][1],
        OBJECT_COORDS[activeId][2]
      );
      const dist = camera.position.distanceTo(targetCoordsVec);
      let scaleName = "";
      if (dist > 50) {
        scaleName = "ASTRONOMICAL SCALE (AU)";
      } else if (dist > 1) {
        scaleName = "PLANETARY SCALE (10^4 km)";
      } else if (dist > 0.05) {
        scaleName = "BIOLOGICAL SCALE (m)";
      } else if (dist > 0.005) {
        scaleName = "CELLULAR SCALE (μm)";
      } else {
        scaleName = "ATOMIC SCALE (pm)";
      }
      if (el.innerText !== scaleName) {
        el.innerText = scaleName;
      }
    }
  });
  return null;
};

const SmartHtmlLabel = ({ id, isSelected, config, onSelectObject }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { simulationMode, simulationSelected, toggleSimulationSelected, simulationActive } = useDashboardStore();

  const isSimSelected = simulationSelected.includes(id);

  useFrame(({ camera }) => {
    if (ref.current) {
      if (simulationActive) {
        // Hide all floaty labels when the simulation itself is running
        ref.current.style.opacity = '0';
        ref.current.style.pointerEvents = 'none';
        return;
      }

      const targetCoordsVec = new THREE.Vector3(
        OBJECT_COORDS[id][0],
        OBJECT_COORDS[id][1],
        OBJECT_COORDS[id][2]
      );
      const dist = camera.position.distanceTo(targetCoordsVec);
      const [minD, maxD] = RANGES[id] || [0, 15000];
      const isVisible = dist >= minD && dist <= maxD;
      ref.current.style.opacity = isVisible ? '1' : '0';
      ref.current.style.pointerEvents = isVisible ? 'auto' : 'none';
      if (isSelected || isSimSelected) ref.current.style.opacity = '1'; // keep active
    }
  });

  // Calculate classes for simulation selection highlights
  const bgBorderClass = (() => {
    if (simulationMode) {
      if (isSimSelected) {
        return 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110 animate-pulse';
      }
      return 'bg-black/80 border-purple-500/20 text-purple-300/60 hover:text-purple-200 hover:border-purple-400/60 hover:bg-purple-950/20';
    }
    return isSelected 
      ? 'bg-black/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105' 
      : 'bg-black/70 border-white/10 text-white/40 group-hover:text-white/80 group-hover:border-white/30';
  })();

  return (
    <Html
      position={LABEL_OFFSETS[id as DashboardId]}
      distanceFactor={id === 'sun' ? 25 : id === 'earth' ? 5 : ATOM_IDS.includes(id as DashboardId) ? 0.005 : id === 'mitochondria' || id === 'cell' || id === 'skeleton' ? 0.05 : 12}
      className={`transition-opacity duration-300 pointer-events-auto`}
      center
    >
      <div 
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          if (simulationMode) {
            toggleSimulationSelected(id);
          } else {
            onSelectObject(id);
          }
        }}
        className="flex flex-col items-center group cursor-pointer select-none"
      >
        <div className={`px-3 py-1.5 rounded-sm border backdrop-blur-md flex flex-col font-mono text-[11px] tracking-wider uppercase shadow-lg transition-all duration-300 ${bgBorderClass}`}>
          <span className="font-bold tracking-wider whitespace-nowrap">
            {simulationMode ? (isSimSelected ? `🧪 IN CHAMBER: ${config.title}` : `⊕ SELECT: ${config.title}`) : config.title}
          </span>
        </div>
      </div>
    </Html>
  );
};

export interface ReactionData {
  title: string;
  formula: string;
  type: 'chemical' | 'nuclear' | 'gravitational' | 'biological';
  description: string;
  energy: string;
  mass: string;
  protons: number;
}

export const getReactionDetails = (selected: DashboardId[]): ReactionData => {
  const sorted = [...selected].sort();
  const has = (id: DashboardId) => sorted.includes(id);

  if (has('hydrogen') && has('oxygen')) {
    return {
      title: "Synthesis of Water (H₂O)",
      formula: "2H₂ + O₂ ➔ 2H₂O",
      type: "chemical",
      description: "Hydrogen and oxygen atoms bond covalently. The oxygen's high electronegativity draws electron density away from hydrogen nuclei, creating a highly stable polar bent structure with double covalent polar bonds.",
      energy: "-285.8 kJ/mol (Highly Exothermic)",
      mass: "18.015 amu (Neutral Node)",
      protons: 10
    };
  }
  if (has('carbon') && has('oxygen')) {
    return {
      title: "Carbon Dioxide (CO₂) Integration",
      formula: "C + O₂ ➔ CO₂",
      type: "chemical",
      description: "A single carbon atom shares four valence electrons with two polar oxygen nuclei, organizing in a straight linear layout. The symmetric double bonds neutralize electrostatic imbalances in the molecule.",
      energy: "-393.5 kJ/mol (Exothermic)",
      mass: "44.01 amu (Highly Stable Gas)",
      protons: 22
    };
  }
  if (has('hydrogen') && sorted.length >= 2 && sorted.every(x => x === 'hydrogen' || x === 'helium')) {
    return {
      title: "Solar Stellar Nuclear Fusion",
      formula: "¹H + ¹H ➔ ²H + e⁺ + ν_e ➔ He",
      type: "nuclear",
      description: "Thermonuclear fusion occurring under high stellar pressure. Massive gravitational constraints push proton centers beyond the Coulomb electro-barrier, causing strong nuclear forces to bind them.",
      energy: "+26.7 MeV (Thermonuclear Core Energy)",
      mass: "4.0026 amu (Helium Fused Orbit)",
      protons: 2
    };
  }
  if (has('sodium') && has('chlorine')) {
    return {
      title: "Sodium Chloride (NaCl) Ionic Bond",
      formula: "Na⁺ + Cl⁻ ➔ NaCl",
      type: "chemical",
      description: "Sodium donates its single valence electron to chlorine to reach argon electron shell levels. Both ion elements align, forming cubic electrostatic salt crystal microstructures.",
      energy: "-411.1 kJ/mol (Violent Salt Formation)",
      mass: "58.44 amu (Halite Structure)",
      protons: 28
    };
  }
  if (has('earth') && has('moon')) {
    return {
      title: "Gravitational Barycentric Interlock",
      formula: "F_g = G · (M_earth · M_moon) / r²",
      type: "gravitational",
      description: "A binary system orbit revolving around the common terrestrial gravity barycenter. Driven by tidal frictional kinetic energy, the moon lock-spins while slowly receding from earth.",
      energy: "-7.6e28 Joules (Newtonian Binding Energy)",
      mass: "6.04e24 kg (Combined Celestial System)",
      protons: 360000
    };
  }
  if (has('cell') && has('mitochondria')) {
    return {
      title: "Symbiotic Endosymbiosis Engine",
      formula: "Eukaryotic Cell + Proteobacterium ➔ Active Organelle",
      type: "biological",
      description: "An ancient host eukaryotic cell engulfs a specialized red-oxidative bacterium. Cellular structures coordinate to synthesize high density adenosine triphosphate (ATP) organelles.",
      energy: "High Adenosine Triphosphate Surplus (+38 ATP)",
      mass: "Microscopic Biome",
      protons: 120000000
    };
  }

  // Fallback hybrid reaction
  const names = selected.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' + ');
  const formulaSyms = selected.map(s => {
    if (s === 'hydrogen') return 'H';
    if (s === 'helium') return 'He';
    if (s === 'oxygen') return 'O';
    if (s === 'carbon') return 'C';
    if (s === 'cell') return 'Cell';
    if (s === 'mitochondria') return 'Mito';
    return s.slice(0, 2).toUpperCase();
  }).join(' · ');

  return {
    title: `Simulated Collision: ${names || 'Chamber Empty'}`,
    formula: formulaSyms ? `${formulaSyms} ➔ High-Vacuum Kinetic Hybrid` : 'No elements in chamber',
    type: "chemical",
    description: "The targeted materials collision triggers valence orbital excitation, particle trajectory bends, and ionization energy exchanges in high-accuracy scale chambers.",
    energy: "-120.5 kJ/mol (Transient Molecular State)",
    mass: "Transient Dynamic Mass",
    protons: selected.length * 6
  };
};

const SpacetimeSimulationViewer = () => {
  const { simulationActive, simulationSelected } = useDashboardStore();
  const groupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4;
      groupRef.current.rotation.x = t * 0.15;
    }
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y = -t * 0.8;
    }
  });

  if (!simulationActive || simulationSelected.length === 0) return null;

  const has = (id: DashboardId) => simulationSelected.includes(id);

  // Render different product views based on reaction type!
  const renderProduct = () => {
    if (has('hydrogen') && has('oxygen')) {
      // H2O
      return (
        <group>
          {/* Oxygen */}
          <mesh>
            <sphereGeometry args={[1.0, 32, 32]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.25} />
          </mesh>
          {/* Hydrogen 1 */}
          <group position={[-1.1, -0.8, 0]}>
            <mesh>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            <Line points={[[0, 0, 0], [1.1, 0.8, 0]]} color="#22d3ee" lineWidth={3} opacity={0.6} transparent />
          </group>
          {/* Hydrogen 2 */}
          <group position={[1.1, -0.8, 0]}>
            <mesh>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            <Line points={[[0, 0, 0], [-1.1, 0.8, 0]]} color="#22d3ee" lineWidth={3} opacity={0.6} transparent />
          </group>
          {/* Shared Orbit Ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.4, 0.05, 8, 32]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
          </mesh>
        </group>
      );
    }

    if (has('carbon') && has('oxygen')) {
      // CO2
      return (
        <group>
          {/* Carbon */}
          <mesh>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial color="#374151" roughness={0.5} />
          </mesh>
          {/* Oxygen Left */}
          <group position={[-1.7, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.75, 24, 24]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>
            {/* Double bonded cylinders */}
            <mesh position={[0.85, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 1.7]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[0.85, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 1.7]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          </group>
          {/* Oxygen Right */}
          <group position={[1.7, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.75, 24, 24]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>
            {/* Double bonded cylinders */}
            <mesh position={[-0.85, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 1.7]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[-0.85, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 1.7]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          </group>
        </group>
      );
    }

    if (has('hydrogen') && simulationSelected.every(x => x === 'hydrogen' || x === 'helium')) {
      // Stellar Fusion
      return (
        <group>
          <mesh>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.3} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.95, 32, 32]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2.0} roughness={0.1} />
          </mesh>
          {/* Solar corona ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.6, 0.07, 8, 48]} />
            <meshBasicMaterial color="#ea580c" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[1.9, 0.03, 8, 48]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.4} />
          </mesh>
        </group>
      );
    }

    if (has('sodium') && has('chlorine')) {
      // NaCl ionic crystal lattice
      return (
        <group>
          {/* Draw a tiny 3D lattice of sodium (purple) and chlorine (green) */}
          <mesh position={[-0.8, -0.8, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#a855f7" roughness={0.2} emissive="#a855f7" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0.8, -0.8, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#22c55e" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[-0.8, 0.8, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#22c55e" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0.8, 0.8, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#a855f7" roughness={0.2} emissive="#a855f7" emissiveIntensity={0.2} />
          </mesh>
          {/* Connectors */}
          <Line points={[[-0.8, -0.8, 0], [0.8, -0.8, 0]]} color="#e9d5ff" lineWidth={2} />
          <Line points={[[-0.8, 0.8, 0], [0.8, 0.8, 0]]} color="#e9d5ff" lineWidth={2} />
          <Line points={[[-0.8, -0.8, 0], [-0.8, 0.8, 0]]} color="#e9d5ff" lineWidth={2} />
          <Line points={[[0.8, -0.8, 0], [0.8, 0.8, 0]]} color="#e9d5ff" lineWidth={2} />
        </group>
      );
    }

    if (has('earth') && has('moon')) {
      // Gravitational barycentric orbit
      return (
        <group>
          {/* Tiny Earth */}
          <mesh position={[-1.2, 0, 0]}>
            <sphereGeometry args={[0.7, 24, 24]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.4} />
          </mesh>
          {/* Tiny Moon */}
          <mesh position={[1.8, 0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.8} />
          </mesh>
          {/* Connective force line and orbit trail */}
          <Line points={[[-1.2, 0, 0], [1.8, 0, 0]]} color="#22d3ee" lineWidth={2} opacity={0.6} transparent />
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.02, 8, 64]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.2} />
          </mesh>
        </group>
      );
    }

    if (has('cell') && has('mitochondria')) {
      // Cell Endosymbiosis
      return (
        <group>
          {/* Eukaryotic Cell boundary - big glassy capsule */}
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshStandardMaterial color="#10b981" transparent opacity={0.2} roughness={0.1} metalness={0.1} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.1} />
          </mesh>
          {/* Host Nucleus */}
          <mesh position={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#6366f1" roughness={0.3} />
          </mesh>
          {/* Bacterial Mitochondrion nested inside */}
          <mesh position={[0.6, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
            <meshStandardMaterial color="#ea580c" roughness={0.4} emissive="#f97316" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    }

    // Generic response molecule cluster
    return (
      <group>
        <mesh position={[-0.8, 0, 0]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshStandardMaterial color="#a855f7" roughness={0.4} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshStandardMaterial color="#ec4899" roughness={0.4} />
        </mesh>
        <Line points={[[-0.8, 0, 0], [0.8, 0, 0]]} color="#ffffff" lineWidth={3} opacity={0.7} transparent />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.04, 8, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Visual background energetic aura */}
      <mesh>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#0c101e" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Glow aura wireframe */}
      <mesh>
        <sphereGeometry args={[3.2, 16, 16]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Render the specific reactive model product */}
      {renderProduct()}

      {/* Embedded orbiting reaction sparkles */}
      <group ref={particleGroupRef}>
        {[...Array(24)].map((_, i) => {
          const theta = (i / 24) * Math.PI * 2;
          const phi = Math.sin(i * 1.7) * Math.PI / 4;
          const r = 2.4 + Math.sin(i * 0.9) * 0.4;
          const x = r * Math.cos(theta) * Math.cos(phi);
          const y = r * Math.sin(phi);
          const z = r * Math.sin(theta) * Math.cos(phi);
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#22d3ee" : "#ec4899"} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

interface SpacetimeCanvasProps {
  activeId: DashboardId;
  onSelectObject: (id: DashboardId) => void;
}

export const SpacetimeCanvas: React.FC<SpacetimeCanvasProps> = ({ activeId, onSelectObject }) => {
  const { 
    simulationMode, 
    setSimulationMode, 
    simulationSelected, 
    toggleSimulationSelected, 
    simulationActive, 
    setSimulationActive, 
    clearSimulation 
  } = useDashboardStore();

  const labels: Record<DashboardId, { title: string }> = {
    sun: { title: 'Sun' },
    mercury: { title: 'Mercury' },
    venus: { title: 'Venus' },
    earth: { title: 'Earth' },
    mars: { title: 'Mars' },
    jupiter: { title: 'Jupiter' },
    saturn: { title: 'Saturn' },
    uranus: { title: 'Uranus' },
    neptune: { title: 'Neptune' },
    moon: { title: 'Moon' },
    cell: { title: 'Eukaryotic Cell' },
    mitochondria: { title: 'Mitochondrion' },
    skeleton: { title: 'Skeletal System' },
    // First 20 elements dynamic labels generator
    ...Object.fromEntries(
      ATOM_IDS.map(id => [
        id, 
        { title: `${id.charAt(0).toUpperCase()}${id.slice(1)} Atom` }
      ])
    ) as Record<DashboardId, { title: string }>
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* 2D Absolute Overlay Cards for Simulation Mode */}
      {simulationMode && (
        <div id="simulator-overlay-hud" className="absolute top-20 left-6 z-40 w-80 max-h-[75%] bg-[#08080d]/95 border border-purple-500/20 rounded-lg p-5 flex flex-col gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.95)] overflow-y-auto backdrop-blur-xl animate-fade-in text-white/90">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧪</span>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#a855f7] uppercase leading-none">Chamber Core</h3>
                <p className="text-[10px] text-white/40 font-sans mt-1">Quantum Collision Simulator</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSimulationMode(false);
              }}
              className="text-white/40 hover:text-white/80 transition-colors font-mono text-[9px] uppercase border border-white/10 px-1.5 py-0.5 rounded bg-white/5"
            >
              Exit
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-mono tracking-wider uppercase text-white/40 block">Chamber Deposit (Max 3)</label>
            {simulationSelected.length === 0 ? (
              <div className="border border-dashed border-white/10 p-4 rounded text-center text-xs text-white/30 font-mono leading-relaxed">
                Chamber Empty.<br />
                <span className="text-[9px] text-[#a855f7] font-sans mt-1 block">Click objects in 3D Space, or select from the core catalog below!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {simulationSelected.map(id => {
                  const title = labels[id]?.title || id;
                  return (
                    <div key={id} className="flex items-center justify-between bg-purple-950/20 border border-purple-500/25 rounded px-2.5 py-1.5 text-xs font-mono">
                      <span className="text-purple-300 font-bold">☄️ {title}</span>
                      <button 
                        onClick={() => toggleSimulationSelected(id)}
                        className="text-[10px] text-red-400 hover:text-red-300 transition-colors px-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={simulationSelected.length === 0}
              onClick={() => {
                setSimulationActive(!simulationActive);
              }}
              className={`flex-1 py-2 rounded font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                simulationSelected.length === 0 
                  ? 'bg-neutral-800 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
                  : simulationActive
                    ? 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-[#a855f7]/90 border border-[#c084fc]/50 text-white hover:bg-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              }`}
            >
              {simulationActive ? '⏹ STOP SIMULATION' : '⚡ TRIGGER COLLISION'}
            </button>
            {simulationSelected.length > 0 && (
              <button 
                onClick={clearSimulation}
                className="px-2.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white/90 rounded bg-white/5 font-mono text-[10px]"
              >
                CLEAR
              </button>
            )}
          </div>

          {simulationActive && (() => {
            const details = getReactionDetails(simulationSelected);
            return (
              <div className="border-t border-white/5 pt-3.5 mt-1 space-y-3 font-mono text-[11px] animate-fade-in">
                <div className="bg-black/40 border border-[#a855f7]/10 p-2.5 rounded text-[10px] font-mono leading-relaxed space-y-2">
                  <div className="text-purple-400 font-bold border-b border-white/5 pb-1 flex items-center justify-between text-[11px]">
                    <span className="truncate pr-1">{details.title}</span>
                    <span className="text-[8px] uppercase px-1 rounded bg-[#a855f7]/25 text-purple-300 border border-[#c084fc]/20 shrink-0">{details.type}</span>
                  </div>
                  <div className="text-purple-300 font-mono text-xs font-bold tracking-widest bg-[#150e22] border border-[#a855f7]/20 p-1 text-center rounded animate-pulse">
                    {details.formula}
                  </div>
                  <p className="text-white/70 text-[10px] leading-normal font-sans pt-1">
                    {details.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest">Active Scale Telemetry</label>
                  <div className="space-y-1.5 bg-[#040406] border border-white/5 p-2 rounded">
                    <div>
                      <div className="flex justify-between text-[8px] text-white/40 mb-0.5">
                        <span>VALENCE BOND OVERLAP</span>
                        <span className="text-cyan-400 font-bold">98.4%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: '98.4%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[8px] text-white/40 mb-0.5">
                        <span>SIMULATION ENERGY</span>
                        <span className="text-amber-400 font-bold">{details.energy.split(' (')[0]}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[8.5px] text-white/50 font-mono">
                      <span>PRODUCT ENERGY:</span>
                      <span className="text-purple-300 font-bold">{details.energy}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Embedded Chemical Reactants Selector Bar */}
      {simulationMode && !simulationActive && (
        <div id="quick-reactants-bar" className="absolute bottom-[80px] left-6 right-6 z-40 bg-[#08080d]/90 border border-[#a855f7]/20 rounded-lg p-3 backdrop-blur-md flex flex-col gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center text-[10px] font-mono select-none px-1 text-white/40">
            <span>QUICK-SELECT REACTOR CORES (CLICK ITEMS TO DEPOSIT INTO CHAMBER)</span>
            <span className="text-purple-400 font-bold font-mono">CHAMBER DEPOSITED: {simulationSelected.length}/3</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {Object.entries({
              'hydrogen': 'H (Hydrogen)',
              'helium': 'He (Helium)',
              'sodium': 'Na (Sodium)',
              'chlorine': 'Cl (Chlorine)',
              'carbon': 'C (Carbon)',
              'oxygen': 'O (Oxygen)',
              'earth': 'Earth (Planet)',
              'moon': 'Moon (Satellite)',
              'cell': 'Eukaryotic Cell',
              'mitochondria': 'Mito Organelles'
            }).map(([id, name]) => {
              const isSelected = simulationSelected.includes(id as DashboardId);
              return (
                <button
                  key={id}
                  onClick={() => toggleSimulationSelected(id as DashboardId)}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono transition-all border whitespace-nowrap uppercase ${
                    isSelected 
                      ? 'bg-[#1a0e2a] border-purple-400 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.25)]' 
                      : 'bg-black/40 border-white/5 text-white/55 hover:border-purple-500/30 hover:bg-purple-950/20 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ ' : '＋ '}{name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
        <button 
          onClick={() => {
            const nextMode = !simulationMode;
            setSimulationMode(nextMode);
          }}
          className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all shadow-lg backdrop-blur flex items-center justify-center gap-1.5 border rounded-md ${
            simulationMode 
              ? 'bg-[#1a0e2a] border-purple-400 text-purple-300 font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
              : 'bg-[#08080d]/80 border-white/10 text-white/70 hover:border-purple-400/50 hover:bg-purple-950/30'
          }`}
          title={simulationMode ? "Exit Simulation Mode" : "Enable Quantum Collision Simulator"}
        >
          <span>🧪 SIMULATE</span>
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('spacetime-zoom', { detail: 'in' }))}
          className="w-10 h-10 bg-[#08080d]/80 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/30 rounded-md flex items-center justify-center text-white/70 hover:text-cyan-300 transition-all shadow-lg backdrop-blur mx-auto"
          title="Zoom In"
        >
          <span className="text-xl leading-none font-light">+</span>
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('spacetime-zoom', { detail: 'out' }))}
          className="w-10 h-10 bg-[#08080d]/80 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/30 rounded-md flex items-center justify-center text-white/70 hover:text-cyan-300 transition-all shadow-lg backdrop-blur mx-auto"
          title="Zoom Out"
        >
          <span className="text-xl leading-none font-light mb-1">-</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-50 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          <div className="text-[10px] font-mono text-cyan-400 tracking-widest font-bold uppercase drop-shadow-md" id="scale-label-text">
            PLANETARY SCALE
          </div>
          <div className="w-32 h-[1px] bg-cyan-500/50 relative">
            <div className="absolute left-0 top-[-3px] w-[1px] h-[7px] bg-cyan-400"></div>
            <div className="absolute right-0 top-[-3px] w-[1px] h-[7px] bg-cyan-400"></div>
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 200], fov: 45, near: 0.000001, far: 50000 }}>
        <ScaleTracker activeId={activeId} />
        <OrbitalMechanics />
        <color attach="background" args={['#000000']} />
        
        {/* Real-time Atmospheric Environmental Lights */}
        <ambientLight intensity={0.25} />
        <pointLight position={[10, 15, 10]} intensity={80} color="#ffedd5" distance={80} decay={1.5} />
        <pointLight position={[-15, -10, -10]} intensity={40} color="#38bdf8" distance={80} decay={1.5} />
        <directionalLight position={[0, -2, 0]} intensity={0.5} color="#111827" />

        {/* Dense Starfields */}
        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0.2} fade speed={1.2} />

        {/* Custom Simulation Viewer */}
        <SpacetimeSimulationViewer />

        {/* Scene Objects */}
        <SpacetimeSun />
        <SpacetimePlanet id="mercury" radius={0.38} color="#a3a3a3" rotationSpeed={0.01} />
        <SpacetimePlanet id="venus" radius={0.95} color="#ea580c" rotationSpeed={0.02} />
        <SpacetimeEarth />
        <SpacetimeMoon />
        <SpacetimePlanet id="mars" radius={0.53} color="#dc2626" />
        <SpacetimePlanet id="jupiter" radius={11.2} color="#d97706" rotationSpeed={0.15} />
        <SpacetimePlanet id="saturn" radius={9.4} color="#fef08a" rotationSpeed={0.14} hasRings={true} />
        <SpacetimePlanet id="uranus" radius={4.0} color="#2dd4bf" rotationSpeed={0.1} />
        <SpacetimePlanet id="neptune" radius={3.9} color="#3b82f6" rotationSpeed={0.11} />
        
        {ATOM_IDS.map((sym, idx) => (
          <SpacetimeAtom key={sym} id={sym} atomicNumber={idx + 1} />
        ))}
        <SpacetimeEukaryoticCell />
        <SpacetimeCell />
        <SpacetimeSkeleton />

        {/* Interactive Coordinate Target labels in 3D Space */}
        {(Object.keys(OBJECT_COORDS) as DashboardId[]).map((id) => {
          const isSelected = activeId === id;
          const config = labels[id] || { title: id };

          return (
            <DynamicPosition key={id} id={id}>
              <SmartHtmlLabel 
                id={id}
                isSelected={isSelected}
                config={config}
                onSelectObject={onSelectObject}
              />
            </DynamicPosition>
          );
        })}

        {/* Smooth Camera Interpolation System */}
        <SpacetimeCameraController activeId={activeId} />
      </Canvas>
    </div>
  );
};
