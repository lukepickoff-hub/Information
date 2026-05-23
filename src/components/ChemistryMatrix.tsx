import { useState, useMemo } from 'react';
import { PARTICLE_TABLE_DATA, QUANTITY_OVER_TIME, MOLECULE_COMPOSITIONS, OBJECT_ATOMIC_ABUNDANCE, AtomRatio } from '../data/chemistryData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { FlaskConical, History, Atom, Binary, Compass, Zap } from 'lucide-react';
import { useDashboardStore, DashboardId } from '../store/useDashboardStore';

interface ChemistryMatrixProps {
  activeId: string;
}

// Science-based mapping showing only the specific chemical species that construct or inhabit the clicked spacetime object
const OBJECT_CHEMICAL_SPECIES: Record<string, string[]> = {
  sun: ['H', 'He'],
  mercury: ['O', 'P'],
  venus: ['CO₂', 'N'],
  earth: ['H₂O', 'CO₂', 'O'],
  moon: ['O', 'He'],
  mars: ['CO₂', 'N'],
  jupiter: ['H', 'He'],
  saturn: ['H', 'He'],
  uranus: ['H', 'He', 'H₂O'],
  neptune: ['H', 'He', 'H₂O'],
  skeleton: ['P', 'C'],
  cell: ['C₆H₁₂O₆', 'H₂O', 'O'],
  mitochondria: ['ATP', 'CO₂', 'O'],
  carbon: ['C'],
  oxygen: ['O']
};

const PARTICLE_SCALE_MAP: Record<string, DashboardId> = {
  'H': 'hydrogen',
  'He': 'helium',
  'Li': 'lithium',
  'Be': 'beryllium',
  'B': 'boron',
  'C': 'carbon',
  'N': 'nitrogen',
  'O': 'oxygen',
  'F': 'fluorine',
  'Ne': 'neon',
  'Na': 'sodium',
  'Mg': 'magnesium',
  'Al': 'aluminum',
  'Si': 'silicon',
  'P': 'phosphorus',
  'S': 'sulfur',
  'Cl': 'chlorine',
  'Ar': 'argon',
  'K': 'potassium',
  'Ca': 'calcium',
  'H₂O': 'cell',
  'CO₂': 'carbon',
  'C₆H₁₂O₆': 'cell',
  'ATP': 'mitochondria'
};

const getElementColor = (symbol: string) => {
  switch (symbol) {
    case 'H': return 'from-sky-500 to-indigo-500 bg-sky-500/20 text-sky-300';
    case 'He': return 'from-teal-400 to-cyan-500 bg-teal-500/20 text-teal-300';
    case 'O': return 'from-red-500 to-rose-600 bg-red-500/20 text-red-300';
    case 'C': return 'from-slate-400 to-slate-500 bg-slate-500/20 text-slate-300';
    case 'N': return 'from-blue-500 to-indigo-600 bg-blue-500/20 text-blue-300';
    case 'P': return 'from-orange-500 to-amber-600 bg-orange-500/20 text-amber-300';
    case 'Fe': return 'from-amber-700 to-red-700 bg-amber-700/20 text-amber-500';
    case 'Si': return 'from-yellow-500 to-amber-500 bg-yellow-500/20 text-yellow-300';
    case 'Ca': return 'from-emerald-400 to-green-500 bg-emerald-500/20 text-emerald-300';
    case 'Mg': return 'from-lime-400 to-green-400 bg-lime-500/20 text-lime-300';
    case 'S': return 'from-yellow-400 to-yellow-600 bg-yellow-500/20 text-yellow-400';
    default: return 'from-purple-500 to-fuchsia-500 bg-purple-500/20 text-purple-300';
  }
};

