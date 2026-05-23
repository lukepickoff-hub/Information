import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboardStore } from '../store/useDashboardStore';

const Nucleus = ({ speedMultiplier }: { speedMultiplier: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1 * speedMultiplier;
    }
  });

  return (
    <group ref={ref}>
      {/* Nucleolus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#818cf8" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Nuclear Envelope & pores */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.4} roughness={0.1} metalness={0.1} wireframe={true} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.48, 32, 32]} />
        <meshStandardMaterial color="#4338ca" transparent opacity={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
};

const EndoplasmicReticulum = ({ isDeath }: { isDeath: boolean }) => {
  if (isDeath) return null;
  return (
    <group scale={[1.15, 1.15, 1.15]}>
      {/* Rough Endoplasmic Reticulum layered folds surrounding nucleus */}
      <mesh rotation={[0.4, 0.3, 0.1]}>
        <torusGeometry args={[1.9, 0.06, 8, 32, Math.PI * 1.1]} />
        <meshStandardMaterial color="#ec4899" roughness={0.6} transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[-0.2, 0.5, 0.2]}>
        <torusGeometry args={[2.2, 0.05, 8, 32, Math.PI * 1.3]} />
        <meshStandardMaterial color="#ec4899" roughness={0.6} transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

const GolgiApparatus = ({ isDeath }: { isDeath: boolean }) => {
  if (isDeath) return null;
  return (
    <group position={[-2.3, 1.4, -0.6]} rotation={[0.3, -0.4, 0.2]}>
      {/* Stacked disks of Golgi cisternae */}
      <mesh position={[0, 0.22, 0]} scale={[1, 0.14, 0.45]}>
        <torusGeometry args={[0.75, 0.08, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#10b981" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.0, 0]} scale={[1, 0.14, 0.45]}>
        <torusGeometry args={[0.65, 0.08, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#10b981" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.22, 0]} scale={[1, 0.14, 0.45]}>
        <torusGeometry args={[0.55, 0.08, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#10b981" roughness={0.4} />
      </mesh>
    </group>
  );
};

const Mitochondrion = ({ position, rotation, isDeath }: { position: [number, number, number], rotation: [number, number, number], isDeath: boolean }) => {
  const scale: [number, number, number] = isDeath ? [0.4, 0.4, 0.4] : [1, 1, 1];
  return (
    <Float speed={isDeath ? 0.2 : 2} rotationIntensity={isDeath ? 0.1 : 1} floatIntensity={isDeath ? 0.1 : 1}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <capsuleGeometry args={[0.3, 0.8, 16, 32]} />
          <meshStandardMaterial color={isDeath ? '#475569' : '#f97316'} roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Inner folded cristae membrane plates */}
        <mesh>
          <capsuleGeometry args={[0.25, 0.7, 16, 16]} />
          <meshStandardMaterial color={isDeath ? '#64748b' : '#fdba74'} roughness={0.8} wireframe={true} opacity={0.3} transparent />
        </mesh>
        
        {!isDeath && (
          <group position={[0, -0.1, 0]}>
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}>
              <torusGeometry args={[0.2, 0.03, 6, 12]} />
              <meshBasicMaterial color="#fdba74" />
            </mesh>
            <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}>
              <torusGeometry args={[0.2, 0.03, 6, 12]} />
              <meshBasicMaterial color="#fdba74" />
            </mesh>
            <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}>
              <torusGeometry args={[0.2, 0.03, 6, 12]} />
              <meshBasicMaterial color="#fdba74" />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
};

const Lysosome = ({ position, isDeath }: { position: [number, number, number], isDeath: boolean }) => {
  return (
    <Float speed={isDeath ? 0.3 : 3} rotationIntensity={isDeath ? 0.2 : 2} floatIntensity={isDeath ? 0.2 : 2}>
      <mesh position={position}>
        <sphereGeometry args={[isDeath ? 0.1 : 0.2, 16, 16]} />
        <meshStandardMaterial color={isDeath ? '#334155' : '#fcd34d'} roughness={0.4} metalness={0.1} />
      </mesh>
    </Float>
  );
};

export const CellScene = ({ embedded = false }: { embedded?: boolean }) => {
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const { activeTimelineStep } = useDashboardStore();

  const isDeath = activeTimelineStep === 5;
  const speedMultiplier = useMemo(() => {
    if (activeTimelineStep === 1) return 3.0; // origin accretion
    if (activeTimelineStep === 5) return 0.15; // death decay
    return 1.0;
  }, [activeTimelineStep]);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#01030d']} />
        <ambientLight intensity={isDeath ? 0.1 : 0.4} />
        <pointLight position={[10, 10, 10]} intensity={isDeath ? 20 : 150} color={isDeath ? '#475569' : '#e0f2fe'} />
        <pointLight position={[-10, -10, -10]} intensity={isDeath ? 10 : 80} color={isDeath ? '#1e293b' : '#38bdf8'} />
        
        <Stars radius={100} depth={50} count={isDeath ? 300 : 1200} factor={2} saturation={0} fade speed={1} />
        
        <group>
          {/* Cell Membrane */}
          <mesh onClick={() => setSelectedOrganelle('Cell Membrane')} onPointerMissed={() => setSelectedOrganelle(null)}>
            <sphereGeometry args={[4, 64, 64]} />
            <meshStandardMaterial 
              color={isDeath ? '#334155' : '#0ea5e9'} 
              transparent 
              opacity={isDeath ? 0.05 : 0.18} 
              roughness={0.1} 
              metalness={0.2} 
              depthWrite={false} 
              wireframe={isDeath}
            />
          </mesh>
          
          {/* Cytoplasm (inner volume effect) */}
          <mesh>
            <sphereGeometry args={[3.8, 32, 32]} />
            <meshStandardMaterial color={isDeath ? '#1e293b' : '#38bdf8'} transparent opacity={isDeath ? 0.02 : 0.05} />
          </mesh>

          {/* Organelles */}
          <group onClick={(e) => { e.stopPropagation(); setSelectedOrganelle('Nucleus'); }}>
            <Nucleus speedMultiplier={speedMultiplier} />
          </group>

          <group onClick={(e) => { e.stopPropagation(); setSelectedOrganelle('Endoplasmic Reticulum'); }}>
            <EndoplasmicReticulum isDeath={isDeath} />
          </group>

          <group onClick={(e) => { e.stopPropagation(); setSelectedOrganelle('Golgi Apparatus'); }}>
            <GolgiApparatus isDeath={isDeath} />
          </group>

          <group onClick={(e) => { e.stopPropagation(); setSelectedOrganelle('Mitochondria'); }}>
            <Mitochondrion position={[2, 1, 1]} rotation={[0.5, 0, 0.2]} isDeath={isDeath} />
            <Mitochondrion position={[-2, -1.5, 0]} rotation={[-0.2, 1, -0.5]} isDeath={isDeath} />
            <Mitochondrion position={[0, 2.5, -1.5]} rotation={[1, 0.5, 0]} isDeath={isDeath} />
            <Mitochondrion position={[-1.5, 1.5, 1]} rotation={[0, -0.5, 0.8]} isDeath={isDeath} />
          </group>

          <group onClick={(e) => { e.stopPropagation(); setSelectedOrganelle('Lysosome'); }}>
            <Lysosome position={[1.5, -2, 1.5]} isDeath={isDeath} />
            <Lysosome position={[-2, 1, -2]} isDeath={isDeath} />
            <Lysosome position={[2.5, -0.5, -1]} isDeath={isDeath} />
            <Lysosome position={[0.5, -2.5, 0]} isDeath={isDeath} />
            <Lysosome position={[-1, -2, 1]} isDeath={isDeath} />
          </group>
        </group>

        <OrbitControls enablePan={true} minDistance={5} maxDistance={20} autoRotate={true} autoRotateSpeed={0.3 * speedMultiplier} />
      </Canvas>

      {/* Overlay UI (only show if not embedded inside our dashboard!) */}
      {!embedded && (
        <>
          <div className="absolute left-8 top-8 space-y-4 z-10 pointer-events-none">
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-slate-500/20 pointer-events-auto">
              <h1 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">Cellular Structure</h1>
              <div className="text-sm text-slate-300 mb-2">Interact with the cell to inspect organelles.</div>
              
              {selectedOrganelle ? (
                <div className="mt-4 p-4 bg-cyan-950/40 border border-cyan-500/30 rounded animate-in fade-in">
                  <h2 className="text-lg font-bold text-cyan-300 mb-1">{selectedOrganelle}</h2>
                  <p className="text-xs text-cyan-100/70 leading-relaxed">
                    {selectedOrganelle === 'Nucleus' && 'The control center of the cell, storing genetic information (DNA) and coordinating cell activities.'}
                    {selectedOrganelle === 'Endoplasmic Reticulum' && 'A network of membranous tubules that assists in protein and lipid synthesis, folding, and transport. The rough ER is studded with ribosomes.'}
                    {selectedOrganelle === 'Golgi Apparatus' && 'The dispatch station of the cell. It modifies, sorts, and packages proteins and lipids received from the ER for secretion or active transport.'}
                    {selectedOrganelle === 'Mitochondria' && 'The powerhouse of the cell, generating most of the chemical energy needed to power the cell\'s biochemical reactions via ATP.'}
                    {selectedOrganelle === 'Lysosome' && 'Contains digestive enzymes. They break down excess or worn-out cell parts and may be used to destroy invading viruses and bacteria.'}
                    {selectedOrganelle === 'Cell Membrane' && 'A semipermeable lipid bilayer that regulates what enters and exits the cell.'}
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 border border-dashed border-white/20 rounded text-xs text-white/30 text-center">
                  No organelle selected
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-500">
            <div className="bg-slate-900/40 backdrop-blur-md px-6 py-2 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] pointer-events-auto flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap text-cyan-400">
                Subject: Eukaryotic Animal Cell
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
