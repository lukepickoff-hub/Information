export interface ParticleStats {
  symbol: string;
  name: string;
  chineseName: string;
  protons: number;
  electrons: number;
  neutrons: number;
  isMolecule: boolean;
  formulaDescription?: string;
}

export interface AbundanceTimeline {
  epoch: string;
  abundance: number;
}

export interface AtomCompItem {
  name: string;
  symbol: string;
  count: number;
  protons: number;
  neutrons: number;
  electrons: number;
}

export const PARTICLE_TABLE_DATA: ParticleStats[] = [
  { symbol: 'H', name: 'Hydrogen Atom', chineseName: '氢原子', protons: 1, electrons: 1, neutrons: 0, isMolecule: false },
  { symbol: 'He', name: 'Helium Atom', chineseName: '氦原子', protons: 2, electrons: 2, neutrons: 2, isMolecule: false },
  { symbol: 'C', name: 'Carbon Atom', chineseName: '碳原子', protons: 6, electrons: 6, neutrons: 6, isMolecule: false },
  { symbol: 'N', name: 'Nitrogen Atom', chineseName: '氮原子', protons: 7, electrons: 7, neutrons: 7, isMolecule: false },
  { symbol: 'O', name: 'Oxygen Atom', chineseName: '氧原子', protons: 8, electrons: 8, neutrons: 8, isMolecule: false },
  { symbol: 'P', name: 'Phosphorus Atom', chineseName: '磷原子', protons: 15, electrons: 15, neutrons: 16, isMolecule: false },
  { symbol: 'H₂O', name: 'Water', chineseName: '水分子', protons: 10, electrons: 10, neutrons: 8, isMolecule: true, formulaDescription: 'Two Hydrogen atoms covalently bonded to one Oxygen atom.' },
  { symbol: 'CO₂', name: 'Carbon Dioxide', chineseName: '二氧化碳', protons: 22, electrons: 22, neutrons: 22, isMolecule: true, formulaDescription: 'One Carbon atom double-bonded to two Oxygen atoms symmetrically.' },
  { symbol: 'C₆H₁₂O₆', name: 'Glucose', chineseName: '葡萄糖', protons: 96, electrons: 96, neutrons: 84, isMolecule: true, formulaDescription: 'A hexagonal carbon ring base decorated with hydrogen and oxygen side chains.' },
  { symbol: 'ATP', name: 'Adenosine Triphosphate', chineseName: '三磷酸腺苷', protons: 260, electrons: 260, neutrons: 247, isMolecule: true, formulaDescription: 'An organophosphate rich cellular power battery storing high action potential.' },
];