export function ChemistryMatrix({ activeId }: ChemistryMatrixProps) {
  const { setDashboardId } = useDashboardStore();

  // Get relevant particles for active clicked object (fallback to Water/Carbon/Oxygen if missing)
  const relevantSymbols = useMemo(() => {
    return OBJECT_CHEMICAL_SPECIES[activeId] || ['C', 'H₂O', 'CO₂'];
  }, [activeId]);

  // Handle active sub-selected chemical species from the filter list
  const [activeSymbol, setActiveSymbol] = useState<string>('');

  // Auto-synchronize or choose the first chemistry item when the parent object switches
  const currentSymbol = useMemo(() => {
    if (relevantSymbols.includes(activeSymbol)) {
      return activeSymbol;
    }
    return relevantSymbols[0] || 'C';
  }, [relevantSymbols, activeSymbol]);

  const selectedParticle = useMemo(() => {
    return PARTICLE_TABLE_DATA.find(p => p.symbol === currentSymbol) || PARTICLE_TABLE_DATA[0];
  }, [currentSymbol]);

  const timelineData = useMemo(() => {
    return QUANTITY_OVER_TIME[selectedParticle.symbol] || [];
  }, [selectedParticle]);

  const composition = useMemo(() => {
    return MOLECULE_COMPOSITIONS[selectedParticle.symbol] || [];
  }, [selectedParticle]);

  const atomicAbundance = useMemo(() => {
    const list = OBJECT_ATOMIC_ABUNDANCE[activeId] || [];
    // Sort from highest atomic percentage to lowest
    return [...list].sort((a, b) => b.percentage - a.percentage);
  }, [activeId]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header and Filter Selector */}
      <div className="bg-[#09090e] border border-white/5 rounded p-4">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#f4f4f5] font-mono">
            Particle Chemistry Specs
          </h3>
        </div>
        <p className="text-[10px] text-white/40 mb-3 leading-relaxed font-sans">
          Physical objects are constructs of precise atoms and molecular bonds. Below is the chemical blueprint of the active state.
        </p>

        {/* Selected Species Toggle Filter (Shows only relevant) */}
        <div className="space-y-2">
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
            Interactive Species on this Object:
          </span>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {relevantSymbols.map(sym => {
                const part = PARTICLE_TABLE_DATA.find(p => p.symbol === sym);
                const isActive = sym === currentSymbol;
                return (
                  <button
                    key={sym}
                    onClick={() => setActiveSymbol(sym)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-purple-950/45 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-[#040406]/70 border-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    <span className="text-xs">{sym}</span>
                    <span className="text-[8px] opacity-40 font-normal">({part?.name || 'Element'})</span>
                  </button>
                );
              })}
            </div>

            {/* Direct Jump Navigation Scale Trigger */}
            {PARTICLE_SCALE_MAP[currentSymbol] && PARTICLE_SCALE_MAP[currentSymbol] !== activeId && (
              <button
                onClick={() => setDashboardId(PARTICLE_SCALE_MAP[currentSymbol])}
                className="px-2.5 py-1 rounded bg-purple-950/25 border border-purple-500/25 text-[10px] font-mono text-purple-300 hover:bg-purple-900/40 hover:text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse shrink-0"
                title={`Focus physical viewport directly onto ${PARTICLE_SCALE_MAP[currentSymbol]} scale`}
              >
                <Compass className="w-3.5 h-3.5" /> Scale Focus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. OBJECT-LEVEL ELEMENTAL ATOMIC ABUNDANCE RATIO TABLE (Sorted descending) */}
      <div className="bg-[#09090e] border border-white/5 rounded p-4 font-sans animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2 mb-2">
          <Binary className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#f4f4f5] font-mono">
            Elemental Atomic Abundance Specs Profile
          </h3>
        </div>
        <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
          The exact distribution percentage of atoms that construct this physical system, arranged from <strong className="text-purple-400">highest ratio (top)</strong> to <strong className="text-purple-400">lowest ratio (bottom)</strong>.
        </p>

        {/* Stacked Proportional Distribution Visual Bar */}
        {atomicAbundance.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-bold">
              Visual Mass-to-Atom Fractional Spectrum
            </span>
            <div className="w-full h-3 rounded bg-black/60 overflow-hidden flex border border-white/5 select-none">
              {atomicAbundance.map((item, index) => {
                const colors = getElementColor(item.symbol).split(' ');
                const colorClass = `${colors[0]} ${colors[1]}`;
                return (
                  <div
                    key={`bar-${item.symbol}-${index}`}
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 relative`}
                    title={`${item.element} (${item.symbol}): ${item.percentage}% (By Atom Count)`}
                  />
                );
              })}
            </div>
            {/* Quick mini-legend labels */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[8px] font-mono">
              {atomicAbundance.map((item, index) => {
                const colors = getElementColor(item.symbol).split(' ');
                const colorText = colors[3];
                return (
                  <div key={`legend-${item.symbol}-${index}`} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors[0]}`} />
                    <span className={`${colorText} font-bold`}>{item.symbol}</span>
                    <span className="text-white/30">({item.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* The Abundance Matrix Table */}
        <div className="overflow-x-auto border border-white/5 rounded bg-black/40">
          <table className="w-full text-left text-xs whitespace-normal font-sans">
            <thead>
              <tr className="bg-[#050508] text-white/40 text-[9px] uppercase tracking-wider font-mono border-b border-white/5">
                <th className="px-3 py-2 text-center w-8">Rank</th>
                <th className="px-3 py-2 w-28">Atomic Node / Element</th>
                <th className="px-3 py-2 text-right w-24">Atom Count Ratio</th>
                <th className="px-3 py-2 text-right w-24">Mass Percent</th>
                <th className="px-3 py-2 min-w-[200px]">Structural / Metabolic Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {atomicAbundance.map((item, index) => {
                const colors = getElementColor(item.symbol).split(' ');
                const colorBadge = colors[2];
                const colorText = colors[3];
                const borderHover = relevantSymbols.includes(item.symbol) || PARTICLE_SCALE_MAP[item.symbol];
                const isSelectedInHeader = item.symbol === currentSymbol;

                return (
                  <tr
                    key={`row-${item.symbol}-${index}`}
                    onClick={() => {
                      if (relevantSymbols.includes(item.symbol)) {
                        setActiveSymbol(item.symbol);
                      } else if (PARTICLE_SCALE_MAP[item.symbol]) {
                        const targetId = PARTICLE_SCALE_MAP[item.symbol];
                        if (targetId) setDashboardId(targetId);
                      }
                    }}
                    className={`transition-all duration-200 ${
                      isSelectedInHeader 
                        ? 'bg-purple-950/15' 
                        : borderHover 
                          ? 'hover:bg-white/5 cursor-pointer' 
                          : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Rank cell */}
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-white/30 text-[10px]">
                      #{index + 1}
                    </td>

                    {/* Element badge & name */}
                    <td className="px-3 py-2.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 text-[9px] leading-none font-bold rounded border border-white/10 shadow-sm ${colorBadge} ${colorText}`}>
                          {item.symbol}
                        </span>
                        <span className="text-white/80 font-bold font-sans text-[10px] truncate block w-20" title={item.element}>
                          {item.element}
                        </span>
                      </div>
                    </td>

                    {/* Atom Count percentage with graphical bar */}
                    <td className="px-3 py-2.5 text-right font-mono text-[10.5px]">
                      <div className="flex flex-col items-end gap-1 select-none">
                        <span className="font-bold text-emerald-400">{item.percentage.toFixed(index === 0 && item.percentage === 100 ? 1 : 2)}%</span>
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[0]} rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Mass Percent */}
                    <td className="px-3 py-2.5 text-right font-mono text-[10px] text-purple-300 font-semibold">
                      {item.massPercent.toFixed(index === 0 && item.massPercent === 100 ? 1 : 2)}%
                    </td>

                    {/* Role & Dynamic focus link */}
                    <td className="px-3 py-2.5 text-white/60 text-[10px] leading-relaxed">
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.role}</span>
                        {relevantSymbols.includes(item.symbol) && (
                          <span className={`text-[8px] font-mono shrink-0 px-1 py-0.5 rounded uppercase border transition-all ${
                            isSelectedInHeader 
                              ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold' 
                              : 'bg-black/60 border-white/10 text-white/30 hover:text-white/70 font-medium'
                          }`}>
                            {isSelectedInHeader ? 'Active focus' : 'Select'}
                          </span>
                        )}
                        {!relevantSymbols.includes(item.symbol) && PARTICLE_SCALE_MAP[item.symbol] && (
                          <span className="text-[8px] font-mono shrink-0 px-1 py-0.5 rounded bg-blue-950/40 border border-blue-500/20 text-blue-300 uppercase font-medium">
                            Scale Link
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Visual Bond Connectivity Schema / Bohr Atom Model (THE TOPOLOGY DISCOVERY CORE) */}
      <div className="bg-[#09090e] border border-white/5 rounded p-4">
        <div className="flex items-center gap-2 mb-3">
          <Atom className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
            {selectedParticle.isMolecule ? "Molecular Bonding Topology" : "Concentrated Atomic Shell Shells"}
          </h4>
        </div>

        {/* Dynamic Topology Graphic Canvas */}
        <div className="bg-black/50 border border-white/5 rounded p-4 flex flex-col items-center">
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-2 mb-3">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide">
              {selectedParticle.isMolecule ? `${selectedParticle.name} (${selectedParticle.symbol}) Covalent Nodes` : `Bohr Shell Map: ${selectedParticle.name}`}
            </span>
            <span className="text-[8.5px] font-mono bg-emerald-950/35 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
              {selectedParticle.isMolecule ? "Covalent Bonds" : "Shell Octet"}
            </span>
          </div>

          <div className="relative w-full h-44 flex items-center justify-center bg-[#010103] rounded border border-white/5 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                </pattern>
                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* RENDER SPECIFIC TOPOLOGIES FOR ALL MOLECULES & ATOMS IN CHEMISTRY DATA */}
              {selectedParticle.symbol === 'H₂O' && (
                <g>
                  {/* Oxygen Atom Center */}
                  <circle cx="110" cy="50" r="14" className="stroke-red-500/50 fill-red-950/70" strokeWidth="1.5" />
                  <text x="110" y="53" textAnchor="middle" className="fill-red-400 font-mono text-[9px] font-extrabold font-semibold">O</text>
                  <text x="110" y="32" textAnchor="middle" className="fill-red-400/50 font-mono text-[7px] font-bold">δ-</text>

                  {/* Left Hydrogen Atom */}
                  <circle cx="65" cy="85" r="9" className="stroke-blue-400/40 fill-blue-950/60" strokeWidth="1.5" />
                  <text x="65" y="88" textAnchor="middle" className="fill-blue-300 font-mono text-[8px] font-extrabold">H</text>
                  <text x="65" y="103" textAnchor="middle" className="fill-blue-300/50 font-mono text-[7px] font-bold">δ+</text>

                  {/* Right Hydrogen Atom */}
                  <circle cx="155" cy="85" r="9" className="stroke-blue-400/40 fill-blue-950/60" strokeWidth="1.5" />
                  <text x="155" y="88" textAnchor="middle" className="fill-blue-300 font-mono text-[8px] font-bold">H</text>
                  <text x="155" y="103" textAnchor="middle" className="fill-blue-300/50 font-mono text-[7px] font-bold">δ+</text>

                  {/* Covalent Single Bonds (104.5 degrees) */}
                  <line x1="110" y1="50" x2="65" y2="85" className="stroke-cyan-500/40" strokeWidth="1.5" strokeDasharray="2 3" />
                  <line x1="110" y1="50" x2="155" y2="85" className="stroke-cyan-500/40" strokeWidth="1.5" strokeDasharray="2 3" />

                  {/* Bond Angle Arc */}
                  <path d="M 94 62 A 25 25 0 0 0 126 62" fill="none" className="stroke-emerald-400/35" strokeWidth="1" />
                  <text x="110" y="70" textAnchor="middle" className="fill-emerald-400 font-mono text-[7px] font-bold">104.5° Bend</text>

                  {/* Orbiting Shared Electrons */}
                  <circle cx="87.5" cy="67.5" r="2.2" className="fill-yellow-300 shadow-glow" />
                  <circle cx="132.5" cy="67.5" r="2.2" className="fill-yellow-300 shadow-glow" />
                  <text x="110" y="115" textAnchor="middle" className="fill-white/30 text-[7px] uppercase font-bold tracking-widest">Polar Covalent Shared Duplets</text>
                </g>
              )}

              {selectedParticle.symbol === 'CO₂' && (
                <g>
                  {/* Symmetrical Linear Arrangement */}
                  {/* Central Carbon */}
                  <circle cx="110" cy="55" r="13" className="stroke-gray-400/50 fill-gray-950" strokeWidth="1.5" />
                  <text x="110" y="58" textAnchor="middle" className="fill-white font-mono text-[9px] font-extrabold">C</text>

                  {/* Left Oxygen */}
                  <circle cx="50" cy="55" r="13" className="stroke-red-500/50 fill-red-950/70" strokeWidth="1.5" />
                  <text x="50" y="58" textAnchor="middle" className="fill-red-400 font-mono text-[9px] font-bold">O</text>

                  {/* Right Oxygen */}
                  <circle cx="170" cy="55" r="13" className="stroke-red-500/50 fill-red-950/70" strokeWidth="1.5" />
                  <text x="170" y="58" textAnchor="middle" className="fill-red-400 font-mono text-[9px] font-bold">O</text>

                  {/* Double bonds representation (two parallel lines on each side) */}
                  {/* Left Double Bond */}
                  <line x1="63" y1="51" x2="97" y2="51" className="stroke-cyan-400/50" strokeWidth="1.5" />
                  <line x1="63" y1="59" x2="97" y2="59" className="stroke-cyan-400/50" strokeWidth="1.5" />

                  {/* Right Double Bond */}
                  <line x1="123" y1="51" x2="157" y2="51" className="stroke-cyan-400/50" strokeWidth="1.5" />
                  <line x1="123" y1="59" x2="157" y2="59" className="stroke-cyan-400/50" strokeWidth="1.5" />

                  {/* Electron symbols pulsing along the double covalent links */}
                  <circle cx="80" cy="51" r="2" className="fill-yellow-300" />
                  <circle cx="80" cy="59" r="2" className="fill-yellow-300" />
                  <circle cx="140" cy="51" r="2" className="fill-yellow-300" />
                  <circle cx="140" cy="59" r="2" className="fill-yellow-300" />

                  <text x="110" y="24" textAnchor="middle" className="fill-white/30 text-[7px] uppercase font-bold tracking-widest">Symmetrical Covalent (Linear 180°)</text>
                  <text x="110" y="112" textAnchor="middle" className="fill-cyan-400/80 font-mono text-[7px] font-bold">4 Shared Electrons Per Double Bond</text>
                </g>
              )}

              {selectedParticle.symbol === 'C₆H₁₂O₆' && (
                <g>
                  {/* Hexagonal Sugar Ring Structure */}
                  {/* Ring Vertices: 1 Oxygen + 5 Carbons */}
                  {/* Vertex Positions around center(110,60) r=25 */}
                  {/* Angle and coord mapping:
                      O (135, 60)
                      C1 (122.5, 81.6)
                      C2 (97.5, 81.6)
                      C3 (85, 60)
                      C4 (97.5, 38.4)
                      C5 (122.5, 38.4)
                  */}
                  <g className="stroke-white/20" strokeWidth="1.5">
                    {/* Ring Connections */}
                    <line x1="135" y1="60" x2="122.5" y2="81.6" />
                    <line x1="122.5" y1="81.6" x2="97.5" y2="81.6" />
                    <line x1="97.5" y1="81.6" x2="85" y2="60" />
                    <line x1="85" y1="60" x2="97.5" y2="38.4" />
                    <line x1="97.5" y1="38.4" x2="122.5" y2="38.4" />
                    <line x1="122.5" y1="38.4" x2="135" y2="60" />
                  </g>

                  {/* Main oxygen ring node */}
                  <circle cx="135" cy="60" r="7" className="stroke-red-500/50 fill-red-950" />
                  <text x="135" y="62.5" textAnchor="middle" className="fill-red-400 font-mono text-[7px] font-bold">O</text>

                  {/* Carbon ring nodes */}
                  <circle cx="122.5" cy="81.6" r="6" className="stroke-gray-400/50 fill-gray-950" />
                  <text x="122.5" y="84" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">C₁</text>

                  <circle cx="97.5" cy="81.6" r="6" className="stroke-gray-400/50 fill-gray-950" />
                  <text x="97.5" y="84" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">C₂</text>

                  <circle cx="85" cy="60" r="6" className="stroke-gray-400/50 fill-gray-950" />
                  <text x="85" y="62.5" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">C₃</text>

                  <circle cx="97.5" cy="38.4" r="6" className="stroke-gray-400/50 fill-gray-950" />
                  <text x="97.5" y="41" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">C₄</text>

                  <circle cx="122.5" cy="38.4" r="6" className="stroke-gray-400/50 fill-gray-950" />
                  <text x="122.5" y="41" textAnchor="middle" className="fill-white font-mono text-[6.5px] font-bold">C₅</text>

                  {/* Branches of C6 tail and OH subgroups for authenticity */}
                  <line x1="122.5" y1="38.4" x2="140" y2="20" className="stroke-white/10" strokeWidth="1" />
                  <circle cx="140" cy="20" r="5.5" className="fill-[#10b981] stroke-emerald-500/20" />
                  <text x="140" y="22.5" textAnchor="middle" className="fill-white font-mono text-[5.5px] font-bold">OH</text>

                  <line x1="85" y1="60" x2="65" y2="60" className="stroke-white/10" strokeWidth="1" />
                  <circle cx="65" cy="60" r="5.5" className="fill-[#10b981] stroke-emerald-500/20" />
                  <text x="65" y="62.5" textAnchor="middle" className="fill-white font-mono text-[5.5px] font-bold">OH</text>

                  <text x="110" y="113" textAnchor="middle" className="fill-emerald-400 font-mono text-[7.5px] font-bold">Hexagonal heterocyclic pyranose carbohydrate ring</text>
                </g>
              )}

              {selectedParticle.symbol === 'ATP' && (
                <g>
                  {/* Unified modular chains */}
                  {/* Adenine group */}
                  <rect x="15" y="43" width="34" height="24" rx="4" className="stroke-purple-500/30 fill-purple-950/40" strokeWidth="1" />
                  <text x="32" y="57" textAnchor="middle" className="fill-purple-300 font-mono text-[8px] font-extrabold">Adenine</text>

                  {/* Bond to Ribose */}
                  <line x1="49" y1="55" x2="65" y2="55" className="stroke-white/20" />

                  {/* Ribose group */}
                  <polygon points="65,55 75,40 92,46 92,64 75,70" className="stroke-blue-500/30 fill-blue-950/40" strokeWidth="1" />
                  <text x="80" y="58" textAnchor="middle" className="fill-blue-300 font-mono text-[8px] font-extrabold">Ribose</text>

                  {/* Phosphate Chain Link */}
                  <line x1="92" y1="55" x2="115" y2="55" className="stroke-white/20" strokeWidth="1" />

                  {/* Linear Tri-Phosphate cascade with glowing high energy bonds */}
                  {/* Phosphate 1 */}
                  <circle cx="120" cy="55" r="7.5" className="stroke-yellow-500/30 fill-[#f59e0b]/20" />
                  <text x="120" y="57.5" textAnchor="middle" className="fill-amber-400 font-mono text-[8px] font-bold">P<sub>α</sub></text>

                  {/* Phosphatase Anhydride Bond 1 (High Energy) */}
                  <line x1="127.5" y1="55" x2="147.5" y2="55" className="stroke-red-500/80 saturate-150" strokeWidth="2" filter="url(#glow-purple)" />
                  <path d="M 137.5 50 L 137.5 60" className="stroke-red-500/85" strokeWidth="1.5" />

                  {/* Phosphate 2 */}
                  <circle cx="155" cy="55" r="7.5" className="stroke-yellow-500/30 fill-[#f59e0b]/20" />
                  <text x="155" y="57.5" textAnchor="middle" className="fill-amber-400 font-mono text-[8px] font-bold">P<sub>β</sub></text>

                  {/* Phosphatase Anhydride Bond 2 (The primary catalytic energy release!) */}
                  <line x1="162.5" y1="55" x2="182.5" y2="55" className="stroke-red-500/90 saturate-200" strokeWidth="2.5" />
                  <text x="172.5" y="45" textAnchor="middle" className="fill-red-400 font-bold text-[8px] animate-pulse">⚡ ~30kJ</text>

                  {/* Phosphate 3 */}
                  <circle cx="190" cy="55" r="7.5" className="stroke-yellow-500/30 fill-[#f59e0b]/20" />
                  <text x="190" y="57.5" textAnchor="middle" className="fill-amber-400 font-mono text-[8px] font-bold">P<sub>γ</sub></text>

                  <text x="110" y="24" textAnchor="middle" className="fill-amber-400 font-mono text-[7px] font-bold uppercase tracking-widest">Adenosine Triphosphate</text>
                  <text x="110" y="113" textAnchor="middle" className="fill-red-400 font-mono text-[7.5px] font-bold">Red bonds store maximum Gibbs free potential</text>
                </g>
              )}

              {/* RENDER ELECTRONS CONCENTRIC BOOHR SHELLS FOR SINGLE ELEMENTS (H, He, C, N, O, P) */}
              {!selectedParticle.isMolecule && (
                <g>
                  {/* Concentric Atomic Core */}
                  {/* Orbit circles */}
                  <circle cx="110" cy="55" r="18" fill="none" className="stroke-cyan-500/10" strokeWidth="1" />
                  {selectedParticle.protons > 2 && (
                    <circle cx="110" cy="55" r="33" fill="none" className="stroke-cyan-500/10" strokeWidth="1" />
                  )}
                  {selectedParticle.protons > 10 && (
                    <circle cx="110" cy="55" r="45" fill="none" className="stroke-cyan-500/10" strokeWidth="1" />
                  )}

                  {/* Central Nucleus ball */}
                  <circle cx="110" cy="55" r="9" className="fill-[#1e1b4b] stroke-[#c084fc]/50" strokeWidth="1.5" />
                  <text x="110" y="57.5" textAnchor="middle" className="fill-purple-300 font-mono text-[6.5px] font-bold">Z={selectedParticle.protons}</text>

                  {/* Specific electron dots plotted neatly on rings */}
                  {/* Hydrogen: 1 electron */}
                  {selectedParticle.symbol === 'H' && (
                    <g>
                      <circle cx="110" cy="37" r="2.2" className="fill-indigo-400" />
                      <text x="110" y="113" textAnchor="middle" className="fill-[#eeeff4]/40 font-mono text-[7px] uppercase font-bold tracking-widest">Hydrogen Bohr duplet shell: 1 Valence e-</text>
                    </g>
                  )}

                  {/* Helium: 2 electrons */}
                  {selectedParticle.symbol === 'He' && (
                    <g>
                      <circle cx="110" cy="37" r="2.2" className="fill-indigo-400" />
                      <circle cx="110" cy="73" r="2.2" className="fill-indigo-400" />
                      <text x="110" y="113" textAnchor="middle" className="fill-emerald-400 font-mono text-[7px] uppercase font-bold tracking-widest">Helium: Perfectly Stable 1s² Shell</text>
                    </g>
                  )}

                  {/* Carbon: 6 electrons (2 inner, 4 outer) */}
                  {selectedParticle.symbol === 'C' && (
                    <g>
                      {/* Inner 2 */}
                      <circle cx="110" cy="37" r="2" className="fill-indigo-400" />
                      <circle cx="110" cy="73" r="2" className="fill-indigo-400" />
                      {/* Outer 4 */}
                      <circle cx="110" cy="22" r="2.2" className="fill-cyan-400" />
                      <circle cx="110" cy="88" r="2.2" className="fill-cyan-400" />
                      <circle cx="77" cy="55" r="2.2" className="fill-cyan-400" />
                      <circle cx="143" cy="55" r="2.2" className="fill-cyan-400" />
                      <text x="110" y="113" textAnchor="middle" className="fill-[#eeeff4]/40 font-mono text-[7px] font-bold tracking-wider">Carbon: 4 Valence Atoms for dynamic covalent nesting</text>
                    </g>
                  )}

                  {/* Nitrogen: 7 electrons (2 inner, 5 outer) */}
                  {selectedParticle.symbol === 'N' && (
                    <g>
                      {/* Inner 2 */}
                      <circle cx="110" cy="37" r="2" className="fill-indigo-400" />
                      <circle cx="110" cy="73" r="2" className="fill-indigo-400" />
                      {/* Outer 5 (Slightly staggered angles) */}
                      <circle cx="110" cy="22" r="2.2" className="fill-cyan-400" />
                      <circle cx="132" cy="79" r="2.2" className="fill-cyan-400" />
                      <circle cx="88" cy="79" r="2.2" className="fill-cyan-400" />
                      <circle cx="143" cy="40" r="2.2" className="fill-cyan-400" />
                      <circle cx="77" cy="40" r="2.2" className="fill-cyan-400" />
                      <text x="110" y="113" textAnchor="middle" className="fill-[#eeeff4]/40 font-mono text-[7px] font-bold">Nitrogen: 5 Valence Shell electrons</text>
                    </g>
                  )}

                  {/* Oxygen: 8 electrons (2 inner, 6 outer) */}
                  {selectedParticle.symbol === 'O' && (
                    <g>
                      {/* Inner 2 */}
                      <circle cx="110" cy="37" r="2" className="fill-indigo-400" />
                      <circle cx="110" cy="73" r="2" className="fill-indigo-400" />
                      {/* Outer 6 */}
                      <circle cx="110" cy="22" r="2.2" className="fill-cyan-400" />
                      <circle cx="110" cy="88" r="2.2" className="fill-cyan-400" />
                      <circle cx="77" cy="55" r="2.2" className="fill-cyan-400" />
                      <circle cx="143" cy="55" r="2.2" className="fill-cyan-400" />
                      <circle cx="132" cy="35" r="2.2" className="fill-cyan-400" />
                      <circle cx="88" cy="75" r="2.2" className="fill-cyan-400" />
                      <text x="110" y="114" textAnchor="middle" className="fill-red-400/90 font-mono text-[7px] font-bold">Oxygen Core: 6 Valence shell orbitals (highly reactive)</text>
                    </g>
                  )}

                  {/* Phosphorus: 15 electrons (2 inner, 8 middle, 5 outer) */}
                  {selectedParticle.symbol === 'P' && (
                    <g>
                      {/* Inner 2 */}
                      <circle cx="110" cy="40" r="1.5" className="fill-indigo-400" />
                      <circle cx="110" cy="70" r="1.5" className="fill-indigo-400" />
                      {/* Middle 8 */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                          <circle
                            key={`mid-${deg}`}
                            cx={110 + 21 * Math.cos(rad)}
                            cy={55 + 21 * Math.sin(rad)}
                            r="1.8"
                            className="fill-indigo-300"
                          />
                        );
                      })}
                      {/* Outer 5 */}
                      {[0, 72, 144, 216, 288].map(deg => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                          <circle
                            key={`out-${deg}`}
                            cx={110 + 38 * Math.cos(rad)}
                            cy={55 + 38 * Math.sin(rad)}
                            r="2.2"
                            className="fill-cyan-400"
                          />
                        );
                      })}
                      <text x="110" y="114" textAnchor="middle" className="fill-amber-400 font-mono text-[7px] font-bold">Phosphorus skeleton backbone: 5 outer valence nodes</text>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          <div className="w-full text-center space-y-1 mt-1">
            <span className="text-[10px] text-white/75 font-sans block leading-relaxed">
              {selectedParticle.formulaDescription || "Single elementary atom with concentrated cloud layers mapping standard configuration potentials."}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subatomic Matrix Metrics List */}
      <div className="bg-[#09090e] border border-white/5 rounded p-4">
        <div className="flex items-center gap-2 mb-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#f4f4f5] font-mono">Subatomic Nuclear Formula</span>
        </div>

        {selectedParticle.isMolecule ? (
          <div className="space-y-2">
            {composition.map((item) => {
              const targetId = PARTICLE_SCALE_MAP[item.symbol];
              return (
                <div 
                  key={item.symbol} 
                  onClick={() => targetId && setDashboardId(targetId)}
                  className={`bg-[#030305] border border-white/5 p-2 rounded font-mono text-[9px] flex items-center justify-between transition-all ${
                    targetId 
                      ? 'cursor-pointer hover:border-purple-500/30 hover:bg-[#07050d] group/item' 
                      : ''
                  }`}
                  title={targetId ? `Click to jump to the ${item.name} Atom details` : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded border transition-colors ${
                      targetId 
                        ? 'bg-purple-950/20 border-purple-500/20 text-purple-300 group-hover/item:border-purple-400 group-hover/item:text-purple-200 shadow-sm' 
                        : 'bg-white/5 border-white/10 text-purple-300'
                    }`}>{item.symbol}</span>
                    <div>
                      <div className={`font-mono font-bold leading-tight transition-colors ${targetId ? 'text-purple-300 group-hover/item:text-purple-100 group-hover/item:underline' : 'text-white/85'}`}>
                        {item.name} Atom Node {targetId && '☄️'}
                      </div>
                      <div className="text-[8.5px] text-white/30 font-sans">Multiplicity Factor: {item.count} in molecule</div>
                    </div>
                  </div>
                  <div className="flex gap-2.5 text-right text-[8.5px]">
                    <div>
                      <span className="text-white/30 block text-[7.5px] uppercase">Protons</span>
                      <span className="text-cyan-400 font-bold">{item.protons * item.count}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block text-[7.5px] uppercase">Neutrons</span>
                      <span className="text-amber-400 font-bold">{item.neutrons * item.count}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block text-[7.5px] uppercase">Electrons</span>
                      <span className="text-indigo-400 font-bold">{item.electrons * item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center select-none font-mono">
            <div className="bg-cyan-950/20 border border-cyan-500/15 p-2 rounded">
              <span className="text-white/35 block text-[7.5px] uppercase font-bold tracking-wider">Protons (Z)</span>
              <span className="text-cyan-400 text-sm font-extrabold">{selectedParticle.protons}</span>
            </div>
            <div className="bg-amber-950/20 border border-amber-500/15 p-2 rounded">
              <span className="text-white/35 block text-[7.5px] uppercase font-bold tracking-wider">Neutrons (N)</span>
              <span className="text-amber-400 text-sm font-extrabold">{selectedParticle.neutrons}</span>
            </div>
            <div className="bg-indigo-950/20 border border-indigo-505/15 p-2 rounded">
              <span className="text-white/35 block text-[7.5px] uppercase font-bold tracking-wider">Electrons (e-)</span>
              <span className="text-indigo-400 text-sm font-extrabold">{selectedParticle.electrons}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Abundance Historical Sparkline Trend */}
      {timelineData.length > 0 && (
        <div id="abundance-trend-box" className="bg-[#09090e] border border-white/5 rounded p-4 select-none">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f4f4f5] font-mono">Temporal Synthesis Trend</h4>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mb-3 leading-relaxed font-sans">
            Relative presence curve tracking {selectedParticle.name} abundance levels across spacetime boundaries:
          </p>

          <div className="h-28 w-full text-[9px] font-mono">
            <ResponsiveContainer width="100%" height="105%">
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAbundance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="epoch" stroke="#ffffff15" tick={{ fill: '#ffffff35', fontSize: 7.5 }} />
                <YAxis stroke="#ffffff15" tick={{ fill: '#ffffff35', fontSize: 7.5 }} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: '#09090e', borderColor: '#ffffff10', borderRadius: '4px', fontSize: '9px' }}
                  itemStyle={{ color: '#c084fc' }}
                />
                <Area type="monotone" dataKey="abundance" name="Synthesis Ratio %" stroke="#a855f7" strokeWidth={1} fillOpacity={1} fill="url(#colorAbundance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
