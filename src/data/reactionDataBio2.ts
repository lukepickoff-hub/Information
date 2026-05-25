import { ReactionDomain } from './reactionDataCosmos';

export const ORGAN_DOMAIN: ReactionDomain = {
  id: 'organ',
  title: 'Organ System — Physiological Reactions',
  number: '06',
  color: '#d4956a',
  secondaryColor: '#e0aa80',
  tagClass: 'tag-organ',
  bgGradient: 'd-organ',
  reactions: [
    {
      id: 'organ_pacemaker',
      subCategory: 'Circulatory System Reactions',
      name: 'Cardiac action potential — pacemaker (SAN)',
      equation: 'Na⁺/Ca²⁺ funny current (If) → depolarization (−60 to −40 mV)\nL-type Ca²⁺ active: depolarization to +20 mV\nK⁺ efflux: repolarization',
      atoms: [
        { name: 'Sodium', specs: 'P:11 E:11 N:12' },
        { name: 'Calcium', specs: 'P:20 E:18 N:20' },
        { name: 'Potassium', specs: 'P:19 E:19 N:20' }
      ],
      description: 'Funny channels in pacemaker cells spontaneously depolarize membrane. Regulated directly by cyclic AMP and autonomous nervous systems.'
    },
    {
      id: 'organ_nos',
      subCategory: 'Circulatory System Reactions',
      name: 'Nitric oxide vasodilation (Vascular endothelium)',
      equation: 'L-Arg + O₂ + NADPH → Citrulline + NO·\nNO· → sGC → cyclic GMP → PKG → Myosin dephosphorylation → vasodilation',
      atoms: [
        { name: 'Nitric Oxide Free Radical', specs: 'Aqueous signal' },
        { name: 'Iron active', specs: 'sGC sensor' }
      ],
      description: 'Endothelial cells synthesize gaseous NO radical, which diffuses across boundaries to relax muscle walls and lower pressure.'
    },
    {
      id: 'organ_prost_throm',
      subCategory: 'Circulatory System Reactions',
      name: 'Prostacyclin (PGI₂) vs Thromboxane A₂ (TXA₂)',
      equation: 'Endothelium: AA + COX → PGH₂ → PGI₂ (stops clotting)\nPlatelet: AA + COX → PGH₂ → TXA₂ (promotes clotting)',
      atoms: [
        { name: 'Arachidonic Acid', specs: 'C₂₀H₃₂O₂' }
      ],
      description: 'Homeostatic balance coordinates blood fluidity. Endothelial prostacyclins prevent plates from sticking, while thromboxanes trigger plugs.'
    },
    {
      id: 'organ_alveolar_gas',
      subCategory: 'Respiratory System Reactions',
      name: 'O₂ / CO₂ exchange at capillary membrane',
      equation: 'O₂(alveolus, 100 mmHg) → diffuse → O₂(plasma, binds Hb)\nCO₂(venous, 46 mmHg) → diffuse → CO₂(alveolus, 40 mmHg)',
      atoms: [
        { name: 'Oxygen', specs: 'Alveolar gradient' },
        { name: 'Carbon Dioxide', specs: 'Venous pressure' }
      ],
      description: 'Passive diffusion down sharp partial pressure gradients across ultra-thin membranous boundaries inside pulmonary air sacs.'
    },
    {
      id: 'organ_blood_ph',
      subCategory: 'Respiratory System Reactions',
      name: 'pH regulation via ventilation (Bicarbonate buffer)',
      equation: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺\npH = 6.1 + log([HCO₃⁻] / [0.03 × pCO₂])',
      atoms: [
        { name: 'Hydrogen ion', specs: 'pH 7.4 (40 nM)' },
        { name: 'Bicarbonate', specs: '24 mEq/L' }
      ],
      description: 'Respiratory centers alter breathing rate within seconds to expel or retain carbon dioxide acid, stabilizing blood pH.'
    },
    {
      id: 'organ_gastric_acid',
      subCategory: 'Digestive System Reactions',
      name: 'Gastric acid secretion (Parietal cells)',
      equation: 'H⁺/K⁺-ATPase: H⁺(cell) → gastric lumen + K⁺(lumen) → cell\nCO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻ (carbonic anhydrase)',
      atoms: [
        { name: 'Chlorine', specs: 'P:17 E:17 N:18' },
        { name: 'Zinc cofactor', specs: 'Anhydrase helper' }
      ],
      description: 'Parietal cells generate a massive million-fold proton concentration gradient across membranes to establish highly acidic gastric juices.'
    },
    {
      id: 'organ_gluconeogenesis',
      subCategory: 'Digestive System Reactions',
      name: 'Liver gluconeogenesis — fasting state',
      equation: 'Lactate/Amino Acids → Pyruvate → PEPCK (OAA → PEP) → G6Pase → Free Glucose',
      atoms: [
        { name: 'Biotin cofactor', specs: 'CO₂ carrier' },
        { name: 'Glucose', specs: 'C₆H₁₂O₆ buffer' }
      ],
      description: 'Liver builds glucose de novo during fasting, protecting cerebral cells which cannot survive sudden blood sugar dips.'
    },
    {
      id: 'organ_bile_cycle',
      subCategory: 'Digestive System Reactions',
      name: 'Bile acid enterohepatic circulation',
      equation: 'Cholesterol → Cholic Acid → Conjugate with Gly/Tau → Emulsifies fat\nTerminal ileum: 95% reabsorbed → portal vein → liver reuptake',
      atoms: [
        { name: 'Cholesterol', specs: 'Sterol precursor' },
        { name: 'Taurine sulfur', specs: 'Conjugate' }
      ],
      description: 'The liver recycles biological bile salts repeatedly to conserve metabolic assets, losing only trace amounts in stool.'
    },
    {
      id: 'organ_bbb',
      subCategory: 'Nervous System Reactions',
      name: 'Blood-brain barrier (BBB) selective transport',
      equation: 'Passes: glucose (GLUT1), neutral amino acids (LAT1 under competition), gases\nPumped out: toxins, chemical therapeutics (P-glycoprotein exchange)',
      atoms: [
        { name: 'Glucose', specs: 'Active brain fuel' }
      ],
      description: 'Protects sensitive cerebral synaptic systems from systemic blood fluctuation. Highly selective gatekeepers control entries.'
    },
    {
      id: 'organ_glutamate_shuttle',
      subCategory: 'Nervous System Reactions',
      name: 'Glutamate-glutamine shuttle (Astrocyte-neuron)',
      equation: 'Astrocyte GLT1 consumes Glu → Glutamine Synthesizer (Glu + NH₄⁺ + ATP → Gln)\nNeuron imports Gln → Glutaminase (Gln → Glu + NH₄⁺)',
      atoms: [
        { name: 'Glutamate', specs: 'Excitatory driver' },
        { name: 'Ammonium toxin', specs: 'Direct clearing' }
      ],
      description: 'Astrocytes recycle neuron transmitters, shielding synapses from excitotoxic glutamate buildup and detoxifying ammonium.'
    },
    {
      id: 'organ_insulin',
      subCategory: 'Endocrine System Reactions',
      name: 'Insulin secretion and action',
      equation: 'Cell: glucose (GLUT2) → glycolysis → ATP targets K_ATP close → Ca²⁺ active → exocytosis\nTarget: active receptor → IRS1 → PI3K → Akt → GLUT4 translocates',
      atoms: [
        { name: 'Insulin peptide', specs: 'Disulfide locked' },
        { name: 'Zinc storage', specs: 'Hexamer binder' }
      ],
      description: 'Insulin triggers muscle and fat tissues of mammalian bodies to insert GLUT4 channels, consuming blood glucose.'
    },
    {
      id: 'organ_thyroid',
      subCategory: 'Endocrine System Reactions',
      name: 'Thyroid hormone synthesis (Thyrocyte)',
      equation: 'Active Iodide (NIS) → follicle → TPO iodine organification with Tyrosine\nTyrosine nodes combine → MIT/DIT → T4 storage →Peripheral deiodinase converts T4 to T3',
      atoms: [
        { name: 'Iodine (I)', specs: 'P:53 E:53 N:74', boldText: 'P:53 E:53 N:74' },
        { name: 'Selenium active', specs: 'Deiodinase active' }
      ],
      description: 'Follicular iodination builds thyroid state hormones. Peripheral deiodinase (selenium metalloenzyme) is key to release active T3.'
    },
    {
      id: 'organ_raas',
      subCategory: 'Endocrine System Reactions',
      name: 'Renin-Angiotensin-Aldosterone System (RAAS)',
      equation: 'Low pressure → renin (kidney) splits Angiotensinogen → AngI\nLung ACE splits AngI → AngII\nAngII triggers AT1R + aldosterone releases',
      atoms: [
        { name: 'Angiotensin II', specs: 'Octapeptide pressor' },
        { name: 'Zinc ACE catalytic', specs: 'Peptidic splitter' }
      ],
      description: 'Hormonal loop manages fluid volume and arteriole squeeze, crucial for homeostasis of multi-cellular body pressures.'
    },
    {
      id: 'organ_nephron',
      subCategory: 'Urinary System Reactions',
      name: 'Glomerular filtration and tubular reabsorption',
      equation: 'Filter: glomerular pressures extract 180 L fluid daily\nReclaimer: PT SGLT2 retrieves all glucose + Na⁺\nLoop: NKCC2 imports ions to compile medullary salt gradients',
      atoms: [
        { name: 'NKCC2 symporter', specs: 'Triple balance' }
      ],
      description: 'Loop of Henle coordinates highly localized solute gradients to passively concentrate metabolic waste urine outputs.'
    },
    {
      id: 'organ_kidney_ph',
      subCategory: 'Urinary System Reactions',
      name: 'Acid-base regulation (Intercalated cells)',
      equation: 'Type A cell: active proton pump H⁺ into collecting duct + exports HCO₃⁻ to blood\nType B cell: reversed exchange',
      atoms: [
        { name: 'Hydrogen ion', specs: 'PT filtration acid' }
      ],
      description: 'Renal systems actively secrete metabolic acids and reclaim bicarbonate over day scales to balance respiratory buffers.'
    },
    {
      id: 'organ_complement',
      subCategory: 'Immune System Reactions',
      name: 'Complement cascade',
      equation: 'C3 spontaneous hydrolysis → C3b active bounds to surface\nFactor B + D split → Bb loop amplifies → C5 convertase → Membrane Attack Complex (pore)',
      atoms: [
        { name: 'Thioester bond', specs: 'Covalent lock' }
      ],
      description: 'Innate plasma pathways react to foreign membranes by assembling circular pore complexes, exploding invasive pathogens.'
    },
    {
      id: 'organ_vdj',
      subCategory: 'Immune System Reactions',
      name: 'Antibody V(D)J recombination',
      equation: 'Pro-B cell: RAG1/RAG2 split DNA loops → aligns V, D, and J cassettes\nGerminal AID mutates cytidines → selects active binding mutants',
      atoms: [
        { name: 'RAG recombinase', specs: 'Double strand splitter' }
      ],
      description: 'Slices and rearranges gene segments to generate massive antibody varieties, selecting high-affinity versions.'
    },
    {
      id: 'organ_hematopoiesis',
      subCategory: 'Skeletal System Reactions',
      name: 'Hematopoiesis (Heme synthesis)',
      equation: 'ALA loop (Gly + Succinyl-CoA) → cytosolic porphyrins → protoporphyrin IX\nFerrochelatase inserts iron → active coordinates heme inside reticulocytes',
      atoms: [
        { name: 'Iron (Fe)', specs: 'P:26 E:26 N:30', boldText: 'Fe' },
        { name: 'Succinyl-CoA', specs: 'Krebs intermediate' }
      ],
      description: 'Bone marrow builds hemoglobin. Succinyl-CoA combines with glycine to forge porphyrin rings that capture iron.'
    },
    {
      id: 'organ_vitd',
      subCategory: 'Integumentary System Reactions',
      name: 'Vitamin D photosynthesis (Skin)',
      equation: '7-Dehydrocholesterol + UVB → Pre-D3 → thermal shift → Vitamin D3\nLiver 25-hydroxylase + Kidney 1-hydroxylase → Calcitriol',
      atoms: [
        { name: '7-Dehydrocholesterol', specs: 'Skin B-ring' },
        { name: 'UVB photon', specs: 'Kinetic splitter' }
      ],
      description: 'Sunlight hits epidermic cholesterols to break pre-Vitamin ring bonds, isomerizing precursors into critical bone hormones.'
    },
    {
      id: 'organ_sweat',
      subCategory: 'Integumentary System Reactions',
      name: 'Eccrine sweat gland thermoregulation',
      equation: 'Cholinergic receptor → Ca²⁺ active → Cl⁻ gates open (TMEM16A)\nActive Sodium follow Cl⁻ → osmotic water flow yields sweat',
      atoms: [
        { name: 'Chlorine channel', specs: 'TMEM16A driver' }
      ],
      description: 'Evaporation removes body heat. Sweat ducts use ENaC channels to reclaim valuable sodium salts before exit.'
    },
    // ── SKELETAL SYSTEM SPECIFIC PHYSIOLOGICAL CHEMESTRY ──
    {
      id: 'organ_osteoclast_dissolution',
      subCategory: 'Skeletal System Reactions',
      name: 'Osteoclast Bone Resorption (acid dissolution)',
      equation: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺  (via Carbonic Anhydrase II)\nH⁺(cytosol) + ATP → H⁺(resorption pit) via V-proton pump → Ca₅(PO₄)₃OH (HA) + 8H⁺ → 5Ca²⁺ + 3H₂PO₄⁻ + H₂O',
      atoms: [
        { name: 'Calcium Ca²⁺', specs: 'Dissolved bone mineral' },
        { name: 'Zinc cofactor', specs: 'Carbonic anhydrase center' }
      ],
      description: 'Osteoclasts build an airtight seal over bone and pump protons (H⁺) until the local pH reaches ~4.5, dissolving the solid calcium hydroxyapatite mineral matrix.'
    },
    {
      id: 'organ_collagen_lox',
      subCategory: 'Skeletal System Reactions',
      name: 'Collagen Lysyl Oxidase Cross-linking',
      equation: 'Lysin residues + O₂ → Allysine + NH₃  via lysyl oxidase (Cu²⁺-dependent)\nAllysine + Lysine → Pyridinoline covalent bond (structural lock)',
      atoms: [
        { name: 'Copper Cu²⁺', specs: 'Lysyl oxidase metallic center' }
      ],
      description: 'Copper-catalyzed amino acid alignment bridges neighboring collagen fibers. This reaction creates the high tensile-strength organic mesh of bones and tendons.'
    },
    // ── MUSCULAR SYSTEM ATP DYNAMIC CHEMESTRY ──
    {
      id: 'organ_muscle_anaerobic',
      subCategory: 'Muscular System Reactions',
      name: 'Anaerobic threshold ATP generation',
      equation: 'Glucose + 2 ADP + 2 Pi → 2 Lactate + 2 ATP (net) + 2 H⁺  (without oxygen)',
      atoms: [
        { name: 'Lactate molecule', specs: 'C₃H₅O₃⁻ glycolytic byproduct' }
      ],
      description: 'Provides rapid chemical energy during explosive actions (under 2 minutes). Re-oxidizes NADH to NAD⁺ by converting pyruvate to lactate.'
    },
    {
      id: 'organ_muscle_aerobic_yield',
      subCategory: 'Muscular System Reactions',
      name: 'Aerobic cellular respiration maximum yield',
      equation: 'C₆H₁₂O₆ + 6 O₂ + 30-32 ADP + 30-32 Pi → 6 CO₂ + 6 H₂O + 30-32 ATP',
      atoms: [
        { name: 'Oxygen O₂', specs: 'Terminal electron sink' }
      ],
      description: 'Slow-twitch muscle fibers oxidize glucose completely using oxygen. Delivers 15-fold more ATP per glucose than anaerobic pathways, maintaining long endurance bounds.'
    },
    // ── REPRODUCTIVE SYSTEM DUAL CHEMESTRY ──
    {
      id: 'organ_steroidogenesis',
      subCategory: 'Reproductive System Reactions',
      name: 'Steroidogenesis (Hormone synthesis from cholesterol)',
      equation: 'Cholesterol + CYP11A1 (mitochondria) → Pregnenolone → Progesterone → Androstenedione → Testosterone → Estradiol  (via CYP19A1 aromatase)',
      atoms: [
        { name: 'Cholesterol', specs: 'C₂₇H₄₆O steroid skeleton' },
        { name: 'Iron active center', specs: 'Cytochrome P450 enzymes' }
      ],
      description: 'Conversion from cholesterol into progestogens, androgens, and estrogens. Cytochrome P450 monooxygenases split molecular bonds with iron cofactors.'
    },
    {
      id: 'organ_acrosome_fertilization',
      subCategory: 'Reproductive System Reactions',
      name: 'Acrosome Reaction (egg penetration)',
      equation: 'Sperm + egg ZP3 glycoprotein → Ca²⁺ ion influx → Acrosomal membrane fusion + Acrosin release',
      atoms: [
        { name: 'Acrosin', specs: 'Serine protease enzyme' }
      ],
      description: 'Sperm contact with egg coat triggers calcium influx, causing acrosomal bags to empty proteolytic enzymes, digesting a path through the egg outer layer.'
    },
    // ── INTEGUMENTARY SYSTEM REACTION ──
    {
      id: 'organ_melanin_synthesis',
      subCategory: 'Integumentary System Reactions',
      name: 'Melanin ultraviolet shield synthesis',
      equation: 'L-Tyrosine + O₂ → L-DOPA → Dopaquinone  via tyrosinase (Cu²⁺-dependent) → Eumelanin (brown/black polymer) or Pheomelanin (red/yellow)',
      atoms: [
        { name: 'Copper Cu²⁺', specs: 'Tyrosinase active center' }
      ],
      description: 'Melanocytes in skin convert Tyrosine using oxygen and copper-centered tyrosinase to synthesize chemical polymer shields that absorb ultraviolet radiation.'
    }
  ]
};

