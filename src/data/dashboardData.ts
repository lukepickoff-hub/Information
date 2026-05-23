export interface StructureLayer {
  name: string;
  number: string | number;
  mass: string;
  energy: string;
  size: string;
  color: string;
}

export interface TimelineStage {
  step: number;
  title: string;
  description: string;
  time: string;
  temp: string;
  massOrEnergy: string;
  probability: string;
  imgType: 'birth' | 'stable' | 'active' | 'future' | 'death';
}

export interface DashboardItem {
  id: string;
  name: string;
  subtitle: string;
  mode: 'universe' | 'atomic' | 'cell' | 'anatomy' | 'quantum';
  structures: StructureLayer[];
  relationships: {
    formation: string[];
    forces: { name: string; desc: string }[];
    energies: { name: string; value: string }[];
  };
  timeline: TimelineStage[];
}

export const DASHBOARD_DATA: Record<string, DashboardItem> = {
  moon: {
    id: 'moon',
    name: 'MOON',
    subtitle: "Earth's natural satellite, differentiated silicate body.",
    mode: 'universe',
    structures: [
      { name: 'Inner Core', number: 1, mass: '1.0 × 10²² kg', energy: '5.0 × 10²⁸ J', size: '1.6 × 10⁵ m radius', color: '#22d3ee' },
      { name: 'Outer Core', number: 1, mass: '2.0 × 10²² kg', energy: '8.0 × 10³⁶ J', size: '3.3 × 10⁵ m radius', color: '#3b82f6' },
      { name: 'Mantle', number: 1, mass: '6.9 × 10²³ kg', energy: '2.1 × 10³⁰ J', size: '1.3 × 10⁶ m thickness', color: '#f97316' },
      { name: 'Crust & Regolith', number: 1, mass: '1.6 × 10²² kg', energy: '4.5 × 10²⁶ J', size: '7.0 × 10⁴ m avg thickness', color: '#a1a1aa' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~5.0 × 10³ K (Post-impact magma ocean)',
        'Environment: Early Earth vicinity, solar system debris disk'
      ],
      forces: [
        { name: 'Gravity (with Earth and Sun)', desc: "Moon's gravity creates Earth's ocean tides and stabilizes its polar axis wobble." },
        { name: 'Tidal forces', desc: "Earth's relentless tidal flexing caused synchronous rotation locking." },
        { name: 'Centrifugal force', desc: "Balances gravitational attraction, securing the orbital trajectory." }
      ],
      energies: [
        { name: 'Orbital Kinetic Energy', value: '~3.8 × 10²⁸ J' },
        { name: 'Rotational Kinetic Energy', value: '~3.4 × 10²³ J' },
        { name: 'Gravitational Potential Energy (w/Earth)', value: '-1.8 × 10³⁰ J' }
      ]
    },
    timeline: [
      { step: 1, title: 'Birth / Formation', description: 'Molten proto-Moon coalesces after Giant Impact of planetesimal Theia.', time: '~4.51 × 10⁹ yrs ago', temp: '~4500 K', massOrEnergy: '7.3 × 10²² kg', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Stability / Mature Phase', description: 'Cooling, crust solidifying, mare basaltic volcanism filling major basins.', time: '~4.4 - 1.0 × 10⁹ yrs ago', temp: '~150 K (avg)', massOrEnergy: 'Stabilized', probability: 'Very High', imgType: 'stable' },
      { step: 3, title: 'Active Role / Function', description: 'Present day Moon in orbit, driving Earth tides and stabilizing biosphere.', time: 'Present Day (0 offset)', temp: '120 K to 390 K', massOrEnergy: '10³⁶ J orbital energy', probability: 'Very High', imgType: 'active' },
      { step: 4, title: 'Long-term Journey / Evolution', description: 'Orbital recession from Earth due to tidal friction and conservation of angular momentum.', time: '+1.0 × 10⁹ yrs into future', temp: 'Stable', massOrEnergy: 'Reced. rate ~3.8cm/yr', probability: 'High', imgType: 'future' },
      { step: 5, title: 'Death or Transformation', description: 'Sun expansion into Red Giant. Extreme thermal erosion and potential tidal dissolution.', time: '+5.0 × 10⁹ yrs into future', temp: '> 1500 K', massOrEnergy: 'Possible dissolution', probability: 'High on Solar Expansion', imgType: 'death' }
    ]
  },
  earth: {
    id: 'earth',
    name: 'EARTH',
    subtitle: "Third terrestrial planet, biosphere harboring life in spacetime.",
    mode: 'universe',
    structures: [
      { name: 'Solid Inner Core', number: 1, mass: '9.7 × 10²² kg', energy: '1.2 × 10³¹ J', size: '1.22 × 10⁶ m radius', color: '#ffb74d' },
      { name: 'Liquid Outer Core', number: 1, mass: '1.8 × 10²⁴ kg', energy: '4.6 × 10³² J', size: '2.26 × 10⁶ m thickness', color: '#ff7043' },
      { name: 'Silicate Mantle', number: 1, mass: '4.0 × 10²⁴ kg', energy: '1.5 × 10³⁴ J', size: '2.89 × 10⁶ m thickness', color: '#ef5350' },
      { name: 'Lithospheric Crust', number: 1, mass: '2.6 × 10²² kg', energy: '5.8 × 10²⁹ J', size: '3.5 × 10⁴ m avg thickness', color: '#26a69a' }
    ],
    relationships: {
      formation: [
        'Time ~4.54 × 10⁹ years ago',
        'Temperature ~2.0 × 10³ K (Initial accretion phase)',
        'Environment: Solar Nebula disk, planetesimal accretion region'
      ],
      forces: [
        { name: 'Geomagnetic Dynamo', desc: "Convection in liquid iron outer core generates defensive magnetosphere." },
        { name: 'Gravitational Force', desc: "Earth surface gravity of 9.807 m/s² retaining thick Nitrogen-Oxygen atmosphere." },
        { name: 'Tectonic Tensions', desc: "Convection currents in mantle drive continental drift and volcanic venting." }
      ],
      energies: [
        { name: 'Rotational Kinetic Energy', value: '2.13 × 10²⁹ J' },
        { name: 'Orbital Kinetic Energy', value: '2.7 × 10³³ J' },
        { name: 'Geothermal Heat Flow rate', value: '4.7 × 10¹³ W' }
      ]
    },
    timeline: [
      { step: 1, title: 'Accretion & Core Separation', description: 'Collisions of planetesimals gather kinetic energy, smelting metals to create core.', time: '~4.54 × 10⁹ yrs ago', temp: '~2500 K', massOrEnergy: '5.97 × 10²⁴ kg', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Cooling & Hydrosphere', description: 'Water vapor condensation forms primordial oceans; life originates at deep sea vents.', time: '~4.0 - 3.5 × 10⁹ yrs ago', temp: '350 K', massOrEnergy: 'Oceanic forming', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Active Biosphere Era', description: 'Oxygen catastrophe, plate tectonics steady state supporting complex biodiversity.', time: 'Present Day', temp: '288 K (avg surface)', massOrEnergy: 'Life sustentation', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Future Desiccation Boost', description: 'Increasing solar luminosity boils oceans, transferring water contents back into Space.', time: '+1.5 × 10⁹ yrs from now', temp: '> 400 K', massOrEnergy: 'Atmospheric escape', probability: 'Highly Likely', imgType: 'future' },
      { step: 5, title: 'Solar Red Giant Collapse', description: 'Sun engulfment, melting crust completely, ending Earth as a differentiated rocky body.', time: '+5.5 × 10⁹ yrs from now', temp: '> 2200 K', massOrEnergy: 'Sublimated silicates', probability: 'High Match', imgType: 'death' }
    ]
  },
  carbon: {
    id: 'carbon',
    name: 'CARBON',
    subtitle: "Atomic Element 6, basic organic building block.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (6P, 6N)', number: 1, mass: '1.99 × 10⁻²⁶ kg', energy: '1.1 × 10⁻¹⁰ J (Binding)', size: '2.7 × 10⁻¹⁵ m radius', color: '#f59e0b' },
      { name: 'K Shell (1s²)', number: 2, mass: '1.82 × 10⁻³⁰ kg', energy: '4.5 × 10⁻¹⁷ J (Ioniz.)', size: '1.5 × 10⁻¹¹ m orbital', color: '#10b981' },
      { name: 'L Shell (2s² 2p²)', number: 4, mass: '3.64 × 10⁻³⁰ kg', energy: '1.8 × 10⁻¹⁸ J (Valence)', size: '7.0 × 10⁻¹¹ m radius', color: '#3b82f6' }
    ],
    relationships: {
      formation: [
        'Time ~1.3 × 10¹⁰ years ago (Stellar core nucleosynthesis)',
        'Temperature ~1.0 × 10⁸ K (Helium flash / Triple-alpha phase)',
        'Environment: Red Giant Star interiors during stellar death cycles'
      ],
      forces: [
        { name: 'Strong Nuclear Force', desc: "Gluons binds 6 Protons and 6 Neutrons inside nucleus, defying electrostatic repulsion." },
        { name: 'Electromagnetic Force', desc: "Attracts negative electrons to the highly positive (+6e) core nucleus." },
        { name: 'Covalent Orbit Sharing', desc: "Electrostatic attraction of shared electron cloud holds molecules like methane together." }
      ],
      energies: [
        { name: 'Nuclear Binding Energy', value: '92.16 MeV' },
        { name: 'First Ionization Energy', value: '11.26 eV' },
        { name: 'C-C Single Bond Energy', value: '347 kJ/mol' }
      ]
    },
    timeline: [
      { step: 1, title: 'Nucleosynthesis', description: 'Triple-alpha process fuse three helium-4 cores within massive stars.', time: 'Cosmic Stella cycle', temp: '1.2 × 10⁸ K', massOrEnergy: '12.000 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Supernova Ejection', description: 'Red Giant collapses, blasting outer layers rich in carbon atoms into deep interstellar medium.', time: 'Pre-Solar epochs', temp: 'Million K', massOrEnergy: 'Interstellar gas', probability: 'Extremely High', imgType: 'stable' },
      { step: 3, title: 'Biological Integration', description: 'Carbon forms base chain for amino acids, proteins, and DNA holding mammalian memory.', time: 'Present Day', temp: '310 K inside cells', massOrEnergy: 'Enzymatic fuel', probability: 'Active organic', imgType: 'active' },
      { step: 4, title: 'Tectonic Deep Carbon', description: 'Sediments subducted, diamond crystallization deep within Earth mantle at high pressure.', time: 'Ongoing geological', temp: '1400 K', massOrEnergy: 'Diamond structures', probability: 'Very High', imgType: 'future' },
      { step: 5, title: 'Radioactive Decay (C-14)', description: 'Carbon-14 isotype beta decays back into Nitrogen-14 over a half-life of 5730 years.', time: 'Nuclear timeline', temp: 'Any temperature', massOrEnergy: 'Beta emission', probability: 'Statistically regular', imgType: 'death' }
    ]
  },
  oxygen: {
    id: 'oxygen',
    name: 'OXYGEN ATOM',
    subtitle: "Atomic Number 8. A highly reactive nonmetal and an oxidizing agent.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (8p, 8n)', number: 1, mass: '15.999 u', energy: 'Strong Nuclear', size: '2.4 fm', color: '#dc2626' },
      { name: '1s Electron Shell', number: 2, mass: 'Light', energy: '-870 eV', size: 'Core Shell', color: '#60a5fa' },
      { name: '2s/2p Electron Shell', number: 6, mass: 'Light', energy: 'Valence', size: 'Valence', color: '#93c5fd' }
    ],
    relationships: {
      formation: [
        'Time ~1.3 × 10¹⁰ years ago',
        'Temperature ~1.5 × 10⁸ K',
        'Environment: Massive stars via the neon-burning process'
      ],
      forces: [
        { name: 'Electromagnetism', desc: "8 protons exert strong pull on valence electrons, causing high electronegativity." },
        { name: 'Strong Nuclear', desc: "Binds the 8 protons and 8 neutrons tightly." }
      ],
      energies: [
        { name: 'First Ionization', value: '13.618 eV' },
        { name: 'Electronegativity', value: '3.44 Pauling scale' }
      ]
    },
    timeline: [
      { step: 1, title: 'Nucleosynthesis', description: 'Formed via helium fusion and neon-burning in massive stars.', time: 'Cosmic Stellar cycle', temp: '1.5 × 10⁸ K', massOrEnergy: '15.999 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Interstellar Medium', description: 'Expelled into space via stellar winds and supernovae.', time: 'Pre-Solar', temp: 'Cold', massOrEnergy: 'Gas', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Molecular Oxygen (O2)', description: 'Biologically active gas vital for respiration.', time: 'Present Day', temp: 'Standard', massOrEnergy: 'Diatomic', probability: 'Active', imgType: 'active' },
      { step: 4, title: 'Oxidation', description: 'Reacts with other elements to form oxides (rust, CO2).', time: 'Chemical reaction', temp: 'Various', massOrEnergy: 'Chemical bonds', probability: 'High', imgType: 'future' },
      { step: 5, title: 'Ozone Cycle', description: 'Breaks apart under UV light to form ozone (O3) in the stratosphere.', time: 'Atmospheric', temp: 'Cold', massOrEnergy: 'O3 formation', probability: 'High', imgType: 'death' }
    ]
  },
  hydrogen: {
    id: 'hydrogen',
    name: 'HYDROGEN',
    subtitle: "Atomic Element 1. The most abundant chemical substance in the Universe.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (1P, 0N)', number: 1, mass: '1.008 u', energy: '0 J (No binding)', size: '1.2 fm', color: '#f59e0b' },
      { name: 'K Shell (1s¹)', number: 1, mass: 'Light', energy: '13.6 eV (Ioniz.)', size: '5.3 × 10⁻¹¹ m', color: '#a5f3fc' }
    ],
    relationships: {
      formation: [
        'Time ~380,000 years after Big Bang (Recombination)',
        'Environment: Primordial expanding universe cooling'
      ],
      forces: [
        { name: 'Coulomb Attraction', desc: "Electromagnetic core attraction of single electron." }
      ],
      energies: [
        { name: 'First Ionization', value: '13.598 eV' }
      ]
    },
    timeline: [
      { step: 1, title: 'Primordial Recombination', description: 'Neutral hydrogen atoms form in the cooling universe.', time: '~380k yrs post-BB', temp: '3000 K', massOrEnergy: '1.008 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Organic Carrier', description: 'Forms the structural basis of hydration and acids in life.', time: 'Present Day', temp: '310 K', massOrEnergy: 'Cellular fluids', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Proton-Proton Fusion', description: 'Fuses into Helium inside the cores of stars.', time: 'Cosmic lifetime', temp: '1.5 × 10⁷ K', massOrEnergy: 'Stellar fuel', probability: 'High', imgType: 'death' }
    ]
  },
  helium: {
    id: 'helium',
    name: 'HELIUM',
    subtitle: "Atomic Element 2. A chemically inert, highly abundant noble gas.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (2P, 2N)', number: 1, mass: '4.0026 u', energy: '28.3 MeV', size: '1.9 fm', color: '#ef4444' },
      { name: 'K Shell (1s²)', number: 2, mass: 'Light', energy: '24.6 eV', size: '3.1 × 10⁻¹¹ m', color: '#cbd5e1' }
    ],
    relationships: {
      formation: [
        'Time ~3 minutes after Big Bang (Big Bang nucleosynthesis)',
        'Environment: Stellar core proton fusion'
      ],
      forces: [
        { name: 'Nuclear Binding', desc: "Very high binding energy per nucleon makes helium-4 core extremely stable." }
      ],
      energies: [
        { name: 'First Ionization', value: '24.587 eV' }
      ]
    },
    timeline: [
      { step: 1, title: 'Primordial Genesis', description: 'Created through rapid fusion in the early cosmic explosion.', time: '3 mins post-BB', temp: '10⁹ K', massOrEnergy: '4.002 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Stellar Fusion', description: 'Helium conducts triple-alpha fusion to build heavier carbon.', time: 'Stellar life', temp: '10⁸ K', massOrEnergy: 'Alpha cores', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Cryogenic Superfluidity', description: 'Condenses into a super-conductive superfluid close to absolute zero.', time: 'Modern labs', temp: '2.17 K', massOrEnergy: 'Superfluid', probability: 'High', imgType: 'death' }
    ]
  },
  lithium: {
    id: 'lithium',
    name: 'LITHIUM',
    subtitle: "Atomic Element 3. The lightest structural solid alkali metal.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (3P, 4N)', number: 1, mass: '6.94 u', energy: '39.2 MeV', size: '2.5 fm', color: '#f97316' },
      { name: 'K/L Electron Shells', number: 3, mass: 'Light', energy: '5.39 eV', size: '15.2 × 10⁻¹¹ m', color: '#fb7185' }
    ],
    relationships: {
      formation: [
        'Cosmic ray spallation splitting heavier carbon molecules',
        'Stellar novae and cosmic lithium synthesis'
      ],
      forces: [
        { name: 'Metallic Bonding', desc: "Free-flowing electron sea binding light nuclei together." }
      ],
      energies: [
        { name: 'First Ionization', value: '5.392 eV' }
      ]
    },
    timeline: [
      { step: 1, title: 'Cosmic Spallation', description: 'High-energy cosmic rays shatter heavier nuclei to produce lithium.', time: 'Interstellar epochs', temp: 'Cold space', massOrEnergy: '6.94 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Battery Ions', description: 'Powers electrochemical storage in lithium-ion cells.', time: 'Present Day', temp: 'Standard', massOrEnergy: 'Battery storage', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Tectonic Locking', description: 'Subducted into mineral crystal structures inside Earth\'s mantle.', time: 'Geological timescale', temp: '1200 K', massOrEnergy: 'Silicates', probability: 'High', imgType: 'stable' }
    ]
  },
  beryllium: {
    id: 'beryllium',
    name: 'BERYLLIUM',
    subtitle: "Atomic Element 4. A rare, high-melting alkaline earth metal.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (4P, 5N)', number: 1, mass: '9.012 u', energy: '56.5 MeV', size: '2.6 fm', color: '#f59e0b' },
      { name: 'Valence Shell', number: 4, mass: 'Light', energy: '9.32 eV', size: '11.2 × 10⁻¹¹ m', color: '#f43f5e' }
    ],
    relationships: {
      formation: ['Produced through cosmic ray spallation in gas clouds.'],
      forces: [{ name: 'Strong Force', desc: "Binds 4 protons and 5 neutrons in a highly rigid spatial layout." }],
      energies: [{ name: 'First Ionization', value: '9.322 eV' }]
    },
    timeline: [
      { step: 1, title: 'Cosmic Genesis', description: 'Synthesis via interstellar cosmic-ray spallation.', time: 'Interstellar', temp: 'Cold', massOrEnergy: '9.012 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Aviation Alloys', description: 'Strengthens copper and nickel elements matching space crafts.', time: 'Modern Day', temp: 'High temp', massOrEnergy: 'Hard alloy', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Tectonic Sinks', description: 'Concentrates inside granite pegmatite veins.', time: 'Geological', temp: 'Various', massOrEnergy: 'Beryl gems', probability: 'High', imgType: 'stable' }
    ]
  },
  boron: {
    id: 'boron',
    name: 'BORON',
    subtitle: "Atomic Element 5. A low-abundance metalloid used in heat-resistant glass structures.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (5P, 6N)', number: 1, mass: '10.81 u', energy: '64.5 MeV', size: '2.7 fm', color: '#d97706' },
      { name: 'Valence Shell', number: 5, mass: 'Light', energy: '8.30 eV', size: '9.0 × 10⁻¹¹ m', color: '#ec4899' }
    ],
    relationships: {
      formation: ['Primarily cosmic ray spallation and supernova shockwaves.'],
      forces: [{ name: 'Covalent Networking', desc: "Forms strong interconnected atomic network grids." }],
      energies: [{ name: 'First Ionization', value: '8.298 eV' }]
    },
    timeline: [
      { step: 1, title: 'Deep Space Creation', description: 'Created when cosmic galactic rays strike carbon clouds.', time: 'Interstellar', temp: 'Cold', massOrEnergy: '10.81 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Borosilicate Glass', description: 'Used to fabricate heavy laboratory beaker glasses.', time: 'Modern Labs', temp: 'Standard', massOrEnergy: 'Glassware', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Mineral Crystallization', description: 'Deposited as borates in evaporation basins.', time: 'Geological', temp: 'Desert air', massOrEnergy: 'Borax beds', probability: 'High', imgType: 'stable' }
    ]
  },
  nitrogen: {
    id: 'nitrogen',
    name: 'NITROGEN',
    subtitle: "Atomic Element 7. An essential biological nonmetal forming the majority of terrestrial air.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (7P, 7N)', number: 1, mass: '14.00 u', energy: '104.7 MeV', size: '2.3 fm', color: '#dc2626' },
      { name: 'Valence L Shell', number: 7, mass: 'Light', energy: '14.53 eV', size: '7.5 × 10⁻¹¹ m', color: '#6366f1' }
    ],
    relationships: {
      formation: ['Formed in massive stellar interiors via the CNO catalyst cycle.'],
      forces: [{ name: 'Triple Covalent Bond', desc: "Extremely strong bonding in diatomic N₂ gas resists chemical decay." }],
      energies: [{ name: 'First Ionization', value: '14.534 eV' }]
    },
    timeline: [
      { step: 1, title: 'CNO Fusion Ring', description: 'Fuses inside hot hydrogen-burning stellar zones.', time: 'Stellar cycle', temp: '15M K', massOrEnergy: '14.0 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Atmospheric Shield', description: 'Blankets 78% of Earth\'s surface layer, regulating oxidation.', time: 'Present Day', temp: '288 K', massOrEnergy: 'Diatomic gas', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Proteinic Fixation', description: 'Fixed by biological bacteria to construct life amino acids.', time: 'Ongoing biological', temp: '310 K', massOrEnergy: 'Ammonia/DNA', probability: 'High', imgType: 'active' }
    ]
  },
  fluorine: {
    id: 'fluorine',
    name: 'FLUORINE',
    subtitle: "Atomic Element 9. The most electronegative and chemically reactive halogen gas.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (9P, 10N)', number: 1, mass: '18.99 u', energy: '147.8 MeV', size: '2.5 fm', color: '#ef4444' },
      { name: 'Valence Shell', number: 9, mass: 'Light', energy: '17.42 eV', size: '7.1 × 10⁻¹¹ m', color: '#14b8a6' }
    ],
    relationships: {
      formation: ['Synthesized during later stellar helium and oxygen fusion stages.'],
      forces: [{ name: 'Ionic Electron Capture', desc: "Pulls electron strongly from adjacent metals to form fluorides." }],
      energies: [{ name: 'Electronegativity', value: '3.98 Pauling' }]
    },
    timeline: [
      { step: 1, title: 'Late-Stage Synthesis', description: 'Nucleosynthesis occurring during stellar core carbon burnout phases.', time: 'Stellar cycle', temp: '10⁸ K', massOrEnergy: 'Fluorine nucleus', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Aerospace Engineering', description: 'Enters Teflon fluoropolymer interfaces resisting super-acids.', time: 'Modern Day', temp: 'High resistance', massOrEnergy: 'Teflon sheets', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Mineralic Trapping', description: 'Forms stable fluorite crystals deep within hydrothermic vents.', time: 'Geological', temp: '600 K', massOrEnergy: 'CaF₂ mineral', probability: 'High', imgType: 'stable' }
    ]
  },
  neon: {
    id: 'neon',
    name: 'NEON',
    subtitle: "Atomic Element 10. A highly stable, glowing noble gas.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (10P, 10N)', number: 1, mass: '20.18 u', energy: '160.6 MeV', size: '2.6 fm', color: '#b91c1c' },
      { name: 'Complete Outer Shell', number: 10, mass: 'Light', energy: '21.56 eV', size: '6.9 × 10⁻¹¹ m', color: '#cbd5e1' }
    ],
    relationships: {
      formation: ['Synthesized through the oxygen-burning nucleosynthesis stage.'],
      forces: [{ name: 'Inert Shell Repulsion', desc: "Closed outer p-shell prevents sharing or metallic binding." }],
      energies: [{ name: 'First Ionization', value: '21.564 eV' }]
    },
    timeline: [
      { step: 1, title: 'Carbon Fusion Ash', description: 'Formed via alpha capture by fluorine inside dying giant stars.', time: 'Supernova cycles', temp: '10⁹ K', massOrEnergy: 'Neon core', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Discharge Glow', description: 'Excited electrons emit a bright orange-red glow in gas tubes.', time: 'Present Day', temp: 'Standard', massOrEnergy: 'Gaseous photons', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Cosmic Dissipation', description: 'Escapes gravity easily, dispersing into deep cosmic background.', time: 'Continuous', temp: '3 K', massOrEnergy: 'Ambient gas', probability: 'High', imgType: 'stable' }
    ]
  },
  sodium: {
    id: 'sodium',
    name: 'SODIUM',
    subtitle: "Atomic Element 11. An ultra-reactive alkali metal initiating nerve electrical paths.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (11P, 12N)', number: 1, mass: '22.99 u', energy: '186.5 MeV', size: '2.8 fm', color: '#f97316' },
      { name: 'Outer Valence Electron', number: 11, mass: 'Light', energy: '5.14 eV', size: '18.6 × 10⁻¹¹ m', color: '#3b82f6' }
    ],
    relationships: {
      formation: ['Created in massive stars during carbon-fusing explosion events.'],
      forces: [{ name: 'Ionic Potential', desc: "Releases single outermost valence electron to halogens easily." }],
      energies: [{ name: 'First Ionization', value: '5.139 eV' }]
    },
    timeline: [
      { step: 1, title: 'Exploding Carbon Core', description: 'Formed through primary carbon-helium fusion reactions in supernovae.', time: 'Explosion epochs', temp: '8 × 10⁸ K', massOrEnergy: '22.99 amu', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Cell Membrane Balance', description: 'Sodium-potassium pump regulates bioelectricity and water flow.', time: 'Present Day', temp: '310 K inside cells', massOrEnergy: 'Membrane ions', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Ocean Resorber', description: 'Builds salts (NaCl) washed into land drainage systems.', time: 'Geological timescale', temp: '290 K', massOrEnergy: 'Halite mineral', probability: 'High', imgType: 'stable' }
    ]
  },
  magnesium: {
    id: 'magnesium',
    name: 'MAGNESIUM',
    subtitle: "Atomic Element 12. A silvery-white alkaline earth metal coordinating energy capture.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (12P, 12N)', number: 1, mass: '24.30 u', energy: '198.2 MeV', size: '2.9 fm', color: '#f59e0b' },
      { name: 'Outer M Shell', number: 12, mass: 'Light', energy: '7.65 eV', size: '16.0 × 10⁻¹¹ m', color: '#8b5cf6' }
    ],
    relationships: {
      formation: ['Synthesized inside heavy helium-accumulating giant stars.'],
      forces: [{ name: 'Chlorophyll Chelation', desc: "Coordinating covalent bonds hold plant light-gathering systems together." }],
      energies: [{ name: 'First Ionization', value: '7.646 eV' }]
    },
    timeline: [
      { step: 1, title: 'Carbon Fusion Shell', description: 'Created when carbon fuses with helium in outer stellar regions.', time: 'Stellar cycle', temp: '10⁹ K', massOrEnergy: 'Massive star ash', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Solar Harvesting', description: 'Sits at chlorophyll\'s heart, driving the biological synthesis of sugars.', time: 'Present Day', temp: 'Ambient', massOrEnergy: 'Organic catalyst', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Structural Crust', description: 'Siltation of dolomite mountains on continental margins.', time: 'Ongoing geologic', temp: '290 K', massOrEnergy: 'Dolomite crystals', probability: 'High', imgType: 'stable' }
    ]
  },
  aluminum: {
    id: 'aluminum',
    name: 'ALUMINUM',
    subtitle: "Atomic Element 13. A lightweight, nonmagnetic post-transition metal.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (13P, 14N)', number: 1, mass: '26.98 u', energy: '224.9 MeV', size: '3.0 fm', color: '#ea580c' },
      { name: 'Valence Electronic shells', number: 13, mass: 'Light', energy: '5.98 eV', size: '14.3 × 10⁻¹¹ m', color: '#c084fc' }
    ],
    relationships: {
      formation: ['Synthesized through stellar neon-proton capture pathways.'],
      forces: [{ name: 'Covalent/Metallic Hybrid', desc: "Balances metallic grid with trivalent molecular bonding." }],
      energies: [{ name: 'First Ionization', value: '5.986 eV' }]
    },
    timeline: [
      { step: 1, title: 'Neon Core Burning', description: 'Synthesized under pressure by high neon capture inside red supergiants.', time: 'Stellar cycle', temp: '1.2 × 10⁹ K', massOrEnergy: 'Aluminum nucleus', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Aeronautics Framing', description: 'Skins modern airplane structures with ultra-resistant oxides.', time: 'Modern Day', temp: 'Stable', massOrEnergy: 'Rigid airframes', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Silicate Entrapment', description: 'Binds into clay and bauxite soils in rain belts.', time: 'Geological', temp: 'Ambient', massOrEnergy: 'Clay minerals', probability: 'High', imgType: 'stable' }
    ]
  },
  silicon: {
    id: 'silicon',
    name: 'SILICON',
    subtitle: "Atomic Element 14. A hard crystalline metalloid constituting the silicon bedrock of technology.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (14P, 14N)', number: 1, mass: '28.08 u', energy: '236.5 MeV', size: '3.1 fm', color: '#d97706' },
      { name: 'Valence M Shell', number: 14, mass: 'Light', energy: '8.15 eV', size: '11.8 × 10⁻¹¹ m', color: '#f43f5e' }
    ],
    relationships: {
      formation: ['Synthesized via the oxygen-burning process inside large stars.'],
      forces: [{ name: 'Covalent Diamond Matrix', desc: "Binds 4 valence electrons into a locked crystalline semiconductor grid." }],
      energies: [{ name: 'First Ionization', value: '8.151 eV' }]
    },
    timeline: [
      { step: 1, title: 'Oxygen Burning Core', description: 'Fusion of core oxygen-16 and helium-4 inside supergiant stars.', time: 'Pre-Solar exploding', temp: '2.0 × 10⁹ K', massOrEnergy: 'Silicon sediment', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Lithospherical Crust', description: 'Constructs quartz and tectonic granite rocks spanning tectonic plates.', time: 'Tectonic history', temp: 'Crustal melt', massOrEnergy: 'Quartz grid', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Transistor Gateways', description: 'Engineered into microchip transistor nodes routing digital logic.', time: 'Present Day', temp: '320 K', massOrEnergy: 'Integrated Circuits', probability: 'High', imgType: 'active' }
    ]
  },
  phosphorus: {
    id: 'phosphorus',
    name: 'PHOSPHORUS',
    subtitle: "Atomic Element 15. A highly reactive nonmetal critical to DNA structural spines and ATP metabolism.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (15P, 16N)', number: 1, mass: '30.97 u', energy: '262.2 MeV', size: '3.2 fm', color: '#dc2626' },
      { name: 'Valence M Shell', number: 15, mass: 'Light', energy: '10.48 eV', size: '11.0 × 10⁻¹¹ m', color: '#e11d48' }
    ],
    relationships: {
      formation: ['Synthesized during oxygen-burning phase of dying massive stars.'],
      forces: [{ name: 'Covalent Phospholink', desc: "Connects nucleic acid structures via phosphate bonds." }],
      energies: [{ name: 'First Ionization', value: '10.486 eV' }]
    },
    timeline: [
      { step: 1, title: 'Supergiant Genesis', description: 'Synthesized right before massive silicon fusion collapses.', time: 'Pre-gravational explosion', temp: '2.2 × 10⁹ K', massOrEnergy: 'Core ash', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'ATP Fuel Cycle', description: 'Releases instant biological cellular fuel through ATP-ADP transformations.', time: 'Present Day', temp: '310 K inside cells', massOrEnergy: 'Hydrated Phosphate', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Minerals', description: 'Locks down as stable organic apatite fossils.', time: 'Geological epochs', temp: 'Ambient', massOrEnergy: 'Apatite bedrock', probability: 'High', imgType: 'stable' }
    ]
  },
  sulfur: {
    id: 'sulfur',
    name: 'SULFUR',
    subtitle: "Atomic Element 16. A yellow-colored reactive nonmetal forming core protein disulfide bridges.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (16P, 16N)', number: 1, mass: '32.06 u', energy: '271.8 MeV', size: '3.2 fm', color: '#f59e0b' },
      { name: 'Valence M Shell', number: 16, mass: 'Light', energy: '10.36 eV', size: '10.4 × 10⁻¹¹ m', color: '#db2777' }
    ],
    relationships: {
      formation: ['Synthesized through primary silicon core burning pathways.'],
      forces: [{ name: 'Disulfide Linkages', desc: "Binds amino acid chains into resilient folded muscular layouts." }],
      energies: [{ name: 'First Ionization', value: '10.360 eV' }]
    },
    timeline: [
      { step: 1, title: 'Silicon Core Burnout', description: 'Synthesized alongside heavy iron in hot core explosions.', time: 'Stellar nova phase', temp: '2.5 × 10⁹ K', massOrEnergy: 'Core elements', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Biologic Proteins', description: 'Coordinates enzymatic pathways inside cellular membranes.', time: 'Present Day', temp: '315 K', massOrEnergy: 'Folded keratins', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Volcano Spew', description: 'Ejected as native yellow sulfur vapors in crater margins.', time: 'Ongoing geologic', temp: '900 K', massOrEnergy: 'Crystalline vents', probability: 'High', imgType: 'stable' }
    ]
  },
  chlorine: {
    id: 'chlorine',
    name: 'CHLORINE',
    subtitle: "Atomic Element 17. A highly oxidizing halogen vital for cellular electrolyte potentials.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (17P, 18N)', number: 1, mass: '35.45 u', energy: '298.1 MeV', size: '3.3 fm', color: '#b91c1c' },
      { name: 'Valence Electronic M Shell', number: 17, mass: 'Light', energy: '12.96 eV', size: '9.9 × 10⁻¹¹ m', color: '#10b981' }
    ],
    relationships: {
      formation: ['Constructed through stellar oxygen and silicon fusion stages.'],
      forces: [{ name: 'Electrostatic Ionization', desc: "Aggressively abstracts a valence electron to form chloride ions." }],
      energies: [{ name: 'First Ionization', value: '12.967 eV' }]
    },
    timeline: [
      { step: 1, title: 'Oxygen Burning Burnout', description: 'Formed via alpha capture of phosphorus kernels inside stars.', time: 'Stellar cycle', temp: '2.2 × 10⁹ K', massOrEnergy: 'Interstellar gas', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Neurotransmitter Balance', description: 'Coordinates inhibitory action potential controls via chloride gates.', time: 'Present Day', temp: '310 K', massOrEnergy: 'Synaptic ions', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Sea Evaporation', description: 'Assembles halite salt deposits under intense heating.', time: 'Geological', temp: 'Dry air', massOrEnergy: 'Salt sediments', probability: 'High', imgType: 'stable' }
    ]
  },
  argon: {
    id: 'argon',
    name: 'ARGON',
    subtitle: "Atomic Element 18. An abundant and highly stable noble gas.",
    mode: 'quantum',
    structures: [
      { name: 'Nucleus (18P, 22N)', number: 1, mass: '39.95 u', energy: '343.8 MeV', size: '3.4 fm', color: '#9ca3af' },
      { name: 'Valence Shell (Closed Octet)', number: 18, mass: 'Light', energy: '15.76 eV', size: '9.7 × 10⁻¹¹ m', color: '#cbd5e1' }
    ],
    relationships: {
      formation: ['Synthesized through potassium-40 radioactive electron capture.'],
      forces: [{ name: 'Inert Core Shield', desc: "Strong shielding resists molecular interactions." }],
      energies: [{ name: 'First Ionization', value: '15.760 eV' }]
    },
    timeline: [
      { step: 1, title: 'Supernova Ash', description: 'Synthesized during stellar core silicon burning spikes.', time: 'Stellar death', temp: '3 × 10⁹ K', massOrEnergy: 'Argon atoms', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Potassium Decay Link', description: 'Formed continuously in the crust through decay of potassium-40.', time: 'Ongoing geological', temp: 'Underground', massOrEnergy: 'Noble gas', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Insulating Blanket', description: 'Fills historical thermopane laboratory glass insulating channels.', time: 'Modern Day', temp: 'Stable', massOrEnergy: 'Inert gas', probability: 'High', imgType: 'active' }
    ]
  },
  potassium: {
    id: 'potassium',
    name: 'POTASSIUM',
    subtitle: "Atomic Element 19. A soft, silvery alkali metal driving active cellular pulse flows.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (19P, 20N)', number: 1, mass: '39.10 u', energy: '341.4 MeV', size: '3.5 fm', color: '#f97316' },
      { name: 'Outer Valence N Shell', number: 19, mass: 'Light', energy: '4.34 eV', size: '22.7 × 10⁻¹¹ m', color: '#0ea5e9' }
    ],
    relationships: {
      formation: ['Created via stellar neon core burnout pathways near supernovas.'],
      forces: [{ name: 'Rapid Solvation', desc: "Dissolves into water to drive active electrical gradients." }],
      energies: [{ name: 'First Ionization', value: '4.341 eV' }]
    },
    timeline: [
      { step: 1, title: 'Neon Core Synthesis', description: 'Constructed via massive neon carbon reaction cycles in supernovas.', time: 'Stellar cycle', temp: '1.5 × 10⁹ K', massOrEnergy: 'Heavy metallics', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Muscle Contraction Spark', description: 'Regulates cardiovascular contraction rhythms via K+ cellular channels.', time: 'Present Day', temp: '310 K inside muscle', massOrEnergy: 'Ionic currents', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Silicate Reservoir', description: 'Locks into feldspar rock systems forming land grains.', time: 'Geological timescale', temp: 'Ambient', massOrEnergy: 'Feldspar sands', probability: 'High', imgType: 'stable' }
    ]
  },
  calcium: {
    id: 'calcium',
    name: 'CALCIUM',
    subtitle: "Atomic Element 20. An alkaline earth metal coordinating skeletal structures and molecular contracting signals.",
    mode: 'atomic',
    structures: [
      { name: 'Nucleus (20P, 20N)', number: 1, mass: '40.08 u', energy: '342.1 MeV', size: '3.5 fm', color: '#f59e0b' },
      { name: 'Outer Valence Shell', number: 20, mass: 'Light', energy: '6.11 eV', size: '19.7 × 10⁻¹¹ m', color: '#ef4444' }
    ],
    relationships: {
      formation: ['Synthesized through late-stage stellar silicon burning.'],
      forces: [{ name: 'Apatite Hardening', desc: "Binds phosphate to crystallize hard calcium apatite skeleton bones." }],
      energies: [{ name: 'First Ionization', value: '6.113 eV' }]
    },
    timeline: [
      { step: 1, title: 'Silicon Burn Fusion', description: 'Synthesized inside massive stellar oxygen and silicon fusions.', time: 'Pre-Solar exploding', temp: '3 × 10⁹ K', massOrEnergy: 'Silicate cores', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Skeletal Synthesis', description: 'Precipitated by cells to construct highly rigid cortical bones and teeth.', time: 'Present Day', temp: '310 K', massOrEnergy: 'Bone matrix', probability: 'High', imgType: 'active' },
      { step: 3, title: 'Ocean Limestone Beds', description: 'Accumulates as deep limestone marine strata over geological eras.', time: 'Geological eras', temp: 'Ambient bottom', massOrEnergy: 'Limestone crusts', probability: 'High', imgType: 'stable' }
    ]
  },
  mitochondria: {
    id: 'mitochondria',
    name: 'CELL ORGANELLE',
    subtitle: "Mitochondria - The biological powerhouse of the eukaryotic cellular model.",
    mode: 'cell',
    structures: [
      { name: 'Outer Membrane', number: 1, mass: '1.2 × 10⁻¹⁵ kg', energy: 'Lipid barrier', size: '1.0 × 10⁻⁶ m thick', color: '#10b981' },
      { name: 'Intermembrane Space', number: 1, mass: 'H+ Ion saturated', energy: 'Proton Gradient', size: '2.0 × 10⁻⁸ m gap', color: '#06b6d4' },
      { name: 'Inner Membrane / Cristae', number: 1, mass: 'Protein rich complexes', energy: 'ETC (Electron Transport)', size: 'Electron channel network', color: '#f43f5e' },
      { name: 'Matrix', number: 1, mass: 'Enzymes & mtDNA', energy: 'Krebs Loop fuel', size: 'Core cavity volume', color: '#eab308' }
    ],
    relationships: {
      formation: [
        'Time ~1.5 × 10⁹ years ago',
        'Temperature ~310 K standard biological cell fluid',
        'Environment: Primordial eukaryotic host engulfing aerobic Proteobacteria'
      ],
      forces: [
        { name: 'Proton Motive Force', desc: "Electrochemical proton gradient creates electrostatic voltage push (180mV)." },
        { name: 'ATP Synthase Rotor Force', desc: "Flowing protons turn cellular micro-molecular turbine to synthesize ATP chemical bonds." },
        { name: 'Osmotic Membrane Tension', desc: "Balances ion gradients preventing osmotic cell collapse." }
      ],
      energies: [
        { name: 'Proton Gradient Potential', value: '-180 mV' },
        { name: 'ATP Synthesis Energy output', value: '30.5 kJ/mol' },
        { name: 'Oxygen reduction potential', value: '1.14 Volts' }
      ]
    },
    timeline: [
      { step: 1, title: 'Endosymbiotic Origin', description: 'Eukaryotic cells engulf an alphaproteobacterium, establishing persistent cell symbiosis.', time: '~1.5 × 10⁹ yrs ago', temp: '300 K', massOrEnergy: 'Genetic fusion', probability: 'High Evidence', imgType: 'birth' },
      { step: 2, title: 'Genome Transfer', description: 'Symbiont transfers most genes to host nucleus, retaining 37 essential respiration instructions.', time: 'Evolutionary epochs', temp: '305 K', massOrEnergy: '16.5kb mtDNA', probability: 'Stabilized', imgType: 'stable' },
      { step: 3, title: 'Cellular Respiration Stage', description: 'Consumes glucose and oxygen, utilizing ETC to produce ATP power for mammalian muscle.', time: 'Present Day (Now)', temp: '310 K inside bodies', massOrEnergy: '36 ATP / Glucose', probability: 'Highly Active', imgType: 'active' },
      { step: 4, title: 'Fission & Fusion Dynamics', description: 'Constantly cycles shape through fusion (combining) and fission (splitting) to clear damage.', time: 'Ongoing seconds', temp: 'Cellular steady', massOrEnergy: 'Mitochondrial networks', probability: 'Continuous', imgType: 'future' },
      { step: 5, title: 'Mitophagy / Cell Apoptosis', description: 'Oxidative damage accumulates; cell signals apoptosis, opening pores to dismantle energy engine.', time: 'Cell decay cycles', temp: 'Room temp to 310K', massOrEnergy: 'Cytochrome C release', probability: 'Normal life limit', imgType: 'death' }
    ]
  },
  cell: {
    id: 'cell',
    name: 'EUKARYOTIC CELL',
    subtitle: "Eukaryotic Cell - The fundamental biological building block of complex cellular life.",
    mode: 'cell',
    structures: [
      { name: 'Plasma Membrane', number: 1, mass: '1.5 × 10⁻¹⁴ kg', energy: 'Active transport voltage', size: '1.0 × 10⁻⁵ m diameter', color: '#38bdf8' },
      { name: 'Nucleus & Chromatin', number: 1, mass: '4.0 × 10⁻¹⁵ kg', energy: 'Genetic transcript site', size: '6.0 × 10⁻⁶ m diameter', color: '#818cf8' },
      { name: 'Mitochondria network', number: 250, mass: '2.0 × 10⁻¹⁵ kg', energy: 'ATP Synthesis', size: '2.0 × 10⁻⁶ m length', color: '#f97316' },
      { name: 'Endoplasmic Reticulum', number: 1, mass: 'Rich membrane fold', energy: 'Protein folding', size: 'Vast surface structure', color: '#ec4899' }
    ],
    relationships: {
      formation: [
        'Time ~1.8 × 10⁹ years ago',
        'Temperature ~310 K cellular optimal homeostatic condition',
        'Environment: Primordial shallow oceans and geothermal vent pools'
      ],
      forces: [
        { name: 'Cytoskeletal Tension (Tensegrity)', desc: "Microtubules and actin filaments balance pulling and pushing forces to maintain cell shape." },
        { name: 'Electrochemical potential', desc: "Sodium-Potassium ATPase pump drives a rest charge of -70mV across the cell membrane." }
      ],
      energies: [
        { name: 'ATP Turnover power rate', value: '1.0 × 10⁷ molecules/sec' },
        { name: 'Membrane Potential Energy', value: '70 mV (millivolts)' }
      ]
    },
    timeline: [
      { step: 1, title: 'Abiogenesis Precursors', description: 'Coacervate droplets and lipid vesicles capture self-replicating catalytic RNA.', time: '~3.8 × 10⁹ yrs ago', temp: '325 K', massOrEnergy: 'Pre-RNA worlds', probability: 'High Speculation', imgType: 'birth' },
      { step: 2, title: 'Eukaryogenesis Leap', description: 'Archaea host merges with cyanobacteria and proteobacteria, forming mitochondria and nuclei.', time: '~1.8 × 10⁹ yrs ago', temp: '300 K', massOrEnergy: 'Intracellular organelles', probability: 'Proven', imgType: 'stable' },
      { step: 3, title: 'Active Civil Metazoan', description: 'Cells differentiate to construct complex tissues, skeletal bones, muscles, and networks.', time: 'Present Day (Now)', temp: '310 K inside human body', massOrEnergy: 'Intercellular metabolic exchange', probability: 'Active', imgType: 'active' },
      { step: 4, title: 'Cellular Senescence', description: 'Telomeres shorten; DNA damage accumulation halts the replication machinery.', time: 'Ongoing seconds', temp: 'Stable', massOrEnergy: 'Hayflick replication limit', probability: 'Highly Likely', imgType: 'future' },
      { step: 5, title: 'Apoptotic Programmed Death', description: 'Receptor signals trigger caspase cascades, neatly dismantling cellular structures without inflaming neighbors.', time: 'Cellular demise lines', temp: '310 K cooling down', massOrEnergy: 'Enzymatic fragmentation', probability: 'Certain under stress', imgType: 'death' }
    ]
  },
  skeleton: {
    id: 'skeleton',
    name: 'SKELETAL SYSTEM',
    subtitle: "Bone matrix structure, osteocyte balance in biological locomotion.",
    mode: 'anatomy',
    structures: [
      { name: 'Skull & Facial Bones', number: 22, mass: '1.1 × 10⁰ kg', energy: 'Structural armor', size: '2.0 × 10⁻¹ m volume', color: '#14b8a6' },
      { name: 'Vertebrae & Torso', number: 58, mass: '3.4 × 10⁰ kg', energy: 'Vertical Spine tension', size: '9.0 × 10⁻¹ m column', color: '#ec4899' },
      { name: 'Appendicular (Arms & Legs)', number: 126, mass: '4.5 × 10⁰ kg', energy: 'Lever locomotion', size: 'Various length nodes', color: '#3b82f6' }
    ],
    relationships: {
      formation: [
        'Time ~300 days average prenatal & childhood ossification',
        'Temperature ~310 K body core homeostatic focus',
        'Environment: Embryoid cartilage template, calcification'
      ],
      forces: [
        { name: 'Muscle Lever Tensile', desc: "Tendons transfer force vector from striated muscle to bone levers to trigger rotation." },
        { name: 'Piezoelectric bone signal', desc: "Mechanical loading creates localized microvolt charge, driving bone cell growth." },
        { name: 'Gravitational Compression', desc: "Downward force triggers calcium deposition to retain rigidity." }
      ],
      energies: [
        { name: 'Cortical Bone breaking limit', value: '120 MPa tension' },
        { name: 'Calcium reserve capacity', value: '~1.0 kg storage' },
        { name: 'Elastic strain energy absorption', value: '1.2 × 10³ J per impact' }
      ]
    },
    timeline: [
      { step: 1, title: 'Intramembranous Ossification', description: 'Mesenchymal cells bundle together, directly transforming into rigid bone plates.', time: 'Embryoid phase', temp: '310 K inside womb', massOrEnergy: 'Cartilage skeleton', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Epiphyseal Fusion', description: 'Growth plates calcify, lock maximum stature, establishing skeletal adulthood.', time: 'Ages 12 - 25 years', temp: '310 K', massOrEnergy: '206 Bones active', probability: 'Standard human', imgType: 'stable' },
      { step: 3, title: 'Osteoclast Remodeling', description: 'Constant remodeling: Osteoclasts absorb bone while active Osteoblasts install fresh bone matrix.', time: 'Present Day (Now)', temp: '310 K baseline', massOrEnergy: '10% remodeled / yr', probability: 'Very Active', imgType: 'active' },
      { step: 4, title: 'Osteopenic Bone Density loss', description: 'Gradual mineral depletion. Micro-architectural deterioration under less exercise.', time: 'Ages 50+ onward', temp: 'Intact', massOrEnergy: 'Density down max 30%', probability: 'Moderate age threat', imgType: 'future' },
      { step: 5, title: 'Mineral Dissolution (Fossilization)', description: 'Soft tissues disintegrate; bone minerals slowly exchange under pressure to form hard rock fossils.', time: '+10 to +10⁶ yrs', temp: 'Earth crust temp', massOrEnergy: 'Apatite to Stone matrix', probability: 'Low/Medium', imgType: 'death' }
    ]
  },
  mercury: {
    id: 'mercury',
    name: 'MERCURY',
    subtitle: "The Swift Planet. Smallest and innermost planet in the Solar System.",
    mode: 'universe',
    structures: [
      { name: 'Metallic Core', number: 1, mass: '2.3 × 10²³ kg', energy: 'High Density', size: '2020 km radius', color: '#737373' },
      { name: 'Silicate Mantle', number: 1, mass: '1.0 × 10²³ kg', energy: 'Solid', size: '400 km thickness', color: '#d4d4d4' },
      { name: 'Crust', number: 1, mass: 'Light', energy: 'Cratered', size: '10-300 km thickness', color: '#a3a3a3' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Extreme cooling after bombardment',
        'Environment: Very close to early Sun'
      ],
      forces: [
        { name: 'Solar Gravity Dominance', desc: "Extreme gravitational pull from Sun causing 3:2 spin-orbit resonance." },
        { name: 'Thermal Contraction', desc: "Planet cooling causes giant lobed scarps (cliffs) as surface buckles." }
      ],
      energies: [
        { name: 'Orbital Kinetic Energy', value: 'High due to 47 km/s speed' }
      ]
    },
    timeline: [
      { step: 1, title: 'Accretion & Core Formation', description: 'Heavy metals sink to center, forming a massive iron core.', time: '~4.5 × 10⁹ yrs ago', temp: 'Molten', massOrEnergy: 'Accreting', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Late Heavy Bombardment', description: 'Intense asteroid impacts scar the surface, forming basin structures like Caloris Planitia.', time: '~4.1 - 3.8 × 10⁹ yrs ago', temp: 'Cooling', massOrEnergy: 'Stable mass', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Present Orbit', description: 'Barren, cratered world locked in resonance. Extreme day/night temp swings.', time: 'Present Day', temp: '100K to 700K', massOrEnergy: 'Stable', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Solar Expansion', description: 'Will be one of the first planets consumed by the expanding Sun.', time: '+5 × 10⁹ yrs', temp: '> 2000K', massOrEnergy: 'Vaporized', probability: 'Certain', imgType: 'death' }
    ]
  },
  venus: {
    id: 'venus',
    name: 'VENUS',
    subtitle: "Earth's toxic sister planet, shrouded in thick clouds of sulfuric acid.",
    mode: 'universe',
    structures: [
      { name: 'Iron Core', number: 1, mass: 'Similar to Earth', energy: 'Liquid/Solid', size: '3200 km radius', color: '#ea580c' },
      { name: 'Mantle', number: 1, mass: 'Silicate', energy: 'Hot convective', size: '2800 km thickness', color: '#f97316' },
      { name: 'Crust & Atmosphere', number: 1, mass: 'Massive CO2 Env', energy: 'Greenhouse', size: '100 km dense atmosphere', color: '#fcd34d' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Cooling similarly to Earth initially',
        'Environment: Inner solar system accretion disk'
      ],
      forces: [
        { name: 'Runaway Greenhouse Effect', desc: "Massive CO2 atmosphere traps heat, creating highest surface temperatures of any planet." },
        { name: 'Atmospheric Pressure', desc: "Surface pressure is 92 times that of Earth." }
      ],
      energies: [
        { name: 'Thermal Energy Trap', value: '737 K consistent surface temp' }
      ]
    },
    timeline: [
      { step: 1, title: 'Formation', description: 'Forms similarly to Earth, possibly with early shallow oceans.', time: '~4.5 × 10⁹ yrs ago', temp: 'Cooling', massOrEnergy: '4.86 × 10²⁴ kg', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Water Loss & Greenhouse', description: 'Solar output increases, oceans boil, trapping heat and releasing CO2.', time: '~3 - 1 × 10⁹ yrs ago', temp: 'Increasing', massOrEnergy: 'Water loss', probability: 'Likely', imgType: 'stable' },
      { step: 3, title: 'Toxic Hothouse', description: 'Current state. Slow retrograde rotation, crushing pressure, acid rain.', time: 'Present Day', temp: '737 K', massOrEnergy: 'Stable Atmosphere', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Eventual Engulfment', description: 'Consumed during the Sun\'s red giant phase.', time: '+5 × 10⁹ yrs', temp: '> 3000 K', massOrEnergy: 'Destroyed', probability: 'Certain', imgType: 'death' }
    ]
  },
  mars: {
    id: 'mars',
    name: 'MARS',
    subtitle: "The Red Planet. A cold, desert world with a very thin atmosphere.",
    mode: 'universe',
    structures: [
      { name: 'Iron-Sulfur Core', number: 1, mass: 'Dense', energy: 'Mostly liquid', size: '1800 km radius', color: '#991b1b' },
      { name: 'Silicate Mantle', number: 1, mass: 'Rocky', energy: 'Dormant', size: '1500 km', color: '#b91c1c' },
      { name: 'Crust', number: 1, mass: 'Iron-oxide rich', energy: 'Dusty', size: '50 km avg', color: '#ef4444' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Cooling into a habitable early world',
        'Environment: Accretion near the asteroid belt boundary'
      ],
      forces: [
        { name: 'Solar Wind Stripping', desc: "Loss of magnetic field allowed solar winds to blow away most of the atmosphere." },
        { name: 'Low Gravity', desc: "38% of Earth's gravity, making it harder to retain atmospheric gases." }
      ],
      energies: [
        { name: 'Latent Heat', value: 'Frozen poles (CO2 and H2O)' }
      ]
    },
    timeline: [
      { step: 1, title: 'Wet Mars', description: 'Early Mars had rivers, lakes, and possibly a thick atmosphere supporting liquid water.', time: '~4.1 - 3.7 × 10⁹ yrs ago', temp: 'Moderate', massOrEnergy: 'Wet', probability: 'High', imgType: 'birth' },
      { step: 2, title: 'Magnetic Dynamo Death', description: 'Core cools, magnetic field dies. Solar wind strips away atmosphere and water freezes or evaporates.', time: '~3.7 - 2 × 10⁹ yrs ago', temp: 'Freezing', massOrEnergy: 'Atmospheric Loss', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Frozen Desert', description: 'Current barren, rusty, cold state. Huge dormant volcanoes and deep canyons.', time: 'Present Day', temp: '210 K avg', massOrEnergy: 'Stable', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Moon Crash (Phobos)', description: 'Moon Phobos spirals inward and will eventually crash or break into a ring.', time: '+50 × 10⁶ yrs', temp: 'Impact', massOrEnergy: 'Debris Ring', probability: 'High', imgType: 'future' }
    ]
  },
  jupiter: {
    id: 'jupiter',
    name: 'JUPITER',
    subtitle: "The Gas Giant King. More than twice as massive as all other planets combined.",
    mode: 'universe',
    structures: [
      { name: 'Solid Core (Possible)', number: 1, mass: '10-30 Earth masses', energy: 'Extreme pressure', size: 'Unknown', color: '#451a03' },
      { name: 'Metallic Hydrogen', number: 1, mass: 'Massive', energy: 'Conductive fluid', size: '40,000 km', color: '#d97706' },
      { name: 'Molecular Envelope', number: 1, mass: 'Mostly H/He', energy: 'Turbulent weather', size: 'Thick atmosphere', color: '#fcd34d' }
    ],
    relationships: {
      formation: [
        'Time ~4.6 × 10⁹ years ago',
        'Temperature ~Formed beyond the frost line',
        'Environment: First planet to form, vacuuming up massive amounts of gas'
      ],
      forces: [
        { name: 'Extreme Gravity', desc: "Forms a mini-solar system of 90+ moons and shapes the asteroid belt." },
        { name: 'Magnetic Dynamo', desc: "Metallic hydrogen ocean generates solar system's strongest planetary magnetic field." }
      ],
      energies: [
        { name: 'Internal Heat', value: 'Radiates more heat than receives from Sun' }
      ]
    },
    timeline: [
      { step: 1, title: 'Gas Accretion', description: 'Quickly forms a massive rocky core and rapidly accretes hydrogen and helium.', time: '~4.6 × 10⁹ yrs ago', temp: 'Hot', massOrEnergy: 'Massive growth', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Grand Tack Migration', description: 'Migrated inward then outward, shaping the early inner solar system.', time: '~4.5 × 10⁹ yrs ago', temp: 'Cooling', massOrEnergy: 'Orbital shift', probability: 'Hypothesized', imgType: 'stable' },
      { step: 3, title: 'Stormy Giant', description: 'Present state with turbulent bands, Giant Red Spot, and immense magnetic field.', time: 'Present Day', temp: '165 K (1 bar)', massOrEnergy: 'Stable gas ball', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Hot Jupiter (if Sun expands)', description: 'May swell slightly when Sun becomes red giant, but survives.', time: '+5 × 10⁹ yrs', temp: 'Warming', massOrEnergy: 'Intact', probability: 'High', imgType: 'future' }
    ]
  },
  saturn: {
    id: 'saturn',
    name: 'SATURN',
    subtitle: "The Ringed Planet. A low-density gas giant with a stunning ring system.",
    mode: 'universe',
    structures: [
      { name: 'Ice/Rock Core', number: 1, mass: '9-22 Earth masses', energy: 'Dense', size: 'Unknown', color: '#713f12' },
      { name: 'Metallic Hydrogen', number: 1, mass: 'Fluid inner mantle', energy: 'Conductive', size: 'Large internal layer', color: '#eab308' },
      { name: 'Atmosphere & Rings', number: 1, mass: '96% H, 3% He', energy: 'High winds', size: 'Massive exterior', color: '#fef08a' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Cold outer solar system',
        'Environment: Accretion of gas beyond Jupiter'
      ],
      forces: [
        { name: 'Tidal Forces (Rings)', desc: "Roche limit tears apart moons/comets, organizing debris into vast, thin icy rings." },
        { name: 'Low Density', desc: "Planet is so gaseous it is less dense than liquid water." }
      ],
      energies: [
        { name: 'Equatorial Winds', value: '1800 km/h velocities' }
      ]
    },
    timeline: [
      { step: 1, title: 'Formation', description: 'Formed after Jupiter, accreting leftover gas in the outer disk.', time: '~4.5 × 10⁹ yrs ago', temp: 'Cold', massOrEnergy: 'Gas giant', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Ring Formation', description: 'Torn-apart ice moons or comets form the spectacular ring system relatively recently.', time: '10-100 × 10⁶ yrs ago', temp: 'Freezing', massOrEnergy: 'Ice debris', probability: 'Current leading theory', imgType: 'stable' },
      { step: 3, title: 'Ringed Wonder', description: 'Present state. Dynamic weather, hexagon pole storm, intricate rings.', time: 'Present Day', temp: '134 K', massOrEnergy: 'Stable', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Ring Rain / Decay', description: 'Rings are slowly raining into Saturn\'s atmosphere; will vanish over time.', time: '+300 × 10⁶ yrs', temp: 'Cold', massOrEnergy: 'Rings gone', probability: 'High', imgType: 'future' }
    ]
  },
  uranus: {
    id: 'uranus',
    name: 'URANUS',
    subtitle: "The Sideways Ice Giant.",
    mode: 'universe',
    structures: [
      { name: 'Rocky Core', number: 1, mass: '0.5 Earth mass', energy: 'Small', size: 'Small', color: '#334155' },
      { name: 'Icy Mantle', number: 1, mass: 'Water, Ammonia, Methane', energy: 'Slushy', size: 'Large bulk', color: '#2dd4bf' },
      { name: 'H/He Atmosphere', number: 1, mass: 'Light', energy: 'Coldest', size: 'Outer layer', color: '#a7f3d0' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Extremely cold formation',
        'Environment: Outer edges of the planetary disk'
      ],
      forces: [
        { name: 'Extreme Axial Tilt', desc: "A massive prehistoric collision knocked the planet entirely onto its side (98 degrees)." }
      ],
      energies: [
        { name: 'Internal Heat', value: 'Lacks significant internal heat, unlike other giants' }
      ]
    },
    timeline: [
      { step: 1, title: 'Formation', description: 'Ice accretes into a giant world.', time: '~4.5 × 10⁹ yrs ago', temp: 'Freezing', massOrEnergy: 'Ice giant', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'The Great Impact', description: 'A massive Earth-sized body smashes into Uranus, tilting its axis nearly 90 degrees.', time: '~4.0 × 10⁹ yrs ago', temp: 'Violent', massOrEnergy: 'Tilted', probability: 'Likely', imgType: 'stable' },
      { step: 3, title: 'Rolling Orbit', description: 'Orbits on its side, causing extreme 42-year long seasons of light and darkness.', time: 'Present Day', temp: '76 K (Coldest planet)', massOrEnergy: 'Stable tilt', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Stable Deep Freeze', description: 'Will remain largely unchanged even past the Sun\'s death.', time: 'Far Future', temp: 'Near Absolute Zero', massOrEnergy: 'Frozen', probability: 'Certain', imgType: 'future' }
    ]
  },
  neptune: {
    id: 'neptune',
    name: 'NEPTUNE',
    subtitle: "The Windy Ice Giant. Farthest known planet from the Sun.",
    mode: 'universe',
    structures: [
      { name: 'Solid Core', number: 1, mass: '~Earth mass', energy: 'Rock/Ice', size: 'Small center', color: '#1e3a8a' },
      { name: 'Liquid Mantle', number: 1, mass: 'Water, Ammonia, Methane', energy: 'Pressurized ocean', size: 'Massive', color: '#2563eb' },
      { name: 'Atmosphere', number: 1, mass: 'H, He, Methane gas', energy: 'Supersonic winds', size: 'Upper layer', color: '#93c5fd' }
    ],
    relationships: {
      formation: [
        'Time ~4.5 × 10⁹ years ago',
        'Temperature ~Formed in outer cold depths',
        'Environment: Pertinent to Kuiper Belt interactions'
      ],
      forces: [
        { name: 'Supersonic Winds', desc: "Winds reach 2,100 km/h, the fastest in the solar system, driven by internal heat." },
        { name: 'Gravitational Shepherd', desc: "Dominates the Kuiper Belt, trapping Pluto in 2:3 resonance." }
      ],
      energies: [
        { name: 'Radiant Output', value: 'Emits 2.6x more energy than it gets from Sun' }
      ]
    },
    timeline: [
      { step: 1, title: 'Outer Migration', description: 'Formed closer to Sun, pushed outwards by Jupiter, scattering icy bodies into Kuiper Belt.', time: '~4.5 × 10⁹ yrs ago', temp: 'Cold', massOrEnergy: 'Orbital shift', probability: 'Likely', imgType: 'birth' },
      { step: 2, title: 'Triton Capture', description: 'Captured a large Kuiper Belt object (Triton) into a retrograde orbit, destroying original moons.', time: 'Early epoch', temp: 'Freezing', massOrEnergy: 'Moon capture', probability: 'High', imgType: 'stable' },
      { step: 3, title: 'Blue Storms', description: 'Deep azure blue due to methane absorption. Raging storms like the Great Dark Spot.', time: 'Present Day', temp: '72 K', massOrEnergy: 'Active weather', probability: 'Current', imgType: 'active' },
      { step: 4, title: 'Triton Destruction', description: 'Triton\'s orbit decays; it will eventually be torn apart to form a massive ring.', time: '+3.6 × 10⁹ yrs', temp: 'Cold', massOrEnergy: 'Ring formation', probability: 'High', imgType: 'future' }
    ]
  },
  sun: {
    id: 'sun',
    name: 'SOLAR SYSTEM STAR',
    subtitle: "The Sun is a Yellow Dwarf G-type Star driving spacetime curves in our home system.",
    mode: 'universe',
    structures: [
      { name: 'Core (Fusion zone)', number: 1, mass: '6.8 × 10²⁹ kg', energy: '1.2 × 10⁴⁴ J (Thermonuclear)', size: '1.7 × 10⁵ m radius', color: '#fbbf24' },
      { name: 'Radiative Zone', number: 1, mass: '9.5 × 10²⁹ kg', energy: '5.0 × 10⁴³ J (Radiative drift)', size: '3.5 × 10⁵ m thick', color: '#ff7043' },
      { name: 'Convective Zone', number: 1, mass: '3.7 × 10²⁹ kg', energy: '2.0 × 10⁴² J (Thermal plumes)', size: '2.0 × 10⁵ m thick', color: '#f97316' },
      { name: 'Photosphere & Corona', number: 1, mass: '1.0 × 10¹⁹ kg', energy: '3.8 × 10²⁶ W radiation power', size: '5.0 × 10² m average thickness', color: '#eab308' }
    ],
    relationships: {
      formation: [
        'Time ~4.6 × 10⁹ years ago',
        'Temperature ~1.5 × 10⁷ K (Standard core hydrogen ignition)',
        'Environment: Massive collapsing dense core within Giant Molecular Cloud (GMC)'
      ],
      forces: [
        { name: 'Hydrostatic Equilibrium', desc: "Impeccable cosmic balancing act between outward thermonuclear expansion radiation pressure and inward self-gravity contraction." },
        { name: 'Strong Nuclear Force / Fusion', desc: "Quantum tunneling allows protons to beat electromagentic Coulomb repulsion, fusing into helium-4 nuclei." },
        { name: 'Convective Magnetic Dynamo', desc: "Highly turbulent gas shear (tachocline) twists magnetic field lines, causing periodic solar weather cycles and flare arches." }
      ],
      energies: [
        { name: 'Hydrogen Fusion Output rate', value: '3.86 × 10²⁶ W' },
        { name: 'Gravitational Binding Potential', value: '-5.6 × 10⁴¹ J' },
        { name: 'Radiant Reserve Lifetime energy', value: '1.2 × 10⁴⁴ J' }
      ]
    },
    timeline: [
      { step: 1, title: 'Protostar T-Tauri Stage', description: 'Gravitational collapse accelerates. Thermal energy builds up until stellar disk jets form.', time: '~4.6 × 10⁹ yrs ago', temp: '~3500 K', massOrEnergy: '1.989 × 10³⁰ kg', probability: 'Certain', imgType: 'birth' },
      { step: 2, title: 'Main Sequence Ignition', description: 'Core density reaches thermonuclear threshold. Hydrogen fusion settles the star into stable hydrostatic balance.', time: 'Present Day (Now)', temp: '5778 K (surface)', massOrEnergy: 'Stable Core H-reserves', probability: 'Current', imgType: 'stable' },
      { step: 3, title: 'Coronal Weather & Storms', description: 'Continuous solar winds, coronal mass ejections (CMEs), and deep heliosphere shielding.', time: 'Steady cycle', temp: '1.5 × 10⁶ K (corona)', massOrEnergy: '3.8 × 10²⁶ W radiant', probability: 'Highly Active', imgType: 'active' },
      { step: 4, title: 'Subgiant Red Swell', description: 'Core hydrogen diminishes. Core contracts, heating shell hydrogen, expanding stellar radius 100-fold.', time: '+5.5 × 10⁹ yrs', temp: '~4200 K (surface)', massOrEnergy: 'Helium core accretion', probability: 'Certain', imgType: 'future' },
      { step: 5, title: 'Helium Flash / White Dwarf', description: 'Planetary nebula ejects remaining stellar envelope. Stellar core remains as a dense, glowing white dwarf.', time: '+7.5 × 10⁹ yrs', temp: '> 1.0 × 10⁵ K', massOrEnergy: 'Degenerate Electron core', probability: 'Highly Expected', imgType: 'death' }
    ]
  }
};