export const QUANTITY_OVER_TIME: Record<string, AbundanceTimeline[]> = {
  'H': [
    { epoch: 'Big Bang', abundance: 100 },
    { epoch: 'Stellar Era', abundance: 92 },
    { epoch: 'Early Solar', abundance: 80 },
    { epoch: 'Pre-Life Earth', abundance: 75 },
    { epoch: 'Primordial Cell', abundance: 72 },
    { epoch: 'Present', abundance: 70 },
  ],
  'He': [
    { epoch: 'Big Bang', abundance: 8 },
    { epoch: 'Stellar Era', abundance: 22 },
    { epoch: 'Early Solar', abundance: 24 },
    { epoch: 'Pre-Life Earth', abundance: 24.5 },
    { epoch: 'Primordial Cell', abundance: 24.8 },
    { epoch: 'Present', abundance: 25 },
  ],
  'C': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 15 },
    { epoch: 'Early Solar', abundance: 50 },
    { epoch: 'Pre-Life Earth', abundance: 85 },
    { epoch: 'Primordial Cell', abundance: 98 },
    { epoch: 'Present', abundance: 100 },
  ],
  'N': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 8 },
    { epoch: 'Early Solar', abundance: 35 },
    { epoch: 'Pre-Life Earth', abundance: 70 },
    { epoch: 'Primordial Cell', abundance: 90 },
    { epoch: 'Present', abundance: 100 },
  ],
  'O': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 10 },
    { epoch: 'Early Solar', abundance: 45 },
    { epoch: 'Pre-Life Earth', abundance: 80 },
    { epoch: 'Primordial Cell', abundance: 95 },
    { epoch: 'Present', abundance: 100 },
  ],
  'P': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 2 },
    { epoch: 'Early Solar', abundance: 30 },
    { epoch: 'Pre-Life Earth', abundance: 65 },
    { epoch: 'Primordial Cell', abundance: 88 },
    { epoch: 'Present', abundance: 100 },
  ],
  'H₂O': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 0 },
    { epoch: 'Early Solar', abundance: 25 },
    { epoch: 'Pre-Life Earth', abundance: 82 },
    { epoch: 'Primordial Cell', abundance: 95 },
    { epoch: 'Present', abundance: 100 },
  ],
  'CO₂': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 0 },
    { epoch: 'Early Solar', abundance: 20 },
    { epoch: 'Pre-Life Earth', abundance: 100 },
    { epoch: 'Primordial Cell', abundance: 45 },
    { epoch: 'Present', abundance: 1.5 },
  ],
  'C₆H₁₂O₆': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 0 },
    { epoch: 'Early Solar', abundance: 0 },
    { epoch: 'Pre-Life Earth', abundance: 0 },
    { epoch: 'Primordial Cell', abundance: 40 },
    { epoch: 'Present', abundance: 100 },
  ],
  'ATP': [
    { epoch: 'Big Bang', abundance: 0 },
    { epoch: 'Stellar Era', abundance: 0 },
    { epoch: 'Early Solar', abundance: 0 },
    { epoch: 'Pre-Life Earth', abundance: 0 },
    { epoch: 'Primordial Cell', abundance: 65 },
    { epoch: 'Present', abundance: 100 },
  ],
};

export const MOLECULE_COMPOSITIONS: Record<string, AtomCompItem[]> = {
  'H₂O': [
    { name: 'Hydrogen', symbol: 'H', count: 2, protons: 1, neutrons: 0, electrons: 1 },
    { name: 'Oxygen', symbol: 'O', count: 1, protons: 8, neutrons: 8, electrons: 8 },
  ],
  'CO₂': [
    { name: 'Carbon', symbol: 'C', count: 1, protons: 6, neutrons: 6, electrons: 6 },
    { name: 'Oxygen', symbol: 'O', count: 2, protons: 8, neutrons: 8, electrons: 8 },
  ],
  'C₆H₁₂O₆': [
    { name: 'Carbon', symbol: 'C', count: 6, protons: 6, neutrons: 6, electrons: 6 },
    { name: 'Hydrogen', symbol: 'H', count: 12, protons: 1, neutrons: 0, electrons: 1 },
    { name: 'Oxygen', symbol: 'O', count: 6, protons: 8, neutrons: 8, electrons: 8 },
  ],
  'ATP': [
    { name: 'Carbon', symbol: 'C', count: 10, protons: 6, neutrons: 6, electrons: 6 },
    { name: 'Hydrogen', symbol: 'H', count: 16, protons: 1, neutrons: 0, electrons: 1 },
    { name: 'Nitrogen', symbol: 'N', count: 5, protons: 7, neutrons: 7, electrons: 7 },
    { name: 'Oxygen', symbol: 'O', count: 13, protons: 8, neutrons: 8, electrons: 8 },
    { name: 'Phosphorus', symbol: 'P', count: 3, protons: 15, neutrons: 16, electrons: 15 },
  ]
};

export interface AtomRatio {
  element: string;
  symbol: string;
  percentage: number; // Atom count percentage
  massPercent: number; // Mass percentage
  role: string;
}

