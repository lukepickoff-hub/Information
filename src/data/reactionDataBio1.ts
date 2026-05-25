import { ReactionDomain } from './reactionDataCosmos';

export const PLANT_DOMAIN: ReactionDomain = {
  id: 'plant',
  title: 'Plant — Photosynthesis & Biosynthesis',
  number: '02',
  color: '#4ab09a',
  secondaryColor: '#6acab8',
  tagClass: 'tag-plant',
  bgGradient: 'd-plant',
  reactions: [
    {
      id: 'plant_chl',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Chlorophyll photon absorption (Photosystem II)',
      equation: 'Chl + hν → Chl* (excited state, λ = 680 nm)',
      atoms: [
        { name: 'Magnesium (鎂, Mg²⁺)', specs: 'P:12 E:12 N:12', boldText: 'P:12 E:12 N:12' }
      ],
      description: 'Chlorophyll a has Mg²⁺ at its center. Excitation energy is transferred to the reaction center via resonance energy transfer through antenna pigments.'
    },
    {
      id: 'plant_photolysis',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Water photolysis (oxygen-evolving complex)',
      equation: '2H₂O + 4hν → 4H⁺ + 4e⁻ + O₂',
      atoms: [
        { name: 'Oxygen (氧, O₂)', specs: 'P:16 E:16 N:16', boldText: 'P:16 E:16 N:16' },
        { name: 'Manganese cluster (Mn₄CaO₅)', specs: 'Splitting complex' }
      ],
      description: 'The source of ALL atmospheric oxygen on Earth. The Mn₄CaO₅ cluster accumulates 4 oxidizing equivalents (S-state cycle) before releasing O₂.'
    },
    {
      id: 'plant_pq',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Plastoquinone reduction (PQ pool)',
      equation: 'PQ + 2e⁻ + 2H⁺(stroma) → PQH₂',
      atoms: [
        { name: 'Plastoquinone', specs: 'Lipid-soluble shuttle' }
      ],
      description: 'Mobile lipid-soluble carrier in the thylakoid membrane. Shuttles electrons from PSII to the cytochrome b6f complex, translocating protons.'
    },
    {
      id: 'plant_cyto',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Cytochrome b6f — Q cycle (proton pumping)',
      equation: 'PQH₂ + 2 plastocyanin(ox) → PQ + 2 plastocyanin(red) + 4H⁺(lumen)',
      atoms: [
        { name: 'Plastocyanin', specs: 'Copper protein carrier' }
      ],
      description: 'Analogous to Complex III in mitochondria. Q cycle doubles proton pumping efficiency. Plastocyanin shuttles electrons.'
    },
    {
      id: 'plant_psi',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Photosystem I — ferredoxin reduction (P700, λ=700nm)',
      equation: 'Plastocyanin(red) + Fd(ox) + hν → Plastocyanin(ox) + Fd(red)',
      atoms: [
        { name: 'Ferredoxin (Fd)', specs: '[4Fe-4S] cluster' }
      ],
      description: 'PSI reaction center (P700) absorbs longer wavelength light than PSII. Electrons drop to ferredoxin iron-sulfur protein.'
    },
    {
      id: 'plant_nadp_red',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'NADP⁺ reduction (ferredoxin-NADP⁺ reductase, FNR)',
      equation: '2Fd(red) + NADP⁺ + H⁺ → 2Fd(ox) + NADPH',
      atoms: [
        { name: 'NADPH', specs: 'Anabolic reduction agent' }
      ],
      description: 'Final step of the Z-scheme — produces NADPH that powers the Calvin cycle. FNR is a flavoprotein.'
    },
    {
      id: 'plant_atp_synth',
      subCategory: 'Light Reactions — Thylakoid Membrane',
      name: 'Chloroplast ATP synthase (CF₀CF₁)',
      equation: 'ADP + Pi + 3H⁺(lumen) → ATP + H₂O + 3H⁺(stroma)',
      atoms: [
        { name: 'Adenosine Triphosphate', specs: 'Energy battery' }
      ],
      description: 'Proton gradient across thylakoid membrane drives ATP synthesis. CF₀CF₁ structure is highly conserved, similar to mitochondria.'
    },
    {
      id: 'plant_rubisco',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: 'CO₂ fixation — RuBisCO',
      equation: 'CO₂ + RuBP (5C) + H₂O → 2 × 3-phosphoglycerate (3-PGA, 3C)',
      atoms: [
        { name: 'CO₂ (二氧化碳)', specs: 'P:22 E:22 N:16', boldText: 'P:22 E:22 N:16' }
      ],
      description: 'RuBisCO is the most abundant enzyme on Earth (~700 million tons). Commits carbon into 3-PGA, foundational organic compounds.'
    },
    {
      id: 'plant_3pga',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: '3-PGA reduction (consumes ATP + NADPH)',
      equation: '3-PGA + ATP → 1,3-bisphosphoglycerate + ADP\n1,3-BPG + NADPH → G3P + NADP⁺ + Pi',
      atoms: [
        { name: 'G3P', specs: 'C₃H₇O₆P glyceraldehyde' }
      ],
      description: 'Energy-consuming reactions that use ATP and NADPH. G3P is the immediate, direct output of photosynthesis.'
    },
    {
      id: 'plant_rubp_reg',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: 'RuBP regeneration (5 of 6 G3P molecules)',
      equation: '5 G3P + 3ATP → 3 RuBP (5C) + 3ADP + 3Pi',
      atoms: [
        { name: 'RuBP', specs: 'Ribulose receptor' }
      ],
      description: 'Complex transketolase cycles regenerate the CO₂ acceptor. Requires 9 ATP and 6 NADPH per single molecule of net sugar sugar glucose.'
    },
    {
      id: 'plant_photorespiration',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: 'Photorespiration (oxygenase activity of RuBisCO)',
      equation: 'RuBP + O₂ → 3-PGA + 2-phosphoglycolate (2PG)\n2PG → glycolate → glycine → serine + CO₂ (refixed)',
      atoms: [
        { name: 'Oxygen reactant', specs: 'RuBisCO oxygenase' }
      ],
      description: 'In high O₂/low CO₂ conditions, RuBisCO reacts with O₂ instead of CO₂, causing metabolic waste that C4/CAM plants evolved to bypass.'
    },
    {
      id: 'plant_c4',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: 'C4 pathway — PEP carboxylase (mesophyll)',
      equation: 'PEP (3C) + CO₂ + H₂O → Oxaloacetate (4C) + Pi',
      atoms: [
        { name: 'Oxaloacetate', specs: 'C4 intermediate' }
      ],
      description: 'PEP carboxylase has no oxygenase activity and fixes carbon rapidly to bypass photorespiration constraints in warm grass environments.'
    },
    {
      id: 'plant_cam',
      subCategory: 'Calvin Cycle (Dark Reactions) — Stroma',
      name: 'CAM pathway — nighttime CO₂ fixation',
      equation: 'Night: CO₂ + PEP → Malate (stored in vacuole)\nDay:  Malate → CO₂ (released to Calvin cycle, stomata closed)',
      atoms: [
        { name: 'Malate', specs: 'Vacuole storage acid' }
      ],
      description: 'Crassulacean Acid Metabolism. Stomata open only at night, storing carbon as malic acid to conserve water during warm desert days.'
    },
    {
      id: 'plant_sucrose',
      subCategory: 'Carbon Allocation & Storage',
      name: 'Sucrose synthesis (export sugar)',
      equation: 'UDP-glucose + Fructose-6-P → Sucrose-6-P + UDP → Sucrose + Pi',
      atoms: [
        { name: 'Sucrose (蔗糖, C₁₂H₂₂O₁₁)', specs: 'P:182 E:182 N:132', boldText: 'P:182 E:182 N:132' }
      ],
      description: 'Primary transport sugar. Non-reducing disaccharide that remains chemically stable while moving through phloem systems.'
    },
    {
      id: 'plant_starch',
      subCategory: 'Carbon Allocation & Storage',
      name: 'Starch synthesis (storage)',
      equation: 'ADP-glucose + Starch(n) → Starch(n+1) + ADP  (starch synthase)',
      atoms: [
        { name: 'Starch (澱粉, [C₆H₁₀O₅]ₙ)', specs: 'Polymer' }
      ],
      description: 'Linear amylose and branched amylopectin form starch grains within host chloroplast stroma and roots.'
    },
    {
      id: 'plant_cellulose',
      subCategory: 'Carbon Allocation & Storage',
      name: 'Cellulose synthesis (cell wall)',
      equation: 'UDP-glucose → β-1,4-glucan chains (cellulose synthase complex, rosette)',
      atoms: [
        { name: 'Cellulose ([C₆H₁₀O₅]ₙ)', specs: 'Skeletal cell wall' }
      ],
      description: 'Most abundant organic molecule on Earth. Dense hydrogen-bonding of β-1,4-glucan sheets creates high-strength plant structures.'
    },
    {
      id: 'plant_n_fix',
      subCategory: 'Nitrogen Metabolism',
      name: 'Nitrogen fixation (nitrogenase — root nodule bacteria)',
      equation: 'N₂ + 8H⁺ + 8e⁻ + 16ATP → 2NH₃ + H₂ + 16ADP + 16Pi',
      atoms: [
        { name: 'Nitrogen (氮, N₂)', specs: 'P:14 E:14 N:14 (per atom)', boldText: 'P:14 E:14 N:14' },
        { name: 'Ammonia (NH₃)', specs: 'P:10 E:10 N:7', boldText: 'P:10 E:10 N:7' }
      ],
      description: 'Extremely expensive biological reaction. Nitrogenase breaks the N≡N triple bond inside nodules shielded from oxygen.'
    },
    {
      id: 'plant_nitrate_red',
      subCategory: 'Nitrogen Metabolism',
      name: 'Nitrate reduction (root/leaf)',
      equation: 'NO₃⁻ + 2e⁻ → NO₂⁻  (nitrate reductase, cytosol)\nNO₂⁻ + 6e⁻ → NH₄⁺  (nitrite reductase, chloroplast)',
      atoms: [
        { name: 'Nitrate ion', specs: 'Soil extraction nutrient' }
      ],
      description: 'Nitrates are reduced in two steps. Uses photosynthetically-derived ferredoxin in the chloroplast stage.'
    },
    {
      id: 'plant_gs_gogat',
      subCategory: 'Nitrogen Metabolism',
      name: 'Glutamine synthetase / GOGAT (ammonia assimilation)',
      equation: 'Glutamate + NH₄⁺ + ATP → Glutamine + ADP + Pi  (GS)\nGlutamine + α-ketoglutarate + NADPH → 2 Glutamate  (GOGAT)',
      atoms: [
        { name: 'Glutamate', specs: 'Amino group transporter' }
      ],
      description: 'Incorporates inorganic nitrogen into amino acids. Foundations of all animal and plant proteins.'
    },
    {
      id: 'plant_lignin',
      subCategory: 'Secondary Metabolites & Structural Molecules',
      name: 'Lignin biosynthesis (phenylpropanoid pathway)',
      equation: 'Phenylalanine → Cinnamic acid → p-Coumaryl alcohol\n→ Coniferyl alcohol → Sinapyl alcohol → Lignin polymer',
      atoms: [
        { name: 'Monolignols', specs: 'Wood binders' }
      ],
      description: 'Lignin acts as high-strength concrete cross-linking with cellulose fibers, creating hard wood structures.'
    },
    {
      id: 'plant_ethylene',
      subCategory: 'Secondary Metabolites & Structural Molecules',
      name: 'Ethylene biosynthesis (ripening hormone)',
      equation: 'Methionine → SAM → ACC → Ethylene (CH₂=CH₂) + CO₂ + HCN',
      atoms: [
        { name: 'Ethylene (乙烯, C₂H₄)', specs: 'P:16 E:16 N:12', boldText: 'P:16 E:16 N:12' }
      ],
      description: 'Volatile gaseous hormone. ACC synthase is rate-limiting. Triggers fruit ripening and leaf drop.'
    },
    {
      id: 'plant_anthocyanin',
      subCategory: 'Secondary Metabolites & Structural Molecules',
      name: 'Anthocyanin biosynthesis (flavonoid pathway)',
      equation: 'Phenylalanine → Naringenin chalcone → Naringenin → Dihydroflavonols → Anthocyanidins → Anthocyanins',
      atoms: [
        { name: 'Flavones', specs: 'Colored pigments' }
      ],
      description: 'Provides red and blue floral pigments that depend on vacuolar pH. Screens UV rays and attracts pollinators.'
    },
    {
      id: 'plant_isoprene',
      subCategory: 'Secondary Metabolites & Structural Molecules',
      name: 'Isoprene / terpene biosynthesis',
      equation: 'Acetyl-CoA × 3 → HMG-CoA → Mevalonate → IPP → Terpenes',
      atoms: [
        { name: 'Isoprene units', specs: 'C5 hydrocarbons' }
      ],
      description: 'Precursor of essential oils, rubber, and carotenoids. Volatile terpene plumes form cloud nuclei.'
    },
    {
      id: 'plant_carotenoid',
      subCategory: 'Secondary Metabolites & Structural Molecules',
      name: 'Carotenoid synthesis (xanthophyll cycle)',
      equation: 'Violaxanthin ⇌ Antheraxanthin ⇌ Zeaxanthin  (via deepoxidase, epoxidase)',
      atoms: [
        { name: 'Zeaxanthin', specs: 'Photoprotection agent' }
      ],
      description: 'When light energy exceeds photosynthetic capacity, this cycle dissipates excess energy safely as heat.'
    }
  ]
};

