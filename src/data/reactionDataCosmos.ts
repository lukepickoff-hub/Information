export interface AtomChip {
  name: string;
  specs: string; // e.g. "P:1 E:1 N:0"
  formula?: string;
  boldText?: string;
}

export interface ReactionItem {
  id: string;
  subCategory: string;
  name: string;
  equation: string;
  atoms: AtomChip[];
  description: string;
}

export interface ReactionDomain {
  id: string; // 'star', 'plant', 'cell', 'tissue', 'planet', 'organ', 'animal'
  title: string;
  number: string;
  color: string;
  secondaryColor: string;
  tagClass: string;
  bgGradient: string;
  reactions: ReactionItem[];
}

export const STAR_DOMAIN: ReactionDomain = {
  id: 'star',
  title: 'Star — Nuclear Reactions',
  number: '01',
  color: '#e8a020',
  secondaryColor: '#f0c060',
  tagClass: 'tag-star',
  bgGradient: 'd-star',
  reactions: [
    {
      id: 'star_pp1',
      subCategory: 'Proton–Proton Chain (main sequence stars ≤ 1.5 M☉)',
      name: 'Step 1 — Deuterium formation',
      equation: '¹H + ¹H → ²H + e⁺ + νₑ + 0.42 MeV',
      atoms: [
        { name: 'Hydrogen (氫, H)', specs: 'P:1 E:1 N:0', boldText: 'P:1 E:1 N:0' },
        { name: 'Deuterium (²H)', specs: 'P:1 E:1 N:1', boldText: 'P:1 E:1 N:1' }
      ],
      description: 'Two protons collide; the weak nuclear force converts one proton to a neutron, emitting a positron and electron neutrino. Rate-limiting step of the entire chain — takes billions of years per proton pair on average.'
    },
    {
      id: 'star_pp2',
      subCategory: 'Proton–Proton Chain (main sequence stars ≤ 1.5 M☉)',
      name: 'Step 2 — Helium-3 formation',
      equation: '²H + ¹H → ³He + γ + 5.49 MeV',
      atoms: [
        { name: 'Helium-3 (³He)', specs: 'P:2 E:2 N:1', boldText: 'P:2 E:2 N:1' }
      ],
      description: 'Deuterium fuses with a proton almost instantly compared to step 1, producing helium-3 and a gamma-ray photon.'
    },
    {
      id: 'star_pp3a',
      subCategory: 'Proton–Proton Chain (main sequence stars ≤ 1.5 M☉)',
      name: 'Step 3a — Helium-4 production (pp-I branch)',
      equation: '³He + ³He → ⁴He + 2¹H + 12.86 MeV',
      atoms: [
        { name: 'Helium-4 (氦, He)', specs: 'P:2 E:2 N:2', boldText: 'P:2 E:2 N:2' }
      ],
      description: 'Two helium-3 nuclei merge and eject two protons. Net equation of full pp-I: 4¹H → ⁴He + 2e⁺ + 2νₑ + 2γ + 26.73 MeV.'
    },
    {
      id: 'star_pp3b',
      subCategory: 'Proton–Proton Chain (main sequence stars ≤ 1.5 M☉)',
      name: 'Step 3b — Beryllium-7 branch (pp-II)',
      equation: '³He + ⁴He → ⁷Be + γ',
      atoms: [
        { name: 'Beryllium-7 (⁷Be)', specs: 'P:4 E:4 N:3', boldText: 'P:4 E:4 N:3' }
      ],
      description: 'Alternative to pp-I at higher temperatures. Beryllium-7 then captures an electron: ⁷Be + e⁻ → ⁷Li + νₑ, followed by ⁷Li + ¹H → 2⁴He.'
    },
    {
      id: 'star_pp3c',
      subCategory: 'Proton–Proton Chain (main sequence stars ≤ 1.5 M☉)',
      name: 'Boron-8 branch (pp-III, rare)',
      equation: '⁷Be + ¹H → ⁸B + γ → ⁸Be + e⁺ + νₑ → 2⁴He',
      atoms: [
        { name: 'Boron-8 (⁸B)', specs: 'P:5 E:5 N:3', boldText: 'P:5 E:5 N:3' }
      ],
      description: 'Rare branch (< 0.02% of reactions in the Sun) but produces the high-energy neutrinos detectable by experiments like Super-Kamiokande.'
    },
    {
      id: 'star_cno1',
      subCategory: 'CNO Cycle (massive stars > 1.5 M☉)',
      name: 'CNO step 1 — Carbon-12 captures proton',
      equation: '¹²C + ¹H → ¹³N + γ + 1.95 MeV',
      atoms: [
        { name: 'Carbon-12 (碳, C)', specs: 'P:6 E:6 N:6', boldText: 'P:6 E:6 N:6' },
        { name: 'Nitrogen-13 (¹³N)', specs: 'P:7 E:7 N:6', boldText: 'P:7 E:7 N:6' }
      ],
      description: 'Carbon-12 acts as a catalyst — it is consumed and regenerated each cycle. Dominant energy source in stars with core T > 1.7×10⁷ K.'
    },
    {
      id: 'star_cno2',
      subCategory: 'CNO Cycle (massive stars > 1.5 M☉)',
      name: 'CNO step 2 — Nitrogen-13 beta-plus decay',
      equation: '¹³N → ¹³C + e⁺ + νₑ + 1.20 MeV',
      atoms: [
        { name: 'Carbon-13 (¹³C)', specs: 'P:6 E:6 N:7', boldText: 'P:6 E:6 N:7' }
      ],
      description: 'Half-life ~10 minutes. Positron quickly annihilates with an electron, releasing two 0.511 MeV gamma rays.'
    },
    {
      id: 'star_cno3',
      subCategory: 'CNO Cycle (massive stars > 1.5 M☉)',
      name: 'CNO steps 3–6 (completion)',
      equation: '¹³C + ¹H → ¹⁴N + γ\n¹⁴N + ¹H → ¹⁵O + γ\n¹⁵O → ¹⁵N + e⁺ + νₑ\n¹⁵N + ¹H → ¹²C + ⁴He  ← catalyst regenerated',
      atoms: [
        { name: 'Nitrogen-14 (氮, N)', specs: 'P:7 E:7 N:7', boldText: 'P:7 E:7 N:7' },
        { name: 'Oxygen-15 (¹⁵O)', specs: 'P:8 E:8 N:7', boldText: 'P:8 E:8 N:7' }
      ],
      description: 'Net result identical to pp-chain: 4H → He-4. N-14 accumulates because ¹⁴N + p is the slowest step, making it the most abundant CNO isotope.'
    },
    {
      id: 'star_triple',
      subCategory: 'Helium Burning (Red Giant cores, T > 10⁸ K)',
      name: 'Triple-alpha process',
      equation: '3⁴He → ¹²C + γ + 7.27 MeV',
      atoms: [
        { name: 'Carbon-12 (碳, C)', specs: 'P:6 E:6 N:6', boldText: 'P:6 E:6 N:6' }
      ],
      description: 'First: ⁴He + ⁴He → ⁸Be (unstable, t½ = 8.2×10⁻¹⁷ s); then ⁸Be + ⁴He → ¹²C* → ¹²C + γ via Hoyle resonance state. Only works because of a precise nuclear energy level Hoyle predicted in 1953.'
    },
    {
      id: 'star_alpha_c_o',
      subCategory: 'Helium Burning (Red Giant cores, T > 10⁸ K)',
      name: 'Alpha capture: C → O',
      equation: '¹²C + ⁴He → ¹⁶O + γ + 7.16 MeV',
      atoms: [
        { name: 'Oxygen-16 (氧, O)', specs: 'P:8 E:8 N:8', boldText: 'P:8 E:8 N:8' }
      ],
      description: 'Competes directly with triple-alpha — the C/O ratio in stellar ejecta depends on the ratio of these two reaction rates.'
    },
    {
      id: 'star_alpha_series',
      subCategory: 'Helium Burning (Red Giant cores, T > 10⁸ K)',
      name: 'Alpha capture series: Ne, Mg, Si, S, Ar, Ca',
      equation: '¹⁶O  + ⁴He → ²⁰Ne + γ\n²⁰Ne + ⁴He → ²⁴Mg + γ\n²⁴Mg + ⁴He → ²⁸Si + γ\n²⁸Si + ⁴He → ³²S  + γ\n³²S  + ⁴He → ³⁶Ar + γ\n³⁶Ar + ⁴He → ⁴⁰Ca + γ',
      atoms: [
        { name: 'Neon (氖, Ne)', specs: 'P:10 E:10 N:10' },
        { name: 'Magnesium (鎂, Mg)', specs: 'P:12 E:12 N:12' },
        { name: 'Silicon (矽, Si)', specs: 'P:14 E:14 N:14' },
        { name: 'Sulfur (硫, S)', specs: 'P:16 E:16 N:16' },
        { name: 'Argon (氬, Ar)', specs: 'P:18 E:18 N:22' },
        { name: 'Calcium (鈣, Ca)', specs: 'P:20 E:20 N:20' }
      ],
      description: 'Each alpha capture requires higher temperatures. This is why massive stars develop onion-shell structure — each shell burns a different fuel.'
    },
    {
      id: 'star_carbon_burn',
      subCategory: 'Advanced Burning Stages (Massive Stars, T > 5×10⁸ K)',
      name: 'Carbon burning',
      equation: '¹²C + ¹²C → ²³Na + ¹H + 2.24 MeV\n¹²C + ¹²C → ²⁰Ne + ⁴He + 4.62 MeV\n¹²C + ¹²C → ²⁴Mg + γ  + 13.93 MeV',
      atoms: [
        { name: 'Sodium (鈉, Na)', specs: 'P:11 E:11 N:12', boldText: 'P:11 E:11 N:12' }
      ],
      description: 'Occurs in stars > 8 M☉. Duration ~600 years at core temperature ~8×10⁸ K. Three simultaneous channels depending on impact parameter.'
    },
    {
      id: 'star_neon_photo',
      subCategory: 'Advanced Burning Stages (Massive Stars, T > 5×10⁸ K)',
      name: 'Neon photodisintegration',
      equation: '²⁰Ne + γ → ¹⁶O + ⁴He\n²⁰Ne + ⁴He → ²⁴Mg + γ',
      atoms: [
        { name: 'Neon (Ne)', specs: 'P:10 E:10 N:10' }
      ],
      description: 'Gamma rays at T > 1.2×10⁹ K are energetic enough to break Ne-20. The released alpha is immediately captured by another Ne-20, net result: 2²⁰Ne → ¹⁶O + ²⁴Mg.'
    },
    {
      id: 'star_oxygen_burn',
      subCategory: 'Advanced Burning Stages (Massive Stars, T > 5×10⁸ K)',
      name: 'Oxygen burning',
      equation: '¹⁶O + ¹⁶O → ³¹P + ¹H + 7.68 MeV\n¹⁶O + ¹⁶O → ²⁸Si + ⁴He + 9.59 MeV\n¹⁶O + ¹⁶O → ³¹S  + n  + 1.45 MeV\n¹⁶O + ¹⁶O → ³²S  + γ  + 16.54 MeV',
      atoms: [
        { name: 'Phosphorus (磷, P)', specs: 'P:15 E:15 N:16', boldText: 'P:15 E:15 N:16' }
      ],
      description: 'Duration ~1 year at T ~ 2×10⁹ K. Produces the silicon-group elements that form most of Earth\'s mantle.'
    },
    {
      id: 'star_silicon_burn',
      subCategory: 'Advanced Burning Stages (Massive Stars, T > 5×10⁸ K)',
      name: 'Silicon burning (quasi-statistical equilibrium)',
      equation: '²⁸Si + ²⁸Si → ⁵⁶Ni + γ (via photodisintegration cascade)',
      atoms: [
        { name: 'Iron (鐵, Fe-56)', specs: 'P:26 E:26 N:30', boldText: 'P:26 E:26 N:30' },
        { name: 'Nickel-56 (⁵⁶Ni)', specs: 'P:28 E:28 N:28', boldText: 'P:28 E:28 N:28' }
      ],
      description: 'Duration ~1 day at T ~ 4×10⁹ K. Silicon is photodisintegrated into alphas which recombine. Produces an iron-nickel core — once the core is iron, fusion cannot release energy and the star collapses.'
    },
    {
      id: 'star_s_process',
      subCategory: 'Neutron Capture Processes (Building Heavy Elements)',
      name: 's-process (slow neutron capture, AGB stars)',
      equation: '⁵⁶Fe + n → ⁵⁷Fe + γ → ⁵⁸Fe + n → ⁵⁹Fe → ⁵⁹Co (β⁻) → ...\nBuilds: Sr, Ba, La, Pb, Bi (Z = 26–83)',
      atoms: [
        { name: 'Barium (鋇, Ba)', specs: 'P:56 E:56 N:82', boldText: 'P:56 E:56 N:82' },
        { name: 'Lead (鉛, Pb)', specs: 'P:82 E:82 N:126', boldText: 'P:82 E:82 N:126' }
      ],
      description: 'Neutron flux low enough that beta-decay occurs between captures. Proceeds along the valley of stability. AGB stars are the factory for half of all elements heavier than iron.'
    },
    {
      id: 'star_r_process',
      subCategory: 'Neutron Capture Processes (Building Heavy Elements)',
      name: 'r-process (rapid neutron capture, neutron star mergers / supernovae)',
      equation: '⁵⁶Fe + 10n → ⁶⁶Fe → ⁶⁶Co (β⁻) → ...\nBuilds: Au, Pt, U, Th, lanthanides (Z > 56)',
      atoms: [
        { name: 'Gold (金, Au)', specs: 'P:79 E:79 N:118', boldText: 'P:79 E:79 N:118' },
        { name: 'Uranium (鈾, U)', specs: 'P:92 E:92 N:146', boldText: 'P:92 E:92 N:146' }
      ],
      description: 'Neutron flux so intense that nuclei capture many neutrons before beta-decaying. Creates neutron-rich nuclei far from stability. Confirmed in neutron star merger GW170817 (2017) by kilonovae spectroscopy.'
    },
    {
      id: 'star_p_process',
      subCategory: 'Neutron Capture Processes (Building Heavy Elements)',
      name: 'p-process (proton capture / photodisintegration)',
      equation: '⁹⁰Zr + γ → ⁸⁹Zr + n  (photodisintegration)\n⁹²Mo(p, γ)⁹³Tc → ...  (proton capture)',
      atoms: [
        { name: 'Zirconium (Zr)', specs: 'P:40 E:40 N:50' }
      ],
      description: 'Produces the ~35 proton-rich isotopes bypassed by s- and r-process. Occurs in supernova shock waves. Explains why e.g. ¹³⁸La and ¹⁸⁰Ta exist in trace amounts.'
    },
    {
      id: 'star_sn_collapse',
      subCategory: 'Supernova & Post-Stellar Reactions',
      name: 'Core collapse: iron photodisintegration',
      equation: '⁵⁶Fe + γ → 13⁴He + 4n  (endothermic — absorbs 124 MeV)',
      atoms: [
        { name: 'Iron (Fe)', specs: 'P:26 E:26 N:30' }
      ],
      description: 'At T > 10¹⁰ K, photons destroy the iron core. This endothermic reaction removes pressure support, triggering gravitational collapse in milliseconds.'
    },
    {
      id: 'star_sn_neutronize',
      subCategory: 'Supernova & Post-Stellar Reactions',
      name: 'Neutronization (electron capture)',
      equation: 'p + e⁻ → n + νₑ',
      atoms: [
        { name: 'Neutron (n)', specs: 'P:0 E:0 N:1' }
      ],
      description: 'Protons in the collapsing core capture electrons under extreme density (> 10¹² g/cm³), converting to neutrons and neutrinos. The neutrino burst carries ~3×10⁴⁶ J — the energy equivalent of the Sun\'s 10-billion-year output in 10 seconds.'
    },
    {
      id: 'star_sn_nickel_decay',
      subCategory: 'Supernova & Post-Stellar Reactions',
      name: 'Nickel-56 decay chain (supernova light curve)',
      equation: '⁵⁶Ni → ⁵⁶Co + e⁺ + νₑ  (t½ = 6.1 days)\n⁵⁶Co → ⁵⁶Fe + e⁺ + νₑ  (t½ = 77.2 days)',
      atoms: [
        { name: 'Cobalt-56 (⁵⁶Co)', specs: 'P:27 E:27 N:29', boldText: 'P:27 E:27 N:29' }
      ],
      description: 'Radioactive decay heats the ejecta, powering the visible glow of supernovae for months. The 77-day half-life of Co-56 was confirmed by SN 1987A light curve.'
    },
    {
      id: 'star_annihilation',
      subCategory: 'Supernova & Post-Stellar Reactions',
      name: 'Electron-positron annihilation',
      equation: 'e⁻ + e⁺ → 2γ (each 0.511 MeV)',
      atoms: [
        { name: 'Gamma photon (γ)', specs: 'High energy electromagnetic wave' }
      ],
      description: 'Pair production and annihilation in hot stellar interiors (T > 10⁹ K). In pair-instability supernovae, runaway production of e⁻/e⁺ pairs softens the equation of state, causing collapse without a remnant.'
    }
  ]
};

