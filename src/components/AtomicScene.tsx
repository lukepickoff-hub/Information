import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAtomicStore } from '../store/useAtomicStore';
import { ElementData } from '../data/elements';
import { 
  LineChart, 
  Line as RechartsLine, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceDot 
} from 'recharts';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

// Hardcoded electronegativity values for Elements 1 to 36 for high-fidelity accuracy
const getElectronegativity = (num: number): number => {
  const table: Record<number, number> = {
    1: 2.20, 2: 0, 3: 0.98, 4: 1.57, 5: 2.04, 6: 2.55, 7: 3.04, 8: 3.44, 9: 3.98, 10: 0,
    11: 0.93, 12: 1.31, 13: 1.61, 14: 1.90, 15: 2.19, 16: 2.58, 17: 3.16, 18: 0,
    19: 0.82, 20: 1.00, 21: 1.36, 22: 1.54, 23: 1.63, 24: 1.66, 25: 1.55, 26: 1.83,
    27: 1.88, 28: 1.91, 29: 1.90, 30: 1.65, 31: 1.81, 32: 2.01, 33: 2.18, 34: 2.55,
    35: 2.96, 36: 0
  };
  return table[num] || 0;
};

const isMetal = (category: string) => {
  return category.toLowerCase().includes('metal') && !category.toLowerCase().includes('nonmetal');
};

const isNobleGas = (category: string) => {
  return category.toLowerCase() === 'noble gas';
};

interface BondInfo {
  type: 'covalent' | 'polar_covalent' | 'ionic' | 'metallic' | 'inert';
  name: string;
  description: string;
  sharedElectrons: number;
  electrostaticSign: [number, number];
  potentialEnergy: number;
  equilibriumEnergy: number;
}

const calculateBond = (el1: ElementData, el2: ElementData, distanceScale: number = 1.0): BondInfo => {
  const en1 = getElectronegativity(el1.atomicNumber);
  const en2 = getElectronegativity(el2.atomicNumber);
  const diff = Math.abs(en1 - en2);

  // Well depth (De in kJ/mol) based on bond classification and electronegativity difference
  let De = 340; // baseline
  let type: 'covalent' | 'polar_covalent' | 'ionic' | 'metallic' | 'inert' = 'covalent';
  let name = '';
  let description = '';
  let sharedElectrons = 0;
  let electrostaticSign: [number, number] = [0, 0];

  if (isNobleGas(el1.category) || isNobleGas(el2.category)) {
    type = 'inert';
    De = 8;
    name = 'No Bond (Inert Noble Gas)';
    description = 'Noble gases have a completely filled outer valence electron shell, making them inert and highly stable. They do not share, gain, or lose electrons under standard conditions.';
    sharedElectrons = 0;
    electrostaticSign = [0, 0];
  } else {
    const m1 = isMetal(el1.category);
    const m2 = isMetal(el2.category);

    if (m1 && m2) {
      type = 'metallic';
      De = 135;
      name = 'Metallic Bond';
      description = 'Both species are metal atoms. They pool their valence electrons into an un-localized "sea of mobile electrons" that flows freely around the positive metal cores.';
      sharedElectrons = 0;
      electrostaticSign = [0, 0];
    } else if ((m1 && !m2) || (!m1 && m2)) {
      type = 'ionic';
      const metal = m1 ? el1 : el2;
      const nonmetal = m1 ? el2 : el1;
      const valenceMetal = metal.electrons[metal.electrons.length - 1];
      const valenceNonmetal = nonmetal.electrons[nonmetal.electrons.length - 1];
      const transferCount = Math.min(valenceMetal, 8 - valenceNonmetal);
      
      De = 450 + 120 * diff;
      name = 'Ionic Bond';
      description = `${metal.name} is a metal with low electronegativity. It transfers ${transferCount} valence electron(s) directly to the highly electronegative nonmetallic ${nonmetal.name}, generating stable cations (+) and anions (-) held together by strong electrostatic attraction.`;
      sharedElectrons = transferCount;
      electrostaticSign = m1 ? [1, -1] : [-1, 1];
    } else {
      // Covalent
      const v1 = el1.electrons[el1.electrons.length - 1];
      const v2 = el2.electrons[el2.electrons.length - 1];
      const needed1 = el1.atomicNumber === 1 ? 1 : 8 - v1;
      const needed2 = el2.atomicNumber === 1 ? 1 : 8 - v2;
      const bondOrder = Math.min(needed1, needed2);
      sharedElectrons = bondOrder * 2;

      if (diff >= 0.4) {
        type = 'polar_covalent';
        De = 360 + 60 * diff;
        name = 'Polar Covalent Bond';
        description = `Nonmetallic atoms sharing electron pairs unequally. Due to a larger electronegativity difference (ΔEN = ${diff.toFixed(2)}), the shared electron cloud is pulled closer to the more electronegative ${en1 > en2 ? el1.name : el2.name} atom.`;
        electrostaticSign = en1 > en2 ? [-0.5, 0.5] : [0.5, -0.5];
      } else {
        type = 'covalent';
        De = 340;
        name = 'Nonpolar Covalent Bond';
        description = `Nonmetallic species with similar electronegativities sharing ${bondOrder * 2} electron(s) symmetrically. This creates a balanced, stable chemical orbital centered between both partners.`;
        electrostaticSign = [0, 0];
      }
    }
  }

  // Calculate Morse Potential at distanceScale
  // E_p = De * ((1 - e^(-a * (x - 1)))^2 - 1)
  const a = 4.2;
  const exponent = -a * (distanceScale - 1.0);
  const coreRepulsion = 1.0 - Math.exp(exponent);
  const potentialEnergy = De * (coreRepulsion * coreRepulsion - 1.0);

  return {
    type,
    name,
    description,
    sharedElectrons,
    electrostaticSign,
    potentialEnergy,
    equilibriumEnergy: De
  };
};