export const ANIMAL_DOMAIN: ReactionDomain = {
  id: 'animal',
  title: 'Animal — Biochemistry & Sensory Spec',
  number: '07',
  color: '#d46a6a',
  secondaryColor: '#e08080',
  tagClass: 'tag-animal',
  bgGradient: 'd-animal',
  reactions: [
    {
      id: 'animal_hemoglobin',
      subCategory: 'Oxygen Transport & Blood Chemistry',
      name: 'Hemoglobin O₂ binding (cooperative)',
      equation: 'Hb + 4O₂ ⇌ Hb(O₂)₄  (cooperative cooperativity)',
      atoms: [
        { name: 'Iron (鐵, Fe²⁺ in heme)', specs: 'P:26 E:26 N:30', boldText: 'P:26 E:26 N:30' },
        { name: 'Oxygen (O₂)', specs: 'P:16 E:16 N:16', boldText: 'P:16 E:16 N:16' }
      ],
      description: 'Sigmoidal binding curve. Active tissues release H⁺ and CO₂ to drop oxygen affinities, ensuring unload occurs where needed.'
    },
    {
      id: 'animal_co2_transport',
      subCategory: 'Oxygen Transport & Blood Chemistry',
      name: 'CO₂ transport — carbonic anhydrase',
      equation: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺',
      atoms: [
        { name: 'Bicarbonate (HCO₃⁻)', specs: 'P:25 E:26 N:17', boldText: 'P:25 E:26 N:17' },
        { name: 'Zinc (鋅, Zn²⁺) cofactor', specs: 'P:30 E:30 N:34', boldText: 'P:30 E:30 N:34' }
      ],
      description: 'Maintains rapid conversion of waste carbon dioxide into soluble bicarb buffers inside red blood cells.'
    },
    {
      id: 'animal_myoglobin',
      subCategory: 'Oxygen Transport & Blood Chemistry',
      name: 'Myoglobin O₂ storage (muscle)',
      equation: 'Mb + O₂ ⇌ Mb(O₂)',
      atoms: [
        { name: 'Myoglobin binding', specs: 'Monomeric oxygen storage' }
      ],
      description: 'Single chain globin binds oxygen at very low tissue pressures, releasing storage during explosive anaerobic actions.'
    },
    {
      id: 'animal_adrenaline',
      subCategory: 'Hormones & Signal Molecules',
      name: 'Adrenaline (epinephrine) synthesis',
      equation: 'Tyrosine → DOPA → Dopamine → Noradrenaline → Adrenaline',
      atoms: [
        { name: 'Tyrosine (酪氨酸, C₉H₁₁NO₃)', specs: 'P:117 E:117 N:83', boldText: 'P:117 E:117 N:83' },
        { name: 'Adrenaline', specs: 'Catecholamine' }
      ],
      description: 'Adrenal glands modify Tyrosine ring cofactors to compile adrenaline, driving whole-organism fight-or-flight.'
    },
    {
      id: 'animal_dopamine',
      subCategory: 'Hormones & Signal Molecules',
      name: 'Dopamine synthesis',
      equation: 'L-Tyrosine → L-DOPA → Dopamine (DOPA decarboxylase)',
      atoms: [
        { name: 'Dopamine (多巴胺, C₈H₁₁NO₂)', specs: 'Catechol chain' }
      ],
      description: 'Key motivation neurotransmitter. Tyrosine coordinates the synthesis path in deep cerebral basal ganglia centers.'
    },
    {
      id: 'animal_serotonin',
      subCategory: 'Hormones & Signal Molecules',
      name: 'Serotonin synthesis',
      equation: 'Tryptophan → 5-hydroxytryptophan → Serotonin (5-HT)',
      atoms: [
        { name: 'Tryptophan (色氨酸)', specs: 'Indole amine' },
        { name: 'Serotonin (血清素)', specs: '5-HT modulator' }
      ],
      description: 'Synthesized mostly in digestive cells. Regulates vascular squeeze, mood thresholds, and sleep cycles.'
    },
    {
      id: 'animal_steroids',
      subCategory: 'Hormones & Signal Molecules',
      name: 'Steroid hormone synthesis (from cholesterol)',
      equation: 'Cholesterol → Pregnenolone → Progesterone → Cortisol / Testosterone / Estradiol',
      atoms: [
        { name: 'Cholesterol precursor', specs: 'C₂₇H₄₆O steroid' }
      ],
      description: 'Differentiated CYP450 active centers modify lipid structures to construct mineralocorticoids and hormones.'
    },
    {
      id: 'animal_ach',
      subCategory: 'Neurotransmitter Reactions',
      name: 'Acetylcholine synthesis',
      equation: 'Choline + Acetyl-CoA → Acetylcholine + CoA',
      atoms: [
        { name: 'Acetylcholine (乙酰膽鹼)', specs: 'Quaternary amine' }
      ],
      description: 'Synthesized by Choline Acetyltransferase. Acts as primary trigger driving peripheral neuromuscular activations.'
    },
    {
      id: 'animal_ach_hydrolysis',
      subCategory: 'Neurotransmitter Reactions',
      name: 'Acetylcholine hydrolysis (termination)',
      equation: 'Acetylcholine + H₂O → Choline + Acetate  (AChE)',
      atoms: [
        { name: 'AChE enzyme', specs: 'Catalytic limit' }
      ],
      description: 'AChE splits transmitters inside synaptic clefts in microseconds, ensuring signal stops rapidly.'
    },
    {
      id: 'animal_gaba',
      subCategory: 'Neurotransmitter Reactions',
      name: 'GABA synthesis (inhibitory neurotransmitter)',
      equation: 'Glutamate → GABA + CO₂  (GAD enzyme)',
      atoms: [
        { name: 'GABA (γ-aminobutyric acid)', specs: 'Inhibitory ligand' }
      ],
      description: 'Glutamate Decarboxylase trims glutamate into GABA, triggering chloride gates to quiet neurological lines.'
    },
    {
      id: 'animal_respiratory_burst',
      subCategory: 'Immune & Detoxification Reactions',
      name: 'Respiratory burst (neutrophil / macrophage)',
      equation: 'NADPH + 2O₂ → NADP⁺ + 2O₂·⁻\n2O₂·⁻ + 2H⁺ → H₂O₂ + O₂\nH₂O₂ + Cl⁻ → HOCl + OH⁻ (myeloperoxidase)',
      atoms: [
        { name: 'HOCl Bleach', specs: 'Reactive oxidant' }
      ],
      description: 'Aggressive consumption of oxygen builds superoxide radicals and hypochlorous bleach to dissolve trapped cell invaders.'
    },
    {
      id: 'animal_cyp_detox',
      subCategory: 'Immune & Detoxification Reactions',
      name: 'Cytochrome P450 detoxification (liver)',
      equation: 'Drug + O₂ + NADPH → Drug-OH + H₂O + NADP⁺',
      atoms: [
        { name: 'CYP450 enzyme', specs: 'Metabolic hydroxylase' }
      ],
      description: 'P450 coordinates oxygen transfers onto lipophilic elements for safe renal clearance.'
    },
    {
      id: 'animal_vision',
      subCategory: 'Immune & Detoxification Reactions',
      name: 'Vision — retinal photoisomerization',
      equation: '11-cis-Retinal + hν → all-trans-Retinal (rhodopsin active state)',
      atoms: [
        { name: 'Retinal (C₂₀H₂₈O)', specs: 'Vitamin A derivative' }
      ],
      description: 'Incident photons instantaneously twist Retinal isomers, launching G-protein cascades to signal vision maps.'
    }
  ]
};