export const PLANET_DOMAIN: ReactionDomain = {
  id: 'planet',
  title: 'Planet — Geological & Atmospheric Chemistry',
  number: '05',
  color: '#6ea8d8',
  secondaryColor: '#8ac0e0',
  tagClass: 'tag-planet',
  bgGradient: 'd-planet',
  reactions: [
    {
      id: 'planet_quartz',
      subCategory: 'Mineral & Rock Formation',
      name: 'Quartz / silica formation',
      equation: 'Si + O₂ → SiO₂',
      atoms: [
        { name: 'Silicon (矽, Si)', specs: 'P:14 E:14 N:14', boldText: 'P:14 E:14 N:14' },
        { name: 'Oxygen (氧, O)', specs: 'P:8 E:8 N:8', boldText: 'P:8 E:8 N:8' },
        { name: 'Silicon dioxide (SiO₂)', specs: 'Quartz framework' }
      ],
      description: 'Most abundant mineral in Earth\'s crust. Silica tetrahedra (SiO₄⁴⁻) link into quartz, feldspar, mica, and all silicate minerals.'
    },
    {
      id: 'planet_olivine',
      subCategory: 'Mineral & Rock Formation',
      name: 'Olivine formation (mantle mineral)',
      equation: '2MgO + SiO₂ → Mg₂SiO₄ (forsterite)',
      atoms: [
        { name: 'Magnesium (鎂, Mg)', specs: 'P:12 E:12 N:12', boldText: 'P:12 E:12 N:12' }
      ],
      description: 'Olivine is the most abundant mineral in Earth\'s upper mantle. The Fe analogue (fayalite, Fe₂SiO₄) forms with iron.'
    },
    {
      id: 'planet_serpentine',
      subCategory: 'Mineral & Rock Formation',
      name: 'Serpentinization (water + mantle rock)',
      equation: 'Mg₂SiO₄ + 2H₂O → Mg(OH)₂ + SiO₂ + H₂↑',
      atoms: [
        { name: 'Water (水, H₂O)', specs: 'P:10 E:10 N:8', boldText: 'P:10 E:10 N:8' },
        { name: 'Hydrogen (H₂)', specs: 'P:2 E:2 N:0', boldText: 'P:2 E:2 N:0' }
      ],
      description: 'Produces molecular hydrogen — the energy source powering chemosynthetic life at mid-ocean ridge hydrothermal vents. Exothermic, generating heat even without sunlight.'
    },
    {
      id: 'planet_limestone',
      subCategory: 'Mineral & Rock Formation',
      name: 'Limestone / calcite formation',
      equation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓',
      atoms: [
        { name: 'Calcium (鈣, Ca)', specs: 'P:20 E:20 N:20', boldText: 'P:20 E:20 N:20' },
        { name: 'Carbon dioxide (CO₂)', specs: 'P:22 E:22 N:16', boldText: 'P:22 E:22 N:16' },
        { name: 'Calcium carbonate (CaCO₃)', specs: 'Calcite deposition' }
      ],
      description: 'Removes CO₂ from the ocean-atmosphere system as limestone rock. This Urey reaction is the long-term thermostat regulating Earth\'s climate over million-year timescales.'
    },
    {
      id: 'planet_karst',
      subCategory: 'Mineral & Rock Formation',
      name: 'Limestone dissolution (karst formation)',
      equation: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂ (soluble)',
      atoms: [
        { name: 'Calcium bicarbonate', specs: 'Soluble aqueous state' }
      ],
      description: 'Acidic rainwater dissolves limestone, carving caves, sinkholes, and karst landscapes over thousands of years.'
    },
    {
      id: 'planet_dolomite',
      subCategory: 'Mineral & Rock Formation',
      name: 'Dolomite formation',
      equation: '2CaCO₃ + MgCl₂ → CaMg(CO₃)₂ + CaCl₂',
      atoms: [
        { name: 'Magnesium (鎂, Mg)', specs: 'P:12 E:12 N:12', boldText: 'P:12 E:12 N:12' }
      ],
      description: 'Forms when magnesium replaces half the calcium in calcite. Mechanism still debated — may require microbial mediation in modern environments.'
    },
    {
      id: 'planet_iron_ox',
      subCategory: 'Mineral & Rock Formation',
      name: 'Iron oxide formation (rust, hematite)',
      equation: '4Fe + 3O₂ → 2Fe₂O₃ (hematite — red)',
      atoms: [
        { name: 'Iron (鐵, Fe)', specs: 'P:26 E:26 N:30', boldText: 'P:26 E:26 N:30' }
      ],
      description: 'Great Oxidation Event (~2.4 Gya): cyanobacterial O₂ oxidized dissolved ocean Fe²⁺, precipitating banded iron formations. These are Earth\'s primary iron ore deposits today.'
    },
    {
      id: 'planet_magnetite',
      subCategory: 'Mineral & Rock Formation',
      name: 'Magnetite formation',
      equation: '3Fe + 2O₂ → Fe₃O₄ (magnetite — black)',
      atoms: [
        { name: 'Magnetite (Fe₃O₄)', specs: 'Magnetic core marker' }
      ],
      description: 'Mixed Fe²⁺/Fe³⁺ oxide. Records Earth\'s magnetic field direction when it crystallizes from magma — key tool in paleomagnetics and plate tectonics reconstruction.'
    },
    {
      id: 'planet_pyrite',
      subCategory: 'Mineral & Rock Formation',
      name: 'Pyrite formation (fool\'s gold)',
      equation: 'Fe²⁺ + 2S → FeS₂ (pyrite)',
      atoms: [
        { name: 'Sulfur (硫, S)', specs: 'P:16 E:16 N:16', boldText: 'P:16 E:16 N:16' }
      ],
      description: 'Forms in anoxic marine sediments. Was a key mineral on early anoxic Earth. Some researchers propose pyrite surfaces as the site where early life chemistry began.'
    },
    {
      id: 'planet_halite',
      subCategory: 'Mineral & Rock Formation',
      name: 'Salt (halite) formation',
      equation: 'Na⁺ + Cl⁻ → NaCl (halite)',
      atoms: [
        { name: 'Sodium (鈉, Na)', specs: 'P:11 E:11 N:12', boldText: 'P:11 E:11 N:12' },
        { name: 'Chlorine (氯, Cl)', specs: 'P:17 E:17 N:18', boldText: 'P:17 E:17 N:18' }
      ],
      description: 'Evaporite deposit. Volcanic HCl dissolving in ocean water + Na from rock weathering established ocean salinity. Ocean has maintained ~3.5% salinity for ~4 billion years.'
    },
    {
      id: 'planet_gypsum',
      subCategory: 'Mineral & Rock Formation',
      name: 'Gypsum formation',
      equation: 'Ca²⁺ + SO₄²⁻ + 2H₂O → CaSO₄·2H₂O (gypsum)',
      atoms: [
        { name: 'Calcium Sulfate Gypsum', specs: 'Evaporite rock' }
      ],
      description: 'Evaporite mineral. Major component of drywall. Precipitation from evaporating shallow seawater — Messinian Salinity Crisis deposited 3 km of gypsum in the Mediterranean 5.96 Mya.'
    },
    {
      id: 'planet_ozone_f_r_m',
      subCategory: 'Atmospheric Chemistry',
      name: 'Ozone formation',
      equation: 'O₂ + UV(λ < 242nm) → 2O·\nO· + O₂ + M → O₃ + M',
      atoms: [
        { name: 'Ozone (O₃)', specs: 'P:24 E:24 N:24', boldText: 'P:24 E:24 N:24' }
      ],
      description: 'Stratospheric photolysis of O₂ creates atomic oxygen which combines with O₂. Ozone absorbs UV(280–315 nm), protecting DNA from damage. The ozone layer enabled terrestrial life ~450 Mya.'
    },
    {
      id: 'planet_ozone_destroy',
      subCategory: 'Atmospheric Chemistry',
      name: 'Ozone catalytic destruction (Chapman cycle)',
      equation: 'O₃ + UV → O₂ + O·\nO· + O₃ → 2O₂',
      atoms: [
        { name: 'Ozone (O₃)', specs: 'Stratospheric screen' }
      ],
      description: 'Natural ozone balance. The Cl· catalytic variant (Cl· + O₃ → ClO + O₂; ClO + O· → Cl· + O₂) from CFC photolysis creates the ozone hole.'
    },
    {
      id: 'planet_volcanic_h2o',
      subCategory: 'Atmospheric Chemistry',
      name: 'Water formation from volcanic outgassing',
      equation: 'H₂ + ½O₂ → H₂O  (volcanic/mantle origin)',
      atoms: [
        { name: 'Water (水, H₂O)', specs: 'P:10 E:10 N:8', boldText: 'P:10 E:10 N:8' }
      ],
      description: 'Early Earth\'s oceans formed primarily from volcanic outgassing of water trapped in the accreting planetary material, supplemented by asteroid/comet delivery.'
    },
    {
      id: 'planet_lightning_fix',
      subCategory: 'Atmospheric Chemistry',
      name: 'Lightning nitrogen fixation',
      equation: 'N₂ + O₂ → 2NO  (requires ~450 kJ/mol)\n2NO + O₂ → 2NO₂\nNO₂ + H₂O → HNO₃ (nitric acid rain)',
      atoms: [
        { name: 'Nitrogen (氮, N₂)', specs: 'P:14 E:14 N:14 (per atom)', boldText: 'P:14 E:14 N:14 (per atom)' }
      ],
      description: 'Lightning provides enough energy to break the N≡N triple bond (945 kJ/mol). Fixed nitrogen as nitric acid rain was the primary nitrogen source before biological nitrogen fixation evolved.'
    },
    {
      id: 'planet_methane_oxid',
      subCategory: 'Atmospheric Chemistry',
      name: 'Methane oxidation (hydroxyl radical)',
      equation: 'CH₄ + ·OH → ·CH₃ + H₂O → CO₂ + 2H₂O',
      atoms: [
        { name: 'Methane (甲烷, CH₄)', specs: 'P:10 E:10 N:6', boldText: 'P:10 E:10 N:6' }
      ],
      description: 'Tropospheric ·OH radical (from O₃ + H₂O + UV) destroys methane in ~12 years. Without this sink, methane from wetlands and animals would accumulate to catastrophic greenhouse levels.'
    },
    {
      id: 'planet_sulfate_aerosol',
      subCategory: 'Atmospheric Chemistry',
      name: 'Sulfur dioxide to sulfate aerosol',
      equation: 'SO₂ + H₂O → H₂SO₃\n2H₂SO₃ + O₂ → 2H₂SO₄ (sulfuric acid)',
      atoms: [
        { name: 'Sulfur dioxide (SO₂)', specs: 'P:32 E:32 N:32', boldText: 'P:32 E:32 N:32' }
      ],
      description: 'Volcanic SO₂ → sulfuric acid aerosols reflect sunlight, causing volcanic winters (e.g. 1815 Tambora eruption cooled Earth by 0.5°C for 1 year).'
    },
    {
      id: 'planet_acidification',
      subCategory: 'Atmospheric Chemistry',
      name: 'Carbonic acid equilibrium (ocean acidification)',
      equation: 'CO₂(g) + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ ⇌ 2H⁺ + CO₃²⁻',
      atoms: [
        { name: 'Carbonic acid', specs: 'pH equilibrium' }
      ],
      description: 'Atmospheric CO₂ dissolves in ocean water → lowers pH. Ocean pH has dropped from 8.2 to 8.1 since industrialization (~30% more acidic), threatening shell-forming organisms.'
    },
    {
      id: 'planet_silicate_weathering',
      subCategory: 'Atmospheric Chemistry',
      name: 'Silicate weathering CO₂ drawdown',
      equation: 'CaSiO₃ + CO₂ → CaCO₃ + SiO₂',
      atoms: [
        { name: 'Atmospheric CO₂', specs: 'Walker Cycle buffer' }
      ],
      description: 'The Walker cycle — Earth\'s million-year CO₂ thermostat. Higher CO₂ → warmer climate → more rain → faster weathering → more CO₂ sequestration → cooling. Stabilizes Earth\'s climate over geological time.'
    },
    {
      id: 'planet_miller_urey',
      subCategory: 'Hydrothermal & Abiotic Organic Chemistry',
      name: 'Miller-Urey synthesis (early Earth atmosphere)',
      equation: 'CH₄ + NH₃ + H₂O + H₂ + energy → amino acids, HCN, sugars',
      atoms: [
        { name: 'Ammonia (NH₃)', specs: 'P:10 E:10 N:7', boldText: 'P:10 E:10 N:7' }
      ],
      description: 'Lightning energy drives inorganic molecules to form organic building blocks — demonstrated by Stanley Miller in 1952. Now replicated with CO₂-rich atmospheres more representative of early Earth.'
    },
    {
      id: 'planet_fischer_tropsch',
      subCategory: 'Hydrothermal & Abiotic Organic Chemistry',
      name: 'Fischer-Tropsch synthesis (abiotic hydrocarbons)',
      equation: 'nCO + (2n+1)H₂ → CₙH₂ₙ₊₂ + nH₂O (alkanes)',
      atoms: [
        { name: 'Hydrocarbons', specs: 'Abiotic organic genesis' }
      ],
      description: 'CO from volcanic gases reacts with H₂ in hydrothermal systems at high temperature/pressure → abiotic hydrocarbons found in some meteorites and deep-Earth rocks.'
    },
    {
      id: 'planet_abiotic_ammonia',
      subCategory: 'Hydrothermal & Abiotic Organic Chemistry',
      name: 'Ammonia synthesis (abiotic)',
      equation: 'N₂ + 3H₂ → 2NH₃ + 92 kJ/mol',
      atoms: [
        { name: 'Ammonia (氨, NH₃)', specs: 'P:10 E:10 N:7', boldText: 'P:10 E:10 N:7' }
      ],
      description: 'Occurs at hydrothermal vents and was essential nitrogen source for prebiotic chemistry. The industrial Haber-Bosch process replicates this at scale — now feeds ~half of humanity.'
    }
  ]
};