export const CELL_DOMAIN: ReactionDomain = {
  id: 'cell',
  title: 'Cell — Molecular Metabolism',
  number: '03',
  color: '#5cb87a',
  secondaryColor: '#7dd49a',
  tagClass: 'tag-cell',
  bgGradient: 'd-cell',
  reactions: [
    {
      id: 'cell_glyc1',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Glucose phosphorylation (hexokinase)',
      equation: 'Glucose + ATP → Glucose-6-phosphate + ADP',
      atoms: [
        { name: 'Glucose (C₆H₁₂O₆)', specs: 'P:96 E:96 N:72', boldText: 'P:96 E:96 N:72' },
        { name: 'ATP (C₁₀H₁₆N₅O₁₃P₃)', specs: 'P:197 E:197 N:152', boldText: 'P:197 E:197 N:152' }
      ],
      description: 'Traps glucose inside the cell. First investment step of the preparatory phase of hexose breakdown.'
    },
    {
      id: 'cell_glyc2',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Glucose-6-phosphate isomerization (phosphoglucose isomerase)',
      equation: 'Glucose-6-P ⇌ Fructose-6-P',
      atoms: [
        { name: 'Fructose-6-P', specs: 'Isomerized hexose' }
      ],
      description: 'Rearranges glucose into fructose, positioning carbonyl groups for subsequent cleavages.'
    },
    {
      id: 'cell_glyc3',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Fructose-1,6-bisphosphate formation (PFK-1) — rate-limiting',
      equation: 'Fructose-6-P + ATP → Fructose-1,6-bisphosphate + ADP',
      atoms: [
        { name: 'PFK-1 enzyme', specs: 'Allosteric controller' }
      ],
      description: 'Committed step of glycolysis. Strongly regulated by cell energy status (activated by AMP, inhibited by ATP).'
    },
    {
      id: 'cell_glyc4',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Aldol cleavage (aldolase)',
      equation: 'Fructose-1,6-bisphosphate → DHAP + Glyceraldehyde-3-P (G3P)',
      atoms: [
        { name: 'Aldolase complex', specs: '6C cleavage' }
      ],
      description: 'Splits the hexose into two active 3-carbon compounds (triose phosphates) that funnel down pathway.'
    },
    {
      id: 'cell_glyc5',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'G3P oxidation + substrate-level phosphorylation (GAPDH)',
      equation: 'G3P + NAD⁺ + Pi → 1,3-bisphosphoglycerate + NADH',
      atoms: [
        { name: '1,3-BPG', specs: 'High energy phosphate' }
      ],
      description: 'First NADH generation. Extracts electrons from aldehyde to build high-energy acyl-phosphate bonds.'
    },
    {
      id: 'cell_glyc6',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'ATP synthesis from 1,3-BPG (phosphoglycerate kinase)',
      equation: '1,3-bisphosphoglycerate + ADP → 3-phosphoglycerate + ATP',
      atoms: [
        { name: 'ADP receptor', specs: 'Phospho transfer' }
      ],
      description: 'First substrate-level ATP generation (yields 2 ATP per glucose, balancing the initial energy investment).'
    },
    {
      id: 'cell_glyc7',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Phosphoenolpyruvate formation (enolase)',
      equation: '2-phosphoglycerate → Phosphoenolpyruvate (PEP) + H₂O',
      atoms: [
        { name: 'PEP molecule', specs: 'High water offset' }
      ],
      description: 'Dehydration builds highly unstable PEP, presenting a massive phosphate transfer potential.'
    },
    {
      id: 'cell_glyc8',
      subCategory: 'Glycolysis (Cytoplasm)',
      name: 'Pyruvate kinase — final glycolysis ATP',
      equation: 'PEP + ADP → Pyruvate + ATP',
      atoms: [
        { name: 'Pyruvate (C₃H₃O₃⁻)', specs: 'P:42 E:42 N:30', boldText: 'P:42 E:42 N:30' }
      ],
      description: 'Final step of glycolysis. Synthesizes second wave of ATP. Allosterically regulated to adjust metabolic speed.'
    },
    {
      id: 'cell_pdh',
      subCategory: 'Pyruvate Processing & Krebs Cycle (Mitochondria)',
      name: 'Pyruvate decarboxylation (PDH complex)',
      equation: 'Pyruvate + CoA + NAD⁺ → Acetyl-CoA + CO₂ + NADH',
      atoms: [
        { name: 'CO₂ (二氧化碳)', specs: 'P:22 E:22 N:16', boldText: 'P:22 E:22 N:16' }
      ],
      description: 'Bridge reaction in mitochondrial matrix. Irreversible oxidative decarboxylation feeding acetyl-CoA into Krebs.'
    },
    {
      id: 'cell_krebs1',
      subCategory: 'Pyruvate Processing & Krebs Cycle (Mitochondria)',
      name: 'Krebs 1 — citrate synthase',
      equation: 'Acetyl-CoA (2C) + Oxaloacetate (4C) → Citrate (6C) + CoA',
      atoms: [
        { name: 'Citrate', specs: '6C acid' }
      ],
      description: 'Condenses the acetate group onto the oxaloacetate carrier. Highly exergonic reaction driven by thioester cleavage.'
    },
    {
      id: 'cell_krebs3',
      subCategory: 'Pyruvate Processing & Krebs Cycle (Mitochondria)',
      name: 'Krebs 3 — isocitrate dehydrogenase (first CO₂, first NADH)',
      equation: 'Isocitrate (6C) + NAD⁺ → α-ketoglutarate (5C) + CO₂ + NADH',
      atoms: [
        { name: 'Isocitrate IDH', specs: 'Matrix regulator' }
      ],
      description: 'Primary regulatory speed bottleneck of Krebs. Inhibited by ATP and NADH; activated by ADP and Calcium.'
    },
    {
      id: 'cell_krebs6',
      subCategory: 'Pyruvate Processing & Krebs Cycle (Mitochondria)',
      name: 'Krebs 6 — succinate dehydrogenase (FADH₂ production)',
      equation: 'Succinate + FAD → Fumarate + FADH₂',
      atoms: [
        { name: 'SDH complex', specs: 'Complex II anchor' }
      ],
      description: 'Embedded directly on inner membrane. Integrates Krebs oxidation directly with mitochondrial ETC.'
    },
    {
      id: 'cell_etc1',
      subCategory: 'Electron Transport Chain & ATP Synthesis (Inner Membrane)',
      name: 'Complex I — NADH dehydrogenase (proton pumping)',
      equation: 'NADH + H⁺ + CoQ → NAD⁺ + CoQH₂ + 4H⁺(pumped)',
      atoms: [
        { name: 'Ubiquinone (CoQ)', specs: 'Lipophilic shuttle' }
      ],
      description: 'Largest ETC complex. Extracts electrons from NADH, pumping 4 protons across the membrane per pair.'
    },
    {
      id: 'cell_etc4',
      subCategory: 'Electron Transport Chain & ATP Synthesis (Inner Membrane)',
      name: 'Complex IV — cytochrome c oxidase (O₂ reduction)',
      equation: '4 cyt-c(red) + O₂ + 4H⁺ → 4 cyt-c(ox) + 2H₂O + 2H⁺(pumped)',
      atoms: [
        { name: 'Oxygen (O₂)', specs: 'P:16 E:16 N:16', boldText: 'P:16 E:16 N:16' },
        { name: 'Water (H₂O)', specs: 'P:10 E:10 N:8', boldText: 'P:10 E:10 N:8' }
      ],
      description: 'Terminal electron acceptor. Facilitates safe four-electron reduction of oxygen to water without releasing toxins.'
    },
    {
      id: 'cell_etc5',
      subCategory: 'Electron Transport Chain & ATP Synthesis (Inner Membrane)',
      name: 'ATP synthase (Complex V — chemiosmosis)',
      equation: 'ADP + Pi + nH⁺(lumen) → ATP + H₂O + nH⁺(matrix)',
      atoms: [
        { name: 'Adenosine Triphosphate', specs: 'ATP fuel' }
      ],
      description: 'Proton flow spins the rotor domain, driving mechanical shape changes that condense ADP and inorganic phosphate.'
    },
    {
      id: 'cell_lactic',
      subCategory: 'Fermentation Pathways (Anaerobic)',
      name: 'Lactic acid fermentation',
      equation: 'Pyruvate + NADH + H⁺ → Lactate + NAD⁺',
      atoms: [
        { name: 'Lactate', specs: 'P:42 E:42 N:30', boldText: 'P:42 E:42 N:30' }
      ],
      description: 'Regenerates NAD⁺ under anoxic conditions, encouraging glycolysis pathways to keep running locally.'
    },
    {
      id: 'cell_ethanol',
      subCategory: 'Fermentation Pathways (Anaerobic)',
      name: 'Ethanol fermentation (two steps)',
      equation: 'Pyruvate → Acetaldehyde + CO₂  (pyruvate decarboxylase)\nAcetaldehyde + NADH → Ethanol + NAD⁺  (alcohol dehydrogenase)',
      atoms: [
        { name: 'Ethanol (C₂H₅OH)', specs: 'P:26 E:26 N:18', boldText: 'P:26 E:26 N:18' }
      ],
      description: 'Primary yeast pathway. Releases CO₂ gaseous expansions and ethanol, serving as foundation for organic baking.'
    },
    {
      id: 'cell_rep',
      subCategory: 'Nucleotide, DNA & Protein Synthesis',
      name: 'DNA replication (polymerization)',
      equation: 'dNTP + (DNA)ₙ → (DNA)ₙ₊₁ + PPi',
      atoms: [
        { name: 'dNTP source', specs: 'Nucleic energy' }
      ],
      description: 'Polymerase builds genetic filaments 5\' to 3\'. Pyrophosphate hydrolysis drives the reaction forward.'
    },
    {
      id: 'cell_transcription',
      subCategory: 'Nucleotide, DNA & Protein Synthesis',
      name: 'RNA transcription',
      equation: 'NTP + (RNA)ₙ → (RNA)ₙ₊₁ + PPi',
      atoms: [
        { name: 'NTP substrate', specs: 'RNA monomer' }
      ],
      description: 'RNA polymerase drafts mRNA strands using DNA templates, initiating structural biological messaging.'
    },
    {
      id: 'cell_translation',
      subCategory: 'Nucleotide, DNA & Protein Synthesis',
      name: 'Translation — peptide bond formation (ribosome)',
      equation: 'aa₁-tRNA + aa₂-tRNA → aa₁-aa₂-tRNA + tRNA + 2GTP consumed',
      atoms: [
        { name: 'tRNA adapter', specs: 'Amino carrier' }
      ],
      description: 'rRNA peptidyl transferase catalyzes amino group bonding to carve custom folded proteins.'
    },
    {
      id: 'cell_phosphorylation',
      subCategory: 'Nucleotide, DNA & Protein Synthesis',
      name: 'Protein phosphorylation (kinases)',
      equation: 'Protein-OH + ATP → Protein-O-PO₃²⁻ + ADP',
      atoms: [
        { name: 'Phosphate group', specs: 'Signaling modifier' }
      ],
      description: 'Primary cellular on/off signaling switch. Modifies protein charges, conformations, and interactions.'
    },
    {
      id: 'cell_g_protein',
      subCategory: 'Nucleotide, DNA & Protein Synthesis',
      name: 'GTP hydrolysis (G-proteins, translation, transport)',
      equation: 'GTP + H₂O → GDP + Pi + free energy',
      atoms: [
        { name: 'GTP molecular switch', specs: 'Hydrolysis timer' }
      ],
      description: 'G-proteins serve as molecular toggles. Active GTP transitions to inactive GDP to manage pathways.'
    },
    {
      id: 'cell_nak_pump',
      subCategory: 'Membrane & Ion Transport',
      name: 'Na⁺/K⁺-ATPase pump',
      equation: '3Na⁺(in) + 2K⁺(out) + ATP → 3Na⁺(out) + 2K⁺(in) + ADP + Pi',
      atoms: [
        { name: 'Sodium (Na)', specs: 'P:11 E:11 N:12', boldText: 'P:11 E:11 N:12' },
        { name: 'Potassium (K)', specs: 'P:19 E:19 N:20', boldText: 'P:19 E:19 N:20' }
      ],
      description: 'Maintains critical resting potential across cell lines. Consumes vast percentage of cerebral ATP reservoirs.'
    },
    {
      id: 'cell_depol',
      subCategory: 'Membrane & Ion Transport',
      name: 'Action potential — Na⁺ influx (depolarization)',
      equation: 'Na⁺(out) → Na⁺(in) via voltage-gated Na⁺ channel',
      atoms: [
        { name: 'Sodium ions', specs: 'Potential trigger' }
      ],
      description: 'Channels open when threshold voltage is hit. Positive Sodium floods in, reversing membrane potential rapidly.'
    },
    {
      id: 'cell_repol',
      subCategory: 'Membrane & Ion Transport',
      name: 'Action potential — K⁺ efflux (repolarization)',
      equation: 'K⁺(in) → K⁺(out) via voltage-gated K⁺ channel',
      atoms: [
        { name: 'Potassium ions', specs: 'Charge rebalancer' }
      ],
      description: 'Slow channels open to let Potassium flow out. Restores the negative biological rest potentials.'
    },
    {
      id: 'cell_ca_signaling',
      subCategory: 'Membrane & Ion Transport',
      name: 'Ca²⁺ influx (signaling)',
      equation: 'Ca²⁺(ER/extracellular) → Ca²⁺(cytosol) [1000-fold gradient]',
      atoms: [
        { name: 'Calcium (Ca²⁺)', specs: 'P:20 E:18 N:20', boldText: 'P:20 E:18 N:20' }
      ],
      description: 'Ca²⁺ is the universal second messenger. Extremely low rest levels allow rapid, controlled signaling spikes.'
    },
    {
      id: 'cell_beta_oxid',
      subCategory: 'Fatty Acid & Lipid Metabolism',
      name: 'Fatty acid beta-oxidation (palmitoyl-CoA, 16C)',
      equation: 'Palmitoyl-CoA + 7FAD + 7NAD⁺ + 7CoA + 7H₂O → 8 Acetyl-CoA + 7FADH₂ + 7NADH',
      atoms: [
        { name: 'Acetyl-CoA', specs: 'Krebs fuel' }
      ],
      description: 'Successive two-carbon clipping. Yields huge numbers of ATP, highlighting lipids as efficient energy stores.'
    },
    {
      id: 'cell_lipid_synth',
      subCategory: 'Fatty Acid & Lipid Metabolism',
      name: 'Fatty acid synthesis (acetyl-CoA carboxylase)',
      equation: 'Acetyl-CoA + CO₂ + ATP → Malonyl-CoA + ADP + Pi',
      atoms: [
        { name: 'Malonyl-CoA', specs: 'Lipid monomer' }
      ],
      description: 'Committed biosynthetic step of lipid generation. Elongated by Fatty Acid Synthase with NADPH.'
    },
    {
      id: 'cell_ros_super',
      subCategory: 'Reactive Oxygen Species & Antioxidants',
      name: 'Superoxide formation (ETC leakage)',
      equation: 'O₂ + e⁻ → O₂·⁻ (superoxide radical)',
      atoms: [
        { name: 'Superoxide radical', specs: 'Reactive stress' }
      ],
      description: 'Incidental electron leakage from respiratory chains reduces oxygen partially, creating primary ROS stressors.'
    },
    {
      id: 'cell_sod',
      subCategory: 'Reactive Oxygen Species & Antioxidants',
      name: 'Superoxide dismutase (SOD)',
      equation: '2O₂·⁻ + 2H⁺ → H₂O₂ + O₂',
      atoms: [
        { name: 'Hydrogen peroxide', specs: 'Intermediate stress' }
      ],
      description: 'Primary defense enzyme converts high-stress superoxides back into less aggressive hydrogen peroxide.'
    },
    {
      id: 'cell_catalase',
      subCategory: 'Reactive Oxygen Species & Antioxidants',
      name: 'Catalase (H₂O₂ removal)',
      equation: '2H₂O₂ → 2H₂O + O₂',
      atoms: [
        { name: 'Water oxygen offset', specs: 'Safe transition' }
      ],
      description: 'Fastest biological enzyme. Resolves toxic peroxides into water and oxygen inside the cell compartment.'
    },
    {
      id: 'cell_glutathione',
      subCategory: 'Reactive Oxygen Species & Antioxidants',
      name: 'Glutathione peroxidase (GPx)',
      equation: 'H₂O₂ + 2GSH → 2H₂O + GSSG',
      atoms: [
        { name: 'GSH peptide', specs: 'Reducing buffer' }
      ],
      description: 'GSH donates electrons to neutralize peroxides, powered indirectly by the pentose-phosphate pathway.'
    }
  ]
};

