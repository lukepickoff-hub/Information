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
