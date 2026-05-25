import React, { useRef, useMemo, useEffect, useState } from 'react';
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
  human: [262, -0.2, 1.6],
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
  human: [0, 0.04, 0.08],
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
  const { simulationActive, simulationMode, toggleSimulationSelected, setDashboardId } = useDashboardStore();
  
  // Custom drag state
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
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
    hasMoved.current = false;
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
    hasMoved.current = true;

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

  const onClick = (e: any) => {
    e.stopPropagation();
    if (hasMoved.current) {
      hasMoved.current = false;
      return;
    }

    if (simulationMode) {
      toggleSimulationSelected(id);
    } else {
      setDashboardId(id);
      window.dispatchEvent(new CustomEvent('spacetime-reset-explanation'));
    }
  };

  return (
    <group 
      ref={ref} 
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onClick={onClick}
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

      // Human Body structure (clamped near the biological cluster)
      OBJECT_COORDS.human = [ex + 2.0, -0.2, ez + 1.2];

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
    <DynamicPosition id="sun">
      <group scale={[baseScale, baseScale, baseScale]}>
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
        <StructuralAnnotations id="sun" />
      </group>
    </DynamicPosition>
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
      <StructuralAnnotations id="earth" />
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

interface OrbitalConfiguration {
  shell: number;
  subshell: 's' | 'p' | 'd';
  count: number;
  axis?: 'x' | 'y' | 'z' | 'xy' | 'yz' | 'zx' | 'x2-y2' | 'z2';
}

const getOrbitalConfig = (Z: number): OrbitalConfiguration[] => {
  const configs: OrbitalConfiguration[] = [];
  let remaining = Z;

  // 1s shell (max 2)
  const e1s = Math.min(2, remaining);
  if (e1s > 0) {
    configs.push({ shell: 1, subshell: 's', count: e1s });
    remaining -= e1s;
  }

  // 2s shell (max 2)
  const e2s = Math.min(2, remaining);
  if (e2s > 0) {
    configs.push({ shell: 2, subshell: 's', count: e2s });
    remaining -= e2s;
  }

  // 2p shell (max 6)
  const e2p = Math.min(6, remaining);
  if (e2p > 0) {
    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    const counts = [0, 0, 0];
    for (let i = 0; i < e2p; i++) {
      counts[i % 3]++;
    }
    axes.forEach((axis, idx) => {
      if (counts[idx] > 0) {
        configs.push({ shell: 2, subshell: 'p', count: counts[idx], axis });
      }
    });
    remaining -= e2p;
  }

  // 3s shell (max 2)
  const e3s = Math.min(2, remaining);
  if (e3s > 0) {
    configs.push({ shell: 3, subshell: 's', count: e3s });
    remaining -= e3s;
  }

  // 3p shell (max 6)
  const e3p = Math.min(6, remaining);
  if (e3p > 0) {
    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    const counts = [0, 0, 0];
    for (let i = 0; i < e3p; i++) {
      counts[i % 3]++;
    }
    axes.forEach((axis, idx) => {
      if (counts[idx] > 0) {
        configs.push({ shell: 3, subshell: 'p', count: counts[idx], axis });
      }
    });
    remaining -= e3p;
  }

  // 4s and 3d shells (Transition region elements up to Zn=30)
  if (Z >= 19) {
    let e4s = 0;
    let e3d = 0;

    if (Z === 19) {
      e4s = 1; e3d = 0;
    } else if (Z === 20) {
      e4s = 2; e3d = 0;
    } else if (Z === 24) { // Chromium Exception
      e4s = 1; e3d = 5;
    } else if (Z === 29) { // Copper Exception
      e4s = 1; e3d = 10;
    } else {
      e4s = 2;
      e3d = Z - 20;
    }

    if (e4s > 0) {
      configs.push({ shell: 4, subshell: 's', count: e4s });
    }

    if (e3d > 0) {
      const axes: ('xy' | 'yz' | 'zx' | 'x2-y2' | 'z2')[] = ['xy', 'yz', 'zx', 'x2-y2', 'z2'];
      const counts = [0, 0, 0, 0, 0];
      for (let i = 0; i < e3d; i++) {
        counts[i % 5]++;
      }
      axes.forEach((axis, idx) => {
        if (counts[idx] > 0) {
          configs.push({ shell: 3, subshell: 'd', count: counts[idx], axis });
        }
      });
    }
  }

  return configs;
};

interface SingleQuantumOrbitalPointsProps {
  shell: number;
  subshell: 's' | 'p' | 'd';
  axis?: string;
  count: number;
  elementColor: string;
  cloudDensity: number;
  orbitalExcitation: number;
}

const SingleQuantumOrbitalPoints = ({
  shell,
  subshell,
  axis,
  count,
  elementColor,
  cloudDensity,
  orbitalExcitation
}: SingleQuantumOrbitalPointsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    // Generate distinct points based on subshell scale and sliders parameter
    const basePoints = subshell === 's' ? 180 : subshell === 'p' ? 220 : 260;
    const ptsCount = Math.round(basePoints * (cloudDensity / 40) * count);
    
    const posArr = new Float32Array(ptsCount * 3);
    const colArr = new Float32Array(ptsCount * 3);

    const baseColor = new THREE.Color(elementColor);
    const phaseColor = new THREE.Color();
    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);
    // Complementary quantum wave phase offset colour (+108 degrees)
    phaseColor.setHSL((hsl.h + 0.3) % 1.0, Math.min(1.0, hsl.s * 1.15), Math.max(0.4, hsl.l * 0.95));

    // Box-muller random gaussian function
    const randn = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random(); 
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const baseRadius = shell === 1 ? 0.9 : shell === 2 ? 1.8 : shell === 3 ? 2.8 : 4.0;

    for (let i = 0; i < ptsCount; i++) {
      let x = 0, y = 0, z = 0;
      let phaseIsPositive = true;

      if (subshell === 's') {
        const theta = Math.acos(2.0 * Math.random() - 1.0);
        const phi = Math.random() * Math.PI * 2.0;
        let r = baseRadius;

        if (shell === 1) {
          r = (0.5 + 0.5 * Math.abs(randn())) * baseRadius;
        } else if (shell === 2) {
          if (Math.random() < 0.15) {
            r = (0.3 + 0.3 * Math.abs(randn())) * 0.6; // Inner node peak
          } else {
            r = (0.7 + 0.3 * Math.abs(randn())) * baseRadius; // Outer shell peak
          }
        } else if (shell === 3) {
          const randVal = Math.random();
          if (randVal < 0.1) {
            r = (0.3 + 0.3 * Math.abs(randn())) * 0.35;
          } else if (randVal < 0.3) {
            r = (0.5 + 0.3 * Math.abs(randn())) * 1.25;
          } else {
            r = (0.8 + 0.25 * Math.abs(randn())) * baseRadius;
          }
        } else { // 4s shell
          const randVal = Math.random();
          if (randVal < 0.05) {
            r = (0.3 + 0.3 * Math.abs(randn())) * 0.2;
          } else if (randVal < 0.15) {
            r = (0.4 + 0.3 * Math.abs(randn())) * 1.0;
          } else if (randVal < 0.35) {
            r = (0.6 + 0.25 * Math.abs(randn())) * 2.3;
          } else {
            r = (0.8 + 0.22 * Math.abs(randn())) * baseRadius;
          }
        }

        x = r * Math.sin(theta) * Math.cos(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(theta);
        phaseIsPositive = true; // Uniform s sylvan shell
      } 
      else if (subshell === 'p') {
        const isPositiveLobe = Math.random() > 0.5;
        const sign = isPositiveLobe ? 1 : -1;
        const thetaDev = randn() * 0.28;
        const phiDev = Math.random() * Math.PI * 2.0;
        const r = (0.9 + randn() * 0.18) * baseRadius;

        const xLocal = sign * r * Math.cos(thetaDev);
        const yLocal = r * Math.sin(thetaDev) * Math.cos(phiDev);
        const zLocal = r * Math.sin(thetaDev) * Math.sin(phiDev);

        if (axis === 'x') {
          x = xLocal; y = yLocal; z = zLocal;
        } else if (axis === 'y') {
          x = yLocal; y = xLocal; z = zLocal;
        } else {
          x = zLocal; y = yLocal; z = xLocal;
        }

        phaseIsPositive = isPositiveLobe; // Opposite physical phases
      } 
      else if (subshell === 'd') {
        const r = (1.0 + randn() * 0.16) * baseRadius;
        
        if (axis === 'z2') {
          if (Math.random() < 0.6) {
            const isPositiveLobe = Math.random() > 0.5;
            const sign = isPositiveLobe ? 1 : -1;
            const thetaDev = randn() * 0.28;
            const phiDev = Math.random() * Math.PI * 2.0;

            x = r * Math.sin(thetaDev) * Math.cos(phiDev);
            y = r * Math.sin(thetaDev) * Math.sin(phiDev);
            z = sign * r * Math.cos(thetaDev);
            phaseIsPositive = true;
          } else {
            const phiTorus = Math.random() * Math.PI * 2.0;
            const rTorus = (0.6 + randn() * 0.12) * baseRadius;
            const zTorus = randn() * 0.15;

            x = rTorus * Math.cos(phiTorus);
            y = rTorus * Math.sin(phiTorus);
            z = zTorus;
            phaseIsPositive = false;
          }
        } else {
          const quadrant = Math.floor(Math.random() * 4);
          let phiCenter = 0;
          if (axis === 'xy' || axis === 'yz' || axis === 'zx') {
            phiCenter = Math.PI / 4.0 + quadrant * Math.PI / 2.0;
          } else if (axis === 'x2-y2') {
            phiCenter = quadrant * Math.PI / 2.0;
          }

          const dPhi = randn() * 0.16;
          const thetaDev = Math.PI / 2.0 + randn() * 0.16;

          const xLocal = r * Math.sin(thetaDev) * Math.cos(phiCenter + dPhi);
          const yLocal = r * Math.sin(thetaDev) * Math.sin(phiCenter + dPhi);
          const zLocal = r * Math.cos(thetaDev);

          if (axis === 'xy' || axis === 'x2-y2') {
            x = xLocal; y = yLocal; z = zLocal;
          } else if (axis === 'yz') {
            x = zLocal; y = xLocal; z = yLocal;
          } else {
            x = yLocal; y = zLocal; z = xLocal;
          }

          phaseIsPositive = quadrant % 2 === 0;
        }
      }

      // Record Positions
      posArr[i * 3] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;

      // Color coding representing quantum wave phases
      const chosenColor = phaseIsPositive ? baseColor : phaseColor;
      const distToOrigin = Math.sqrt(x*x + y*y + z*z);
      const densityIntensity = Math.max(0.35, Math.min(1.0, 1.25 - (distToOrigin / (baseRadius * 1.55))));
      
      colArr[i * 3] = chosenColor.r * densityIntensity;
      colArr[i * 3 + 1] = chosenColor.g * densityIntensity;
      colArr[i * 3 + 2] = chosenColor.b * densityIntensity;
    }

    return { positions: posArr, colors: colArr };
  }, [shell, subshell, axis, count, elementColor, cloudDensity]);

  useFrame((state) => {
    if (pointsRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const speed = elapsed * orbitalExcitation * (1.15 / shell);
      
      if (subshell === 'p') {
        if (axis === 'x') {
          pointsRef.current.rotation.x = speed * 0.12;
        } else if (axis === 'y') {
          pointsRef.current.rotation.y = speed * 0.12;
        } else {
          pointsRef.current.rotation.z = speed * 0.12;
        }
      } else if (subshell === 'd') {
        pointsRef.current.rotation.y = speed * 0.22;
        pointsRef.current.rotation.x = speed * 0.08;
      } else {
        pointsRef.current.rotation.y = speed * 0.06;
      }

      const pulse = 1.0 + Math.sin(elapsed * 2.5 * orbitalExcitation + shell) * 0.035;
      pointsRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          args={[colors, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

interface QuantumOrbitalCloudProps {
  Z: number;
  color: string;
  cloudDensity: number;
  orbitalExcitation: number;
}

const QuantumOrbitalCloud = ({
  Z,
  color,
  cloudDensity,
  orbitalExcitation
}: QuantumOrbitalCloudProps) => {
  const configs = useMemo(() => getOrbitalConfig(Z), [Z]);

  return (
    <group>
      {configs.map((cfg, idx) => (
        <SingleQuantumOrbitalPoints 
          key={`${cfg.shell}-${cfg.subshell}-${cfg.axis || 'none'}-${idx}`}
          shell={cfg.shell}
          subshell={cfg.subshell}
          axis={cfg.axis}
          count={cfg.count}
          elementColor={color}
          cloudDensity={cloudDensity}
          orbitalExcitation={orbitalExcitation}
        />
      ))}
    </group>
  );
};

interface SpacetimeAtomProps {
  id: DashboardId;
  atomicNumber: number;
  cloudDensity?: number;
  orbitalExcitation?: number;
  showBohrTracks?: boolean;
}

const SpacetimeAtom = ({ 
  id, 
  atomicNumber,
  cloudDensity = 40,
  orbitalExcitation = 1.5,
  showBohrTracks = true
}: SpacetimeAtomProps) => {
  const element = useMemo(() => ELEMENTS.find(e => e.atomicNumber === atomicNumber), [atomicNumber]);
  const quantumView = useDashboardStore(s => s.quantumView);

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

        {quantumView ? (
          <QuantumOrbitalCloud 
            Z={atomicNumber} 
            color={element.color} 
            cloudDensity={cloudDensity} 
            orbitalExcitation={orbitalExcitation} 
          />
        ) : (
          <>
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
          </>
        )}

        {/* Bohr classical ring tracks for visual contrast indicator */}
        {showBohrTracks && element.electrons.map((count, shellIdx) => {
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
        <StructuralAnnotations id="mitochondria" />
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
        <StructuralAnnotations id="cell" />
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
        <StructuralAnnotations id="skeleton" />
      </group>
    </DynamicPosition>
  );
};

const SpacetimeHuman = () => {
  const { activeTimelineStep } = useDashboardStore();
  const isDeath = activeTimelineStep === 5;
  const heartRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (heartRef.current) {
      if (isDeath) {
        heartRef.current.scale.setScalar(0.01);
      } else {
        // Double pulse cardiac physiological rhythm: beat-beat... pause... beat-beat
        const beatVal = Math.sin(t * 5.0) * Math.sin(t * 5.0 + 1.2);
        const pulseFactor = 1.0 + Math.max(0, beatVal) * 0.25;
        heartRef.current.scale.setScalar(pulseFactor);
      }
    }
  });

  return (
    <DynamicPosition id="human">
      <group scale={0.01}>
        {/* Physical outer transparent biological matrix envelope */}
        {!isDeath && (
          <group>
            {/* Shroud head space */}
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.15} wireframe />
            </mesh>
            {/* Torso organic shroud */}
            <mesh position={[0, 1.15, 0]}>
              <capsuleGeometry args={[0.38, 1.05, 8, 16]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.08} wireframe />
            </mesh>
            {/* Structural Limbs representation */}
            <group>
              {/* Left limb hand */}
              <mesh position={[-0.5, 1.1, 0]} rotation={[0, 0, -0.15]}>
                <capsuleGeometry args={[0.06, 0.9, 4, 8]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} wireframe />
              </mesh>
              {/* Right limb hand */}
              <mesh position={[0.5, 1.1, 0]} rotation={[0, 0, 0.15]}>
                <capsuleGeometry args={[0.06, 0.9, 4, 8]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} wireframe />
              </mesh>
              {/* Left lower extremity */}
              <mesh position={[-0.22, 0.1, 0]}>
                <capsuleGeometry args={[0.08, 1.1, 4, 8]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} wireframe />
              </mesh>
              {/* Right lower extremity */}
              <mesh position={[0.22, 0.1, 0]}>
                <capsuleGeometry args={[0.08, 1.1, 4, 8]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} wireframe />
              </mesh>
            </group>
          </group>
        )}

        {/* --- Brain/Cerebral Nervous Core --- */}
        <group position={[0, 2.22, 0.02]} scale={0.72}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color={isDeath ? '#475569' : '#ec4899'} 
              roughness={0.25}
              metalness={0.1}
              emissive={new THREE.Color(isDeath ? '#000000' : '#d946ef')}
              emissiveIntensity={isDeath ? 0 : 0.8}
            />
          </mesh>
          {/* Synaptic nerve halo rings */}
          {!isDeath && (
            <mesh rotation={[Math.PI / 4, Math.PI / 3, 0]}>
              <torusGeometry args={[0.22, 0.012, 4, 24]} />
              <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
            </mesh>
          )}
        </group>

        {/* --- Heart/Cardiovascular Pumping Core --- */}
        <group ref={heartRef} position={[0.04, 1.48, 0.1]} scale={0.65}>
          <mesh>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial 
              color={isDeath ? '#475569' : '#ff003c'} 
              emissive={new THREE.Color(isDeath ? '#000000' : '#ef4444')} 
              emissiveIntensity={isDeath ? 0 : 1.5}
            />
          </mesh>
        </group>

        {/* --- Respiratory Lungs --- */}
        <group position={[0, 1.45, 0.03]} scale={0.92}>
          <mesh position={[-0.11, 0, 0]} scale={[0.85, 1.2, 0.85]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#2dd4bf'} opacity={0.75} transparent />
          </mesh>
          <mesh position={[0.11, 0, 0]} scale={[0.85, 1.2, 0.85]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#2dd4bf'} opacity={0.75} transparent />
          </mesh>
        </group>

        {/* --- Digestive Metabolic Stomach --- */}
        <group position={[0, 0.98, 0.04]} scale={0.85}>
          <mesh>
            <capsuleGeometry args={[0.13, 0.3, 12, 12]} />
            <meshStandardMaterial color={isDeath ? '#475569' : '#8b5cf6'} opacity={0.7} transparent />
          </mesh>
        </group>

        {/* --- Interwoven Central Spinal Spinal Column --- */}
        <group scale={0.96}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const y = 0.55 + (idx / 5) * (1.35 - 0.55);
            return (
              <mesh key={idx} position={[0, y, -0.06]} scale={[0.07, 0.03, 0.04]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={isDeath ? '#475569' : '#e2e8f0'} roughness={0.8} />
              </mesh>
            );
          })}
        </group>
        <StructuralAnnotations id="human" />
      </group>
    </DynamicPosition>
  );
};

// Smooth Camera Transition Controller that interpolates camera focus and automates seamless microscope zooming
const SpacetimeCameraController = ({ activeId }: { activeId: DashboardId }) => {
  const { camera, size } = useThree();
  const controlsRef = useRef<any>(null);
  const activeIdRef = useRef<DashboardId | null>(null);
  const setDashboardId = useDashboardStore(s => s.setDashboardId);

  useEffect(() => {
    const handleZoomEvent = (e: any) => {
      if (!controlsRef.current) return;
      const target = controlsRef.current.target;
      const dir = camera.position.clone().sub(target);
      
      if (e.detail === 'in') {
        dir.multiplyScalar(0.70); // snappy zoom in
      } else if (e.detail === 'out') {
        dir.multiplyScalar(1.43); // snappy zoom out
      }
      
      // Lift zoom limits entirely to allow subatomic to cosmic scale zooming
      const dist = dir.length();
      if (dist < 1e-15) dir.setLength(1e-15);
      if (dist > 1e18) dir.setLength(1e18);

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
      human: 0.08,
      skeleton: 0.04,
      cell: 0.015,
      mitochondria: 0.006,
    };

    // Ensure all atomic elements are assigned correct focus and target scale distances
    ATOM_IDS.forEach(atomId => {
      if (!targetDistances[atomId]) {
        targetDistances[atomId] = 0.0004;
      }
    });

    if (controlsRef.current) {
      const targetCoordsVec = new THREE.Vector3(
        OBJECT_COORDS[activeId][0],
        OBJECT_COORDS[activeId][1],
        OBJECT_COORDS[activeId][2]
      );

      const currentTarget = controlsRef.current.target;
      const currentDist = camera.position.distanceTo(currentTarget);

      // --- SEAMLESS SCALE TRANSITION ZOOMING CONTROL ---
      // Monitors real-time distance and automatically steps into smaller/larger physical scales
      if (activeIdRef.current === activeId) {
        const isPlanet = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'moon'].includes(activeId);
        let minDist = 0.05;
        let maxDist = 50.0;
        let nextId: DashboardId | null = null;
        let prevId: DashboardId | null = null;

        if (activeId === 'sun') {
          minDist = 35.0;
          maxDist = 15000.0;
          nextId = 'earth';
          prevId = null;
        } else if (isPlanet) {
          minDist = 0.35;
          maxDist = 45.0; // Zoom out to astronomical scale
          nextId = 'human';
          prevId = 'sun';
        } else if (activeId === 'human') {
          minDist = 0.015;
          maxDist = 0.35;
          nextId = 'skeleton';
          prevId = 'earth';
        } else if (activeId === 'skeleton') {
          minDist = 0.007;
          maxDist = 0.015;
          nextId = 'cell';
          prevId = 'human';
        } else if (activeId === 'cell') {
          minDist = 0.0022;
          maxDist = 0.007;
          nextId = 'mitochondria';
          prevId = 'skeleton';
        } else if (activeId === 'mitochondria') {
          minDist = 0.0010;
          maxDist = 0.0022;
          nextId = 'carbon'; // Default to Carbon Atom when zooming down organelles
          prevId = 'cell';
        } else if (ATOM_IDS.includes(activeId)) {
          minDist = 1e-15; // Unlimited nucleus/subatomic zoom
          maxDist = 0.0010;
          nextId = null;
          prevId = 'mitochondria';
        }

        if (currentDist < minDist && nextId) {
          // STEP DOWN/ZOOM IN: seamless transition into smaller organic or atomic levels
          activeIdRef.current = nextId;
          setDashboardId(nextId);

          const nextCoords = new THREE.Vector3(
            OBJECT_COORDS[nextId][0],
            OBJECT_COORDS[nextId][1],
            OBJECT_COORDS[nextId][2]
          );
          const nextTargetDistance = targetDistances[nextId] || 0.0004;
          const dir = camera.position.clone().sub(currentTarget);
          if (dir.lengthSq() === 0) dir.set(0, 0, 1);
          dir.normalize();

          // Reposition camera cleanly at outer threshold of next target along the same perspective line
          camera.position.copy(nextCoords).add(dir.multiplyScalar(nextTargetDistance * 1.5));
          currentTarget.copy(nextCoords);
          controlsRef.current.update();
          return;
        } else if (currentDist > maxDist && prevId) {
          // STEP UP/ZOOM OUT: seamless transition into larger astronomical or physiological layers
          activeIdRef.current = prevId;
          setDashboardId(prevId);

          const prevCoords = new THREE.Vector3(
            OBJECT_COORDS[prevId][0],
            OBJECT_COORDS[prevId][1],
            OBJECT_COORDS[prevId][2]
          );
          const prevTargetDistance = targetDistances[prevId] || 200;
          const dir = camera.position.clone().sub(currentTarget);
          if (dir.lengthSq() === 0) dir.set(0, 0, 1);
          dir.normalize();

          // Reposition camera cleanly inside the parent scale bounds along the same perspective line
          camera.position.copy(prevCoords).add(dir.multiplyScalar(prevTargetDistance * 0.75));
          currentTarget.copy(prevCoords);
          controlsRef.current.update();
          return;
        }
      }

      // Standard transition lerps (like clicking side menus or initial landing)
      if (activeIdRef.current !== activeId) {
        // Transitional Lerp to lock onto the newly selected target's position
        const targetDist = (targetDistances[activeId] || 200) * aspectAdjustment;
        const currentTarget = controlsRef.current.target;
        currentTarget.lerp(targetCoordsVec, 0.08);

        const dir = camera.position.clone().sub(currentTarget);
        if (dir.lengthSq() === 0) dir.set(0, 0, 1);
        dir.normalize();

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
      minDistance={1e-15}
      maxDistance={1e18}
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
  human: [0, -0.05, 0],
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
  sun: [50, 1e18],
  jupiter: [50, 1e18],
  saturn: [50, 1e18],
  uranus: [20, 1e18],
  neptune: [20, 1e18],
  mercury: [2, 1e10],
  venus: [2, 1e10],
  earth: [0.5, 1e10],
  mars: [1, 1e10],
  moon: [0.1, 1e9],
  skeleton: [1e-15, 1e6],
  human: [1e-15, 1e6],
  cell: [1e-15, 1e6],
  mitochondria: [1e-15, 1e6],
  hydrogen: [1e-18, 1e4],
  helium: [1e-18, 1e4],
  lithium: [1e-18, 1e4],
  beryllium: [1e-18, 1e4],
  boron: [1e-18, 1e4],
  carbon: [1e-18, 1e4],
  nitrogen: [1e-18, 1e4],
  oxygen: [1e-18, 1e4],
  fluorine: [1e-18, 1e4],
  neon: [1e-18, 1e4],
  sodium: [1e-18, 1e4],
  magnesium: [1e-18, 1e4],
  aluminum: [1e-18, 1e4],
  silicon: [1e-18, 1e4],
  phosphorus: [1e-18, 1e4],
  sulfur: [1e-18, 1e4],
  chlorine: [1e-18, 1e4],
  argon: [1e-18, 1e4],
  potassium: [1e-18, 1e4],
  calcium: [1e-18, 1e4]
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
      if (dist > 15000) {
        scaleName = "COSMIC UNIVERSE SCALE (LY)";
      } else if (dist > 50) {
        scaleName = "ASTRONOMICAL SCALE (AU)";
      } else if (dist > 1) {
        scaleName = "PLANETARY SCALE (10^4 km)";
      } else if (dist > 0.05) {
        scaleName = "BIOLOGICAL SCALE (m)";
      } else if (dist > 0.005) {
        scaleName = "CELLULAR SCALE (μm)";
      } else if (dist > 0.0001) {
        scaleName = "ATOMIC SCALE (pm)";
      } else {
        scaleName = "QUANTUM & SUBATOMIC SCALE (fm)";
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
      distanceFactor={id === 'sun' ? 25 : id === 'earth' ? 5 : ATOM_IDS.includes(id as DashboardId) ? 0.005 : id === 'mitochondria' || id === 'cell' || id === 'skeleton' || id === 'human' ? 0.05 : 12}
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

// 5. Context-aware Interactive Structural Annotations
export const STRUCTURAL_ANNOTATIONS: Record<string, { name: string; desc: string; pos: [number, number, number]; labelOffset: [number, number, number] }[]> = {
  sun: [
    { name: "Thermonuclear Core", desc: "Temperatures exceed 15M Kelvin. Extreme plasma density fuses 600M tons of hydrogen per second.", pos: [0, 0, 0], labelOffset: [35, 45, 10] },
    { name: "Radiative Zone", desc: "Thermal gamma photons bounce inside dense helium ions for up to 100,000 years to escape.", pos: [55, 30, 0], labelOffset: [85, 75, 15] },
    { name: "Convective Zone", desc: "Boiling convection plasma currents cycle thermal kinetic buoyancy up to the photosphere.", pos: [85, -45, 0], labelOffset: [115, -70, 10] },
    { name: "Magnetic Corona", desc: "Superheated outer solar boundary atmosphere held by oscillating high-tension magnetic loops.", pos: [110, 65, 0], labelOffset: [125, 100, 20] }
  ],
  earth: [
    { name: "Biosphere Crust & Ocean", desc: "Absorbs CO2 inside oceanic sediment basins, regulating biological carbon cycles.", pos: [0, 1.0, 0], labelOffset: [1.3, 1.1, 0.2] },
    { name: "Viscous Silicate Mantle", desc: "Convection fields drive continental tectonic plates, locking mineral reserves downstream.", pos: [0, -0.4, 0.4], labelOffset: [-1.4, -0.7, 0.4] },
    { name: "Geodynamo Metal Core", desc: "Churning high-voltage iron-likeness currents generate the protective Magnetosphere shields.", pos: [0, 0, -0.2], labelOffset: [1.3, -0.4, -0.6] }
  ],
  cell: [
    { name: "Lipid Plasma Membrane", desc: "Semi-permeable lipid bilayer regulating nutrient-gated active transport.", pos: [0, 3.2, 0], labelOffset: [3.6, 1.4, 0.4] },
    { name: "Double Envelope Nucleus", desc: "Encapsulates chromatin strands, managing high-fidelity transcription of mRNA files.", pos: [0, 0, 0], labelOffset: [-2.6, 0.9, 0.8] },
    { name: "Rough Endoplasmic Reticulum", desc: "Embedded with dense ribosomal dots, translating peptide-chains for structural foldings.", pos: [0, -1.2, 1.2], labelOffset: [2.6, -1.6, 1.2] }
  ],
  mitochondria: [
    { name: "Outer Boundary Envelope", desc: "Porin membrane gates matching cytoplasm metabolites with internal organelles.", pos: [0, 0.8, 0], labelOffset: [1.1, 1.0, 0.2] },
    { name: "Inner Folded Cristae", desc: "Dense lipid folds tracking ETC membrane complexes to push ATP phosphate creations.", pos: [0, -0.3, 0.3], labelOffset: [-1.1, -0.4, 0.4] },
    { name: "Carbon Krebs Matrix Core", desc: "Soluble metabolic enzymes conducting Tricarboxylic Acid cycle, stripping hydrogen fuels.", pos: [0, 0, -0.1], labelOffset: [1.1, -0.3, -0.4] }
  ],
  skeleton: [
    { name: "Calcium Phosphate Lattice", desc: "Dense crystalline hydroxyapatite matrix providing high structural weight capacity.", pos: [0, 0.45, 0], labelOffset: [0.8, 0.6, 0.1] },
    { name: "Triple Helix Collagen Mesh", desc: "Fibrous structural framework giving bones high tensile flexibility and break resistance.", pos: [0, -0.3, 0], labelOffset: [-0.8, -0.4, 0.15] }
  ],
  human: [
    { name: "Myocardial Pacemaker", desc: "Rhythmic pace cells trigger localized high-frequency potentials driving blood transport.", pos: [0, 0.18, 0.3], labelOffset: [0.6, 0.3, 0.3] },
    { name: "Alveolar Respiration Membrane", desc: "Gas-exchange capillary networks exchanging blood carbon dioxide for clean air-oxygen.", pos: [-0.14, 0.05, 0.1], labelOffset: [-0.6, 0.2, 0.15] },
    { name: "Neural Cerebral Cortex", desc: "Highly dense synaptic myelinated neural cables executing sensory feedback and motor code.", pos: [0, 0.72, 0], labelOffset: [0.5, 0.8, 0.1] }
  ]
};

export const StructuralAnnotations = ({ id }: { id: string }) => {
  const showAnnotations = useDashboardStore(s => s.showAnnotations);
  if (!showAnnotations) return null;

  const annotations = STRUCTURAL_ANNOTATIONS[id];
  if (!annotations) return null;

  return (
    <group>
      {annotations.map((ann, i) => {
        const linePoints = [[0, 0, 0] as [number, number, number], ann.labelOffset] as [number, number, number][];
        const distanceFac = id === 'sun' ? 22 : id === 'earth' ? 5 : 0.055;

        return (
          <group key={`${id}-ann-${i}`} position={ann.pos}>
            {/* Core concentric sensor anchor */}
            <mesh>
              <sphereGeometry args={[id === 'sun' ? 1.5 : id === 'earth' ? 0.04 : 0.0015, 16, 16]} />
              <meshBasicMaterial color="#22d3ee" toneMapped={false} />
            </mesh>
            
            {/* Concentric pulsing outer sonar ripple */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[id === 'sun' ? 1.8 : id === 'earth' ? 0.05 : 0.0018, id === 'sun' ? 2.6 : id === 'earth' ? 0.08 : 0.0028, 32]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            
            {/* Technical annotation connection line */}
            <Line 
              points={linePoints} 
              color="#06b6d4" 
              lineWidth={1.2} 
              opacity={0.4} 
              transparent 
            />

            {/* Micro Cyberpunk HUD HTML Block overlay */}
            <Html 
              position={ann.labelOffset}
              distanceFactor={distanceFac}
              center
              className="pointer-events-none select-none z-50 animate-in fade-in duration-300"
            >
              <div className="bg-[#030305]/95 border border-cyan-500/25 px-2.5 py-1.5 rounded shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-md max-w-[170px] text-left">
                <div className="text-[8.5px] font-mono font-black text-cyan-400 uppercase tracking-widest border-b border-cyan-500/10 pb-1 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  🎯 {ann.name}
                </div>
                <div className="text-[8px] leading-relaxed text-white/80 font-sans font-semibold">
                  {ann.desc}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

interface SpacetimeSimulationViewerProps {
  cloudDensity?: number;
  orbitalExcitation?: number;
  showBohrTracks?: boolean;
  showFieldForceLines?: boolean;
}

const SpacetimeSimulationViewer: React.FC<SpacetimeSimulationViewerProps> = ({
  cloudDensity = 40,
  orbitalExcitation = 1.5,
  showBohrTracks = true,
  showFieldForceLines = true
}) => {
  const { simulationActive, simulationSelected } = useDashboardStore();
  const groupRef = useRef<THREE.Group>(null);
  const particleGroupRef = useRef<THREE.Group>(null);
  const coreFlashRef1 = useRef<THREE.Mesh>(null);
  const coreFlashRef2 = useRef<THREE.Mesh>(null);
  
  // High-frequency kinetic spark emitter states
  const [ionicElectronT, setIonicElectronT] = useState(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = t * 0.05;
    }
    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y = -t * 0.3 * orbitalExcitation;
    }
    
    // Animate ionic transfer packet
    setIonicElectronT((prev) => (prev + 0.03 * orbitalExcitation) % 1.0);

    // Periodic flash trigger for Fusion
    if (coreFlashRef1.current) {
      const flashValue = Math.max(0, Math.sin(t * 1.5 * orbitalExcitation));
      (coreFlashRef1.current.material as THREE.MeshBasicMaterial).opacity = flashValue * 0.25;
      coreFlashRef1.current.scale.setScalar(1.0 + flashValue * 1.2);
    }
    if (coreFlashRef2.current) {
      const flashValue2 = Math.max(0, Math.sin(t * 1.5 * orbitalExcitation + Math.PI / 2));
      (coreFlashRef2.current.material as THREE.MeshBasicMaterial).opacity = flashValue2 * 0.2;
      coreFlashRef2.current.scale.setScalar(1.0 + flashValue2 * 1.8);
    }
  });

  if (!simulationActive || simulationSelected.length === 0) return null;

  const has = (id: DashboardId) => simulationSelected.includes(id);

  // Render high-fidelity reactant complexes inside the quantum chamber
  const renderProduct = () => {
    if (has('hydrogen') && has('oxygen')) {
      // H2O Covalent Overlapping Orbitals
      return (
        <group>
          {/* Oxygen central core */}
          <group position={[0, 0, 0]}>
            <mesh>
              <sphereGeometry args={[1.1, 32, 32]} />
              <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.1} emissive="#ef4444" emissiveIntensity={0.25} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.5, 0.015, 8, 64]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.25} />
              </mesh>
            )}
          </group>

          {/* Hydrogen core 1 */}
          <group position={[-1.3, -0.9, 0]}>
            <mesh>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} emissive="#e2e8f0" emissiveIntensity={0.1} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[0.8, 0.015, 8, 32]} />
                <meshBasicMaterial color="#e2e8f0" transparent opacity={0.25} />
              </mesh>
            )}
            {/* Covalent energy bridge */}
            {showFieldForceLines && (
              <Line points={[[0, 0, 0], [1.3, 0.9, 0]]} color="#22d3ee" lineWidth={2} opacity={0.5} transparent />
            )}
          </group>

          {/* Hydrogen core 2 */}
          <group position={[1.3, -0.9, 0]}>
            <mesh>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} emissive="#e2e8f0" emissiveIntensity={0.1} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 3, -Math.PI / 4, 0]}>
                <torusGeometry args={[0.8, 0.015, 8, 32]} />
                <meshBasicMaterial color="#e2e8f0" transparent opacity={0.25} />
              </mesh>
            )}
            {/* Covalent energy bridge */}
            {showFieldForceLines && (
              <Line points={[[0, 0, 0], [-1.3, 0.9, 0]]} color="#22d3ee" lineWidth={2} opacity={0.5} transparent />
            )}
          </group>

          {/* Soft volumetric covalent overlap probability fields */}
          <group>
            {/* Left shared lobe */}
            <mesh position={[-0.65, -0.45, 0]} rotation={[0, 0, Math.atan2(-0.9, -1.3)]}>
              <sphereGeometry args={[0.75, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.DoubleSide} roughness={0.1} />
            </mesh>
            {/* Right shared lobe */}
            <mesh position={[0.65, -0.45, 0]} rotation={[0, 0, Math.atan2(-0.9, 1.3)]}>
              <sphereGeometry args={[0.75, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.DoubleSide} roughness={0.1} />
            </mesh>
          </group>

          {/* Shared Covalent figure-8 valence electron trails */}
          {Array.from({ length: Math.round(cloudDensity / 8) }).map((_, i) => {
            const speedFact = 1.6 * orbitalExcitation;
            const delayOffset = (i * Math.PI * 2) / Math.round(cloudDensity / 8);
            
            return (
              <group key={`h2o-el-${i}`}>
                {/* Loop 1: Oxygen to Hydrogen 1 */}
                <OrbitingElectron 
                  posA={[0, 0, 0]} 
                  posB={[-1.3, -0.9, 0]} 
                  speed={speedFact} 
                  delay={delayOffset} 
                  color="#22d3ee" 
                />
                {/* Loop 2: Oxygen to Hydrogen 2 */}
                <OrbitingElectron 
                  posA={[0, 0, 0]} 
                  posB={[1.3, -0.9, 0]} 
                  speed={speedFact} 
                  delay={delayOffset + Math.PI} 
                  color="#22d3ee" 
                />
              </group>
            );
          })}
        </group>
      );
    }

    if (has('carbon') && has('oxygen')) {
      // CO2 Linear Covalent Overlapping Orbitals
      return (
        <group>
          {/* Carbon center */}
          <group position={[0, 0, 0]}>
            <mesh>
              <sphereGeometry args={[1.0, 32, 32]} />
              <meshStandardMaterial color="#4b5563" roughness={0.5} emissive="#4b5563" emissiveIntensity={0.1} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.3, 0.01, 8, 32]} />
                <meshBasicMaterial color="#9ca3af" transparent opacity={0.2} />
              </mesh>
            )}
          </group>

          {/* Left Oxygen */}
          <group position={[-1.8, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.85, 24, 24]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                <torusGeometry args={[1.1, 0.01, 8, 32]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
              </mesh>
            )}
            {/* Double bonds */}
            {showFieldForceLines && (
              <>
                <Line points={[[0.1, 0.15, 0], [1.7, 0.15, 0]]} color="#f97316" lineWidth={2} opacity={0.65} transparent />
                <Line points={[[0.1, -0.15, 0], [1.7, -0.15, 0]]} color="#f97316" lineWidth={2} opacity={0.65} transparent />
              </>
            )}
          </group>

          {/* Right Oxygen */}
          <group position={[1.8, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.85, 24, 24]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, -Math.PI / 4, 0]}>
                <torusGeometry args={[1.1, 0.01, 8, 32]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
              </mesh>
            )}
            {/* Double bonds */}
            {showFieldForceLines && (
              <>
                <Line points={[[-0.1, 0.15, 0], [-1.7, 0.15, 0]]} color="#f97316" lineWidth={2} opacity={0.65} transparent />
                <Line points={[[-0.1, -0.15, 0], [-1.7, -0.15, 0]]} color="#f97316" lineWidth={2} opacity={0.65} transparent />
              </>
            )}
          </group>

          {/* Double overlapping sharing clouds */}
          <group>
            <mesh position={[-0.9, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#f97316" transparent opacity={0.06} side={THREE.DoubleSide} roughness={0.1} />
            </mesh>
            <mesh position={[0.9, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#f97316" transparent opacity={0.06} side={THREE.DoubleSide} roughness={0.1} />
            </mesh>
          </group>

          {/* High density linear shared electrons */}
          {Array.from({ length: Math.round(cloudDensity / 8) }).map((_, i) => {
            const speedFact = 1.8 * orbitalExcitation;
            const delayOffset = (i * Math.PI * 2) / Math.round(cloudDensity / 8);
            
            return (
              <group key={`co2-el-${i}`}>
                {/* Left side oscillator */}
                <OrbitingElectron 
                  posA={[0, 0, 0]} 
                  posB={[-1.8, 0, 0]} 
                  speed={speedFact} 
                  delay={delayOffset} 
                  color="#f97316" 
                />
                {/* Right side oscillator */}
                <OrbitingElectron 
                  posA={[0, 0, 0]} 
                  posB={[1.8, 0, 0]} 
                  speed={speedFact} 
                  delay={delayOffset + Math.PI} 
                  color="#f97316" 
                />
              </group>
            );
          })}
        </group>
      );
    }

    if (has('hydrogen') && simulationSelected.every(x => x === 'hydrogen' || x === 'helium')) {
      // Stellar Nuclear Fusion
      return (
        <group>
          {/* Confined ultra-dense star core */}
          <mesh>
            <sphereGeometry args={[1.0, 32, 32]} />
            <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={3.0} roughness={0.1} />
          </mesh>
          
          {/* Glowing magnetic confinement loop grids */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.7, 0.05, 8, 48]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.45} wireframe />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[1.9, 0.03, 8, 48]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} wireframe />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <torusGeometry args={[2.1, 0.02, 8, 48]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.3} wireframe />
          </mesh>

          {/* Expanding periodic fusion shockwaves linked to useFrame timers */}
          <mesh ref={coreFlashRef1}>
            <sphereGeometry args={[1.1, 32, 32]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={coreFlashRef2}>
            <sphereGeometry args={[1.1, 24, 24]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>

          {/* Protons spinning around collapsing orbitals */}
          {Array.from({ length: 4 }).map((_, i) => {
            const r = 2.8;
            return (
              <Float key={i} speed={4 * orbitalExcitation} rotationIntensity={0.8} floatIntensity={0.6}>
                <mesh position={[Math.sin(i * 1.5) * r, Math.cos(i * 1.5) * r * 0.4, Math.sin(i * 2) * 0.5]}>
                  <sphereGeometry args={[0.22, 12, 12]} />
                  <meshBasicMaterial color="#ef4444" toneMapped={false} />
                  {/* Glowing corona spark tail */}
                  <mesh scale={[1.3, 1.3, 1.3]}>
                    <sphereGeometry args={[0.22, 8, 8]} />
                    <meshBasicMaterial color="#fb923c" transparent opacity={0.3} side={THREE.BackSide} />
                  </mesh>
                </mesh>
              </Float>
            );
          })}
        </group>
      );
    }

    if (has('sodium') && has('chlorine')) {
      // Sodium + Chlorine Ionic Crystal Lattice Attraction
      const ionicSpacing = 1.3;
      const tProgress = ionicElectronT; // 0 to 1 loop

      // Cubic electron transfer coordinate calc
      const naPos: [number, number, number] = [-1.3, 0, 0];
      const clPos: [number, number, number] = [1.3, 0, 0];
      const electronPos: [number, number, number] = [
        naPos[0] + (clPos[0] - naPos[0]) * tProgress,
        Math.sin(tProgress * Math.PI) * 0.7, // Quadratic bend arc!
        0
      ];

      return (
        <group>
          {/* Sodium Cation (Na+) - Shrunken purple shell */}
          <group position={naPos}>
            <mesh>
              <sphereGeometry args={[0.55, 24, 24]} />
              <meshStandardMaterial color="#a855f7" roughness={0.1} emissive="#a855f7" emissiveIntensity={0.4} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.8, 0.015, 8, 32]} />
                <meshBasicMaterial color="#c084fc" transparent opacity={0.4} />
              </mesh>
            )}
            {/* Element state text label */}
            <Html position={[0, -0.9, 0]} center>
              <div className="text-[7.5px] font-mono bg-purple-950/70 border border-purple-500/20 px-1 py-0.5 rounded text-purple-300">Na⁺ (Cation)</div>
            </Html>
          </group>

          {/* Chlorine Anion (Cl-) - Expanded green shell */}
          <group position={clPos}>
            <mesh>
              <sphereGeometry args={[0.92, 24, 24]} />
              <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#10b981" emissiveIntensity={0.35} />
            </mesh>
            {/* Highly packed outermost valence shell */}
            <mesh>
              <sphereGeometry args={[1.05, 12, 12]} />
              <meshBasicMaterial color="#22c55e" wireframe transparent opacity={Math.max(0.05, Math.sin(tProgress * Math.PI * 2) * 0.15)} />
            </mesh>
            {showBohrTracks && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.012, 8, 32]} />
                <meshBasicMaterial color="#6ee7b7" transparent opacity={0.3} />
              </mesh>
            )}
            {/* Element state text label */}
            <Html position={[0, -1.2, 0]} center>
              <div className="text-[7.5px] font-mono bg-emerald-950/70 border border-emerald-500/20 px-1 py-0.5 rounded text-emerald-300">Cl⁻ (Anion)</div>
            </Html>
          </group>

          {/* Electrostatic potential bond vector */}
          {showFieldForceLines && (
            <Line points={[naPos, clPos]} color="#fbbf24" lineWidth={1.5} opacity={0.5} transparent />
          )}

          {/* Valence electron being actively transferred */}
          <mesh position={electronPos}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshBasicMaterial color="#facc15" toneMapped={false} />
            {/* Glow halo */}
            <mesh scale={[2.0, 2.0, 2.0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} side={THREE.BackSide} />
            </mesh>
          </mesh>

          {/* Particle ring sparkles when electron lands on Chlorine */}
          {tProgress > 0.85 && (
            <group position={clPos}>
              {Array.from({ length: 6 }).map((_, sparkIdx) => {
                const angle = (sparkIdx / 6) * Math.PI * 2;
                const sparkDist = 1.0 + (tProgress - 0.85) * 3;
                return (
                  <mesh key={sparkIdx} position={[Math.cos(angle) * sparkDist, Math.sin(angle) * sparkDist, 0]}>
                    <sphereGeometry args={[0.03, 4, 4]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={1.0 - (tProgress - 0.85) * 6} />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      );
    }

    if (has('earth') && has('moon')) {
      // Celestial Barycentre and Spacetime Gravity Field Wrap
      return (
        <group>
          {/* Gravitational space-time warp grid below them */}
          <group position={[0, -1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <gridHelper args={[12, 16, '#22d3ee', '#1e293b']} scale={[1, 1, 1]} />
          </group>

          {/* Earth */}
          <group position={[-1.7, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.75, 24, 24]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.1} />
            </mesh>
            <Html position={[0, -1.0, 0]} center>
              <div className="text-[7px] font-mono bg-blue-950/55 px-1 rounded text-blue-300">EARTH</div>
            </Html>
          </group>

          {/* Dynamic Barycentric flux line */}
          {showFieldForceLines && (
            <Line points={[[-1.7, 0, 0], [2.1, 0, 0]]} color="#ec4899" lineWidth={1.8} opacity={0.7} transparent />
          )}

          {/* Moon orbiting barycenter */}
          <group position={[2.1, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshStandardMaterial color="#9ca3af" roughness={0.9} />
            </mesh>
            <Html position={[0, -0.6, 0]} center>
              <div className="text-[7px] font-mono bg-neutral-900/55 px-1 rounded text-neutral-300">MOON</div>
            </Html>
          </group>
        </group>
      );
    }

    if (has('cell') && has('mitochondria')) {
      // Cell Endosymbiosis & Molecular Metabalic Channeling
      return (
        <group>
          {/* Glassy Eukaryotic Cell membrane boundary */}
          <mesh>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshStandardMaterial color="#10b981" transparent opacity={0.14} roughness={0.05} metalness={0.1} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.05} />
          </mesh>

          {/* Parent Host Cell Nucleus */}
          <group position={[-0.7, 0.2, 0.4]}>
            <mesh>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshStandardMaterial color="#6366f1" roughness={0.4} emissive="#4338ca" emissiveIntensity={0.1} />
            </mesh>
          </group>

          {/* Symbiotic Mitochondria charging ATP channel vectors */}
          <group position={[0.6, -0.3, -0.2]} rotation={[0, 0, Math.PI / 4]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.9, 16]} />
              <meshStandardMaterial color="#ea580c" roughness={0.3} emissive="#f97316" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.3, 16, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.3} emissive="#f97316" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, -0.45, 0]}>
              <sphereGeometry args={[0.3, 16, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.3} emissive="#f97316" emissiveIntensity={0.3} />
            </mesh>
          </group>

          {/* ATP energy phosphate spheres flowing out of Mitochondria in real-time */}
          {Array.from({ length: 5 }).map((_, flowIdx) => {
            const flowProgress = (ionicElectronT + flowIdx / 5) % 1.0;
            const startPos: [number, number, number] = [0.6, -0.3, -0.2];
            const endPos: [number, number, number] = [-0.7, 0.2, 0.4]; // Nucleus / cytoplasm receiver
            const x = startPos[0] + (endPos[0] - startPos[0]) * flowProgress;
            const y = startPos[1] + (endPos[1] - startPos[1]) * flowProgress + Math.sin(flowProgress * Math.PI) * 0.4;
            const z = startPos[2] + (endPos[2] - startPos[2]) * flowProgress;

            return (
              <mesh key={`atp-${flowIdx}`} position={[x, y, z]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#34d399" toneMapped={false} />
                <Html position={[0, -0.35, 0]} center>
                  <span className="text-[6.5px] font-mono text-emerald-400 font-bold tracking-widest scale-75 block">ATP</span>
                </Html>
              </mesh>
            );
          })}
        </group>
      );
    }

    // Default general Molecular connector
    return (
      <group>
        <mesh position={[-1.0, 0, 0]}>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial color="#a855f7" roughness={0.3} emissive="#a855f7" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[1.0, 0, 0]}>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial color="#ec4899" roughness={0.3} emissive="#ec4899" emissiveIntensity={0.15} />
        </mesh>
        {showFieldForceLines && (
          <Line points={[[-1.0, 0, 0], [1.0, 0, 0]]} color="#ffffff" lineWidth={2} opacity={0.6} transparent />
        )}
        {showBohrTracks && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.02, 8, 32]} />
            <meshBasicMaterial color="#c084fc" transparent opacity={0.3} />
          </mesh>
        )}
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Visual background vacuum cylinder container (Physic Chamber Bounding) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.8, 3.8, 7.8, 32, 1, true]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          wireframe 
          transparent 
          opacity={0.06} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Chamber structural containment locking seals */}
      <mesh position={[0, 3.9, 0]}>
        <torusGeometry args={[3.8, 0.08, 16, 64]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -3.9, 0]}>
        <torusGeometry args={[3.8, 0.08, 16, 64]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Volumetric atmosphere sphere inside the chamber */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#05050e" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Render the core physical reaction setup inside the containment seals */}
      {renderProduct()}

      {/* High-frequency quantum probability background cloud particle arrays */}
      <group ref={particleGroupRef}>
        {Array.from({ length: Math.round(cloudDensity * 0.8) }).map((_, i) => {
          const theta = (i / Math.round(cloudDensity * 0.8)) * Math.PI * 2;
          const phi = Math.sin(i * 1.6) * Math.PI / 4;
          const r = 2.0 + Math.sin(i * 0.8) * 0.5;
          const x = r * Math.cos(theta) * Math.cos(phi);
          const y = r * Math.sin(phi);
          const z = r * Math.sin(theta) * Math.cos(phi);
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshBasicMaterial 
                color={i % 2 === 0 ? "#22d3ee" : "#a855f7"} 
                transparent 
                opacity={0.55}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// Covalent back-and-forth electron vector simulator
const OrbitingElectron = ({ 
  posA, 
  posB, 
  speed, 
  delay, 
  color 
}: { 
  posA: [number, number, number]; 
  posB: [number, number, number]; 
  speed: number; 
  delay: number; 
  color: string; 
}) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + delay;
      // Smooth sinusoidal interpolation demonstrating true electron wave sharing back and forth!
      const factor = (Math.sin(t) + 1.0) / 2.0; 
      
      ref.current.position.x = posA[0] * (1.0 - factor) + posB[0] * factor;
      ref.current.position.y = posA[1] * (1.0 - factor) + posB[1] * factor + Math.sin(t * 2.0) * 0.15; // little wave wobble
      ref.current.position.z = posA[2] * (1.0 - factor) + posB[2] * factor;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.BackSide} />
      </mesh>
    </mesh>
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
    clearSimulation,
    activeReaction,
    quantumView,
    setQuantumView
  } = useDashboardStore();

  const [collisionSpeedPct, setCollisionSpeedPct] = useState<number>(50);
  const [cloudDensity, setCloudDensity] = useState<number>(40);
  const [orbitalExcitation, setOrbitalExcitation] = useState<number>(1.5);
  const [showBohrTracks, setShowBohrTracks] = useState<boolean>(true);
  const [showFieldForceLines, setShowFieldForceLines] = useState<boolean>(true);

  // Parse theoretical energy text from formatted string e.g. "-285.8 kJ/mol (Highly Exothermic)"
  const parseTheoreticalEnergyText = (energyStr: string) => {
    if (!energyStr) return { value: 0, unit: 'kJ/mol', isExothermic: true };
    const clean = energyStr.toLowerCase();
    const numMatch = energyStr.match(/-?[\d.]+(?:e\d+)?/);
    const val = numMatch ? parseFloat(numMatch[0]) : 0;
    
    let unit = 'kJ/mol';
    if (clean.includes('mev')) {
      unit = 'MeV';
    } else if (clean.includes('joule') || clean.includes('j ')) {
      unit = 'Joules';
    } else if (clean.includes('atp')) {
      unit = 'ATP';
    }
    
    return {
      value: Math.abs(val),
      unit,
      isExothermic: clean.includes('exothermic') || clean.includes('release') || clean.includes('surplus') || clean.includes('salt') || clean.includes('yield')
    };
  };

  const findAtomicMassAndNumber = (name: string) => {
    const clean = name.toLowerCase().trim();
    const matched = ELEMENTS.find(e => 
      clean.includes(e.name.toLowerCase()) || 
      clean.includes(e.symbol.toLowerCase())
    );
    if (matched) {
      return { mass: matched.mass, symbol: matched.symbol, protons: matched.atomicNumber, name: matched.name };
    }
    // Specific search fallbacks
    if (clean.includes('hydrogen') || clean.includes('deuterium') || clean === 'h' || clean.includes('protons') || clean.includes('proton')) {
      return { mass: 1.008, symbol: 'H', protons: 1, name: 'Hydrogen' };
    }
    if (clean.includes('helium') || clean === 'he') {
      return { mass: 4.0026, symbol: 'He', protons: 2, name: 'Helium' };
    }
    if (clean.includes('oxygen') || clean === 'o') {
      return { mass: 15.999, symbol: 'O', protons: 8, name: 'Oxygen' };
    }
    if (clean.includes('carbon') || clean === 'c') {
      return { mass: 12.011, symbol: 'C', protons: 6, name: 'Carbon' };
    }
    if (clean.includes('nitrogen') || clean === 'n') {
      return { mass: 14.007, symbol: 'N', protons: 7, name: 'Nitrogen' };
    }
    if (clean.includes('sodium') || clean === 'na') {
      return { mass: 22.99, symbol: 'Na', protons: 11, name: 'Sodium' };
    }
    if (clean.includes('chlorine') || clean === 'cl') {
      return { mass: 35.45, symbol: 'Cl', protons: 17, name: 'Chlorine' };
    }
    if (clean.includes('calcium') || clean === 'ca') {
      return { mass: 40.078, symbol: 'Ca', protons: 20, name: 'Calcium' };
    }
    if (clean.includes('potassium') || clean === 'k') {
      return { mass: 39.098, symbol: 'K', protons: 19, name: 'Potassium' };
    }
    if (clean.includes('magnesium') || clean === 'mg') {
      return { mass: 24.305, symbol: 'Mg', protons: 12, name: 'Magnesium' };
    }
    if (clean.includes('silicon') || clean === 'si') {
      return { mass: 28.085, symbol: 'Si', protons: 14, name: 'Silicon' };
    }
    if (clean.includes('phosphorus') || clean === 'p') {
      return { mass: 30.974, symbol: 'P', protons: 15, name: 'Phosphorus' };
    }
    if (clean.includes('sulfur') || clean === 's') {
      return { mass: 32.06, symbol: 'S', protons: 16, name: 'Sulfur' };
    }
    if (clean.includes('iron') || clean === 'fe') {
      return { mass: 55.845, symbol: 'Fe', protons: 26, name: 'Iron' };
    }
    if (clean.includes('copper') || clean === 'cu') {
      return { mass: 63.546, symbol: 'Cu', protons: 29, name: 'Copper' };
    }
    if (clean.includes('zinc') || clean === 'zn') {
      return { mass: 65.38, symbol: 'Zn', protons: 30, name: 'Zinc' };
    }
    if (clean.includes('mucin') || clean.includes('mucus') || clean.includes('glycoprotein')) {
      return { mass: 250.0, symbol: 'MUC', protons: 0, name: 'Mucin Glycoprotein' };
    }
    if (clean.includes('transpeptidase')) {
      return { mass: 45000, symbol: 'PBP', protons: 0, name: 'Transpeptidase enzyme' };
    }
    if (clean.includes('cellulase') || clean.includes('ligninase')) {
      return { mass: 52000, symbol: 'Enz', protons: 0, name: 'Exo-Cellulase' };
    }
    if (clean.includes('chitin')) {
      return { mass: 203.19, symbol: 'Chitin', protons: 0, name: 'Chitin Monomer' };
    }
    
    // Non-element fallbacks
    if (clean.includes('cell') || clean.includes('membrane')) {
      return { mass: 1e-12, symbol: 'Cell', protons: 0, name: 'Eukaryotic Cell' };
    }
    if (clean.includes('mitochondria') || clean.includes('organelle')) {
      return { mass: 1e-15, symbol: 'Mito', protons: 0, name: 'Mitochondria' };
    }
    if (clean.includes('earth')) {
      return { mass: 5.972e24, symbol: 'Earth', protons: 0, name: 'Earth' };
    }
    if (clean.includes('moon')) {
      return { mass: 7.342e22, symbol: 'Moon', protons: 0, name: 'Moon' };
    }
    if (clean.includes('sun')) {
      return { mass: 1.989e30, symbol: 'Sun', protons: 0, name: 'Sun' };
    }

    return { mass: 12.0, symbol: 'Mol', protons: 6, name: name };
  };

  const getComponentReactantDetail = (id: DashboardId) => {
    const clean = id.toLowerCase().trim();
    const matched = ELEMENTS.find(e => e.name.toLowerCase() === clean || e.symbol.toLowerCase() === clean);
    if (matched) {
      return { mass: matched.mass, symbol: matched.symbol, protons: matched.atomicNumber, name: matched.name, type: 'element' };
    }
    
    switch (clean) {
      case 'hydrogen': return { mass: 1.008, symbol: 'H', protons: 1, name: 'Hydrogen', type: 'element' };
      case 'helium': return { mass: 4.0026, symbol: 'He', protons: 2, name: 'Helium', type: 'element' };
      case 'sodium': return { mass: 22.990, symbol: 'Na', protons: 11, name: 'Sodium', type: 'element' };
      case 'chlorine': return { mass: 35.450, symbol: 'Cl', protons: 17, name: 'Chlorine', type: 'element' };
      case 'carbon': return { mass: 12.011, symbol: 'C', protons: 6, name: 'Carbon', type: 'element' };
      case 'oxygen': return { mass: 15.999, symbol: 'O', protons: 8, name: 'Oxygen', type: 'element' };
      case 'earth': return { mass: 5.972e24, symbol: '♁', protons: 0, name: 'Earth', type: 'celestial' };
      case 'moon': return { mass: 7.342e22, symbol: '☾', protons: 0, name: 'Moon', type: 'celestial' };
      case 'sun': return { mass: 1.989e30, symbol: '☉', protons: 0, name: 'Sun', type: 'celestial' };
      case 'cell': return { mass: 1.0e-12, symbol: '🧫', protons: 0, name: 'Eukaryotic Cell', type: 'biological' };
      case 'mitochondria': return { mass: 1.0e-15, symbol: '🔋', protons: 0, name: 'Mitochondria', type: 'biological' };
      case 'skeleton': return { mass: 12.0, symbol: '☠', protons: 20, name: 'Bone Tissue', type: 'physiological' };
      case 'human': return { mass: 70.0, symbol: '🧍', protons: 6, name: 'Human Body', type: 'biological' };
      default: return { mass: 12.0, symbol: 'Mol', protons: 6, name: id.charAt(0).toUpperCase() + id.slice(1), type: 'unknown' };
    }
  };

  const getReactionReactants = (rx: any, selected: DashboardId[]) => {
    if (rx && rx.atoms && rx.atoms.length > 0) {
      return rx.atoms.map((a: any) => {
        const details = findAtomicMassAndNumber(a.name);
        return {
          name: a.name,
          symbol: details.symbol,
          mass: details.mass,
          protons: details.protons,
          specs: a.specs
        };
      });
    }
    
    return selected.map(id => {
      const d = getComponentReactantDetail(id);
      return {
        name: d.name,
        symbol: d.symbol,
        mass: d.mass,
        protons: d.protons,
        specs: `Z:${d.protons}`
      };
    });
  };

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
    human: { title: 'Human Body' },
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
            
            // Get atomic mass specifications representing reactants
            const reactantsList = getReactionReactants(activeReaction, simulationSelected);
            
            // 1. Calculate total reactant mass
            const hasCelestial = reactantsList.some(r => r.mass > 1e10);
            const totalMassVal = reactantsList.reduce((sum, r) => sum + r.mass, 0);
            const totalMassStr = hasCelestial
              ? `${totalMassVal.toExponential(3)} kg`
              : `${totalMassVal.toFixed(4)} amu`;

            // 2. Calculate reduced mass (mu) of colliding particles
            let reducedMass = 0;
            if (reactantsList.length > 0) {
              const masses = reactantsList.map(r => r.mass);
              if (masses.length === 1) {
                reducedMass = masses[0];
              } else if (masses.length === 2) {
                reducedMass = (masses[0] * masses[1]) / (masses[0] + masses[1]);
              } else {
                // Generalized reduced mass for three bodies
                const denom = (masses[0] * masses[1]) + (masses[1] * masses[2]) + (masses[2] * masses[0]);
                reducedMass = denom > 0 ? (masses[0] * masses[1] * masses[2]) / denom : 0;
              }
            }
            const reducedMassStr = hasCelestial 
              ? `${reducedMass.toExponential(3)} kg`
              : `${reducedMass.toFixed(4)} amu`;

            // 3. Collision speed calculations
            const isNuclear = details.type === 'nuclear';
            
            // Speed definitions (nuclear works as speed of light fractions, chemical/other works as thermal km/s speeds)
            const speedVal = isNuclear 
              ? (0.01 + (collisionSpeedPct / 100) * 0.19) 
              : (1.0 + (collisionSpeedPct / 100) * 39.0);
            const formattedSpeed = isNuclear
              ? `${speedVal.toFixed(3)}c`
              : `${speedVal.toFixed(1)} km/s`;

            // Calculate kinetic energy in appropriate physics scale
            let E_kin = 0;
            let E_kin_str = "";
            if (isNuclear) {
              // E_kin = 0.5 * mu * beta^2 * 931.494 MeV
              E_kin = 0.5 * reducedMass * (speedVal * speedVal) * 931.494;
              E_kin_str = `${E_kin.toFixed(3)} MeV`;
            } else {
              // E_kin = 0.5 * reducedMass_amu * v^2 in kJ/mol
              E_kin = 0.5 * (hasCelestial ? 12.0 : reducedMass) * (speedVal * speedVal); 
              E_kin_str = `${E_kin.toLocaleString(undefined, { maximumFractionDigits: 1 })} kJ/mol`;
            }

            // 4. Parse theoretical chemical/nuclear bond yield
            const theory = parseTheoreticalEnergyText(details.energy);
            
            // Total yield balance (Theoretical reaction energy + Collision kinetic boost)
            let totalReleaseVal = 0;
            let combinedEnergyStr = '';
            if (isNuclear) {
              totalReleaseVal = theory.value + E_kin;
              combinedEnergyStr = `${totalReleaseVal.toFixed(3)} MeV`;
            } else {
              totalReleaseVal = theory.value + E_kin;
              combinedEnergyStr = `${totalReleaseVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} kJ/mol`;
            }

            // Calculate mass converted (Einstein equivalence deficit: dm = E/c^2)
            let massDefectStr = "";
            if (isNuclear) {
              const convertedMass = totalReleaseVal * 0.00107354; // to amu
              massDefectStr = `${convertedMass.toExponential(4)} amu`;
            } else {
              const convertedMassG = totalReleaseVal * 1.11265e-14; // grams equivalent
              massDefectStr = `${convertedMassG.toExponential(4)} g/mol`;
            }

            // Electrostatic/Coulomb repelling threshold evaluation
            const chemicalIgnitionThreshold = 150.0; // kJ/mol
            const nuclearIgnitionThreshold = 1.2; // MeV
            const isCriticalIgnition = isNuclear 
              ? E_kin > nuclearIgnitionThreshold 
              : E_kin > chemicalIgnitionThreshold;

            return (
              <div className="border-t border-white/5 pt-3 mt-1 space-y-3 font-mono text-[11px] animate-fade-in">
                {/* Product spec block */}
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

                {/* Reactants Mass Spec Sheet */}
                <div className="space-y-1">
                  <span className="text-[8px] text-purple-300/60 uppercase tracking-widest font-bold">Reactant Mass Spec Sheets</span>
                  <div className="grid grid-cols-1 gap-1">
                    {reactantsList.map((r, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-black/60 border border-white/5 px-2 py-1 rounded text-[9.5px]">
                        <span className="text-white/80 font-semibold flex items-center gap-1.5 shrink-0">
                          <span className="py-0.5 px-1 bg-purple-950 text-purple-300 text-[8px] rounded border border-purple-800/20 font-mono tracking-widest font-black uppercase text-center min-w-[20px]">{r.symbol}</span>
                          <span className="truncate max-w-[130px] inline-block">{r.name}</span>
                        </span>
                        <span className="text-[9px] text-cyan-400 font-mono text-right">{r.mass > 1e10 ? `${r.mass.toExponential(2)} kg` : `${r.mass.toFixed(4)} amu`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collision Accelerator Controls */}
                <div className="bg-black/40 border border-white/5 p-2 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8.5px] text-pink-400 font-bold uppercase tracking-wider">Ion velocity accelerator</span>
                    <span className="text-[10px] text-cyan-300 font-bold font-mono bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(34,211,238,0.1)]">{formattedSpeed}</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    value={collisionSpeedPct}
                    onChange={(e) => setCollisionSpeedPct(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-800 accent-purple-400 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[7.5px] text-white/30 px-0.5 select-none uppercase">
                    <span>{isNuclear ? '0.01c (Thermal)' : '1.0 km/s'}</span>
                    <span>{isNuclear ? '0.10c (Warm core)' : '20 km/s'}</span>
                    <span>{isNuclear ? '0.20c (Relativistic)' : '40 km/s'}</span>
                  </div>
                </div>

                {/* Advanced Quantum Cloud Customizer */}
                <div className="bg-black/40 border border-[#a855f7]/10 p-2.5 rounded space-y-3 font-mono">
                  <div className="text-[8.5px] text-cyan-400 font-bold uppercase tracking-wider">Advanced Quantum Cloud Tuning</div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-white/40">Electron prob. density:</span>
                      <span className="text-cyan-300 font-bold">{cloudDensity} particles</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="120"
                      step="5"
                      value={cloudDensity}
                      onChange={(e) => setCloudDensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-cyan-400 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-white/40">Valence flux speed:</span>
                      <span className="text-cyan-300 font-bold">{orbitalExcitation.toFixed(1)}x (excitation)</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.1"
                      value={orbitalExcitation}
                      onChange={(e) => setOrbitalExcitation(parseFloat(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-cyan-400 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-white/60 hover:text-white transition-colors">
                      <input 
                        type="checkbox"
                        checked={showBohrTracks}
                        onChange={(e) => setShowBohrTracks(e.target.checked)}
                        className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Bohr Energy Nodes</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-white/60 hover:text-white transition-colors">
                      <input 
                        type="checkbox"
                        checked={showFieldForceLines}
                        onChange={(e) => setShowFieldForceLines(e.target.checked)}
                        className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                      <span>Covalent Vectors</span>
                    </label>
                  </div>
                </div>

                {/* Physical Telemetry Calculations */}
                <div className="space-y-1">
                  <label className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest">Active Collision Telemetry</label>
                  <div className="space-y-1.5 bg-[#040406] border border-white/5 p-2 rounded">
                    <div className="flex justify-between text-[9px] border-b border-white/5 pb-1 text-white/50">
                      <span>TOTAL INPUT MASS (M_in):</span>
                      <span className="text-cyan-400 font-bold">{totalMassStr}</span>
                    </div>
                    <div className="flex justify-between text-[9px] border-b border-white/5 pb-1 text-white/50">
                      <span>REDUCED MASS (inertia μ):</span>
                      <span className="text-purple-300 font-bold">{reducedMassStr}</span>
                    </div>
                    <div className="flex justify-between text-[9px] border-b border-white/5 pb-1 text-white/50">
                      <span>IGNITION KINETIC BOOST (E_kin):</span>
                      <span className="text-amber-400 font-bold">{E_kin_str}</span>
                    </div>
                    {theory.value > 0 && (
                      <div className="flex justify-between text-[9px] border-b border-white/5 pb-1 text-white/50">
                        <span>THEORETICAL BOND RELEASE (ΔE_rx):</span>
                        <span className="text-green-400 font-bold">{theory.isExothermic ? '+' : '-'}{theory.value.toFixed(1)} {theory.unit}</span>
                      </div>
                    )}
                    <div className="pt-0.5 flex justify-between text-[9px] text-white/50">
                      <span>EINSTEINIAN MASS DEFECT (Δm):</span>
                      <span className="text-pink-400 font-bold font-mono">{massDefectStr}</span>
                    </div>

                    <div className="pt-1.5 border-t border-purple-500/20 flex flex-col gap-1.5 justify-center">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white/60 uppercase">COMBINED CORE RELEASE:</span>
                        <span className="text-purple-300 font-black text-[11.5px] font-mono tracking-wide">{combinedEnergyStr}</span>
                      </div>

                      <div className={`p-1 text-center font-bold text-[7.5px] font-mono border rounded uppercase leading-normal tracking-wide ${
                        isCriticalIgnition 
                          ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 animate-pulse'
                          : 'bg-amber-950/40 border-amber-500/20 text-amber-300'
                      }`}>
                        {isCriticalIgnition 
                          ? '🟢 CRITICAL COLLISION IGNITION REACHED (SUPERCRITICAL)' 
                          : '🟡 STEADY THERMAL COLLISION COMPLETED (SUBCRITICAL)'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 🔬 Dedicated Quantum & Atom Observation Controls */}
      {!simulationMode && ATOM_IDS.includes(activeId) && (
        <div id="quantum-observation-hud" className="absolute top-[80px] left-6 z-40 w-76 bg-[#08080d]/95 border border-[#c084fc]/30 rounded-lg p-4 flex flex-col gap-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-fade-in text-white/90 max-h-[75%] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚛️</span>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase leading-none">Quantum View Deck</h3>
                <span className="text-[7.5px] uppercase text-white/40 block font-mono mt-0.5">Focus: {activeId}</span>
              </div>
            </div>
            <span className="text-[8px] uppercase font-bold py-0.5 px-1.5 rounded bg-cyan-950 border border-cyan-800/30 text-cyan-300">
              { quantumView ? 'Wave Cloud' : 'Classical' }
            </span>
          </div>

          <p className="text-[10px] text-white/60 leading-normal font-sans">
            Visualizing the Schrödinger wave function probability density <span className="text-cyan-400 font-mono font-bold">|ψ|²</span> representing orbital shell configurations.
          </p>

          <div className="space-y-2.5">
            {/* Toggle Wave Cloud vs Bohr classical model */}
            <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-md">
              <span className="text-[9.5px] font-mono tracking-wide text-white/50 uppercase">Schrödinger Mode:</span>
              <button
                onClick={() => setQuantumView(!quantumView)}
                className={`px-3 py-1 rounded text-[9.5px] font-mono uppercase transition-colors shrink-0 font-bold border ${
                  quantumView 
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                    : 'bg-neutral-900 border-white/10 text-white/40'
                }`}
              >
                {quantumView ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>

            {quantumView && (
              <div className="space-y-2.5 border-t border-white/5 pt-2.5">
                {/* Cloud density customizer */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-white/40">Probability Points:</span>
                    <span className="text-cyan-300 font-bold font-mono">{cloudDensity * 4} particles</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={cloudDensity}
                    onChange={(e) => setCloudDensity(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-800 accent-cyan-400 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Excitation customizer */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-white/40">Valence wave flux:</span>
                    <span className="text-cyan-300 font-bold font-mono">{orbitalExcitation.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={orbitalExcitation}
                    onChange={(e) => setOrbitalExcitation(parseFloat(e.target.value))}
                    className="w-full h-1 bg-neutral-800 accent-cyan-400 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Bohr track overlap toggle */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-white/60 hover:text-white transition-colors">
                    <input 
                      type="checkbox"
                      checked={showBohrTracks}
                      onChange={(e) => setShowBohrTracks(e.target.checked)}
                      className="rounded bg-black border-white/10 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Show Energy Ring</span>
                  </label>
                </div>
              </div>
            )}
          </div>
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

      <Canvas camera={{ position: [0, 0, 200], fov: 45, near: 1e-15, far: 1e18 }} gl={{ logarithmicDepthBuffer: true }}>
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
        <SpacetimeSimulationViewer 
          cloudDensity={cloudDensity}
          orbitalExcitation={orbitalExcitation}
          showBohrTracks={showBohrTracks}
          showFieldForceLines={showFieldForceLines}
        />

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
          <SpacetimeAtom 
            key={sym} 
            id={sym} 
            atomicNumber={idx + 1} 
            cloudDensity={cloudDensity}
            orbitalExcitation={orbitalExcitation}
            showBohrTracks={showBohrTracks}
          />
        ))}
        <SpacetimeEukaryoticCell />
        <SpacetimeCell />
        <SpacetimeSkeleton />
        <SpacetimeHuman />

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