export const TISSUE_DOMAIN: ReactionDomain = {
  id: 'tissue',
  title: 'Tissue — Structural & Functional Reactions',
  number: '04',
  color: '#9b7fd4',
  secondaryColor: '#b89ee0',
  tagClass: 'tag-tissue',
  bgGradient: 'd-tissue',
  reactions: [
    {
      id: 'tissue_keratin_disulfide',
      subCategory: 'Animal Tissue — Epithelial (Boundary Reactions)',
      name: 'Keratin disulfide crosslinking (Stratified squamous epithelium)',
      equation: 'Cys-SH + Cys-SH → Cys-S-S-Cys + 2H⁺',
      atoms: [
        { name: 'Sulfur (硫, S)', specs: 'P:16 E:16 N:16', boldText: 'P:16 E:16 N:16' },
        { name: 'Keratin monomer', specs: 'Structural skin protein' }
      ],
      description: 'Covalent sulfur bonds crosslink neighboring keratin strands to establish skin waterproof tensile shields.'
    },
    {
      id: 'tissue_transglutaminase',
      subCategory: 'Animal Tissue — Epithelial (Boundary Reactions)',
      name: 'Transglutaminase crosslinking (Cornified envelope)',
      equation: 'Gln + Lys + Ca²⁺ → γ-glutamyl-lysine isopeptide bond + NH₃',
      atoms: [
        { name: 'Calcium cofactor', specs: 'Ca²⁺ P:20' }
      ],
      description: 'Isotope bond links involucrins and loricrins to finalize insoluble envelopes of outermost skin sheets.'
    },
    {
      id: 'tissue_surfactant',
      subCategory: 'Animal Tissue — Epithelial (Boundary Reactions)',
      name: 'Surfactant synthesis (Type II pneumocytes)',
      equation: 'Choline + CDP-diacylglycerol → DPPC + CMP',
      atoms: [
        { name: 'Phosphorus (P)', specs: 'P:15 E:15 N:16' }
      ],
      description: 'DPPC reduces lung cell surface tension. Crucial structural adaptation ensuring alveoli don\'t collapse during deflation.'
    },
    {
      id: 'tissue_sglt1',
      subCategory: 'Animal Tissue — Epithelial (Boundary Reactions)',
      name: 'Active ion transport (Simple columnar epithelium, intestine)',
      equation: 'Na⁺ + Glucose → [SGLT1] → Na⁺(cell) + Glucose(cell)\nNa⁺/K⁺-ATPase: 3Na⁺(cell) → blood + 2K⁺(blood) → cell',
      atoms: [
        { name: 'SGLT1 symporter', specs: 'Secondary active' }
      ],
      description: 'Basolateral active sodium potentials pull glucose across epithelial boundaries into blood circulations.'
    },
    {
      id: 'tissue_collagen',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Collagen triple helix formation',
      equation: '3 × Pro-α chains → Procollagen → Tropocollagen → Fiber',
      atoms: [
        { name: 'Glycine (Gly)', specs: 'Repeating amino' }
      ],
      description: 'Repeating triplet sequences wound left-handed helices into structural cables of body joints.'
    },
    {
      id: 'tissue_hydroxyproline',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Prolyl hydroxylation (Vitamin C-dependent)',
      equation: 'Pro + O₂ + α-KG + Ascorbate → Hydroxyproline + CO₂ + Succinate',
      atoms: [
        { name: 'Vitamin C', specs: 'C₆H₈O₆ ascorbate' },
        { name: 'Iron (Fe)', specs: 'P:26 E:26 N:30' }
      ],
      description: 'Ascorbate keeps iron cofactors reduced, making stable hydroxyprolines. Deficits cause systemic scurvy breakdowns.'
    },
    {
      id: 'tissue_lox',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Lysyl oxidase crosslinking (Cu²⁺-dependent)',
      equation: 'Lys-NH₂ + O₂ → Allysine + NH₃\n2 Allysine → Aldol crosslink → Pyridinoline',
      atoms: [
        { name: 'Copper (銅, Cu²⁺)', specs: 'P:29 E:29 N:34', boldText: 'P:29 E:29 N:34' }
      ],
      description: 'Copper-catalyzed oxidation coordinates rigid, interconnected matrices securing connective tissues.'
    },
    {
      id: 'tissue_hyaluronic',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Hyaluronic acid (HA) synthesis',
      equation: 'UDP-GlcA + UDP-GlcNAc → [HA synthase] → HA polymer + 2 UDP',
      atoms: [
        { name: 'Glucuronic acid', specs: 'C₆H₁₀O₇ spacer' }
      ],
      description: 'Vast repeating disaccharide strands sponge up fluids to form gel matrices buffering cartilage.'
    },
    {
      id: 'tissue_hydroxyapatite',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Bone hydroxyapatite mineralization',
      equation: '5Ca²⁺ + 3PO₄³⁻ + OH⁻ → Ca₅(PO₄)₃OH (hydroxyapatite, HA crystal)',
      atoms: [
        { name: 'Calcium (Ca²⁺)', specs: 'P:20 E:18 N:20', boldText: 'P:20 E:18 N:20' },
        { name: 'Phosphorus (PO₄³⁻)', specs: 'P:15 E:15 N:16', boldText: 'P:15 E:15 N:16' }
      ],
      description: 'Inorganic crystals deposited into organic collagen frames, ensuring skeletal support resist compression.'
    },
    {
      id: 'tissue_thrombin',
      subCategory: 'Animal Tissue — Connective (Structural Assembly)',
      name: 'Blood clotting cascade',
      equation: 'Prothrombin + Complex → Thrombin\nFibrinogen → Fibrin monomers\nFibrin + XIIIa + Ca²⁺ → cross-linked polymer',
      atoms: [
        { name: 'Vitamin K', specs: 'Gamma carboxylation' }
      ],
      description: 'Interconnected enzymatic cleavages assemble dense, protective fibrin polymeric nets to prevent blood leaks.'
    },
    {
      id: 'tissue_myosin_stroke',
      subCategory: 'Animal Tissue — Muscle (Mechanochemical Reactions)',
      name: 'Myosin ATPase — power stroke cycle',
      equation: 'Myosin·ATP → Cocked (90°)\nMyosin·ADP·Pi + Actin → Actomyosin\nPi release → Power stroke swing (45°, 10 nm displacement)\nADP release → detaches',
      atoms: [
        { name: 'Actin filament', specs: '42 kDa anchor' }
      ],
      description: 'Direct conversion of high-energy chemical ATP states into mechanical pulling forces driving body motion.'
    },
    {
      id: 'tissue_troponin',
      subCategory: 'Animal Tissue — Muscle (Mechanochemical Reactions)',
      name: 'Ca²⁺ troponin switch',
      equation: 'TnC + Ca²⁺ → conformation shift → tropomyosin moves 7 nm',
      atoms: [
        { name: 'Calcium trigger', specs: 'TnC receptor' }
      ],
      description: 'Binding of Calcium exposes actin sites, letting myosin immediately engage muscle fibers.'
    },
    {
      id: 'tissue_serca',
      subCategory: 'Animal Tissue — Muscle (Mechanochemical Reactions)',
      name: 'SERCA pump — muscle relaxation',
      equation: '2Ca²⁺(cytosol) + ATP → 2Ca²⁺(SR lumen) + ADP + Pi',
      atoms: [
        { name: 'SERCA pump', specs: 'Active re-uptake' }
      ],
      description: 'Actively cleared cytosol ions drop Calcium and disconnect the myosin-actin power bridge, relaxing fibers.'
    },
    {
      id: 'tissue_brain_ RMP',
      subCategory: 'Animal Tissue — Nervous',
      name: 'Na⁺/K⁺-ATPase — resting membrane potential maintenance',
      equation: '3Na⁺(in) + 2K⁺(out) + ATP → 3Na⁺(out) + 2K⁺(in) + ADP + Pi',
      atoms: [
        { name: 'Sodium', specs: 'P:11 E:11 N:12' },
        { name: 'Potassium', specs: 'P:19 E:19 N:20' }
      ],
      description: 'Relentless ion pumping maintains a permanent gradient negative charge inside standard neuron membranes.'
    },
    {
      id: 'tissue_myelin',
      subCategory: 'Animal Tissue — Nervous',
      name: 'Myelination lipid chemistry',
      equation: 'Ceramide + PC → Sphingomyelin + DAG\nMBP + membrane face → compact lipid myelin',
      atoms: [
        { name: 'Sphingomyelin', specs: 'High resistance lipid' }
      ],
      description: 'High-density lipid coats secure low capacitance, triggering jumping action potential conduction velocities.'
    },
    {
      id: 'tissue_ltp',
      subCategory: 'Animal Tissue — Nervous',
      name: 'Long-term potentiation — LTP (Synaptic plasticity)',
      equation: 'Glu + NMDAR → Mg²⁺ ejects → Ca²⁺ influx → CaMKII active → AMPAR inserted',
      atoms: [
        { name: 'Magnesium', specs: 'P:12 E:12 N:12' }
      ],
      description: 'LTP is the cellular anchor for memory, using ion gating logic to strengthen synaptic communication networks.'
    },
    {
      id: 'tissue_xylem_lignin',
      subCategory: 'Plant Tissue — Vascular (Transport Chemistry)',
      name: 'Lignin polymerization (Xylem vessel wall)',
      equation: 'Monolignyl radicals → β-O-4, β-5 link polymers (random 3D network)',
      atoms: [
        { name: 'Iron peroxidase', specs: 'Radical engine' }
      ],
      description: 'Radical peroxidases cross-link organic monolignols inside cell walls to build stable plant xylem vessel tubes.'
    },
    {
      id: 'tissue_phloem_load',
      subCategory: 'Plant Tissue — Vascular (Transport Chemistry)',
      name: 'Phloem sucrose loading',
      equation: 'H⁺-ATPase: ATP → H⁺ gradient\nSucrose + H⁺(out) → [SUT1] → sieve tube loader',
      atoms: [
        { name: 'Sucrose payload', specs: 'Phloem solute' }
      ],
      description: 'Ion pumping pushes sucrose inside transportation lines, creating turgor pressures that carry sugar down tissues.'
    },
    {
      id: 'tissue_callose',
      subCategory: 'Plant Tissue — Vascular (Transport Chemistry)',
      name: 'Callose synthesis and degradation',
      equation: 'UDP-glucose → β-1,3-glucan callose deposits (CalS3)',
      atoms: [
        { name: 'Callose glucan', specs: 'Plate sealant' }
      ],
      description: 'Rapid β-1,3-glucan layering seals injured vascular plates instantly to prevent sap and nutrient losses.'
    },
    {
      id: 'tissue_starch_store',
      subCategory: 'Plant Tissue — Ground (Storage & Support)',
      name: 'Starch synthesis and mobilization (Amyloplast)',
      equation: 'Synthesis: ADP-glucose + Starch(n) → Starch(n+1) + ADP\nMobilization: Starch + H₂O → Glucose-1-P',
      atoms: [
        { name: 'Starch polymer', specs: 'Insoluble sugar reserve' }
      ],
      description: 'Allosteric enzymes couple starch storage in roots directly to daylight photosynthetic carbon fixed outputs.'
    },
    {
      id: 'tissue_pectin',
      subCategory: 'Plant Tissue — Ground (Storage & Support)',
      name: 'Pectin crosslinking by Ca²⁺ (Middle lamella)',
      equation: 'Pectin + Ca²⁺ → Ca²⁺-pectate gel ("egg-box" coordination)',
      atoms: [
        { name: 'Calcium linker', specs: 'Ca²⁺ P:20' }
      ],
      description: 'Pectins methylesterified and link via Calcium, forming dense adhesive matrix layers sticking plant cells together.'
    },
    {
      id: 'tissue_cutin',
      subCategory: 'Plant Tissue — Dermal (Barrier Chemistry)',
      name: 'Cutin polyester synthesis (Leaf surface)',
      equation: 'Hydroxy fatty acids + glycol → Cutin polyester + Wax crystals',
      atoms: [
        { name: 'Cutin wax', specs: 'Esters matrix' }
      ],
      description: 'Coats leaves in protective waxy layers that shut down non-stomatal transpiration and bounce rainfall droplets.'
    },
    {
      id: 'tissue_casparian',
      subCategory: 'Plant Tissue — Dermal (Barrier Chemistry)',
      name: 'Root suberin deposition (Casparian strip)',
      equation: 'Ferulic acid + suberin monomer → suberin lamellae',
      atoms: [
        { name: 'Suberin polymer', specs: 'Inorganic filter' }
      ],
      description: 'Deposits thick hydrophobic rings on endodermal lines to force ion solutions to pass membrane checks.'
    }
  ]
};
