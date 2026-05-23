import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useDashboardStore } from '../store/useDashboardStore';

// Procedural stylized human body nodes (Head, Torso, Arms, Legs)
const nodes = [
  { id: 'head', pos: [0, 4.5, 0], radius: 0.35 },
  { id: 'neck', pos: [0, 3.8, 0], radius: 0.15 },
  { id: 'chest', pos: [0, 3.0, 0], radius: 0.55 },
  { id: 'pelvis', pos: [0, 1.4, 0], radius: 0.45 },
  
  { id: 'l_shoulder', pos: [-0.9, 3.0, 0], radius: 0.2 },
  { id: 'l_elbow', pos: [-1.3, 1.5, 0], radius: 0.17 },
  { id: 'l_hand', pos: [-1.4, 0.2, 0], radius: 0.12 },
  
  { id: 'r_shoulder', pos: [0.9, 3.0, 0], radius: 0.2 },
  { id: 'r_elbow', pos: [1.3, 1.5, 0], radius: 0.17 },
  { id: 'r_hand', pos: [1.4, 0.2, 0], radius: 0.12 },
  
  { id: 'l_hip', pos: [-0.4, 1.0, 0], radius: 0.2 },
  { id: 'l_knee', pos: [-0.5, -0.7, 0], radius: 0.17 },
  { id: 'l_foot', pos: [-0.5, -2.4, 0], radius: 0.12 },
  
  { id: 'r_hip', pos: [0.4, 1.0, 0], radius: 0.2 },
  { id: 'r_knee', pos: [0.5, -0.7, 0], radius: 0.17 },
  { id: 'r_foot', pos: [0.5, -2.4, 0], radius: 0.12 },
];

const connections = [
  ['head', 'neck'],
  ['neck', 'chest'],
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
];

const PulsingNode = ({ pos, radius, color, isDeath }: { pos: number[], radius: number, color: string, isDeath: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current && !isDeath) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2.5 + pos[1]) * 0.08;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh position={[pos[0], pos[1], pos[2]]} ref={ref}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={isDeath ? '#334155' : color} transparent opacity={isDeath ? 0.2 : 0.75} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

export const AnatomyScene = ({ embedded = false }: { embedded?: boolean }) => {
    const [system, setSystem] = useState<'nervous' | 'circulatory' | 'skeletal'>('skeletal'); // default skeletal inside dashboard
    const { activeTimelineStep } = useDashboardStore();

    const isDeath = activeTimelineStep === 5;
    const speedMultiplier = useMemo(() => {
      if (activeTimelineStep === 1) return 3.0; // origin accretion
      if (activeTimelineStep === 5) return 0.0; // frozen dead state
      return 1.0;
    }, [activeTimelineStep]);

    const getSystemColor = () => {
        if (isDeath) return '#475569';
        switch(system) {
            case 'nervous': return '#eab308'; // yellow
            case 'circulatory': return '#f43f5e'; // pinkish red
            case 'skeletal': return '#22d3ee'; // vibrant skeletal cyan matching the dashboard
            default: return '#ffffff';
        }
    };

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 1.2, 8], fov: 45 }}>
                <color attach="background" args={['#010207']} />
                <ambientLight intensity={isDeath ? 0.1 : 0.6} />
                <pointLight position={[0, 5, 5]} intensity={isDeath ? 10 : 120} color="#ffffff" />
                
                <Stars radius={100} depth={50} count={isDeath ? 100 : 800} factor={2} saturation={0} fade speed={0.5} />
                
                <group position={[0, -1, 0]}>
                    {/* Nodes representing organs/joints */}
                    {nodes.map(node => (
                        <PulsingNode key={node.id} pos={node.pos} radius={node.radius} color={getSystemColor()} isDeath={isDeath} />
                    ))}

                    {/* Connections representing nerves/vessels/bones */}
                    {connections.map((conn, i) => {
                        const start = nodes.find(n => n.id === conn[0])!;
                        const end = nodes.find(n => n.id === conn[1])!;
                        return (
                            <Line
                                key={i}
                                points={[start.pos as [number, number, number], end.pos as [number, number, number]]}
                                color={getSystemColor()}
                                lineWidth={system === 'skeletal' ? 6 : 2}
                                transparent
                                opacity={isDeath ? 0.08 : 0.45}
                            />
                        );
                    })}
                </group>

                <OrbitControls enablePan={true} minDistance={2} maxDistance={20} autoRotate={!isDeath} autoRotateSpeed={0.4 * speedMultiplier} target={[0, 1.0, 0]} />
            </Canvas>

            {/* Overlay UI (only show if not embedded!) */}
            {!embedded && (
                <div className="absolute left-8 top-8 space-y-4 z-10 pointer-events-auto">
                    <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-slate-500/20">
                        <h1 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Anatomical System</h1>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setSystem('nervous')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded border transition-colors ${system === 'nervous' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}
                            >
                                Nervous System
                            </button>
                            <button 
                                onClick={() => setSystem('circulatory')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded border transition-colors ${system === 'circulatory' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}
                            >
                                Circulatory System
                            </button>
                            <button 
                                onClick={() => setSystem('skeletal')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded border transition-colors ${system === 'skeletal' ? 'bg-slate-300/20 text-slate-300 border-slate-300/50' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}
                            >
                                Skeletal System
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