export const OBJECT_ATOMIC_ABUNDANCE: Record<string, AtomRatio[]> = {
  sun: [
    { element: "Hydrogen", symbol: "H", percentage: 91.2, massPercent: 74.3, role: "Primary nuclear fusion reactant driving solar energy output" },
    { element: "Helium", symbol: "He", percentage: 8.7, massPercent: 24.6, role: "Secondary product of stable proton-proton fusion cycles" },
    { element: "Oxygen", symbol: "O", percentage: 0.078, massPercent: 0.77, role: "Stellar metal synthesised in high-mass core CNO cycles" },
    { element: "Carbon", symbol: "C", percentage: 0.043, massPercent: 0.29, role: "Primary catalyst in stellar core carbon nucleosynthesis" },
    { element: "Other Core Elements", symbol: "Traces", percentage: 0.012, massPercent: 0.12, role: "Heavy traces of Neon, Nitrogen, Iron and Silicon" }
  ],
  mercury: [
    { element: "Iron", symbol: "Fe", percentage: 35.0, massPercent: 70.0, role: "Enormous high-density metallic core, magnetic force source" },
    { element: "Oxygen", symbol: "O", percentage: 32.0, massPercent: 13.0, role: "Dominant anion bound in high-pressure silicate surface rocks" },
    { element: "Silicon", symbol: "Si", percentage: 18.0, massPercent: 10.0, role: "Primary oxide matrix constructing planetary crust" },
    { element: "Magnesium", symbol: "Mg", percentage: 12.0, massPercent: 5.5, role: "Key constituent of mantle rocks olivine & pyroxenes" },
    { element: "Other Trace Metals", symbol: "Traces", percentage: 3.0, massPercent: 1.5, role: "Exospheric Sodium, Calcium, Sulfur and core Nickel" }
  ],
  venus: [
    { element: "Oxygen", symbol: "O", percentage: 63.8, massPercent: 70.3, role: "Locked in super-critical greenhouse carbon dioxide gas layers" },
    { element: "Carbon", symbol: "C", percentage: 31.5, massPercent: 26.8, role: "Core element in the dense atmospheric carbon structure" },
    { element: "Nitrogen", symbol: "N", percentage: 3.5, massPercent: 2.9, role: "Secondary atmospheric gas driving immense surface pressure" },
    { element: "Sulfur", symbol: "S", percentage: 1.0, massPercent: 0.25, role: "Corrosive sulfur oxides and sulfuric acid droplet clouds" },
    { element: "Other Volatiles", symbol: "Traces", percentage: 0.2, massPercent: 0.05, role: "Water vapour, carbon monoxide, argon, and noble gases" }
  ],
  earth: [
    { element: "Oxygen", symbol: "O", percentage: 48.0, massPercent: 30.1, role: "Saturated in ocean water, silicate crust minerals, and mantle ox" },
    { element: "Silicon", symbol: "Si", percentage: 16.0, massPercent: 15.1, role: "Primary stone-forming semiconductor framing the mantle" },
    { element: "Magnesium", symbol: "Mg", percentage: 15.0, massPercent: 13.9, role: "Crucial light alkaline metal holding olivine crystals" },
    { element: "Iron", symbol: "Fe", percentage: 14.0, massPercent: 32.1, role: "Sinks into solid inner & liquid outer cores, generating B-field" },
    { element: "Calcium", symbol: "Ca", percentage: 1.5, massPercent: 1.5, role: "Component of limestone bedrock and deep continental sands" },
    { element: "Other Elements", symbol: "Traces", percentage: 5.5, massPercent: 7.3, role: "Atmospheric Nitrogen, core Nickel, crustal Aluminum" }
  ],
  moon: [
    { element: "Oxygen", symbol: "O", percentage: 60.0, massPercent: 43.1, role: "Highly abundant negative oxygen ions bound in silicate dust" },
    { element: "Silicon", symbol: "Si", percentage: 16.5, massPercent: 21.0, role: "Backbone structural element of plagioclase lunar fieldspars" },
    { element: "Iron", symbol: "Fe", percentage: 9.0, massPercent: 13.0, role: "Component of maria basaltic flows; depleted versus Earth core" },
    { element: "Magnesium", symbol: "Mg", percentage: 6.5, massPercent: 5.5, role: "Important lighter mineral inside high-latitude pyroxene layers" },
    { element: "Calcium", symbol: "Ca", percentage: 4.5, massPercent: 10.0, role: "Concentrated specifically within pristine anorthosite highlands" },
    { element: "Other Elements", symbol: "Traces", percentage: 3.5, massPercent: 7.4, role: "High-density Titanium, Aluminum, Chromium oxides" }
  ],
  mars: [
    { element: "Oxygen", symbol: "O", percentage: 64.0, massPercent: 71.0, role: "Locked in carbon dioxide greenhouse gas and red ferric dust" },
    { element: "Carbon", symbol: "C", percentage: 31.0, massPercent: 25.5, role: "Principal compound of the thin Martian carbon dioxide sky" },
    { element: "Iron", symbol: "Fe", percentage: 2.5, massPercent: 2.1, role: "Oxidized dust (rust) producing the iconic rusty-red soil veneer" },
    { element: "Nitrogen", symbol: "N", percentage: 1.9, massPercent: 1.1, role: "Secondary inactive gas constituent in thin global exosphere" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.6, massPercent: 0.3, role: "Argon, atmospheric Neon, and water-ice frost particles" }
  ],
  jupiter: [
    { element: "Hydrogen", symbol: "H", percentage: 92.5, massPercent: 75.0, role: "Dominant molecular gas; collapses to metallic ocean at depth" },
    { element: "Helium", symbol: "He", percentage: 7.3, massPercent: 24.0, role: "Secondary primordial component circulating in giant shells" },
    { element: "Carbon", symbol: "C", percentage: 0.15, massPercent: 0.8, role: "Constituent of active Jovian upper-deck methane clouds" },
    { element: "Oxygen", symbol: "O", percentage: 0.04, massPercent: 0.18, role: "Synthesized in high-energy water droplet atmospheric rings" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.01, massPercent: 0.02, role: "Ammonia Nitrogen, Hydrogen Sulfide, and core silicate trace" }
  ],
  saturn: [
    { element: "Hydrogen", symbol: "H", percentage: 92.5, massPercent: 75.0, role: "Primary volatile gas layer forming metallic helium-draped core" },
    { element: "Helium", symbol: "He", percentage: 7.3, massPercent: 24.0, role: "Precipitates downward like solar rain due to cooling effects" },
    { element: "Carbon", symbol: "C", percentage: 0.15, massPercent: 0.8, role: "Methane and ethane volatiles coloring the ringed giant" },
    { element: "Oxygen", symbol: "O", percentage: 0.04, massPercent: 0.18, role: "Locked in inner ice rings and deep water-vapor atmospheric layers" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.01, massPercent: 0.02, role: "Phosphine gas, active ammonia, and rocky core components" }
  ],
  uranus: [
    { element: "Hydrogen", symbol: "H", percentage: 82.5, massPercent: 15.0, role: "Combustive upper envelope wrapping around dense hyperconducting mantle" },
    { element: "Helium", symbol: "He", percentage: 15.2, massPercent: 29.0, role: "Secondary volatile atmospheric shell constituent" },
    { element: "Oxygen", symbol: "O", percentage: 1.1, massPercent: 32.0, role: "Saturated in the deep supercritical warm ocean water layers" },
    { element: "Carbon", symbol: "C", percentage: 1.0, massPercent: 20.0, role: "Hydrocarbon slush forcing diamond-rain events at deep margins" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.2, massPercent: 4.0, role: "Heavy rock silicates, core Iron, and active Ammonia nitrogen" }
  ],
  neptune: [
    { element: "Hydrogen", symbol: "H", percentage: 82.5, massPercent: 15.0, role: "Volatiles of the outer storm envelope facing energetic winds" },
    { element: "Helium", symbol: "He", percentage: 15.2, massPercent: 29.0, role: "Secondary gas in deep thermal atmospheric mixing cells" },
    { element: "Oxygen", symbol: "O", percentage: 1.1, massPercent: 32.0, role: "Principal carrier of high-pressure supercritical water mantle" },
    { element: "Carbon", symbol: "C", percentage: 1.0, massPercent: 20.0, role: "Drives high-concentration methane storm structures in lower sky" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.2, massPercent: 4.0, role: "Primal iron-nickel core elements and ionic ammonia structures" }
  ],
  skeleton: [
    { element: "Oxygen", symbol: "O", percentage: 43.0, massPercent: 41.0, role: "Locked continuously into phosphate and carbonate crystallites" },
    { element: "Hydrogen", symbol: "H", percentage: 36.0, massPercent: 3.4, role: "Forms collagen fibers, cellular water, and biological hydration" },
    { element: "Carbon", symbol: "C", percentage: 11.5, massPercent: 13.0, role: "Backbone organic carbon scaffolding of osteoblast structures" },
    { element: "Calcium", symbol: "Ca", percentage: 5.5, massPercent: 25.0, role: "Principal skeletal cation forming solid structural hydroxyapatite" },
    { element: "Phosphorus", symbol: "P", percentage: 3.0, massPercent: 12.0, role: "Intertwined with Calcium to construct rigid crystalline mineral lattices" },
    { element: "Other Trace Elements", symbol: "Traces", percentage: 1.0, massPercent: 5.6, role: "Nitrogen, bone Magnesium, Sodium, and structural Carbonates" }
  ],
  cell: [
    { element: "Hydrogen", symbol: "H", percentage: 62.0, massPercent: 10.0, role: "Unifying component of water ($H_2O$) and organic sugar molecules" },
    { element: "Oxygen", symbol: "O", percentage: 24.0, massPercent: 65.0, role: "Critical for aerobic cellular respiration, metabolic water, and energy" },
    { element: "Carbon", symbol: "C", percentage: 12.0, massPercent: 18.0, role: "Core organic backbone element forming proteins, lipids, and DNA" },
    { element: "Nitrogen", symbol: "N", percentage: 1.1, massPercent: 3.0, role: "Universal key for structuring amino acids, peptide linkages and nucleic bases" },
    { element: "Phosphorus", symbol: "P", percentage: 0.2, massPercent: 1.2, role: "Drives ATP energy transport, phosphorylation, and nucleic structures" },
    { element: "Trace Mineral ions", symbol: "Traces", percentage: 0.7, massPercent: 2.8, role: "Potassium ($K^+$), Sodium ($Na^+$), Calcium ($Ca^{2+}$), and metabolic Chlorine ($Cl^-$)" }
  ],
  mitochondria: [
    { element: "Hydrogen", symbol: "H", percentage: 61.5, massPercent: 9.9, role: "Creates the proton gradient ($H^+$) across cristae to power ATP Synthase" },
    { element: "Oxygen", symbol: "O", percentage: 24.5, massPercent: 64.5, role: "Terminal respiratory chain electron acceptor, making metabolic water" },
    { element: "Carbon", symbol: "C", percentage: 12.2, massPercent: 18.5, role: "Skeletal backbone of Krebs Cycle enzymes and Krebs carboxylates" },
    { element: "Nitrogen", symbol: "N", percentage: 1.3, massPercent: 3.5, role: "Sutured into respiratory chain peptide active centers & cytochromes" },
    { element: "Phosphorus", symbol: "P", percentage: 0.4, massPercent: 2.0, role: "Essential phosphorylation reactant storing energy in ATP bonds" },
    { element: "Other Elements", symbol: "Traces", percentage: 0.1, massPercent: 1.6, role: "Catalytic iron-sulfur complex nodes and magnesium helpers" }
  ],
  carbon: [
    { element: "Carbon", symbol: "C", percentage: 100.0, massPercent: 100.0, role: "Pure carbon form; tetrahedral crystalline nodes or graphene layers" }
  ],
  oxygen: [
    { element: "Oxygen", symbol: "O", percentage: 100.0, massPercent: 100.0, role: "Pure elemental Oxygen; diatomic gas molecules ($O_2$)" }
  ]
};
