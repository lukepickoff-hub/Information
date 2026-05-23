import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboardStore } from '../store/useDashboardStore';

// Circular Orbit track helper
const SimpleOrbitTrack = ({ radius, color = '#22d3ee' }: { radius: number; color?: string }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, opacity: 0.15, transparent: true }))} />
  );
};

// Procedural crater generator for the Moon
const MoonCraters = () => {
  const craters = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 35; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.0; // on sphere surface
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      const size = 0.05 + Math.random() * 0.12;
      arr.push({ pos: [x, y, z] as [number, number, number], size });
    }
    return arr;
  }, []);

  return (
    <group>
      {craters.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.size, 8, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} bumpScale={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// Procedural dynamic solar plasma/corona loop reactor
const SunCorona = ({ sizeScale, activeTimelineStep }: { sizeScale: number; activeTimelineStep: number }) => {
  const coronaRef1 = useRef<THREE.Mesh>(null);
  const coronaRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (coronaRef1.current) {
      coronaRef1.current.rotation.z = elapsed * 0.15;
      coronaRef1.current.rotation.x = elapsed * 0.08;
    }
    if (coronaRef2.current) {
      coronaRef2.current.rotation.y = -elapsed * 0.2;
      coronaRef2.current.rotation.z = elapsed * 0.05;
    }
  });

  const coronaColor = activeTimelineStep === 5 ? '#06b6d4' : (activeTimelineStep === 4 ? '#ef4444' : '#f59e0b');
  const opacity1 = activeTimelineStep === 5 ? 0.3 : 0.2;
  const opacity2 = activeTimelineStep === 5 ? 0.15 : 0.1;

  return (
    <group scale={[sizeScale, sizeScale, sizeScale]}>
      <mesh ref={coronaRef1}>
        <sphereGeometry args={[2.55, 16, 16]} />
        <meshBasicMaterial color={coronaColor} wireframe transparent opacity={opacity1} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={coronaRef2}>
        <sphereGeometry args={[2.8, 12, 12]} />
        <meshBasicMaterial color={activeTimelineStep === 1 ? '#ea580c' : '#f97316'} wireframe transparent opacity={opacity2} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// Main Single Globe component
const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const orbitalSatelRef = useRef<THREE.Group>(null);
  
  const { activeDashboardId, activeTimelineStep } = useDashboardStore();
  const isMoon = activeDashboardId === 'moon';
  const isSun = activeDashboardId === 'sun';

  // State-based physics parameters
  const speedMultiplier = useMemo(() => {
    switch (activeTimelineStep) {
      case 1: return 4.0; // Fast spin at birth
      case 4: return 0.5; // Drag/slowed spin in future
      case 5: return 0.12; // Extremely slow pre-engulfment spin
      default: return 1.0; // Regular spin
    }
  }, [activeTimelineStep]);

  // White Dwarf contraction effect
  const sizeScale = useMemo(() => {
    if (isSun && activeTimelineStep === 5) return 0.45; // ultra-dense tiny core
    return 1.0;
  }, [isSun, activeTimelineStep]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsed * 0.06 * speedMultiplier;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = elapsed * 0.08 * speedMultiplier;
      cloudRef.current.rotation.x = elapsed * 0.01 * speedMultiplier;
    }
    if (orbitalSatelRef.current) {
      orbitalSatelRef.current.rotation.y = elapsed * 0.4;
    }
  });

  // Determine core colors/glows based on activeTimelineStep
  const globeColor = useMemo(() => {
    if (activeTimelineStep === 1) return isSun ? '#f97316' : '#ea580c'; // magma molten birth / gas accretion
    if (activeTimelineStep === 5) return isSun ? '#e2f8ff' : '#78716c'; // cold scorched rock / high temp white dwarf
    
    if (isSun) {
      if (activeTimelineStep === 4) return '#ef4444'; // Red Giant shell swell
      return '#facc15'; // Brilliant yellow main-sequence G-star
    }
    return isMoon ? '#8a8d91' : '#1e3a8a'; // Moon slate or Earth ocean-blue
  }, [activeTimelineStep, isMoon, isSun]);

  const emissiveColor = useMemo(() => {
    if (isSun) {
      if (activeTimelineStep === 1) return '#ea580c';
      if (activeTimelineStep === 4) return '#dc2626';
      if (activeTimelineStep === 5) return '#a5f3fc'; // Blue-cyan core heat glow
      return '#f59e0b';
    }
    if (activeTimelineStep === 1) return '#f97316'; // glowing lava
    if (activeTimelineStep === 5) return '#dc2626'; // scorched warning
    return '#000000';
  }, [activeTimelineStep, isSun]);

  const emissiveIntensity = useMemo(() => {
    if (isSun) {
      if (activeTimelineStep === 5) return 2.8; // intense white-dwarf radiation
      return 1.8; // G-star surface energy
    }
    if (activeTimelineStep === 1) return 1.8;
    if (activeTimelineStep === 5) return 0.5;
    return 0.0;
  }, [activeTimelineStep, isSun]);

  return (
    <group>
      {/* Globe Sphere */}
      <mesh ref={globeRef} position={[0, 0, 0]} scale={[sizeScale, sizeScale, sizeScale]} castShadow receiveShadow>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial 
          color={globeColor}
          roughness={isMoon ? 0.9 : (isSun ? 0.05 : 0.4)}
          metalness={isSun ? 0.0 : 0.1}
          emissive={new THREE.Color(emissiveColor)}
          emissiveIntensity={emissiveIntensity}
        />
        
        {/* Procedural Moon Surface Craters */}
        {isMoon && activeTimelineStep !== 1 && <MoonCraters />}
      </mesh>

      {/* Earth Atmospherics and Continents */}
      {!isMoon && !isSun && activeTimelineStep !== 1 && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[2.25, 64, 64]} />
          <meshStandardMaterial 
            color="#10b981" 
            transparent 
            opacity={0.35} 
            wireframe={activeTimelineStep === 4}
            roughness={0.8}
          />
        </mesh>
      )}

      {/* Atmospheric Glow Aura Ring */}
      <mesh position={[0, 0, 0]} scale={[sizeScale, sizeScale, sizeScale]}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial 
          color={isSun ? (activeTimelineStep === 5 ? '#22d3ee' : '#f59e0b') : (activeTimelineStep === 1 ? '#f97316' : (isMoon ? '#22d3ee' : '#38bdf8'))} 
          transparent 
          opacity={isSun ? 0.35 : (activeTimelineStep === 1 ? 0.35 : 0.1)} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun specific coronal swirls */}
      {isSun && <SunCorona sizeScale={sizeScale} activeTimelineStep={activeTimelineStep} />}

      {/* Standard Coordinate Ring/Ticks */}
      {activeTimelineStep === 3 && (
        <group>
          <SimpleOrbitTrack radius={3.2} color={isMoon ? '#22d3ee' : '#38bdf8'} />
          <group ref={orbitalSatelRef}>
            <mesh position={[3.2, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <SimpleOrbitTrack radius={0.4} color="#ffffff" />
          </group>
        </group>
      )}

      {/* Holographic Polar Lattice/Wireframe Grids under specific active states */}
      {(activeTimelineStep === 2 || activeTimelineStep === 3) && (
        <mesh position={[0,0,0]}>
          <sphereGeometry args={[2.5, 10, 10]} />
          <meshBasicMaterial color={isMoon ? '#10b981' : '#01f0ff'} wireframe transparent opacity={0.06} />
        </mesh>
      )}

      {/* Stage 5: Giant Expanding Red Sun Shell or Planetary Nebula Ejection */}
      {activeTimelineStep === 5 && (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[6.5, 32, 32]} />
            <meshBasicMaterial color={isSun ? '#06b6d4' : '#dc2626'} transparent opacity={isSun ? 0.25 : 0.35} wireframe={true} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[6.0, 32, 32]} />
            <meshBasicMaterial color={isSun ? '#22d3ee' : '#ea580c'} transparent opacity={isSun ? 0.12 : 0.15} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const UniverseScene = () => {
  const { activeDashboardId } = useDashboardStore();

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <color attach="background" args={['#010205']} />
        
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={150} color="#ffedd5" distance={100} decay={1.5} />
        <pointLight position={[-15, -5, -10]} intensity={60} color="#38bdf8" distance={100} decay={1.5} />
        
        <Stars radius={80} depth={40} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="#22d3ee" 
          cellColor="#040a18" 
          sectionThickness={1} 
          cellThickness={0.5} 
          position={[0, -2.8, 0]} 
          sectionSize={4} 
          cellSize={1} 
        />
        
        <Globe />

        <OrbitControls 
          enablePan={false} 
          minDistance={4} 
          maxDistance={25} 
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>
    </div>
  );
};