const Electron = ({ shellRadius, speed, offsetAngle, color }: { shellRadius: number, speed: number, offsetAngle: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
        const t = clock.getElapsedTime() * speed;
        ref.current.position.x = Math.cos(t + offsetAngle) * shellRadius;
        ref.current.position.z = Math.sin(t + offsetAngle) * shellRadius;
        ref.current.position.y = Math.sin(t * 1.5 + offsetAngle) * shellRadius * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

const AtomModel = ({ element, position, fadeOutOutermost = false }: { element: ElementData, position: [number, number, number], fadeOutOutermost?: boolean }) => {
    const nucleusParticles = useMemo(() => {
        const protons = element.atomicNumber;
        const neutrons = Math.round(element.mass) - protons;
        const particles = [];
        const total = protons + neutrons;
        const radius = Math.pow(total, 0.33) * 0.18;
        
        for(let i=0; i<total; i++) {
            const isProton = i < protons;
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.cbrt(Math.random()) * radius;
            const sinPhi = Math.sin(phi);
            const x = r * sinPhi * Math.cos(theta);
            const y = r * sinPhi * Math.sin(theta);
            const z = r * Math.cos(phi);
            particles.push({x, y, z, isProton});
        }
        return particles;
    }, [element]);

    return (
        <group position={position}>
            {/* Nucleus */}
            <group>
                {nucleusParticles.map((p, i) => (
                    <mesh key={i} position={[p.x, p.y, p.z]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshStandardMaterial color={p.isProton ? '#ef4444' : '#6b7280'} roughness={0.3} metalness={0.1} />
                    </mesh>
                ))}
                
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[Math.pow(nucleusParticles.length, 0.33) * 0.2, 32, 32]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                </mesh>
            </group>

            {/* --- QUANTUM MECHANICS MODEL: Probability Electron Clouds --- */}
            {/* 1s spherical orbital cloud density */}
            <mesh>
              <sphereGeometry args={[2.5, 32, 32]} />
              <meshBasicMaterial color={element.color} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* 2s spherical orbital cloud density */}
            {element.atomicNumber > 2 && (
              <mesh>
                <sphereGeometry args={[4.2, 32, 32]} />
                <meshBasicMaterial color={element.color} transparent opacity={0.03} blending={THREE.AdditiveBlending} />
              </mesh>
            )}

            {/* 2p dumbbell orbital clouds */}
            {element.atomicNumber >= 5 && (
              <group>
                {/* 2px */}
                <group rotation={[0, 0, 0]}>
                  <mesh position={[-4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                  <mesh position={[4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                </group>
                {/* 2py */}
                <group rotation={[0, 0, Math.PI / 2]}>
                  <mesh position={[-4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                  <mesh position={[4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                </group>
                {/* 2pz */}
                <group rotation={[0, Math.PI / 2, 0]}>
                  <mesh position={[-4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                  <mesh position={[4.0, 0, 0]}>
                    <sphereGeometry args={[1.0, 16, 16]} />
                    <meshBasicMaterial color={element.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} />
                  </mesh>
                </group>
              </group>
            )}

            {/* Electron Shells */}
            <group>
                {element.electrons.map((count, shellIndex) => {
                    const radius = 3 + shellIndex * 1.5;
                    const isOuter = shellIndex === element.electrons.length - 1;
                    const opacityScale = isOuter && fadeOutOutermost ? 0.3 : 1.0;
                    const electrons = [];
                    for(let i=0; i<count; i++) {
                        electrons.push(
                            <Electron 
                                key={`${shellIndex}-${i}`}
                                shellRadius={radius} 
                                speed={3 / (shellIndex + 1)} 
                                offsetAngle={(i / count) * Math.PI * 2} 
                                color={element.color} 
                            />
                        );
                    }
                    return (
                        <group key={shellIndex} visible={opacityScale > 0.4}>
                            <mesh rotation={[Math.PI/2, 0, 0]}>
                                <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
                                <meshBasicMaterial color={element.color} opacity={0.1 * opacityScale} transparent side={THREE.DoubleSide} />
                            </mesh>
                            {electrons}
                        </group>
                    );
                })}
            </group>
        </group>
    );
}

// Visual Covalent Shared Electron (Paths wrapping in 3D figure-eight loop)
const SharedElectron = ({ dist, speed, offsetAngle, color }: { dist: number, speed: number, offsetAngle: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
        const t = clock.getElapsedTime() * speed + offsetAngle;
        const x = (dist / 2) * Math.sin(t);
        const rY = Math.cos(t) * 1.4;
        const rZ = Math.sin(2 * t) * 1.2;
        
        const cosA = Math.cos(offsetAngle);
        const sinA = Math.sin(offsetAngle);
        
        ref.current.position.x = x;
        ref.current.position.y = rY * cosA - rZ * sinA;
        ref.current.position.z = rY * sinA + rZ * cosA;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

// Visual Ionic Electron Jumping Transfer Path
const IonicElectronTransfer = ({ pos1, pos2, speed, color }: { pos1: [number, number, number], pos2: [number, number, number], speed: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() * speed) % 1.0;
      const x = pos1[0] + (pos2[0] - pos1[0]) * t;
      const y = pos1[1] + (pos2[1] - pos1[1]) * t + Math.sin(t * Math.PI) * 2.5;
      const z = pos1[2] + (pos2[2] - pos1[2]) * t;
      
      ref.current.position.set(x, y, z);
      const scale = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

// Visual Electrostatic Particle Field (Flow between Anion and Cation)
const ElectrostaticParticleFlow = ({ pos1, pos2 }: { pos1: [number, number, number], pos2: [number, number, number] }) => {
  const count = 40;
  const particles = useMemo(() => {
    const arr = [];
    for(let i=0; i<count; i++) {
        // Random offsets for individual particles
        arr.push({ offset: Math.random(), speed: 0.5 + Math.random() * 1.5, radius: Math.random() * 2 });
    }
    return arr;
  }, []);

  return (
    <group>
      {particles.map((p, i) => (
        <ElectrostaticParticle key={i} p={p} pos1={pos1} pos2={pos2} />
      ))}
    </group>
  );
};

const ElectrostaticParticle = ({ p, pos1, pos2 }: { p: any, pos1: [number, number, number], pos2: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
      if (ref.current) {
          const t = (clock.getElapsedTime() * p.speed + p.offset) % 1.0;
          // Smooth curve flowing back and forth or just from one to the other
          const x = THREE.MathUtils.lerp(pos1[0], pos2[0], t);
          
          // Field lines buldging outwards in middle
          const bulge = Math.sin(t * Math.PI) * p.radius;
          const angle = p.offset * Math.PI * 2;
          
          const y = THREE.MathUtils.lerp(pos1[1], pos2[1], t) + Math.cos(angle) * bulge;
          const z = THREE.MathUtils.lerp(pos1[2], pos2[2], t) + Math.sin(angle) * bulge;

          ref.current.position.set(x, y, z);
          
          // Fade at ends
          const opacity = Math.sin(t * Math.PI) * 0.4;
          (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 4, 4]} />
      <meshBasicMaterial color="#fce7f3" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

// Visual Metallic Free Swarm Electron Sea
const MetallicElectronSea = ({ pos1, pos2, color1, color2 }: { pos1: [number, number, number], pos2: [number, number, number], color1: string, color2: string }) => {
  const count = 30;
  const particles = useMemo(() => {
    const arr = [];
    for(let i=0; i<count; i++) {
      arr.push({
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2,
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        radius: 1.2 + Math.random() * 3.0,
        color: Math.random() > 0.5 ? color1 : color2
      });
    }
    return arr;
  }, [color1, color2]);

  return (
    <group>
      {particles.map((p, i) => (
        <MetallicElectron key={i} p={p} pos1={pos1} pos2={pos2} />
      ))}
    </group>
  );
};

const MetallicElectron = ({ p, pos1, pos2 }: { p: any, pos1: [number, number, number], pos2: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * p.speed + p.phase;
      const cx = (pos1[0] + pos2[0]) / 2;
      const cy = (pos1[1] + pos2[1]) / 2;
      const cz = (pos1[2] + pos2[2]) / 2;
      
      const angle = t;
      const xOffset = Math.cos(angle) * p.radius;
      const yOffset = Math.sin(angle) * p.radius * p.axis.y;
      const zOffset = Math.sin(angle) * p.radius * p.axis.z;
      
      ref.current.position.x = cx + xOffset + Math.sin(t * 0.4) * 1.5;
      ref.current.position.y = cy + yOffset;
      ref.current.position.z = cz + zOffset;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={p.color} toneMapped={false} transparent opacity={0.8} />
    </mesh>
  );
};

// ── CUSTOM HEAVY BIOTECH INTEGRATIONS: DRAGGING, TREMBLING & WELL SNAP MECHANISMS ──

const BondShockwave = ({ active, timestamp }: { active: boolean; timestamp: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!active || !meshRef.current) return;
    const elapsed = (performance.now() - timestamp) / 1000;
    const duration = 0.55; 
    if (elapsed > duration) return;
    const progress = elapsed / duration;
    const scale = 1.0 + progress * 10.5;
    meshRef.current.scale.set(scale, scale, scale);
    if (meshRef.current.material && !Array.isArray(meshRef.current.material)) {
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1.0 - progress) * 0.85);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef} rotation={[0, Math.PI / 2, 0]}>
      <ringGeometry args={[0.9, 1.25, 32]} />
      <meshBasicMaterial 
        color="#f43f5e" 
        transparent 
        opacity={0.8} 
        side={THREE.DoubleSide} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  );
};

const ReconstitutionFlash = ({ active, timestamp }: { active: boolean; timestamp: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!active || !meshRef.current) return;
    const elapsed = (performance.now() - timestamp) / 1000;
    const duration = 0.45;
    if (elapsed > duration) return;
    const progress = elapsed / duration;
    const scale = (1.0 - progress) * 5.5;
    meshRef.current.scale.set(scale, scale, scale);
    if (meshRef.current.material && !Array.isArray(meshRef.current.material)) {
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1.0 - progress) * 0.95);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.0, 32, 32]} />
      <meshBasicMaterial 
        color="#38bdf8" 
        transparent 
        opacity={0.95} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  );
};

const EnergeticForceField = ({ 
  pos1, 
  pos2, 
  distanceScale, 
  isBroken, 
  bondColor 
}: { 
  pos1: [number, number, number]; 
  pos2: [number, number, number]; 
  distanceScale: number; 
  isBroken: boolean; 
  bondColor: string; 
}) => {
  const line1Ref = useRef<any>(null);
  const line2Ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (isBroken) return;
    const t = clock.getElapsedTime() * 15;
    const segments = 32;
    const pts1 = [];
    const pts2 = [];

    // Wave amplitude peaks when compressed (repulsion stress), stretches thin when far
    const amp = distanceScale < 1.0 
      ? Math.max(0.01, (1.0 - distanceScale) * 0.98) 
      : Math.max(0.01, (distanceScale - 1.0) * 0.28);

    for (let i = 0; i <= segments; i++) {
      const pct = i / segments;
      const x = THREE.MathUtils.lerp(pos1[0], pos2[0], pct);
      const baseAngle = pct * Math.PI * 6 + t;
      
      // Helix 1
      const y1 = THREE.MathUtils.lerp(pos1[1], pos2[1], pct) + Math.cos(baseAngle) * amp;
      const z1 = THREE.MathUtils.lerp(pos1[2], pos2[2], pct) + Math.sin(baseAngle) * amp;
      pts1.push(new THREE.Vector3(x, y1, z1));

      // Helix 2 (180 degrees phase offset)
      const y2 = THREE.MathUtils.lerp(pos1[1], pos2[1], pct) + Math.cos(baseAngle + Math.PI) * amp;
      const z2 = THREE.MathUtils.lerp(pos1[2], pos2[2], pct) + Math.sin(baseAngle + Math.PI) * amp;
      pts2.push(new THREE.Vector3(x, y2, z2));
    }

    if (line1Ref.current) line1Ref.current.setPoints(pts1);
    if (line2Ref.current) line2Ref.current.setPoints(pts2);
  });

  if (isBroken) {
    // Faded red fracture line representation
    return (
      <Line
        points={[pos1, pos2]}
        color="#ef4444"
        lineWidth={1}
        transparent
        opacity={0.12}
      />
    );
  }

  return (
    <group>
      <Line
        ref={line1Ref}
        points={[pos1, pos2]}
        color={bondColor}
        lineWidth={2.5}
        transparent
        opacity={0.65}
      />
      <Line
        ref={line2Ref}
        points={[pos1, pos2]}
        color={bondColor}
        lineWidth={2.5}
        transparent
        opacity={0.65}
      />
      <Line
        points={[pos1, pos2]}
        color="#ffffff"
        lineWidth={0.8}
        transparent
        opacity={0.2}
      />
    </group>
  );
};

const DraggableVibratingAtom = ({ 
  element, 
  which, 
  baseX, 
  distanceScale,
  draggedAtom,
  setDraggedAtom, 
  dragStartScale, 
  dragStartClientX,
  isBroken,
  bondType,
  onDistanceScaleChange
}: { 
  element: ElementData; 
  which: 1 | 2; 
  baseX: number; 
  distanceScale: number;
  draggedAtom: 1 | 2 | null;
  setDraggedAtom: (w: 1 | 2 | null) => void;
  dragStartScale: React.MutableRefObject<number>;
  dragStartClientX: React.MutableRefObject<number>;
  isBroken: boolean;
  bondType: string;
  onDistanceScaleChange: (scale: number) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 115; // fast frequency vibration
    
    let jitterX = 0;
    let jitterY = 0;
    let jitterZ = 0;

    if (bondType && bondType !== 'inert' && !isBroken) {
      if (distanceScale < 1.0) {
        // Violently trembling under strong core electron cloud repulsion
        const intensity = Math.pow(1.0 - distanceScale, 2.0) * 2.5;
        jitterX = Math.sin(t) * intensity;
        jitterY = Math.cos(t * 1.3) * intensity;
        jitterZ = Math.sin(t * 0.7) * intensity;
      } else if (distanceScale > 1.15 && distanceScale < 1.35) {
        // Tanned/stretched near snap point limit
        const intensity = (distanceScale - 1.15) * 0.15;
        jitterX = Math.sin(t * 0.4) * intensity;
        jitterY = Math.cos(t * 0.55) * intensity;
      }
    }

    groupRef.current.position.set(baseX + jitterX, 0 + jitterY, 0 + jitterZ);
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        if (!bondType || bondType === 'inert') return;
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setDraggedAtom(which);
        dragStartScale.current = distanceScale;
        dragStartClientX.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (draggedAtom === which) {
          e.stopPropagation();
          const deltaX = e.clientX - dragStartClientX.current;
          const factor = which === 1 ? -1 : 1;
          const newScale = Math.max(0.45, Math.min(1.8, dragStartScale.current + (deltaX * factor * 0.0055)));
          onDistanceScaleChange(parseFloat(newScale.toFixed(4)));
        }
      }}
      onPointerUp={(e) => {
        if (draggedAtom === which) {
          e.stopPropagation();
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          setDraggedAtom(null);
        }
      }}
    >
      <AtomModel 
        element={element} 
        position={[0, 0, 0]} 
        fadeOutOutermost={!isBroken && bondType !== 'inert' && bondType !== 'metallic'} 
      />
    </group>
  );
};

export const AtomicScene = ({ embedded = false }: { embedded?: boolean }) => {
    const { selectedElement, selectedElement2, bondingMode, setTableOpen } = useAtomicStore();
    const [distanceScale, setDistanceScale] = useState<number>(1.0);

    const [draggedAtom, setDraggedAtom] = useState<1 | 2 | null>(null);
    const dragStartScale = useRef<number>(1.0);
    const dragStartClientX = useRef<number>(0);

    const [snapActive, setSnapActive] = useState<boolean>(false);
    const [snapTime, setSnapTime] = useState<number>(0);
    const [reformActive, setReformActive] = useState<boolean>(false);
    const [reformTime, setReformTime] = useState<number>(0);
    const wasBrokenRef = useRef<boolean>(false);

    const showBonding = bondingMode && selectedElement2;
    const isBroken = showBonding && distanceScale > 1.35;

    useEffect(() => {
        if (!showBonding) {
            wasBrokenRef.current = false;
            setSnapActive(false);
            setReformActive(false);
            return;
        }
        if (wasBrokenRef.current !== isBroken) {
            if (isBroken) {
                setSnapActive(true);
                setSnapTime(performance.now());
                setReformActive(false);
            } else {
                setReformActive(true);
                setReformTime(performance.now());
                setSnapActive(false);
            }
            wasBrokenRef.current = isBroken;
        }
    }, [isBroken, showBonding]);

    const [isDrifting, setIsDrifting] = useState<boolean>(false);
    const [cumulativeReleasedEnergy, setCumulativeReleasedEnergy] = useState<number>(0);
    const velocityRef = useRef<number>(0);
    const positionRef = useRef<number>(1.0);

    // Keep positionRef in sync when user manually drags the slider (not auto-drifting)
    useEffect(() => {
        if (!isDrifting) {
            positionRef.current = distanceScale;
            velocityRef.current = 0;
        }
    }, [distanceScale, isDrifting]);

    // Track energy release as they drift
    useEffect(() => {
        if (!selectedElement || !selectedElement2) {
            setCumulativeReleasedEnergy(0);
            return;
        }
        // Potential energy release of selected atoms relative to outer dissociation point (distanceScale = 1.8)
        const baseline = calculateBond(selectedElement, selectedElement2, 1.8);
        const currentB = calculateBond(selectedElement, selectedElement2, distanceScale);
        
        // Cumulative release = baseline energy - current energy
        const released = baseline.potentialEnergy - currentB.potentialEnergy;
        setCumulativeReleasedEnergy(released > 0 ? released : 0);
    }, [selectedElement, selectedElement2, distanceScale]);

    // Euler-Cromer Physics Integration Loop for Realistic Morse Potential Drifting & Vibration
    useEffect(() => {
        if (!isDrifting || !selectedElement || !selectedElement2) return;

        let animFrameId: number;
        let lastTime = performance.now();

        const step = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05); // Clamping dt to avoid leap issues on slow machines
            lastTime = now;

            const currentBond = calculateBond(selectedElement, selectedElement2, positionRef.current);
            const De = currentBond.equilibriumEnergy;
            const a = 4.2;
            const x = positionRef.current;
            
            // Calculate restorative chemical force: F = - dV/dx = -2 * De * a * exp(-a*(x-1)) * (1 - exp(-a*(x-1)))
            const DeNormalized = De / 1500; // Scaling for smooth visualization
            const expTerm = Math.exp(-a * (x - 1.0));
            const force = -2 * DeNormalized * a * expTerm * (1.0 - expTerm);

            // Viscous damping friction to dissipate excess kinetic energy as heat, relaxing the bond down
            const friction = 2.8; 
            const frictionForce = -friction * velocityRef.current;

            const acceleration = force + frictionForce;

            // Integration Step
            velocityRef.current += acceleration * dt * 45; 
            positionRef.current += velocityRef.current * dt;

            // Safeguards / limits
            if (positionRef.current < 0.45) {
                positionRef.current = 0.45;
                velocityRef.current = -velocityRef.current * 0.1; // soft bounce
            }
            if (positionRef.current > 1.8) {
                positionRef.current = 1.8;
                velocityRef.current = -velocityRef.current * 0.1;
            }

            setDistanceScale(parseFloat(positionRef.current.toFixed(4)));

            animFrameId = requestAnimationFrame(step);
        };

        animFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animFrameId);
    }, [isDrifting, selectedElement, selectedElement2]);

    const startDrift = () => {
        setDistanceScale(1.8);
        positionRef.current = 1.8;
        velocityRef.current = 0;
        setIsDrifting(true);
    };

    const pauseDrift = () => {
        setIsDrifting(false);
    };

    const resetDrift = () => {
        setIsDrifting(false);
        setDistanceScale(1.0);
    };

    // Compute the Morse graph plotting coordinate cache over the simulation bounds
    const chartData = useMemo(() => {
        if (!selectedElement || !selectedElement2) return [];
        
        const sh1 = 3 + (selectedElement.electrons.length - 1) * 1.5;
        const sh2 = 3 + (selectedElement2.electrons.length - 1) * 1.5;
        const sDist = sh1 + sh2;

        const points = [];
        for (let r = 0.45; r <= 1.815; r += 0.035) {
            const b = calculateBond(selectedElement, selectedElement2, r);
            points.push({
                distanceScale: parseFloat(r.toFixed(3)),
                distance: parseFloat((r * sDist).toFixed(3)),
                potentialEnergy: parseFloat(b.potentialEnergy.toFixed(2))
            });
        }
        return points;
    }, [selectedElement, selectedElement2]);

    if (!selectedElement) {
        return (
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <div className="text-white/30 tracking-widest uppercase font-mono text-xs">Awaiting Element Selection</div>
            </div>
        );
    }

    const bond = showBonding && selectedElement2 ? calculateBond(selectedElement, selectedElement2, distanceScale) : null;
    
    // Core structural distance calculations
    const shell1 = 3 + (selectedElement.electrons.length - 1) * 1.5;
    const shell2 = selectedElement2 ? 3 + (selectedElement2.electrons.length - 1) * 1.5 : 0;
    const standardDist = shell1 + shell2; 
    const currentDist = standardDist * distanceScale;

    const pos1: [number, number, number] = showBonding ? [-currentDist / 2, 0, 0] : [0, 0, 0];
    const pos2: [number, number, number] = showBonding ? [currentDist / 2, 0, 0] : [0, 0, 0];

    const en1 = getElectronegativity(selectedElement.atomicNumber);
    const en2 = selectedElement2 ? getElectronegativity(selectedElement2.atomicNumber) : 0;
    const deltaEN = Math.abs(en1 - en2);

    // Color helpers for dashboards
    const getBondColor = () => {
        if (!bond) return 'rgba(168,85,247,0.3)';
        if (isBroken) return 'rgba(239, 68, 68, 0.2)';
        switch (bond.type) {
            case 'covalent': return '#06b6d4'; // Cyan
            case 'polar_covalent': return '#f59e0b'; // Amber
            case 'ionic': return '#ec4899'; // Pink
            case 'metallic': return '#a855f7'; // Purple
            case 'inert': return '#6b7280'; // Gray
        }
    };

    return (
        <div className="w-full h-full relative cursor-move flex flex-col items-center">
            <Canvas camera={{ position: [0, 4, showBonding ? 18 : 12], fov: 45 }}>
                <color attach="background" args={['#0f101a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 0, 0]} intensity={10} color="#ffffff" />
                
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={1} />
                
                {/* Visual Snapping & Reconstitution Event Overlays */}
                <BondShockwave active={snapActive} timestamp={snapTime} />
                <ReconstitutionFlash active={reformActive} timestamp={reformTime} />

                {!showBonding ? (
                    <AtomModel 
                       element={selectedElement} 
                       position={pos1} 
                    />
                ) : (
                    <>
                        {/* Interactive Drag Node 1 */}
                        <DraggableVibratingAtom
                            element={selectedElement}
                            which={1}
                            baseX={pos1[0]}
                            distanceScale={distanceScale}
                            draggedAtom={draggedAtom}
                            setDraggedAtom={setDraggedAtom}
                            dragStartScale={dragStartScale}
                            dragStartClientX={dragStartClientX}
                            isBroken={isBroken}
                            bondType={bond?.type || ''}
                            onDistanceScaleChange={setDistanceScale}
                        />

                        {selectedElement2 && bond && (
                            <>
                                {/* Interactive Drag Node 2 */}
                                <DraggableVibratingAtom
                                    element={selectedElement2}
                                    which={2}
                                    baseX={pos2[0]}
                                    distanceScale={distanceScale}
                                    draggedAtom={draggedAtom}
                                    setDraggedAtom={setDraggedAtom}
                                    dragStartScale={dragStartScale}
                                    dragStartClientX={dragStartClientX}
                                    isBroken={isBroken}
                                    bondType={bond?.type || ''}
                                    onDistanceScaleChange={setDistanceScale}
                                />

                                {/* Double-spiral force-field line representation */}
                                <EnergeticForceField
                                    pos1={pos1}
                                    pos2={pos2}
                                    distanceScale={distanceScale}
                                    isBroken={isBroken}
                                    bondColor={getBondColor()}
                                />

                                {/* Rendering different interactive bonds */}
                                {!isBroken && (
                                    <>
                                        {/* Shared covalent electron clouds */}
                                        {(bond.type === 'covalent' || bond.type === 'polar_covalent') && (
                                            <>
                                                {/* Dynamic shared cloud */}
                                                <mesh position={[(pos1[0] + pos2[0])/2 + (bond.type === 'polar_covalent' ? (en1 > en2 ? -currentDist * 0.1 : currentDist * 0.1) : 0), 0, 0]}>
                                                    <sphereGeometry args={[(shell1 * 0.38 + shell2 * 0.38) * (2.0 - distanceScale), 32, 32]} />
                                                    <meshBasicMaterial 
                                                       color={bond.type === 'covalent' ? "#06b6d4" : "#f59e0b"} 
                                                       transparent 
                                                       opacity={0.16 * (1.6 - distanceScale)} 
                                                       blending={THREE.AdditiveBlending} 
                                                    />
                                                </mesh>

                                                {/* Shared electron particles in Figure-Eight loops */}
                                                {Array.from({ length: bond.sharedElectrons }).map((_, i) => (
                                                    <SharedElectron 
                                                        key={`shared-${i}`}
                                                        dist={currentDist}
                                                        speed={1.8}
                                                        offsetAngle={(i * Math.PI) / (bond.sharedElectrons / 2 || 1)}
                                                        color="#e0f2fe"
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {/* Ionic Bond transfers */}
                                        {bond.type === 'ionic' && (
                                            <>
                                                {/* Attraction Shell Glow around atoms */}
                                                <mesh position={pos1}>
                                                    <sphereGeometry args={[shell1 * 1.1, 32, 32]} />
                                                    <meshBasicMaterial color={selectedElement.color} transparent opacity={0.03} wireframe />
                                                </mesh>
                                                <mesh position={pos2}>
                                                    <sphereGeometry args={[shell2 * 1.1, 32, 32]} />
                                                    <meshBasicMaterial color={selectedElement2.color} transparent opacity={0.03} wireframe />
                                                </mesh>

                                                {/* Jumping electrons transfer */}
                                                {Array.from({ length: bond.sharedElectrons }).map((_, i) => (
                                                    <IonicElectronTransfer 
                                                        key={`ionic-e-${i}`}
                                                        pos1={pos1}
                                                        pos2={pos2}
                                                        speed={1.0 + i * 0.2}
                                                        color="#fcb0f3"
                                                    />
                                                ))}

                                                <ElectrostaticParticleFlow pos1={pos1} pos2={pos2} />

                                                {/* Attraction electrostatic link ring between the cations and anions */}
                                                <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                                    <ringGeometry args={[1.5, 1.55, 32]} />
                                                    <meshBasicMaterial color="#ec4899" transparent opacity={0.15} side={THREE.DoubleSide} />
                                                </mesh>
                                            </>
                                        )}

                                        {/* Metallic swarm */}
                                        {bond.type === 'metallic' && (
                                            <MetallicElectronSea 
                                                pos1={pos1} 
                                                pos2={pos2} 
                                                color1={selectedElement.color} 
                                                color2={selectedElement2.color} 
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

                <OrbitControls enablePan={false} minDistance={2} maxDistance={40} autoRotate={!showBonding} autoRotateSpeed={0.5} enabled={!draggedAtom} />
            </Canvas>

            {!embedded && (
                <>
                    {/* Title HUD Overlay */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-500">
                      <div 
                        className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] pointer-events-auto flex items-center gap-3"
                        style={{ borderColor: getBondColor() + '50' }}
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ backgroundColor: getBondColor() }}></span>
                        <span className="text-xs font-mono text-purple-200 uppercase tracking-widest whitespace-nowrap">
                          {showBonding ? `Interactive Bond: ${selectedElement.symbol} + ${selectedElement2.symbol}` : `Atomic Structure: ${selectedElement.name}`}
                        </span>
                      </div>
                    </div>

                    {/* Left and Right Dashboards */}
                    <div className="absolute inset-x-8 top-16 bottom-10 z-10 pointer-events-none flex justify-between gap-6">
                        {/* Visual Chemistry / Bond Inspector Panel */}
                        <div className="flex flex-col gap-4 self-start max-w-sm mt-8">
                            {/* Basic Element Metrics (Atom 1) */}
                            <div className="bg-black/60 backdrop-blur-md p-5 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-auto">
                                <h1 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">Element Core Profile</h1>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-4xl font-light tracking-tight text-white" style={{color: selectedElement.color}}>{selectedElement.symbol}</span>
                                    <span className="text-lg text-white/80 tracking-tight pb-1 truncate">{selectedElement.name}</span>
                                </div>
                                
                                <div className="grid gap-y-2 font-mono text-[10px] opacity-90">
                                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">Z PROTONS</span><span className="text-white font-bold">{selectedElement.atomicNumber}</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">E- CONFIG</span><span className="text-white text-right">{selectedElement.electrons.join(', ')}</span></div>
                                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">ELECTRONEG.</span><span className="text-yellow-400 font-bold">{en1.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span className="text-white/40">CLASS</span><span className="text-right truncate max-w-[120px]" style={{color: selectedElement.color}}>{selectedElement.category}</span></div>
                                </div>
                            </div>

                            {/* Bonding Status Controller */}
                            {showBonding && selectedElement2 && bond && (
                                <div className="bg-black/60 backdrop-blur-md p-5 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-auto flex flex-col gap-3">
                                    <h2 className="text-xs font-mono text-fuchsia-400 uppercase tracking-widest font-bold">Bond Mechanics</h2>
                                    
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-white/40">INTER-NUCLEAR DISTANCE</span>
                                            <span className="text-white font-bold">{ (currentDist).toFixed(2) } Å</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="1.8" 
                                            step="0.02" 
                                            value={distanceScale} 
                                            onChange={(e) => setDistanceScale(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                                        />
                                        <div className="flex justify-between text-[8px] font-mono mt-0.5">
                                            <span className="text-white/30">COMPRESS</span>
                                            <span className={isBroken ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                                                {isBroken ? "BOND BROKEN (DISSOCIATED)" : "ACTIVE ORBITAL"}
                                            </span>
                                            <span className="text-white/30">DISSOCIATE</span>
                                        </div>
                                    </div>

                                    {/* Drift Controller Buttons */}
                                    <div className="flex gap-2">
                                        {isDrifting ? (
                                            <button 
                                                onClick={pauseDrift}
                                                className="flex-1 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-300 rounded py-1.5 px-2 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                                            >
                                                <Pause className="w-3 h-3" />
                                                Pause Drift
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={startDrift}
                                                className="flex-1 bg-fuchsia-500/25 border border-fuchsia-500/40 hover:bg-fuchsia-500/35 text-fuchsia-300 rounded py-1.5 px-2 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                                                title="Trigger atoms starting at outer orbit and drifting inward under physical attraction"
                                            >
                                                <Play className="w-3 h-3 text-fuchsia-400" />
                                                Simulate Drift
                                            </button>
                                        )}
                                        <button 
                                            onClick={resetDrift}
                                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white rounded py-1.5 px-2.5 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                                            title="Reset back to stable equilibrium bonding distance"
                                        >
                                            <RotateCcw className="w-3 h-3 text-white/50" />
                                            Equil (1.0)
                                        </button>
                                    </div>

                                    {/* Dynamic comparison of values */}
                                    <div className="border-t border-white/5 pt-2 mt-1 space-y-1">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-white/40">VALENCE SHELLS</span>
                                            <span className="text-white">
                                                {selectedElement.electrons[selectedElement.electrons.length - 1]}e⁻ vs {selectedElement2.electrons[selectedElement2.electrons.length - 1]}e⁻
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bond Dashboard Panel on the right when bonding mode is on */}
                        {showBonding && selectedElement2 && bond && (
                            <div className="flex flex-col gap-4 self-start max-w-sm mt-8">
                                {/* Selected Atom 2 Profile */}
                                <div className="bg-black/60 backdrop-blur-md p-5 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-auto">
                                    <h1 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">Element Core Profile 2</h1>
                                    <div className="flex items-end gap-3 mb-4">
                                        <span className="text-4xl font-light tracking-tight text-white" style={{color: selectedElement2.color}}>{selectedElement2.symbol}</span>
                                        <span className="text-lg text-white/80 tracking-tight pb-1 truncate">{selectedElement2.name}</span>
                                    </div>
                                    
                                    <div className="grid gap-y-2 font-mono text-[10px] opacity-90">
                                        <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">Z PROTONS</span><span className="text-white font-bold">{selectedElement2.atomicNumber}</span></div>
                                        <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">E- CONFIG</span><span className="text-white text-right">{selectedElement2.electrons.join(', ')}</span></div>
                                        <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">ELECTRONEG.</span><span className="text-yellow-400 font-bold">{en2.toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span className="text-white/40">CLASS</span><span className="text-right truncate max-w-[120px]" style={{color: selectedElement2.color}}>{selectedElement2.category}</span></div>
                                    </div>
                                </div>

                                {/* Analytical Bond Characteristics Panel */}
                                <div className="bg-black/60 backdrop-blur-md p-5 rounded shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-auto flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xs font-mono tracking-widest uppercase font-bold" style={{ color: getBondColor() }}>
                                            {isBroken ? "Broken Bond" : bond.name}
                                        </h2>
                                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-mono font-bold text-white/80">
                                            ΔEN = {deltaEN.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Electronegativity Dial Gauge */}
                                    <div>
                                        <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mb-1">
                                            <span>COVALENT SHORE</span>
                                            <span>POLAR REGION</span>
                                            <span>IONIC GATEWAY</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
                                            <div 
                                                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-pink-500 transition-all duration-300" 
                                                style={{ width: `${Math.min((deltaEN / 3.3) * 100, 100)}%` }}
                                            />
                                            <div 
                                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white]" 
                                                style={{ left: `${Math.min((deltaEN / 3.3) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Potential Energy displays */}
                                    <div className="bg-black/40 border border-white/5 p-3 rounded-sm font-mono text-[10px] space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/40 uppercase">Bond Potential Energy</span>
                                            <span className={`font-bold ${bond.potentialEnergy > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                                                {bond.potentialEnergy.toFixed(1)} kJ/mol
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px]">
                                            <span className="text-white/30 uppercase">Equilibrium Potential Depth</span>
                                            <span className="text-cyan-400">-{bond.equilibriumEnergy.toFixed(1)} kJ/mol</span>
                                        </div>
                                        {/* Simple visualization bar */}
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5 relative">
                                            <div 
                                                className={`h-full transition-all duration-150 ${bond.potentialEnergy > 0 ? 'bg-red-500' : 'bg-emerald-400'}`}
                                                style={{ 
                                                    width: bond.potentialEnergy > 0 
                                                        ? `${Math.min((bond.potentialEnergy / (bond.equilibriumEnergy * 2)) * 100, 100)}%`
                                                        : `${Math.min((Math.abs(bond.potentialEnergy) / bond.equilibriumEnergy) * 100, 100)}%` 
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-[10.5px] font-sans leading-relaxed text-white/70">
                                        {isBroken 
                                            ? ` Orbital overlay ceased. Standard thermodynamic drift makes the link unstable at ${currentDist.toFixed(1)} Å.`
                                            : bond.description
                                        }
                                    </p>

                                    <button 
                                        onClick={() => setTableOpen(true)}
                                        className="w-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-white font-mono text-[9px] tracking-widest uppercase py-2 rounded transition-all pointer-events-auto mt-2"
                                    >
                                        Change Partners
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Center Potential Energy Plotter Overlay */}
                    {showBonding && selectedElement2 && bond && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-[560px] max-w-full bg-[#040406]/85 backdrop-blur-md rounded border border-white/10 p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-2.5">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-100">
                                        Potential Energy Well (Morse Plotter)
                                    </span>
                                </div>
                                <span className={`text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                    isDrifting 
                                        ? 'bg-amber-500/10 border border-amber-500/25 text-amber-300' 
                                        : isBroken 
                                            ? 'bg-red-500/10 border border-red-500/25 text-red-300 animate-pulse'
                                            : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                                }`}>
                                    {isDrifting 
                                        ? 'DRIFT ACTIVE (RELEASING HEAT)' 
                                        : isBroken 
                                            ? 'DISSOCIATED LIMIT reached' 
                                            : 'EQUILIBRIUM GROUND STATE'
                                    }
                                </span>
                            </div>

                            {/* Secondary visual metrics deck */}
                            <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-[#bcbecb] mb-1">
                                <div className="bg-[#0c0c10]/50 border border-white/5 rounded p-1.5 text-center flex flex-col justify-center">
                                    <span className="text-white/30 text-[7.5px] uppercase font-semibold">Inter-nuclear r</span>
                                    <span className="text-white font-bold text-xs">{currentDist.toFixed(2)} Å</span>
                                </div>
                                <div className="bg-[#0c0c10]/50 border border-white/5 rounded p-1.5 text-center flex flex-col justify-center">
                                    <span className="text-white/30 text-[7.5px] uppercase font-semibold">Bond Potential Ep</span>
                                    <span className={`font-bold text-xs ${bond.potentialEnergy > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                        {bond.potentialEnergy.toFixed(1)} kJ/mol
                                    </span>
                                </div>
                                <div className="bg-[#0c0c10]/50 border border-white/5 rounded p-1.5 text-center flex flex-col justify-center">
                                    <span className="text-white/30 text-[7.5px] uppercase font-semibold text-ellipsis truncate">Energy Release</span>
                                    <span className="text-cyan-400 font-bold text-xs">{cumulativeReleasedEnergy.toFixed(1)} kJ/mol</span>
                                </div>
                            </div>

                            <div className="w-full h-32 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: -5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.04} />
                                        <XAxis 
                                            dataKey="distance" 
                                            stroke="#ffffff30" 
                                            fontSize={8} 
                                            tickLine={false} 
                                            label={{ value: 'Distance (Å)', position: 'insideBottomRight', offset: -5, fontSize: 8, fill: '#ffffff50', fontFamily: 'monospace' }}
                                            fontFamily="monospace"
                                        />
                                        <YAxis 
                                            stroke="#ffffff30" 
                                            fontSize={8} 
                                            tickLine={false}
                                            allowDataOverflow={true}
                                            domain={[
                                                Math.round(-bond.equilibriumEnergy * 1.25),
                                                Math.round(bond.equilibriumEnergy * 0.6 + 50)
                                            ]}
                                            label={{ value: 'Energy (kJ/mol)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 8, fill: '#ffffff50', fontFamily: 'monospace' }}
                                            fontFamily="monospace"
                                        />
                                        <ChartTooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-[#0c0c12]/95 border border-white/10 p-2 rounded text-[9px] font-mono text-white/90">
                                                            <div className="text-[10px] text-cyan-400 font-bold mb-0.5">r = {data.distance.toFixed(2)} Å</div>
                                                            <div>Potential: {parseFloat(data.potentialEnergy).toFixed(1)} kJ/mol</div>
                                                            <div className="text-[8.5px] text-white/40">Scale: {data.distanceScale.toFixed(2)}x</div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <ReferenceLine y={0} stroke="#ffffff" strokeOpacity={0.15} strokeDasharray="5 5" />
                                        <ReferenceLine x={standardDist} stroke="#a855f7" strokeOpacity={0.25} strokeDasharray="3 3" />
                                        <RechartsLine 
                                            type="monotone" 
                                            dataKey="potentialEnergy" 
                                            stroke={getBondColor()} 
                                            strokeWidth={2} 
                                            dot={false}
                                            activeDot={false}
                                        />
                                        <ReferenceDot 
                                            x={currentDist} 
                                            y={bond.potentialEnergy} 
                                            r={5} 
                                            fill="#eab308" 
                                            stroke="#ffffff" 
                                            strokeWidth={1.5}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
