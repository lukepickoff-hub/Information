import { useState, useMemo } from 'react';
import { 
  Dna, Sparkles, Zap, ChevronDown, ChevronRight, Activity, 
  Orbit, Layers, Minimize2, ArrowRight, Eye, Shield, HelpCircle
} from 'lucide-react';
import { ReactionItem, getAllReactions } from '../data/reactionData';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface BiologicalHierarchyProps {
  onAskAI: (question: string) => void;
  onTriggerReactionInChamber?: (reaction: ReactionItem) => void;
}

interface AtomMoleculeDetail {
  name: string;
  formulaOrSymbol: string;
  structure: string;
  function: string;
  type: 'atom' | 'molecule';
}

interface TaxonomyNode {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  group: 'Cell' | 'Tissue' | 'Organ System';
  structure: string;
  function: string;
  atomsMolecules: AtomMoleculeDetail[];
  reactionsKeywords: string[];
}

interface OrganelleMapData {
  id: string;
  name: string;
  roleTitle: string;
  structure: string;
  metabolicRole: string;
  flowEquation: string; // LaTeX equation
  inputs: string[];
  outputs: string[];
  reactionKeywords: string[];
}

export function BiologicalHierarchy({ onAskAI, onTriggerReactionInChamber }: BiologicalHierarchyProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'tree'>('map');
  const [cellMapType, setCellMapType] = useState<'human' | 'tree'>('human');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string>('mitochondria');
  const [hoveredOrganelle, setHoveredOrganelle] = useState<string | null>(null);

  const [activeGroup, setActiveGroup] = useState<'All' | 'Cell' | 'Tissue' | 'Organ System'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['cell-prokaryotic', 'tissue-muscle', 'system-circulatory']));

  // All biological system taxonomy data mapping exactly to user request
  const taxonomyData: TaxonomyNode[] = useMemo(() => [
    // ── CELL LEVEL ──
    {
      id: 'cell-prokaryotic',
      name: 'Prokaryotic Cell',
      title: 'Prokaryotic cell (No nucleus)',
      subtitle: 'Single-celled primitive organisms with free nucleoids.',
      group: 'Cell',
      structure: 'Lacks a nuclear membrane, membrane-bound organelles, or mitochondria. Composed of a single circular DNA chromosome, 70S ribosomes, a plasma membrane, and a porous protective peptidoglycan cell wall.',
      function: 'Performs rapid biological divisions, direct cell-wall localized respiration, anaerobic pathways, or direct ambient substrate absorption. It relies on diffusion for internal transport and is highly metabolic.',
      atomsMolecules: [
        { name: 'Peptidoglycan', formulaOrSymbol: '(C39H64N10O17)n', structure: 'Alternating N-acetylglucosamine (NAG) and N-acetylmuramic acid (NAM) cross-linked by synthetic oligopeptide chains.', function: 'Forms a highly porous yet ultra-rigid external armor preventing osmotic cell burst from low-osmosis mediums.', type: 'molecule' },
        { name: 'Phosphate Group', formulaOrSymbol: 'PO4^3-', structure: 'Central phosphorus covalently bonded to 4 oxygen atoms in a tetrahedral spatial arrangement.', function: 'Serves as the structural backbone of circular plasmid DNA and free-floating RNA strands.', type: 'molecule' },
        { name: 'Hydrogen Ion / Protons', formulaOrSymbol: 'H+', structure: 'Single unshielded proton, size ~1.5 × 10^-15 m.', function: 'Piped through the plasma membrane to create a proton gradient ($H^+$ gradient) to generate ATP energy direct from the outer cell wall.', type: 'atom' }
      ],
      reactionsKeywords: ['prokaryotic', 'plasma', 'membrane', 'bacteria', 'wall', 'hydrogen', 'respiration']
    },
    {
      id: 'cell-eukaryotic-animalia',
      name: 'Eukaryotic Cell — Animalia (Human)',
      title: 'Eukaryotic Animalia cell (Human as model)',
      subtitle: 'Complex cellular structure with a nucleus and specialized membrane organelles.',
      group: 'Cell',
      structure: 'Contains a true double-membrane Nucleus, Mitochondria, Endoplasmic Reticulum, Golgi Apparatus, and Cytoskeleton. Lacks cell walls or chloroplasts, allowing flexible shape.',
      function: 'Powers muscle contractions, metabolic transformations, active cellular signals, sodium-potassium electrochemical potentials, and synthesizes specific proteins.',
      atomsMolecules: [
        { name: 'Phospholipid Bilayer', formulaOrSymbol: 'C40H80NO8P', structure: 'Hydrophilic polar phosphate head bound to two hydrophobic lipid hydrocarbon fatty acid tales.', function: 'Forms the selectively permeable cell membrane which maintains specific ion charge differences between the cell interior and exterior.', type: 'molecule' },
        { name: 'Adenosine Triphosphate (ATP)', formulaOrSymbol: 'C10H16N5O13P3', structure: 'Adenine ring, ribose sugar, and three phosphate groups connected by high-energy phosphoanhydride bonds.', function: 'The universal molecular energy cash. Hydrolysis of its terminal phosphate releases 30.5 kJ/mol of instant kinetic energy.', type: 'molecule' },
        { name: 'Water', formulaOrSymbol: 'H2O', structure: 'Oxygen atom covalently bonded to two hydrogen atoms in an asymmetric bent geometry (104.5°) creating high dipole moment.', function: 'Acts as the solvent for all intracellular biochemistry, regulating heat, osmosis, and conducting biochemical reactions.', type: 'molecule' },
        { name: 'Sodium Ion', formulaOrSymbol: 'Na+', structure: 'Sodium atom stripped of its valence electron, exposing a complete outer shell.', function: 'Kept concentrated outside the cell membrane to build the driving charge potential necessary for nervous firing.', type: 'atom' }
      ],
      reactionsKeywords: ['cell', 'mitochondria', 'metabolic', 'cycle', 'atp', 'glucose', 'water', 'membrane', 'sodium']
    },
    {
      id: 'cell-eukaryotic-plantae',
      name: 'Eukaryotic Cell — Plantae (Tree)',
      title: 'Eukaryotic Plantae cell (Tree as model)',
      subtitle: 'Rigid photosynthetic cell with chloroplasts and central vacuoles.',
      group: 'Cell',
      structure: 'Surrounded by a outer Cellulose cell wall. Contains Chloroplasts containing chlorophyll pigment, and a Giant Central Vacuole that dominates cell volume.',
      function: 'Performs solar energy collection (photosynthesis), generates turgor pressure to stand upright against gravity, and synthesizes thick structural wooden fibers.',
      atomsMolecules: [
        { name: 'Cellulose', formulaOrSymbol: '(C6H10O5)n', structure: 'Linear polymeric chain consisting of hundreds to thousands of beta-1,4-linked D-glucose glucose units.', function: 'Bundles into thick structural microfibrils that provide enormous tensile strength to build stiff tree leaves and trunk wood.', type: 'molecule' },
        { name: 'Chlorophyll A', formulaOrSymbol: 'C55H72MgN4O5', structure: 'A large porphyrin ring coordinated around a central Magnesium atom, attached to a long hydrophobic phytol tail.', function: 'Captures orange-red and blue-violet solar light photons to excite molecular electrons, driving sugar synthesis from carbon dioxide.', type: 'molecule' },
        { name: 'Magnesium', formulaOrSymbol: 'Mg^2+', structure: 'Alkaline earth metal ion holding a +2 charge.', function: 'The coordinate metal at the core of the chlorophyll molecule which holds excited electrons in stable molecular orbits.', type: 'atom' }
      ],
      reactionsKeywords: ['photosynthesis', 'chlorophyll', 'plant', 'sucrose', 'rubisco', 'calvin', 'carbon', 'wood', 'cellulose']
    },
    {
      id: 'cell-eukaryotic-fungi',
      name: 'Eukaryotic Cell — Fungi',
      title: 'Eukaryotic Fungi cell (Mushroom as model)',
      subtitle: 'Heterotrophic walled cell with chitinous structures.',
      group: 'Cell',
      structure: 'Has a cell wall made of Chitin. Tubular or thread-like elongated cells (hyphae) with porous divider septa allowing cytoplasmic flow.',
      function: 'Secretes powerful extracellular digestion enzymes into surrounding dead logs or soil, then absorbs organic molecules directly through the cell wall. Cannot photosynthesize.',
      atomsMolecules: [
        { name: 'Chitin', formulaOrSymbol: '(C8H13NO5)n', structure: 'Long-chain polymer of N-acetylglucosamine, structured similarly to cellulose but with an amide side group.', function: 'Creates thick, tough, waterproof cell walls that resist decay and environmental pressure.', type: 'molecule' },
        { name: 'Ergosterol', formulaOrSymbol: 'C28H44O', structure: 'A hydrophobic tetracyclic sterol molecule derived from squalene.', function: 'Maintains fluid and selective properties inside fungal cell membranes, performing the same role cholesterol does in animals.', type: 'molecule' }
      ],
      reactionsKeywords: ['fungi', 'chitin', 'digestion', 'enzyme', 'organic', 'absorption']
    },
    {
      id: 'cell-eukaryotic-protista',
      name: 'Eukaryotic Cell — Protista',
      title: 'Eukaryotic Protista cell (Diatom / Paramecium as model)',
      subtitle: 'Highly complex single-celled eukaryotic organisms.',
      group: 'Cell',
      structure: 'Highly complex single cell. Can have calcium carbonate or silicate shells (Diatoms), or cilia coating with contractile vacuoles (Paramecium).',
      function: 'Performs all physiological functions (eating, excretion, locomotion, defense) inside a single cell. Swims actively or floats in maritime photic zones.',
      atomsMolecules: [
        { name: 'Silicon Dioxide', formulaOrSymbol: 'SiO2', structure: 'Network solid where each silicon atom is tetrahedrally bonded to 4 oxygen atoms forming an amorphous glass matrix.', function: 'Constructs the rigid, porous, glass frustule protective shells of diatoms.', type: 'molecule' },
        { name: 'Calcium Carbonate', formulaOrSymbol: 'CaCO3', structure: 'Trigonal planar carbonate ion chemically balanced by a positive calcium cation.', function: 'Forms protective shells or internal skeletal structures in marine protists.', type: 'molecule' }
      ],
      reactionsKeywords: ['diatom', 'silicon', 'protista', 'cilia', 'vacuole', 'freshwater']
    },

    // ── TISSUE LEVEL ──
    {
      id: 'tissue-epithelial',
      name: 'Animal Tissue — Epithelial',
      title: 'Epithelial Tissue (Boundary & Outer Shell)',
      subtitle: 'Tightly packed cellular sheets that form protective and selective boundaries.',
      group: 'Tissue',
      structure: 'Tightly linked rows of cells pinned by anchoring proteins, with zero intercellular space. Sits on a non-cellular collagen-rich basement membrane.',
      function: 'Forms an impermeable or selectively permeable protective seal (skin, digestive lining). Regulates absorption of food, blocks pathogens, and secretes mucus.',
      atomsMolecules: [
        { name: 'Keratin', formulaOrSymbol: 'Complex Protein', structure: 'Alpha-helical or beta-sheet protein macromolecule packed with cysteine amino acids forming heavy disulfide bonds.', function: 'Provides mechanical tough defense inside outer skin cells to resist puncture, abrasion, and keep water locked inside.', type: 'molecule' },
        { name: 'Disulfide Linkage', formulaOrSymbol: '-S-S-', structure: 'Covalent bond connecting 2 sulfur atoms from adjacent cysteine amino acid residues.', function: 'Cross-links keratin chains together, giving skin tissues their immense waterproofing and elastic recovery forces.', type: 'molecule' },
        { name: 'Sulfur', formulaOrSymbol: 'S', structure: 'Group 16 reactive nonmetal element holding 16 protons and 16 electrons.', function: 'Crucial for forming the cross-linking disulfide covalent bridges that stabilize epithelial proteins.', type: 'atom' }
      ],
      reactionsKeywords: ['epithelial', 'keratin', 'barrier', 'disulfide', 'sulfur', 'skin', 'tight', 'junction']
    },
    {
      id: 'tissue-connective',
      name: 'Animal Tissue — Connective',
      title: 'Connective Tissue (Scaffold, Bone & Cartilage)',
      subtitle: 'Extracellular structural matrices that bind, suspend, and support the body.',
      group: 'Tissue',
      structure: 'Sparse cells (fibroblasts, osteocytes) floating in a massive, self-secreted extracellular matrix of collagen fibers, ground gel, or mineral minerals.',
      function: 'Connects tissues together, stores calcium bone mineral banks, cushions bone joints (cartilage), and transports nutrients (blood is a liquid connective tissue).',
      atomsMolecules: [
        { name: 'Collagen', formulaOrSymbol: 'C5H9N1O2 (Gly-Pro-Hyp avg)', structure: 'Triple-helix polypeptide chain consisting of repeating Glycine-Proline-Hydroxyproline amino acid triplets.', function: 'Provides tensile strength greater than steel of equivalent weight, forming the structural framework of bones and tendons.', type: 'molecule' },
        { name: 'Calcium Hydroxyapatite', formulaOrSymbol: 'Ca10(PO4)6(OH)2', structure: 'A dense hexagonal crystalline phosphate salt matrix.', function: 'Denses and mineralizes collagen fibers, giving bone plates their compressive strength and stiffness against gravity.', type: 'molecule' },
        { name: 'Calcium', formulaOrSymbol: 'Ca^2+', structure: 'Positive alkaline earth metal ion stripped of two valence electrons, mass ~40 amu.', function: 'The structural cation used to crystallize solid mineral frameworks in bones and teeth.', type: 'atom' }
      ],
      reactionsKeywords: ['connective', 'collagen', 'bone', 'apatite', 'calcium', 'cartilage', 'skeletal', 'joint']
    },
    {
      id: 'tissue-muscle',
      name: 'Animal Tissue — Muscle',
      title: 'Muscle Tissue (Interaction & Mechanical Pulls)',
      subtitle: 'Contracting cellular bundles that turn chemical energy into movement.',
      group: 'Tissue',
      structure: 'Elongated, multi-nucleated fiber cells packed with regular repeating rows of actin and myosin protein filaments (sarcomeres). Contains dense mitochondria.',
      function: 'Contracts and generates high physical pulling forces to translate skeleton bones, pump blood in the heart (cardiac muscle), or push food in guts (smooth muscle).',
      atomsMolecules: [
        { name: 'Actin & Myosin', formulaOrSymbol: 'Protein Complex', structure: 'Actin is a thin double-helical protein track. Myosin has a global globular motor head that binds ATP.', function: 'Slide past each other using power-strokes to physically shorten the muscle muscle tissue, generating movement.', type: 'molecule' },
        { name: 'Calcium Signal Ion', formulaOrSymbol: 'Ca^2+', structure: 'Divalent positive calcium ion, key intracellular signal trigger.', function: 'Floods the sarcomere from storage to bind troponin, immediately uncovering the actin track so myosin heads can pull.', type: 'atom' }
      ],
      reactionsKeywords: ['muscle', 'actin', 'myosin', 'contraction', 'relaxation', 'calcium', 'atp', 'creatine', 'serca']
    },
    {
      id: 'tissue-nervous',
      name: 'Animal Tissue — Nervous',
      title: 'Nervous Tissue (Reaction & Pulse Routing)',
      subtitle: 'Excitable cells that generate and conduct instant electro-chemical signals.',
      group: 'Tissue',
      structure: 'Consists of Neurons (cell body, receiving dendrites, and projecting axon wire) and Glial support cells. Axons are wrapped in fatty myelin sheets.',
      function: 'Coordinates and processes all body reactions, conducts decision plans, senses environmental changes, and triggers muscle action pulses.',
      atomsMolecules: [
        { name: 'Acetylcholine', formulaOrSymbol: 'C7H16NO2+', structure: 'An organic ester compound of acetic acid and choline.', function: 'The primary neurotransmitter released at muscular interfaces to trigger immediate calcium release and muscle contraction.', type: 'molecule' },
        { name: 'Potassium Ion', formulaOrSymbol: 'K+', structure: 'Monovalent potassium cation, stripped of 1 electron.', function: 'Concentrated inside neurons to rapidly leak out during repolarization, resetting the nervous cell charge back to -70mV.', type: 'atom' },
        { name: 'Sodium Ion', formulaOrSymbol: 'Na+', structure: 'Positive sodium ion, monovalent cation.', function: 'Rushes into the nervous cell during firing (depolarization), shifting local membrane charge from -70mV to +40mV.', type: 'atom' }
      ],
      reactionsKeywords: ['nervous', 'neuron', 'axon', 'synapse', 'sodium', 'potassium', 'action', ' acetylcholine', 'depolarization']
    },
    {
      id: 'tissue-dermal',
      name: 'Plant Tissue — Dermal',
      title: 'Dermal Tissue (Plant Protective Coat)',
      subtitle: 'The seal and skin of the plant, regulating moisture and defense.',
      group: 'Tissue',
      structure: 'A single layer of closely fitting epidermal cells, coated externally by a thick hydrophobic waxy cuticle layer. Contains regulated pairs of guard cells.',
      function: 'Coats tree leaves and bark to prevent water evaporation, blocks insect entry, and regulates exchange of photosynthesis gases via stomata.',
      atomsMolecules: [
        { name: 'Cutin & Plant Waxes', formulaOrSymbol: 'Complex Hydrocarbon Polyesters', structure: 'Cross-linked ester network of hydroxy fatty acids with intermediate molecular chains.', function: 'Acts as an absolute waterproof barrier, preventing vital cell sap and water from evaporating into dry air.', type: 'molecule' },
        { name: 'Potassium Ion', formulaOrSymbol: 'K+', structure: 'Monovalent potassium ion.', function: 'Pumped into guard cells to draw water in by osmosis, causing them to balloon and open the leaf pore (stomata) for carbon dioxide entry.', type: 'atom' }
      ],
      reactionsKeywords: ['dermal', 'guard', 'stomata', 'potassium', 'cuticle', 'evaporation', 'leaf']
    },
    {
      id: 'tissue-vascular',
      name: 'Plant Tissue — Vascular',
      title: 'Vascular Tissue (Plant Fluid Connections)',
      subtitle: 'A high-pressure pipeline network piping fluids up and down the tree.',
      group: 'Tissue',
      structure: 'Composed of Xylem (rigid dead hollow tube cells) and Phloem (living columns of hollow sieve tube cells connected by porous end plates).',
      function: 'Xylem pipes water and dissolved nitrogen up from soil to leaves. Phloem pipes rich glucose sugars synthesized in leaves down to root storage.',
      atomsMolecules: [
        { name: 'Lignin', formulaOrSymbol: '(C10H12O3)n', structure: 'Vast, complex cross-linked phenolic polymer with no standard repeating unit, hydrophobic in nature.', function: 'Encases cellulose chains in xylem walls, providing hydrophobic water-conducting pathways and preventing trunk collapse under heavy wind and physical height.', type: 'molecule' },
        { name: 'Sucrose', formulaOrSymbol: 'C12H22O11', structure: 'Disaccharide sugar molecule formed by combining a glucose molecule and a fructose molecule with a glycosidic linkage.', function: 'The stable, highly soluble sugar form used to pump and transport energy through the phloem sieve pipelines of trees.', type: 'molecule' }
      ],
      reactionsKeywords: ['xylem', 'phloem', 'vascular', 'lignin', 'sucrose', 'sap', 'water', 'root']
    },
    {
      id: 'tissue-ground',
      name: 'Plant Tissue — Ground',
      title: 'Ground Tissue (Interactions, Support & Fuel Factories)',
      subtitle: 'The main biological filler, packing the interior of leaves, stems, and roots.',
      group: 'Tissue',
      structure: 'Divided into Parenchyma (large thin cells packed with chloroplasts or starch cells), Collenchyma (flexible thick cells), and Sclerenchyma (rigid stone cells).',
      function: 'Conducts the bulk of photosynthesis in tree leaves, stores starch, provides flexible structural support in stems, and hardens shell shells.',
      atomsMolecules: [
        { name: 'Starch / Glucose Polymer', formulaOrSymbol: '(C6H10O5)n', structure: 'Semi-crystalline polymer of glucose units linked by alpha-1,4-glucosidic bonds.', function: 'Serves as the main long-term carbohydrate fuel reserve stored inside ground Parenchyma cells of roots.', type: 'molecule' },
        { name: 'Water', formulaOrSymbol: 'H2O', structure: 'Asymmetric bent dipole molecule.', function: 'Provides turgor pressure inside ground cells, keeping leaves expanded and firm without wooden trunks.', type: 'molecule' }
      ],
      reactionsKeywords: ['parenchyma', 'ground', 'starch', 'glucose', 'chloroplast', 'turgor', 'support']
    },

    // ── ORGAN SYSTEM LEVEL ──
    {
      id: 'system-circulatory',
      name: 'Circulatory System',
      title: 'Circulatory System (Heart, Blood & Vessels)',
      subtitle: 'A high-speed fluid distribution network supplying cells.',
      group: 'Organ System',
      structure: 'Composed of the Heart (cardiac muscle pump with pacemaker nodes) and a closed network of elastic blood Arteries, Capillaries, and Veins.',
      function: 'Pipes oxygen and glucose molecules to tissues, reclaims carbon dioxide acid, distributes metabolic hormones, and regulates core body temperature.',
      atomsMolecules: [
        { name: 'Hemoglobin', formulaOrSymbol: 'Complex Fe-Protein', structure: 'Four coordinated protein subunits, each containing a central porphyrin ring holding an Iron atom.', function: 'Binds oxygen gas ($O_2$) in lungs and releases it in acidic, oxygen-deprived tissues.', type: 'molecule' },
        { name: 'Iron Ion', formulaOrSymbol: 'Fe^2+', structure: 'Transition metal ion holding a +2 charge, 26 protons.', function: 'The coordinate metal at the center of heme groups that physically binds the oxygen molecule.', type: 'atom' }
      ],
      reactionsKeywords: ['circulatory', 'heart', 'pacemaker', 'blood', 'hemoglobin', 'iron', 'oxygen', 'vascular']
    },
    {
      id: 'system-respiratory',
      name: 'Respiratory System',
      title: 'Respiratory System (Lungs & Gas Exchangers)',
      subtitle: 'The gas-exchange interface extracting oxygen and purging carbon dioxide.',
      group: 'Organ System',
      structure: 'Air pathways leading to the Lungs, terminating in 300 million micro-air sacs (Alveoli) lined with thin epithelial cells.',
      function: 'Conducts passive gas exchange of oxygen and carbon dioxide across a 0.2 micrometer selective barrier to regulate blood pH.',
      atomsMolecules: [
        { name: 'Carbon Dioxide', formulaOrSymbol: 'CO2', structure: 'Central carbon double-bonded to two oxygens in a linear geometry, 22 protons.', function: 'Highly active metabolic waste. Forms carbonic acid in blood; its elimination regulates safe metabolic pH.', type: 'molecule' },
        { name: 'Oxygen', formulaOrSymbol: 'O2', structure: 'Diatomic oxygen gas bound by a double covalent bond.', function: 'The terminal electron receptor in mitochondria, necessary to burn glucose and run ATP generators.', type: 'molecule' }
      ],
      reactionsKeywords: ['respiratory', 'lung', 'alveoli', 'oxygen', 'carbon dioxide', 'ventilation', 'co2', 'breathe']
    },
    {
      id: 'system-digestive',
      name: 'Digestive System',
      title: 'Digestive System (Stomach & Intestinal Reactors)',
      subtitle: 'A physical and chemical dismantling reactor breaking down organic matter.',
      group: 'Organ System',
      structure: 'Spans the Mouth, Esophagus, Stomach (acidic reactor), Small Intestine (absorptive folds), Large Intestine, Liver, and pancreas organs.',
      function: 'Dismantles carbohydrate, fat, and protein polymers into single glucose, lipid, and amino acid molecules to fuel cellular ATP synthesis.',
      atomsMolecules: [
        { name: 'Hydrochloric Acid', formulaOrSymbol: 'HCl', structure: 'Strong polar covalent hydrogen chloride molecule, completely dissociated in stomach juices.', function: 'Generates extreme acidity ($pH \\sim 1.5$) inside the stomach to unravel protein chains and activate digestive enzymes.', type: 'molecule' },
        { name: 'Chloride Ion', formulaOrSymbol: 'Cl-', structure: 'Chlorine halogen atom holding 17 protons and 18 electrons.', function: 'Secreted by stomach parietal cells to form stomach acid and regulate fluid balance.', type: 'atom' }
      ],
      reactionsKeywords: ['digestive', 'stomach', 'acid', 'pepsin', 'intestine', 'bile', 'glucose', 'absorption', 'hydrochloric']
    },
    {
      id: 'system-nervous',
      name: 'Nervous System',
      title: 'Nervous System (Brain, Spinal Cord & Nerve Network)',
      subtitle: 'The primary central processor and signal bus of animal coordination.',
      group: 'Organ System',
      structure: 'Spans the Brain (billions of synaptic connections), spinal cord, and cranial/peripheral nerves.',
      function: 'Processes inputs, makes decision plans, stores memory traces via synaptic protein modifications, and routes action potential signals.',
      atomsMolecules: [
        { name: 'Serotonin / neurotransmitter', formulaOrSymbol: 'C10H12N2O', structure: 'A monoamine neurotransmitter derived from tryptophan amino acid.', function: 'Synthesized mostly in digestive cells. Regulates vascular squeeze, mood thresholds, and sleep cycles.', type: 'molecule' },
        { name: 'Calcium signal', formulaOrSymbol: 'Ca^2+', structure: 'Calcium ion holding a 2+ charge.', function: 'Rushes into nerve terminal ends to trigger the immediate exocytosis of neurotransmitter vectors.', type: 'atom' }
      ],
      reactionsKeywords: ['nervous', 'brain', 'synaptic', 'serotonin', 'calcium', 'action', 'neurotransmitter']
    },
    {
      id: 'system-skeletal',
      name: 'Skeletal System',
      title: 'Skeletal System (Bones & Joint Frameworks)',
      subtitle: 'The structural skeleton of animal movement.',
      group: 'Organ System',
      structure: 'Includes 206 rigid Bones, Cartilage connections, mineralized matrix plates, and marrow compartments.',
      function: 'Constructs the mechanical frame for muscles, preserves internal organs, generates blood cells in bone marrow, and active calcium homeostasis.',
      atomsMolecules: [
        { name: 'Hydroxyapatite Crystals', formulaOrSymbol: 'Ca10(PO4)6(OH)2', structure: 'Dense hexagonal crystal matrix.', function: 'Provides immense compressive rigidity to the skeleton to bear animal weight.', type: 'molecule' },
        { name: 'Phosphate Cation Balance', formulaOrSymbol: 'PO4^3-', structure: 'Tetrahedral phosphorus and oxygen group.', function: 'Crucial for skeleton bone crystallization and systemic phosphate energy pools.', type: 'atom' }
      ],
      reactionsKeywords: ['skeletal', 'bone', 'hydroxyapatite', 'calcium', 'phosphate', 'skeletons', 'rigid']
    },
    {
      id: 'system-muscular',
      name: 'Muscular System',
      title: 'Muscular System (Muscle Connections & Movement Gears)',
      subtitle: 'The mechanical pull array driving locomotion.',
      group: 'Organ System',
      structure: 'Composed of over 600 skeletal Muscles connected to bone plates via tough collagenous tendons.',
      function: 'Drives skeleton joint rotation, preserves vertical posture against gravity, conducts physical locomotion (running, flying), and radiates heat.',
      atomsMolecules: [
        { name: 'Creatine Phosphate', formulaOrSymbol: 'C4H10N3O5P', structure: 'Phosphorylated creatine molecule containing a high-energy phosphate bond.', function: 'Serves as an instant buffer bank to regenerate ATP during the first 10 seconds of explosive muscular sprint effort.', type: 'molecule' },
        { name: 'Lactic Acid', formulaOrSymbol: 'C3H6O3', structure: 'Carboxylic acid containing a hydroxyl group on the alpha carbon.', function: 'Synthesized anaerobically inside muscles during oxygen deficit, splitting into lactate and protons to recycle NAD+.', type: 'molecule' }
      ],
      reactionsKeywords: ['muscular', 'muscle', 'creatine', 'lactic', 'atp', 'myosin', 'actin']
    },
    {
      id: 'system-endocrine',
      name: 'Endocrine System',
      title: 'Endocrine System (Glands & Chemical Controllers)',
      subtitle: 'A wireless chemical signaling system coordinating long-term development.',
      group: 'Organ System',
      structure: 'Includes the Hypothalamus, Pituitary, Thyroid (regulates metabolism), Adrenal glands (stress), and Pancreas (sugar).',
      function: 'Synthesizes and releases specific hormones into blood vessels to coordinate blood sugar, metabolism kinetics, growth stages, and stress reactions.',
      atomsMolecules: [
        { name: 'Adrenaline / Epinephrine', formulaOrSymbol: 'C9H13NO3', structure: 'A catecholamine chemical derived from tyrosine amino acid.', function: 'Rushes into blood vessels during stress, instantly opening lung airways and shifting blood flows to heart and muscles.', type: 'molecule' },
        { name: 'Thyroxine (T4 Hormone)', formulaOrSymbol: 'C15H11I4NO4', structure: 'Tyrosine-based hormone ring bound directly to 4 Iodine atoms.', function: 'Regulates global metabolic speed inside animal cells.', type: 'molecule' },
        { name: 'Iodine At Node', formulaOrSymbol: 'I', structure: 'Halogen element with 53 protons.', function: 'Crucial element required physically to synthesize thyroid hormones; deficiency stops cell growth.', type: 'atom' }
      ],
      reactionsKeywords: ['endocrine', 'adrenaline', 'thyroid', 'insulin', 'pancreas', 'hormone', 'thyroxine', 'iodine']
    },
    {
      id: 'system-immune',
      name: 'Immune System',
      title: 'Immune System (Macrophage Cells & Chemical Armaments)',
      subtitle: 'The mobile biological police scanning and dismantling threats.',
      group: 'Organ System',
      structure: 'Includes White Blood Cells (leukocytes, macrophages, T cells), antibodies, Lymph nodes, Spleen, and thymus.',
      function: 'Dismantles bacterial wall pathogens, kills virus-infected cells, initiates inflammation repair, and remembers past infections.',
      atomsMolecules: [
        { name: 'Hydrogen Peroxide (Respiratory Burst)', formulaOrSymbol: 'H2O2', structure: 'Non-planar bent structure with a weak covalent single bond between two oxygen atoms.', function: 'A highly reactive oxygen species (ROS) synthesized inside macrophage vesicles to oxidize and destroy bacterial cells.', type: 'molecule' },
        { name: 'Superoxide Radical', formulaOrSymbol: 'O2*-', structure: 'Diatomic oxygen holding an extra unpaired valence electron.', function: 'A powerful radical synthesized during neutrophil respiratory bursts to poison pathogens.', type: 'molecule' }
      ],
      reactionsKeywords: ['immune', 'macrophage', 'respiratory', 'burst', 'antibody', 'peroxide', 'superoxide', 'neutrophil']
    },
    {
      id: 'system-urinary',
      name: 'Urinary System',
      title: 'Urinary System (Kidneys & Blood Filters)',
      subtitle: 'The chemical filtration bank purging cellular waste.',
      group: 'Organ System',
      structure: 'Composed of two Kidneys (packed with 1 million filtration Nephrons), ureters, and bladder.',
      function: 'Filters blood, removes nitrogen urea waste, maintains precise water levels, and actively stabilizes systemic electrolyte balance.',
      atomsMolecules: [
        { name: 'Urea', formulaOrSymbol: 'CO(NH2)2', structure: 'A carbonyl group covalently bonded to two amide nitrogen groups.', function: 'The non-toxic nitrogen-carrying molecule generated by the liver to safely purge chemical amino acid breakdown waste.', type: 'molecule' },
        { name: 'Bicarbonate Buffer Ion', formulaOrSymbol: 'HCO3-', structure: 'Carbonate ion dynamically protonated to carry a negative charge.', function: 'Reclaimed and regulated by kidneys to neutralize metabolic sulfuric and lactic acids.', type: 'molecule' }
      ],
      reactionsKeywords: ['urinary', 'kidney', 'nephron', 'urea', 'bicarbonate', 'filtration', 'urine']
    },
    {
      id: 'system-reproductive',
      name: 'Reproductive System',
      title: 'Reproductive System (Gametes & Genetic Continuers)',
      subtitle: 'The specialized organs that package and recombine DNA.',
      group: 'Organ System',
      structure: 'Includes the Gonads (Ovaries / Testes synthesizing gametes), hormone channels, and uterine chambers.',
      function: 'Produces genetically unique single-copy DNA gamete cells (sperm and egg), coordinates pregnancy development, and drives sex hormones.',
      atomsMolecules: [
        { name: 'Progesterone', formulaOrSymbol: 'C21H30O2', structure: 'A tetracyclic steroid hormone.', function: 'Prepares and maintains the uterine lining cells to support embryo vascular connections.', type: 'molecule' },
        { name: 'Testosterone', formulaOrSymbol: 'C19H28O2', structure: 'A steroid hormone with a ketone group at C3 and hydroxyl group at C17.', function: 'Testosterone initiates chemical pathways that trigger muscle cell protein synthesis and spermatogenesis pathways.', type: 'molecule' }
      ],
      reactionsKeywords: ['reproductive', 'testosterone', 'progesterone', 'ovary', 'gamete', 'pregnancy', 'genetics']
    },
    {
      id: 'system-integumentary',
      name: 'Integumentary System',
      title: 'Integumentary System (Skin & Sweating Radiators)',
      subtitle: 'The outermost defensive wrapper and radiator of the animal.',
      group: 'Organ System',
      structure: 'Spans the epidermal skin layer, dermal hair follicles, sebaceous glands, and water sweat glands.',
      function: 'Prevents entry of germs, creates sensory touch maps of surroundings, synthesizes Vitamin D from sun rays, and cools via sweat.',
      atomsMolecules: [
        { name: 'Cholecalciferol (Vitamin D3)', formulaOrSymbol: 'C27H44O', structure: 'A secosteroid molecule with one open ring.', function: 'Synthesized inside skin cells when exposed to UVB solar light, later converted to calcitriol to regulate calcium absorption in the gut.', type: 'molecule' },
        { name: 'Sodium Chloride (Sweat)', formulaOrSymbol: 'NaCl', structure: 'An ionic lattice solid of sodium cations and chloride anions.', function: 'Excreted with water onto the skin to draw latent heat away as the sweat evaporates.', type: 'molecule' }
      ],
      reactionsKeywords: ['integumentary', 'skin', 'sweat', 'evaporation', 'capillary', 'cholecalciferol', 'vitamin']
    }
  ], []);

  // Organelles Metabolic Map Data Definition
  const organelleDataList: OrganelleMapData[] = useMemo(() => [
    {
      id: 'mitochondria',
      name: 'Mitochondria',
      roleTitle: 'Powerhouse: Krebs Cycle & Electron Transport Chain (ETC)',
      structure: 'Double membrane organelle. The smooth outer membrane encloses a highly folded inner membrane (Cristae) surrounding the internal fluid matrix.',
      metabolicRole: 'Mitochondria conduct oxidative phosphorylation. Pyruvate made in glycolysis is oxidized to Acetyl-CoA, degraded via the Citric Acid Cycle (releasing $CO_2$ and charging $NADH$), whose high-energy electrons power an inner-membrane proton ($H^+$) pump. This $H^+$ concentration gradient drives the ATP Synthase rotor to pack molecular phosphate groups onto ADP, generating the bulk of the cell\'s chemical energy.',
      flowEquation: '$$\\text{Pyruvate} + 3\\text{NAD}^+ + \\text{FAD} + \\text{ADP} + \\text{P}_i + \\text{O}_2 \\xrightarrow{\\text{Matrix / Cristae}} 3\\text{CO}_2 + 3\\text{NADH} + \\text{FADH}_2 + \\text{ATP} \\text{ (net~32~per~glucose)}$$',
      inputs: ['Pyruvate / Fatty Acids', 'Oxygen (O2) oxygen gas as terminal acceptor', 'ADP + Inorganic Phosphate (Pi)'],
      outputs: ['Adenosine Triphosphate (ATP - 30 to 32 units)', 'Carbon Dioxide (CO2) metabolic waste gas', 'Water (H2O) synthesized at ETC end'],
      reactionKeywords: ['mitochondria', 'krebs', 'etc', 'cycle', 'atp', 'succinate', 'respiration']
    },
    {
      id: 'cytosol',
      name: 'Cytosol (Cytoplasm)',
      roleTitle: 'Anaerobic Core: Glycolysis pathway',
      structure: 'Liquid jelly-like intercellular aqueous matrix containing dissolved ions, organic molecules, and a complex network of cytoskeletal scaffolding fibers.',
      metabolicRole: 'The cytosol is the primary metabolic crucible. It contains all the enzymes required for Glycolysis—an oxygen-independent 10-enzyme cascade that splits a single 6-carbon Glucose molecule into two 3-carbon Pyruvates, yielding an initial thermodynamic cash of 2 net ATP and 2 NADH. It mediates substrate-level phosphorylation and interfaces with mitochondria for fluid carbon exchange.',
      flowEquation: '$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 2\\text{NAD}^+ + 2\\text{ADP} + 2\\text{P}_i \\xrightarrow{\\text{Cytosol Enzymes}} 2\\text{Pyruvate} + 2\\text{NADH} + 2\\text{H}^+ + 2\\text{H}_2\\text{O} + 2\\text{ATP}$$',
      inputs: ['Glucose (C6H12O6)', 'NAD+ Coenzymes', 'ADP + Phosphate (Pi)'],
      outputs: ['Pyruvate (C3H3O3) to feed mitochondria', 'NADH high-energy electrons carrier', '2 Net ATP immediate energy'],
      reactionKeywords: ['glycolysis', 'glucose', 'pyruvate', 'atp', 'cytoplasm']
    },
    {
      id: 'chloroplast',
      name: 'Chloroplast',
      roleTitle: 'Autotrophic Sugar Factory: Photosynthesis / Calvin Cycle',
      structure: 'Double outer membrane wrapping rows of stacked thylakoid membranes (Grana) rich in green Chlorophyll pigment, bathed in an aqueous Stroma fluid.',
      metabolicRole: 'Only present in the **Tree/Plant cell**. Chloroplasts synthesize glucose from solar energy. Inside the thylakoids, chlorophyll absorbs orange-red and blue-violet light photons to split water molecules (photolysis), releasing hydrogen and $O_2$ waste, creating ADP-to-ATP charge. Inside the Stroma, the enzyme Rubisco conducts Carbon Fixation (Calvin Cycle), joining carbon dioxide into glucose chains.',
      flowEquation: '$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Photons} (h\\nu) \\xrightarrow{\\text{Chlorophyll & Rubisco}} \\text{C}_6\\text{H}_{12}\\text{O}_6 \\text{ (Glucose)} + 6\\text{O}_2$$',
      inputs: ['Carbon Dioxide (CO2)', 'Water (H2O)', 'Solar Photons (light energy)'],
      outputs: ['Glucose Sugar (high-density carbon storage)', 'Oxygen Gas (O2) released as vital byproduct'],
      reactionKeywords: ['photosynthesis', 'calvin', 'chlorophyll', 'light', 'rubisco', 'plant']
    },
    {
      id: 'membrane',
      name: 'Cell Membrane Portals',
      roleTitle: 'Selective Portals: Ion Pumps & Transporters',
      structure: 'Selectively permeable fluid-mosaic phospholipid bilayer studded with receptor glycoproteins and transmembrane protein active channels.',
      metabolicRole: 'Maintains electrochemical cellular homeostasis. Uses active transports (such as the Sodium-Potassium $Na^+/K^+$ ATPase pump) which consumes 1 ATP to eject 3 Sodium ions and draw in 2 Potassium ions, building a -70mV charge boundary crucial for animal muscle/muscle fibers and nerve tissue reaction. It also hosts GLUT transporters to take glucose inside the cell.',
      flowEquation: '$$3\\text{Na}^+_{\\text{inside}} + 2\\text{K}^+_{\\text{outside}} + \\text{ATP} + \\text{H}_2\\text{O} \\xrightarrow{Na^+/K^+\\text{ ATPase}} 3\\text{Na}^+_{\\text{outside}} + 2\\text{K}^+_{\\text{inside}} + \\text{ADP} + \\text{P}_i$$',
      inputs: ['Extracellular Glucose', 'Intercellular Sodium Cations (Na+)', 'ATP fuel'],
      outputs: ['Intracellular Glucose (for glycolysis)', 'Intercellular Potassium Cations (K+)', 'Electrochemical driving potential (-70mV)'],
      reactionKeywords: ['sodium', 'potassium', 'membrane', 'pump', 'glut', 'transport']
    },
    {
      id: 'nucleus',
      name: 'Nucleus',
      roleTitle: 'Information Vault: Governance & Transcription',
      structure: 'Enclosed by a double-layered Nuclear Envelope with selective pores. Contains chromatin DNA strands wound tight around histone spool proteins.',
      metabolicRole: 'The nucleus regulates metabolic speed. It maintains DNA blueprints for all metabolic enzymes (like Rubisco, Hexokinase, or ATP Synthase). When cellular energy is low, transcription pathways synthesize mRNA transcripts of respiratory genetic structures, which travel through nuclear pores to ribosomes to be parsed into active metabolic enzymes.',
      flowEquation: '$$\\text{DNA Gene} \\xrightarrow{\\text{RNA Polymerase II}} \\text{mRNA Blueprint} \\xrightarrow{\\text{Nuclear Pore}} \\text{Cytosol Ribosome}$$',
      inputs: ['Nucleoside Triphosphates (ATP, GTP, CTP, UTP)', 'Transcription Signaling Transcription factors'],
      outputs: ['mRNA templates (for enzyme proteins synthesis)', 'Ribosomal subunits'],
      reactionKeywords: ['nucleus', 'dna', 'rna', 'transcription', 'chromatin']
    },
    {
      id: 'vacuole',
      name: 'Lysosome / Central Vacuole',
      roleTitle: 'Recycling & Turgor: Macro-Decomposition',
      structure: 'Acidic single-membrane sac ($pH \\sim 5.0$ in animals) or a giant membrane-vault (tonoplast) stretching up to 90% of the interior volume in tree plant cells.',
      metabolicRole: 'In animal skins (Human model), Lysosomes break down defective mitochondria (mitophagy) using acid hydrolases into amino acid monomers to salvage fuel. In tree trunks (Plantae model), the massive Central Vacuole accumulates potassium solute, absorbing surrounding water by osmosis to balloon outwards. This generates massive Turgor Pressure against the cellulose wall to make wooden tree stems stiff.',
      flowEquation: '$$\\text{Biopolymer (Starch, Proteins)} + \\text{H}_2\\text{O} \\xrightarrow{\\text{Acid Hydrolases / Hydration}} \\text{Monomers (Glucose, Free Amino Acids)}$$',
      inputs: ['Autophagic Defective Organelles / Starch polymers', 'Water (H2O)', 'Acidity protons (H+ ion)'],
      outputs: ['Soluble sugar monomers (for instant glycolysis)', 'Free Amino Acids', 'High Turgor standing force (plants only)'],
      reactionKeywords: ['lysosome', 'vacuole', 'starch', 'chitin', 'enzyme', 'turgor']
    }
  ], []);

  // Filter nodes based on active taxonomy group and text searches
  const filteredNodes = useMemo(() => {
    return taxonomyData.filter(node => {
      const matchesGroup = activeGroup === 'All' || node.group === activeGroup;
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesGroup;

      const matchesText = 
        node.name.toLowerCase().includes(query) ||
        node.title.toLowerCase().includes(query) ||
        node.structure.toLowerCase().includes(query) ||
        node.function.toLowerCase().includes(query) ||
        node.atomsMolecules.some(am => 
          am.name.toLowerCase().includes(query) || 
          am.formulaOrSymbol.toLowerCase().includes(query) ||
          am.structure.toLowerCase().includes(query) ||
          am.function.toLowerCase().includes(query)
        );

      return matchesGroup && matchesText;
    });
  }, [taxonomyData, activeGroup, searchQuery]);

  // Expand or collapse nodes
  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedNodes(next);
  };

  // Capture selected organelle's metabolic data card
  const selectedOrganelle = useMemo(() => {
    let organelle = organelleDataList.find(o => o.id === selectedOrganelleId);
    // Safety check for animal/plant chloroplast toggle
    if (organelle?.id === 'chloroplast' && cellMapType === 'human') {
      return organelleDataList.find(o => o.id === 'mitochondria')!;
    }
    return organelle || organelleDataList[0];
  }, [organelleDataList, selectedOrganelleId, cellMapType]);

  // Dynamically hook relevant biochemical reactions from our reaction catalogs
  const getRelevantReactions = (keywords: string[]): ReactionItem[] => {
    const all = getAllReactions();
    return all.filter(rx => {
      const rxText = (rx.name + " " + rx.equation + " " + rx.subCategory + " " + rx.description).toLowerCase();
      return keywords.some(kw => rxText.includes(kw.toLowerCase()));
    }).slice(0, 3);
  };

  const getTaxonReactions = (node: TaxonomyNode) => {
    return getRelevantReactions(node.reactionsKeywords);
  };

  const organelleMatchedReactions = useMemo(() => {
    return getRelevantReactions(selectedOrganelle.reactionKeywords);
  }, [selectedOrganelle]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#030305]">
      
      {/* Prime Header Sub-Tab selector */}
      <div className="bg-[#050508] border-b border-white/5 px-4 pt-3 flex items-center justify-between gap-4 select-none shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-2 text-[9.5px] font-mono tracking-widest uppercase border-t-2 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'border-cyan-400 bg-white/5 text-cyan-200 font-bold'
                : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Cellular Metabolic Map (2D)
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-2 text-[9.5px] font-mono tracking-widest uppercase border-t-2 transition-all cursor-pointer ${
              activeTab === 'tree'
                ? 'border-cyan-400 bg-white/5 text-cyan-200 font-bold'
                : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Organ Taxonomy Tree
          </button>
        </div>
        <div className="text-[10px] font-mono text-cyan-400/60 hidden md:block select-none font-bold">
          BIOPHYSICAL CORE // {activeTab === 'map' ? 'METABOLIC SIMULATION' : 'TAXONOMY'}
        </div>
      </div>

      {activeTab === 'map' ? (
        /* Cellular Interactive Metabolic 2D Map */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 divide-y md:divide-y-0 md:divide-x divide-white/5">
          
          {/* Left Block: SVG Interactive cellular diagram */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between bg-[#040407]/40 relative min-h-0 select-none">
            
            {/* Top Toggle: Animal Cell vs Plant Cell */}
            <div className="flex justify-between items-center bg-[#07070b] border border-white/5 p-2 rounded-sm gap-4">
              <span className="text-[9px] font-mono text-white/40 uppercase">Eukaryotic Cell Model:</span>
              <div className="flex gap-1.5 font-mono text-[8.5px]">
                <button
                  onClick={() => {
                    setCellMapType('human');
                    if (selectedOrganelleId === 'chloroplast') setSelectedOrganelleId('mitochondria');
                  }}
                  className={`px-2 py-1 rounded transition-all uppercase cursor-pointer border ${
                    cellMapType === 'human'
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]'
                      : 'bg-black/40 border-white/5 text-white/40 hover:text-white/80'
                  }`}
                >
                  Human Cell (Animalia)
                </button>
                <button
                  onClick={() => setCellMapType('tree')}
                  className={`px-2 py-1 rounded transition-all uppercase cursor-pointer border ${
                    cellMapType === 'tree'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : 'bg-black/40 border-white/5 text-white/40 hover:text-white/80'
                  }`}
                >
                  Tree Cell (Plantae)
                </button>
              </div>
            </div>

            {/* Central SVG Interactive Canvas */}
            <div className="my-auto py-2 flex items-center justify-center relative w-full h-[280px] shrink-0">
              {/* Decorative coordinate map lines */}
              <div className="absolute top-2 left-2 text-[7.5px] font-mono text-cyan-500/20 select-none leading-none">
                SYS_LOC: C0_{cellMapType.toUpperCase()}_EUKARYA<br/>
                COORD_GRID: 500x400
              </div>

              {/* Floating indicators for metabolic transport paths */}
              <div className="absolute bottom-2 left-2 text-[7.5px] font-mono text-white/30 flex items-center gap-2 select-none">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-ping"></span> Glucose (C6)</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-400 rounded-sm"></span> Pyruvate (C3)</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span> ATP Energy</span>
              </div>

              <svg 
                viewBox="0 0 500 400" 
                className="w-full max-w-[420px] h-full overflow-visible transition-all drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]"
              >
                <defs>
                  {/* Subtle neon glowing filters */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. PLANT CELL CELL WALL (Plantae Cellulose Outline) - only shown for plant */}
                {cellMapType === 'tree' && (
                  <g className="transition-all animate-fade-in">
                    <rect 
                      x="20" y="20" width="460" height="360" rx="35" ry="35"
                      fill="none" stroke="#10b981" strokeWidth="6" strokeOpacity="0.45"
                      className="transition-all"
                    />
                    <rect 
                      x="26" y="26" width="448" height="348" rx="29" ry="29"
                      fill="#0d2a1f" fillOpacity="0.12" stroke="#10b981" strokeWidth="2" strokeOpacity="0.25"
                    />
                    {/* Cellulose plant fiber threads representation */}
                    <path d="M 22,50 L 50,22 M 450,22 L 478,50 M 22,350 L 50,378 M 450,378 L 478,350" stroke="#10b981" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="3 3"/>
                  </g>
                )}

                {/* 2. CELL MEMBRANE OVAL (Eukaryotic boundary) */}
                <ellipse 
                  cx="250" cy="200" rx="205" ry="155" 
                  fill={cellMapType === 'human' ? '#070a16' : '#04100c'} 
                  fillOpacity="0.5"
                  stroke={cellMapType === 'human' ? '#22d3ee' : '#059669'} 
                  strokeWidth={cellMapType === 'human' ? '4.5' : '3'} 
                  className="transition-all duration-300"
                  strokeDasharray="1500"
                />
                
                {/* 3. FLUID CYTOSOL AREA (Clickable back matrix) */}
                <ellipse 
                  cx="250" cy="200" rx="195" ry="145" 
                  fill="transparent" 
                  className="cursor-pointer"
                  onClick={() => setSelectedOrganelleId('cytosol')}
                  onMouseEnter={() => setHoveredOrganelle('Cytosol / Cytoplasm')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                />

                {/* 4. ACTIVE FLOW LINES (Particles traveling) */}
                {/* Glucose flow enters top portal, goes to Cytosol for glycolysis breakdown */}
                <path 
                  id="path-glucose"
                  d="M 250,50 L 250,110 Q 230,120 180,125" 
                  fill="none" stroke="#22d3ee" strokeWidth="2" strokeOpacity="0.25" 
                  strokeDasharray="4 8"
                  style={{ animation: 'flowParticle 3s linear infinite' }}
                />
                
                {/* Pyruvate flow goes to Mitochondrian Matrix */}
                <path 
                  id="path-pyruvate"
                  d="M 180,125 Q 260,110 335,115" 
                  fill="none" stroke="#c084fc" strokeWidth="2.5" strokeOpacity="0.3" 
                  strokeDasharray="5 10"
                  style={{ animation: 'flowParticle 2.2s linear infinite' }}
                />

                {/* ATP outputs flood the cell from mitochondria */}
                <path 
                  id="path-atp"
                  d="M 360,140 Q 280,180 230,200" 
                  fill="none" stroke="#eab308" strokeWidth="1.8" strokeOpacity="0.3" 
                  strokeDasharray="4 6"
                  style={{ animation: 'flowParticle 1.8s linear infinite' }}
                />

                {cellMapType === 'tree' && (
                  /* Sunlight hitting chloroplast and releasing Glucose back down to Cytosol */
                  <path 
                    d="M 100,50 Q 80,110 110,130" 
                    fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.35" 
                    strokeDasharray="4 8"
                    style={{ animation: 'flowParticle 2s linear infinite' }}
                  />
                )}

                {/* 5. SELECTIVE CELL MEMBRANE PORTAL CODES */}
                <g 
                  onClick={() => setSelectedOrganelleId('membrane')}
                  onMouseEnter={() => setHoveredOrganelle('Cell Membrane Portals')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedOrganelleId === 'membrane' ? 'filter inline-block' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ filter: selectedOrganelleId === 'membrane' ? 'url(#glow)' : 'none' }}
                >
                  {/* Gate 1 (Top) */}
                  <rect x="238" y="25" width="24" height="18" rx="4" fill="#f59e0b" stroke="#fff" strokeWidth="1"/>
                  <path d="M 250,15 L 250,45" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3 3"/>
                  
                  {/* Gate 2 (Bottom Left) */}
                  <rect x="75" y="270" width="18" height="24" rx="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" transform="rotate(35 84 282)"/>
                  
                  {/* Outer halo */}
                  <ellipse cx="250" cy="200" rx="205" ry="155" fill="none" stroke="#f59e0b" strokeWidth="4" strokeOpacity={selectedOrganelleId === 'membrane' ? '0.6' : '0.1'} />
                </g>

                {/* 6. NUCLEUS Blue Core Block */}
                <g 
                  onClick={() => setSelectedOrganelleId('nucleus')}
                  onMouseEnter={() => setHoveredOrganelle('Nucleus')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  className="cursor-pointer group"
                >
                  {/* Nuclear Envelope outer ring */}
                  <circle 
                    cx="205" cy="215" r="48" 
                    fill="#1e3a8a" fillOpacity="0.4"
                    stroke="#2563eb" strokeWidth={selectedOrganelleId === 'nucleus' ? '3.5' : '2'} 
                    strokeDasharray="8 4"
                    className="transition-all duration-300 transform origin-[205px_215px] group-hover:scale-105"
                  />
                  {/* Nucleolus dense center */}
                  <circle 
                    cx="195" cy="205" r="16" 
                    fill="#3b82f6" 
                    filter={selectedOrganelleId === 'nucleus' ? 'url(#glow)' : 'none'}
                    className="transition-all duration-300"
                  />
                  {/* Chromatins visual ribbons inside */}
                  <path d="M 180,225 Q 200,210 215,225" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="4 4"/>
                  <path d="M 215,200 Q 225,215 210,230" fill="none" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.5"/>
                </g>

                {/* 7. ENDOPLASMIC RETICULUM (Blue channels weaving) */}
                <path 
                  d="M 155,205 Q 130,220 115,195 Q 100,170 125,160 M 165,245 Q 140,270 120,250" 
                  fill="none" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.45"
                  className="pointer-events-none select-none"
                />
                
                {/* 8. MITOCHONDRIA Bean Core (Neon purple) */}
                <g 
                  onClick={() => setSelectedOrganelleId('mitochondria')}
                  onMouseEnter={() => setHoveredOrganelle('Mitochondria')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  className="cursor-pointer group"
                >
                  {/* Mitochondria 1 (Top-Right) */}
                  <g transform="translate(355, 125) rotate(-15)">
                    {/* Outer membrane */}
                    <ellipse 
                      cx="0" cy="0" rx="35" ry="20" 
                      fill="#581c87" fillOpacity="0.4"
                      stroke="#a855f7" strokeWidth={selectedOrganelleId === 'mitochondria' ? '3' : '1.5'}
                      className="transition-all duration-300"
                    />
                    {/* Folding Inner cristae lines */}
                    <path 
                      d="M -25,0 Q -15,-10 -10,0 Q 0,10 5,0 Q 15,-10 25,0" 
                      fill="none" stroke="#c084fc" strokeWidth="2.5" 
                      className="transition-all"
                      filter={selectedOrganelleId === 'mitochondria' ? 'url(#glow)' : 'none'}
                    />
                    <path d="M -18,-5 L -10,10 M 2, -7 L 10,8" stroke="#d8b4fe" strokeWidth="1" strokeOpacity="0.5" />
                  </g>

                  {/* Mitochondria 2 (Bottom-Right) */}
                  <g transform="translate(340, 275) rotate(25)">
                    <ellipse 
                      cx="0" cy="0" rx="31" ry="18" 
                      fill="#581c87" fillOpacity="0.3"
                      stroke="#a855f7" strokeWidth={selectedOrganelleId === 'mitochondria' ? '3' : '1.5'}
                      className="transition-all duration-300"
                    />
                    <path d="M -21,0 Q -10,8 0,0 Q 10,-8 21,0" fill="none" stroke="#c084fc" strokeWidth="2.5" />
                  </g>

                  {/* Dynamic hovering glow on selected mitochondria */}
                  {selectedOrganelleId === 'mitochondria' && (
                    <ellipse cx="355" cy="125" rx="42" ry="26" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 3" strokeOpacity="0.5" className="animate-spin" style={{ animationDuration: '8s' }}/>
                  )}
                </g>

                {/* 9. LYSOSOME Or GIANT VACUOLE depend on type */}
                {cellMapType === 'human' ? (
                  /* Lysosome (Animal mode) */
                  <g
                    onClick={() => setSelectedOrganelleId('vacuole')}
                    onMouseEnter={() => setHoveredOrganelle('Lysosome (Hydrolyzer)')}
                    onMouseLeave={() => setHoveredOrganelle(null)}
                    className="cursor-pointer group"
                    transform="translate(295, 200)"
                  >
                    <circle 
                      r="16" 
                      fill="#78350f" fillOpacity="0.4"
                      stroke="#f59e0b" strokeWidth={selectedOrganelleId === 'vacuole' ? '3' : '1.5'}
                      className="transition-all duration-300"
                    />
                    {/* Active digestive hydrolyzer dots inside */}
                    <circle cx="-5" cy="-3" r="1.5" fill="#f59e0b"/>
                    <circle cx="4" cy="5" r="1" fill="#fbbf24"/>
                    <circle cx="3" cy="-5" r="1.2" fill="#fff"/>
                  </g>
                ) : (
                  /* Giant Central Vacuole (Plant/Tree mode) */
                  <g
                    onClick={() => setSelectedOrganelleId('vacuole')}
                    onMouseEnter={() => setHoveredOrganelle('Giant Central Vacuole (Turgor)')}
                    onMouseLeave={() => setHoveredOrganelle(null)}
                    className="cursor-pointer group"
                    transform="translate(275, 210) rotate(-10)"
                  >
                    {/* Expansive aqueous tonoplast membrane */}
                    <rect 
                      x="-45" y="-55" width="95" height="110" rx="35"
                      fill="#0284c7" fillOpacity="0.18"
                      stroke="#38bdf8" strokeWidth={selectedOrganelleId === 'vacuole' ? '3.5' : '1.8'}
                      className="transition-all duration-300"
                    />
                    {/* Water molecules / fluid ripples representing 90% space pressure */}
                    <path d="M -25,25 Q -10,30 20,25" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.4"/>
                    <path d="M -15,-20 Q 10,-15 30,-20" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.4"/>
                    
                    {/* High internal pressure outward forces visual arrow indicator */}
                    {selectedOrganelleId === 'vacuole' && (
                      <g stroke="#0ea5e9" strokeWidth="1.5" fill="none" className="animate-pulse">
                        <path d="M 0,-15 L 0,-35 M -5,-30 L 0,-35 L 5,-30"/>
                        <path d="M 0,15 L 0,35 M -5,30 L 0,35 L 5,30"/>
                        <path d="M -15,0 L -30,0 M -25,-5 L -30,0 L -25,5"/>
                        <path d="M 15,0 L 30,0 M 25,-5 L 30,0 L 25,5"/>
                      </g>
                    )}
                  </g>
                )}

                {/* 10. CHLOROPLAST autotrophic sugar harvesters - Plantae exclusive */}
                {cellMapType === 'tree' && (
                  <g 
                    onClick={() => setSelectedOrganelleId('chloroplast')}
                    onMouseEnter={() => setHoveredOrganelle('Chloroplast')}
                    onMouseLeave={() => setHoveredOrganelle(null)}
                    className="cursor-pointer group animate-fade-in"
                  >
                    {/* Chloroplast 1 (Top-Left) */}
                    <g transform="translate(125, 110) rotate(15)">
                      <ellipse 
                        cx="0" cy="0" rx="35" ry="20" 
                        fill="#064e3b" fillOpacity="0.45"
                        stroke="#10b981" strokeWidth={selectedOrganelleId === 'chloroplast' ? '3.5' : '1.5'}
                        className="transition-all duration-300"
                      />
                      {/* Thylakoids piles representation (stacked coins) */}
                      <rect x="-18" y="-8" width="9" height="15" rx="1.5" fill="#34d399" stroke="#10b981" strokeWidth="0.5"/>
                      <rect x="-4" y="-11" width="9" height="18" rx="1.5" fill="#34d399" stroke="#10b981" strokeWidth="0.5"/>
                      <rect x="10" y="-7" width="9" height="14" rx="1.5" fill="#34d399" stroke="#10b981" strokeWidth="0.5"/>
                    </g>

                    {/* Chloroplast 2 (Bottom-Left) */}
                    <g transform="translate(120, 290) rotate(-20)">
                      <ellipse 
                        cx="0" cy="0" rx="32" ry="18" 
                        fill="#064e3b" fillOpacity="0.35"
                        stroke="#10b981" strokeWidth={selectedOrganelleId === 'chloroplast' ? '3.5' : '1.5'}
                        className="transition-all duration-300"
                      />
                      <rect x="-15" y="-6" width="8" height="12" rx="1" fill="#34d399"/>
                      <rect x="-2" y="-10" width="8" height="16" rx="1" fill="#34d399"/>
                      <rect x="11" y="-5" width="8" height="10" rx="1" fill="#34d399"/>
                    </g>
                  </g>
                )}

                {/* 11. CYTOSOL GLOW SPOT (Hexagonal Glycolysis target) */}
                <g 
                  onClick={() => setSelectedOrganelleId('cytosol')}
                  onMouseEnter={() => setHoveredOrganelle('Cytosol / Glycolysis')}
                  onMouseLeave={() => setHoveredOrganelle(null)}
                  className="cursor-pointer group"
                  transform="translate(160, 135)"
                >
                  <polygon 
                    points="0,-12 11,-5 11,8 0,15 -11,8 -11,-5" 
                    fill="#155e75" fillOpacity="0.4"
                    stroke="#22d3ee" strokeWidth={selectedOrganelleId === 'cytosol' ? '3' : '1.5'}
                    className="transition-all duration-300"
                    filter={selectedOrganelleId === 'cytosol' ? 'url(#glow)' : 'none'}
                  />
                  <circle r="4" fill="#06b6d4" className="animate-ping" style={{ animationDuration: '3s' }}/>
                </g>

                {/* Radar target outline for currently hovered or selected organelle */}
                {selectedOrganelleId && (
                  <g className="pointer-events-none">
                    {selectedOrganelleId === 'mitochondria' && <circle cx="355" cy="125" r="41" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="4 4" />}
                    {selectedOrganelleId === 'cytosol' && <circle cx="160" cy="135" r="22" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" />}
                    {selectedOrganelleId === 'nucleus' && <circle cx="205" cy="215" r="54" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" />}
                    {selectedOrganelleId === 'vacuole' && cellMapType === 'human' && <circle cx="295" cy="200" r="22" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />}
                    {selectedOrganelleId === 'vacuole' && cellMapType === 'tree' && <circle cx="275" cy="210" r="70" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />}
                    {selectedOrganelleId === 'chloroplast' && cellMapType === 'tree' && <circle cx="125" cy="110" r="41" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" />}
                  </g>
                )}
              </svg>

              {/* Float-over Radar Tooltip HUD */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {hoveredOrganelle ? (
                  <div className="bg-[#050508]/90 border border-cyan-500/30 px-3 py-1 text-[9px] font-mono rounded text-cyan-300 animate-pulse tracking-widest uppercase">
                    TARGET: {hoveredOrganelle}
                  </div>
                ) : (
                  <div className="bg-[#030306]/60 border border-white/5 px-3 py-1 text-[8.5px] font-mono rounded text-white/30 lowercase select-none">
                    hover structures on the cell radar map
                  </div>
                )}
              </div>
            </div>

            {/* Quick Map Guide card */}
            <div className="bg-[#07070a] border border-white/5 p-3 rounded-sm text-[9.5px] font-mono leading-relaxed text-white/50">
              <span className="text-white/80 font-bold block mb-1">💡 Real-time Cellular Energy Pathways:</span>
              <p className="font-sans text-[10px]">
                Click on any highlighted cellular target (Portals, Glycolysis, Nucleus, or the Mitochondria/Chloroplast) to inspect their metabolic role. Watch the animated streams: Glucose <span className="text-cyan-400">●</span> breaks down inside Cytosol to Pyruvate <span className="text-purple-400">●</span>, fueling the Mitochondria to output massive ATP <span className="text-yellow-400">●</span> energy.
              </p>
            </div>

          </div>

          {/* Right Block: Metabolic Inspector & Reaction Catalyst */}
          <div className="w-full md:w-[280px] bg-[#050508]/80 flex flex-col overflow-hidden min-h-0 divide-y divide-white/5 shrink-0 select-text">
            
            {/* Inspector Profile Header */}
            <div className="p-4 bg-[#07070b]/60 space-y-1">
              <div className="flex justify-between items-start gap-1">
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Organelle Inspector //</span>
                <span className="text-[7.5px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 px-1 py-0.5 rounded-sm uppercase font-bold tracking-wider select-none">Mode: {cellMapType}</span>
              </div>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{selectedOrganelle.name}</h2>
              <span className="text-[9px] font-mono text-cyan-300/80 font-semibold">{selectedOrganelle.roleTitle}</span>
            </div>

            {/* Comprehensive Descriptions */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[9px] leading-relaxed scrollbar-thin">
              
              {/* Physical structure details */}
              <div className="space-y-1">
                <span className="text-[7.5px] text-white/30 uppercase tracking-widest block select-none">Physical Structure</span>
                <p className="text-white/70 font-sans text-[10px] leading-normal">{selectedOrganelle.structure}</p>
              </div>

              {/* Metabolic energy role description */}
              <div className="space-y-1">
                <span className="text-[7.5px] text-white/30 uppercase tracking-widest block select-none">Metabolic Energy Role</span>
                <p className="text-white/70 font-sans text-[10px] leading-normal">{selectedOrganelle.metabolicRole}</p>
              </div>

              {/* Thermochemical Input vs Output Lists */}
              <div className="grid grid-cols-2 gap-2 text-[8.5px]">
                <div className="bg-black/40 border border-white/5 p-2 rounded-sm space-y-1">
                  <span className="text-[#38bdf8] font-bold block select-none">⬇ INPUTS</span>
                  <ul className="list-disc pl-3 text-white/60 space-y-0.5 font-sans leading-none">
                    {selectedOrganelle.inputs.map((inp, i) => (
                      <li key={i} className="text-[9.5px] truncate" title={inp}>{inp}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-black/40 border border-white/5 p-2 rounded-sm space-y-1">
                  <span className="text-[#fbbf24] font-bold block select-none">⬆ OUTPUTS</span>
                  <ul className="list-disc pl-3 text-white/60 space-y-0.5 font-sans leading-none">
                    {selectedOrganelle.outputs.map((out, i) => (
                      <li key={i} className="text-[9.5px] truncate" title={out}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* KaTeX Thermodynamic Flow Equation */}
              <div className="space-y-1.5 selection:bg-cyan-500/20">
                <span className="text-[7.5px] text-white/30 uppercase tracking-widest block select-none">Thermodynamic Equation</span>
                <div className="bg-black/60 border border-white/5 p-2.5 rounded-sm overflow-x-auto text-white leading-relaxed markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}>
                    {selectedOrganelle.flowEquation}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Matched biochemical reactions */}
              {organelleMatchedReactions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[7.5px] text-cyan-400 uppercase tracking-widest block select-none font-bold">Matched Reactions in System</span>
                  <div className="space-y-2 select-none">
                    {organelleMatchedReactions.map((rx) => (
                      <div key={rx.id} className="bg-black/30 border border-white/5 p-2.5 rounded-sm hover:border-cyan-500/10 transition-colors space-y-1.5">
                        <span className="text-[9.5px] text-white font-bold block leading-none">{rx.name}</span>
                        <code className="text-[8px] text-cyan-300 font-bold bg-black/50 px-1 py-0.5 rounded border border-white/5 block select-all">
                          {rx.equation}
                        </code>
                        {onTriggerReactionInChamber && (
                          <button
                            onClick={() => onTriggerReactionInChamber(rx)}
                            className="w-full bg-cyan-950/30 border border-cyan-500/25 hover:bg-cyan-950/60 hover:border-cyan-400 text-cyan-300 font-mono text-[8px] uppercase tracking-wider py-1 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-2 h-2 fill-cyan-400" /> Trigger in Chamber
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* AI Probe buttons for deep metabolic exploration */}
            <div className="p-4 bg-[#07070c]/50">
              <button
                onClick={() => {
                  const query = `Provide an advanced thermodynamic molecular lesson focusing on ${selectedOrganelle.name} (${selectedOrganelle.roleTitle}) metabolic pathways. Clearly formulate all biochemical cycles (such as Glycolysis, Krebs Cycle, or Calvin Cycle) using complete LaTeX balanced chemical math equations, listing inputs, outputs, enthalpy levels, and ATP equivalents.`;
                  onAskAI(query);
                }}
                className="w-full py-2 bg-cyan-950/15 border border-cyan-500/25 hover:bg-cyan-950/30 text-cyan-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(6,182,212,0.12)]"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" /> Deep AI Quiz on {selectedOrganelle.name}
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Taxonomy Tree list of elements */
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#030305]">
          
          {/* Taxonomy filter deck */}
          <div className="bg-[#050508] border-b border-white/5 p-4 shrink-0 space-y-3 select-none">
            {/* Dynamic Search filter */}
            <div className="flex items-center bg-[#030305] border border-white/10 px-3 py-1.5 rounded-sm hover:border-cyan-500/30 focus-within:border-cyan-500/60 transition-all shadow-inner">
              <Dna className="w-3.5 h-3.5 text-cyan-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cells, tissue structures, organs, or molecules..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[11px] font-mono text-white placeholder:text-white/20 py-0.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-white/40 hover:text-white/80 text-[10px] font-mono select-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Categories tab */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {['All', 'Cell', 'Tissue', 'Organ System'].map((grp) => {
                const isSelected = activeGroup === grp;
                return (
                  <button
                    key={grp}
                    onClick={() => setActiveGroup(grp as any)}
                    className={`px-2.5 py-1 rounded text-[8.5px] font-mono tracking-wider uppercase whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold'
                        : 'bg-black/30 border-white/5 text-white/40 hover:border-cyan-500/20 hover:text-white/80'
                    }`}
                  >
                    {grp === 'All' ? 'ALL LEVELS' : `${grp}s`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accordion List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
            {filteredNodes.length === 0 ? (
              <div className="text-center py-10 font-mono text-xs text-white/30 border border-dashed border-white/5 rounded p-4">
                No structures or chemical adapters match your search.
              </div>
            ) : (
              filteredNodes.map((node) => {
                const isExpanded = expandedNodes.has(node.id);
                const matchedReactions = getTaxonReactions(node);

                return (
                  <div
                    key={node.id}
                    className={`border rounded-sm transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-cyan-500/30 bg-[#07090b]/40 shadow-[0_0_15px_rgba(34,211,238,0.03)]'
                        : 'border-white/5 bg-black/20 hover:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => toggleNode(node.id)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-sm bg-[#090b0e] border border-white/5 text-cyan-400 ${
                          isExpanded ? 'border-cyan-500/20 text-cyan-300' : ''
                        }`}>
                          {node.group === 'Cell' && <Orbit className="w-3.5 h-3.5" />}
                          {node.group === 'Tissue' && <Layers className="w-3.5 h-3.5" />}
                          {node.group === 'Organ System' && <Activity className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono font-bold text-white block truncate leading-relaxed">
                            {node.title}
                          </span>
                          <span className="text-[9px] font-mono text-white/40 block truncate leading-none mt-0.5">
                            {node.subtitle}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      />
                    </div>

                    {/* Extended Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1.5 border-t border-white/5 space-y-4 font-mono text-[9.5px] leading-relaxed select-text animate-fade-in text-white/80">
                        
                        {/* Structure & Function */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-black/40 p-3 rounded-sm border border-white/5 space-y-1">
                            <span className="text-[7.5px] text-cyan-400 uppercase tracking-wider font-bold block select-none">Physical Structure</span>
                            <p className="text-white/70 font-sans text-[10px] leading-normal">{node.structure}</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-sm border border-white/5 space-y-1">
                            <span className="text-[7.5px] text-cyan-400 uppercase tracking-wider font-bold block select-none">Biological Function</span>
                            <p className="text-white/70 font-sans text-[10px] leading-normal">{node.function}</p>
                          </div>
                        </div>

                        {/* Atomic Composition */}
                        <div className="space-y-2">
                          <span className="text-[7.5px] text-cyan-400 uppercase tracking-widest font-bold block select-none">
                            Atomic &amp; Molecular Composition
                          </span>
                          <div className="grid grid-cols-1 gap-2.5">
                            {node.atomsMolecules.map((am, idx) => (
                              <div key={idx} className="bg-black/65 border border-white/5 rounded-sm p-3 relative hover:border-cyan-500/10 transition-colors">
                                <span className={`absolute right-3.5 top-3.5 px-1.5 py-0.5 rounded-full text-[7.5px] uppercase font-bold tracking-wider select-none ${
                                  am.type === 'atom' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20' : 'bg-purple-950/40 text-purple-400 border border-purple-500/10'
                                }`}>
                                  {am.type}
                                </span>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="text-[10px] text-white font-bold">{am.name}</span>
                                  <span className="text-[9.5px] text-cyan-300 font-bold bg-[#090c10] px-1.5 py-0.5 rounded-sm border border-white/5">{am.formulaOrSymbol}</span>
                                </div>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px] text-white/60">
                                  <div>
                                    <span className="font-bold text-white/30 text-[8px] uppercase block select-none">Structure:</span>
                                    <span className="font-sans leading-normal">{am.structure}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold text-white/30 text-[8px] uppercase block select-none">Function:</span>
                                    <span className="font-sans leading-normal">{am.function}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Integrated Reactions */}
                        {matchedReactions.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[7.5px] text-cyan-400 uppercase tracking-widest font-bold block select-none">
                              Involved Biochemical Reactions
                            </span>
                            <div className="space-y-2">
                              {matchedReactions.map((rx) => (
                                <div key={rx.id} className="bg-black/30 hover:bg-black/50 border border-white/5 rounded-sm p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
                                  <div className="min-w-0">
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                      <span className="text-[10px] text-white font-bold">{rx.name}</span>
                                      <span className="text-[8.5px] text-purple-400 uppercase font-semibold text-[7.5px] tracking-wider">({rx.subCategory})</span>
                                    </div>
                                    <span className="text-[9px] text-cyan-300 font-bold font-mono mt-1 block select-all bg-black/60 px-2 py-1 rounded-sm border border-white/5 w-fit">
                                      {rx.equation}
                                    </span>
                                    <p className="text-[9px] text-white/50 font-sans mt-1 leading-normal">{rx.description}</p>
                                  </div>
                                  {onTriggerReactionInChamber && (
                                    <button
                                      onClick={() => onTriggerReactionInChamber(rx)}
                                      className="shrink-0 self-end md:self-center bg-cyan-950/30 border border-cyan-500/25 hover:bg-cyan-950/60 hover:border-cyan-400 text-cyan-300 font-mono text-[8.5px] uppercase tracking-wider py-1 px-2.5 rounded-sm transition-all focus:outline-none flex items-center gap-1 cursor-pointer"
                                    >
                                      <Zap className="w-2.5 h-2.5 fill-cyan-400" /> Trigger in Chamber
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Lesson */}
                        <div className="pt-2 select-none">
                          <button
                            onClick={() => {
                              const query = `Provide a full atom, cell, and human-experience lesson about ${node.title}. Explain the detailed molecular architecture of its components (such as ${node.atomsMolecules.map(am => am.name).join(', ')}) and write all relevant biochemical equations using LaTeX.`;
                              onAskAI(query);
                            }}
                            className="w-full py-2 rounded-sm bg-cyan-950/15 border border-cyan-500/25 hover:bg-cyan-950/30 text-cyan-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                          >
                            <Sparkles className="w-3 h-3 text-cyan-400" /> Consult Spacetime AI on {node.name}
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}
