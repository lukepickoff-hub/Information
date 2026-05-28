import { useState, useMemo } from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, Zap, HelpCircle, Activity, CheckCircle2 } from 'lucide-react';
import { REACTION_DOMAINS, ReactionDomain, ReactionItem } from '../data/reactionData';
import { useDashboardStore } from '../store/useDashboardStore';
import { DASHBOARD_DATA } from '../data/dashboardData';

const rxInvolvesObject = (rx: ReactionItem, objId: string): boolean => {
  const normObj = objId.toLowerCase();
  
  if (normObj === 'mitochondria') {
    return rx.id.startsWith('cell_pdh') || rx.id.includes('krebs') || rx.id.includes('etc') || rx.id.includes('beta_oxid');
  }
  if (normObj === 'cell') {
    return rx.id.startsWith('cell');
  }
  if (normObj === 'sun') {
    return rx.id.startsWith('star');
  }
  if (['earth', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'moon'].includes(normObj)) {
    return rx.id.startsWith('planet');
  }
  if (normObj === 'skeleton') {
    return rx.id.startsWith('tissue') || rx.id.includes('osteoclast') || rx.id.includes('collagen') || rx.id.includes('apatite');
  }
  if (normObj === 'human') {
    return rx.id.startsWith('organ') || rx.id.startsWith('animal') || rx.id.startsWith('tissue');
  }
  
  return rx.atoms.some(a => {
    const aName = a.name.toLowerCase();
    return aName.includes(normObj) || 
           (normObj.length === 1 && aName.includes(` ${normObj.toUpperCase()}`)) || 
           (normObj.length === 2 && aName.includes(` ${normObj.charAt(0).toUpperCase()}${normObj.charAt(1).toLowerCase()}`));
  }) || rx.equation.toLowerCase().includes(normObj);
};

export interface ReactionStep {
  label: string;
  type: 'barrier' | 'intermediate' | 'transduction' | 'equilibrium';
  energyChange?: string;
  description: string;
}

export function getReactionTimelineSteps(rxId: string, rxName: string, equation: string): ReactionStep[] {
  // Strip "-rec" from recommended keys
  const cleanId = rxId.replace('-rec', '');

  const database: Record<string, ReactionStep[]> = {
    star_pp1: [
      {
        label: "Electrostatic Barrier Crossing",
        type: "barrier",
        energyChange: "Activation: Ultra High",
        description: "Two protons (¹H) collide deep inside the stellar core at 15,000,000 Kelvin, overcoming absolute mutual Coulomb repulsion via extreme thermal collision speeds."
      },
      {
        label: "Weak Beta Conversion",
        type: "intermediate",
        energyChange: "Beta+ Transition",
        description: "The weak force converts an approaching proton into a neutron at the exact quantum interface, emitting a positron (e⁺) and an electron neutrino (νₑ)."
      },
      {
        label: "Positron Annihilation Spill",
        type: "transduction",
        energyChange: "+0.42 MeV Released",
        description: "The newly born positron instantly meets a free core plasma electron, annihilating together to disperse two thermalizing gamma-ray photons."
      },
      {
        label: "Deuteron Synthesis Peak",
        type: "equilibrium",
        energyChange: "Stable Isotopes",
        description: "A stable Deuterium nucleus (²H) reaches binding equilibrium, providing the critical foundation isotope for subsequent thermonuclear steps."
      }
    ],
    star_pp2: [
      {
        label: "Deuteron Thermal Swarm",
        type: "barrier",
        energyChange: "Activation: Medium",
        description: "A newly synthesized Deuterium nucleus (²H) encounters a free thermal proton (¹H) floating with energetic speeds inside the high-density solar core."
      },
      {
        label: "Strong Force Adhesion",
        type: "intermediate",
        energyChange: "Unstable Intermediate",
        description: "The Deuterium and proton touch, triggering short-range strong nuclear bonds that fuse the particles into a highly excited state of Helium-3."
      },
      {
        label: "Radiative Decay De-excitation",
        type: "transduction",
        energyChange: "+5.49 MeV Released",
        description: "The excited nucleus discharges its energetic surplus by firing off a high-frequency, non-thermal gamma-ray (γ) photon directly into the stellar body."
      },
      {
        label: "Stable Helium-3 Deposit",
        type: "equilibrium",
        energyChange: "³He Stable Ground",
        description: "The Helium-3 nucleus settles into a stable drift state, ready for subsequent molecular encounters in the main fusion sequence."
      }
    ],
    star_pp3a: [
      {
        label: "Helium-3 Dual Compression",
        type: "barrier",
        energyChange: "Activation: High",
        description: "Two Helium-3 nuclei drift through the dense stellar core and collide at close range, overcoming mutual electrostatic charges."
      },
      {
        label: "Unstable Beryllium-6 State",
        type: "intermediate",
        energyChange: "Unstable ⁶Be Intermediate",
        description: "The strong nuclear force triggers a brief, highly unstable structural union containing 4 protons and 2 neutrons."
      },
      {
        label: "Thermonuclear Cleaving",
        type: "transduction",
        energyChange: "+12.86 MeV Released",
        description: "The unstable configuration collapses into an incredibly stable Helium-4 alpha core, violently ejecting 2 excess protons."
      },
      {
        label: "Stable Alpha Ash System",
        type: "equilibrium",
        energyChange: "⁴He Ash Stable",
        description: "The Helium-4 nucleus drops as stable heavy ash, while the 2 ejected protons immediately recycle into the core fusion pool."
      }
    ],
    star_cno1: [
      {
        label: "Stellar Carbon Collision",
        type: "barrier",
        energyChange: "Core Excitation",
        description: "In stars heavier than 1.5 Solar Masses, a thermal proton penetrates the electromagnetic shield of a catalytic Carbon-12 nucleus."
      },
      {
        label: "Nitrogen-13 Synthesis",
        type: "intermediate",
        energyChange: "Unstable Synthesis",
        description: "The nuclear particles fuse to synthesize high-energy Nitrogen-13, an unstable intermediate state with tight bindings."
      },
      {
        label: "Gamma Wave Deflection",
        type: "transduction",
        energyChange: "+1.95 MeV Released",
        description: "Nitrogen-13 releases excess energy by emitting an intense gamma-ray (γ) quantum wave, transforming kinetic energy into radiation."
      },
      {
        label: "Catalyst Cycle Entrance",
        type: "equilibrium",
        energyChange: "¹³N Ground State",
        description: "The stable Nitrogen-13 nucleus prepares for beta-plus decay into Carbon-13, completing the initial segment of the CNO catalytic loop."
      }
    ],
    plant_photolysis: [
      {
        label: "Photon Shock Inception",
        type: "barrier",
        energyChange: "Excitation Peak",
        description: "Incident sunlight strikes the Photosystem II reaction center, forcing the P680 chlorophyll pair to eject a high-energy electron."
      },
      {
        label: "Oxygen-Evolving Active Stack",
        type: "intermediate",
        energyChange: "Catalytic Charge",
        description: "The electron-deficient P680+ center transfers charge to a nearby Manganese-Calcium cluster (Mn₄CaO₅), accumulating four oxidizing equivalents."
      },
      {
        label: "Covalent Splitting of Water",
        type: "transduction",
        energyChange: "Bond Scission",
        description: "The heavily charged manganese complex extracts electrons from two adjacent water (H₂O) molecules, splitting O-H single bonds."
      },
      {
        label: "Oxygen Outflow & Proton Heap",
        type: "equilibrium",
        energyChange: "Exergonic Release",
        description: "Oxygen gas (O₂) is discharged. Four protons are thrown into the thylakoid lumen, and electrons are guided into the electron transport chain."
      }
    ],
    plant_atp_synth: [
      {
        label: "Electrochemical Potential Build",
        type: "barrier",
        energyChange: "Proton Gradient",
        description: "Biological membrane pumps heap a massive electrochemical charge of protons (H⁺) inside the tight thylakoid lumen."
      },
      {
        label: "Mechanical Rotor Rotation",
        type: "intermediate",
        energyChange: "Rotor Torques",
        description: "Protons flow through the half-channels of the ATP synthase complex, neutralizing key amino-acid charges to spin the c-ring rotor."
      },
      {
        label: "Catalytic Compression Stress",
        type: "transduction",
        energyChange: "Mechanical Transfer",
        description: "The central spinning shaft mechanically deforms active sites in the F₁ head, squeezing ADP and Inorganic Phosphate together."
      },
      {
        label: "Anhydride Phosphate Captivation",
        type: "equilibrium",
        energyChange: "+30.5 kJ/mol Stored",
        description: "The intense physical compression forms a stable phosphoanhydride bond, storing cellular energy as synthesized ATP."
      }
    ],
    plant_rubisco: [
      {
        label: "RuBP Substrate Docking",
        type: "barrier",
        energyChange: "Activation Phase",
        description: "Ribulose 1,5-bisphosphate docks at the active site of the Rubisco enzyme and undergoes enolization, creating an enediol intermediate."
      },
      {
        label: "Carbon Dioxide Carboxylation",
        type: "intermediate",
        energyChange: "Transient C6 Intermediate",
        description: "Gaseous carbon dioxide is targeted by the enediol, establishing a highly unstable six-carbon intermediate."
      },
      {
        label: "Hydrolytic Separation",
        type: "transduction",
        energyChange: "Hydrolysis Split",
        description: "Water enters the active chamber and breaks the six-carbon intermediate apart, cleaving its bonds to yield two 3-carbon structures."
      },
      {
        label: "Calvin Sugar Stabilization",
        type: "equilibrium",
        energyChange: "Calvin Captives",
        description: "The segments stabilize as two molecules of 3-phosphoglycerate (3-PGA), anchoring gaseous carbon into physical organic carbon."
      }
    ],
    cell_glyc1: [
      {
        label: "Cytoplasmic Glucose Gating",
        type: "barrier",
        energyChange: "Enzyme Clamping",
        description: "A free glucose molecule docks within the active cleft of the Hexokinase enzyme in the cell cytoplasm."
      },
      {
        label: "Magnesium-ATP Configuration",
        type: "intermediate",
        energyChange: "Active Substrate",
        description: "Hexokinase aligns an ATP molecule coordinated with a critical magnesium (Mg²⁺) ion directly adjacent to the glucose tail."
      },
      {
        label: "Gamma Phosphate Interlocking",
        type: "transduction",
        energyChange: "-16.7 kJ/mol Exergonic",
        description: "The 6-hydroxyl group of glucose undergoes nucleophilic attack on the ATP gamma-phosphate, transferring the phosphate."
      },
      {
        label: "Intracellular Grid Locking",
        type: "equilibrium",
        energyChange: "Glucose 6-P Trap",
        description: "The highly polar Glucose-6-Phosphate cannot cross the hydrophobic membrane, locking it inside the cellular respiration pipeline."
      }
    ],
    cell_pdh: [
      {
        label: "Enzymatic Decarboxylation",
        type: "barrier",
        energyChange: "CO₂ Release",
        description: "Pyruvate docks at Pyruvate Dehydrogenase (E₁); its carboxyl team is severed and emitted as carbon dioxide, storing energy on TPP."
      },
      {
        label: "Lipoamide Disulfide Rotation",
        type: "intermediate",
        energyChange: "Electron Transfer",
        description: "The hydroxyethyl segment of E₁ is oxidized. It is transferred to the rotating lipoamide arm of the E₂ core."
      },
      {
        label: "Acetyl-CoA Synthesis Wave",
        type: "transduction",
        energyChange: "Thioester Loading",
        description: "The acetyl group is shifted onto Coenzyme A, producing highly energetic Acetyl-CoA with an unstable sulfur bond."
      },
      {
        label: "Electrochemical NADH Shift",
        type: "equilibrium",
        energyChange: "E3 Reoxidation",
        description: "Dihydrolipoamide is oxidized at the E₃ center back to the active disulfide state, producing NADH to fuel the electron transport chain."
      }
    ],
    cell_krebs1: [
      {
        label: "Oxaloacetate Conformational Locking",
        type: "barrier",
        energyChange: "Active Site Open",
        description: "Oxaloacetate docks inside Citrate Synthase, forcing a profound conformational shift that prepares the binding pocket for Acetyl-CoA."
      },
      {
        label: "Acetyl Deprotonation Wave",
        type: "intermediate",
        energyChange: "Active Enol Formation",
        description: "An active-site histidine base abstracts a proton from Acetyl-CoA, creating a highly reactive, transient enol nucleophile."
      },
      {
        label: "Condensation To Citryl-CoA",
        type: "transduction",
        energyChange: "Intermediate Bond",
        description: "The enol nucleophile attacks oxaloacetate's carbonyl carbon, forming a temporary covalently-bound citryl-CoA intermediate."
      },
      {
        label: "Irreversible Citrate Expulsion",
        type: "equilibrium",
        energyChange: "-31.4 kJ/mol Exergonic",
        description: "Water rapidly cleaves the citryl-CoA thioester bond, forming Citrate and pushing the Krebs cycle forward deterministically."
      }
    ],
    cell_etc5: [
      {
        label: "Four-Electron Loading Stack",
        type: "barrier",
        energyChange: "Metallic Transition",
        description: "Cytochrome c molecules successively donate four electrons to Cytochrome c Oxidase's metal nuclei (Heme a₃ and Cu_B)."
      },
      {
        label: "Diatomic Peroxygen Docking",
        type: "intermediate",
        energyChange: "Bound Peroxide state",
        description: "Molecular Oxygen (O₂) enters the enzymatic core, anchoring between the iron of Heme a₃ and Cu_B to establish a stable peroxide link."
      },
      {
        label: "Proton Extraction & Bond Breaking",
        type: "transduction",
        energyChange: "Strong-Bond Rupture",
        description: "The enzyme extracts 4 protons from the battery matrix, cleaving the strong oxygen-oxygen double bond of molecular oxygen."
      },
      {
        label: "Dual Water Discharge & Pump",
        type: "equilibrium",
        energyChange: "Water Release",
        description: "Two stable water (H₂O) molecules are synthesized, and massive energy release pumps 4 protons across the mitochondrial membrane."
      }
    ],
    planet_iron_ox: [
      {
        label: "Aqueous Ferrous Diffusion",
        type: "barrier",
        energyChange: "Soluble Ion Drift",
        description: "Primordial geothermal vents release soluble divalent iron (Fe²⁺) ions, spreading throughout early earth's oxygen-deficient oceans."
      },
      {
        label: "Biogenic Oxygen Intersection",
        type: "intermediate",
        energyChange: "Plume Confluence",
        description: "Early photosynthetic cyanobacteria produce oxygen (O₂), creating highly-active localized oxidizing zones in upper ocean layers."
      },
      {
        label: "Divalent Electron Strip",
        type: "transduction",
        energyChange: "Valence Conversion",
        description: "Oxygen acts as an electron acceptor, stripping electrons from dissolved Fe²⁺ and converting them into insoluble trivalent ferric iron (Fe³⁺)."
      },
      {
        label: "Hematite Geological Deposit",
        type: "equilibrium",
        energyChange: "Iron Crust Deposit",
        description: "Insoluble ferric iron complexes precipitate, settling to the prehistoric seafloor as Hematite (Fe₂O₃) layers to form global iron bands."
      }
    ],
    planet_lightning_fix: [
      {
        label: "Atmospheric Plasma Shockwave",
        type: "barrier",
        energyChange: "30,000 Kelvin Peak",
        description: "A super-voltage strike of natural lightning rips through atmospheric nitrogen (N₂) and oxygen (O₂) molecules."
      },
      {
        label: "Atmospheric Triple-Bond Rupture",
        type: "intermediate",
        energyChange: "Dissociation: High",
        description: "Super-thermal heat completely fractures the exceptionally stable nitrogen triple bond (N≡N) and oxygen double bond (O=O)."
      },
      {
        label: "Nitric Oxide Coalition",
        type: "transduction",
        energyChange: "+180 kJ/mol Stored",
        description: "Highly-reactive dissociated nitrogen and oxygen radicals combine to synthesize Nitric Oxide (NO) as the plasma shockwave chills."
      },
      {
        label: "Deposition Acidification Rainout",
        type: "equilibrium",
        energyChange: "Nitrate Enrichment",
        description: "NO oxidizes into NO₂ gas, dissolves inside atmospheric water droplets to create Nitric Acid, enriching ancient soils with life-giving nitrates."
      }
    ],
    organ_pacemaker: [
      {
        label: "Diastolic Funny Current Leak",
        type: "barrier",
        energyChange: "Slow Depolarization",
        description: "Hyperpolarization activates 'funny' sodium channels (I_f) inside cardiac node cells, triggering a slow inward leak of Na⁺ ions."
      },
      {
        label: "T-Type Gate Opening",
        type: "intermediate",
        energyChange: "Calcium Permeability",
        description: "Membrane potential hits -50mV, unlocking localized T-type low-voltage calcium gates to speed the cellular charge toward threshold."
      },
      {
        label: "L-Type Calcium Influx Explosion",
        type: "transduction",
        energyChange: "Action potential spark",
        description: "At the -40mV threshold, high-conductance L-type calcium channels swing open, and a flood of Ca²⁺ fires the rapid action potential spike."
      },
      {
        label: "Gated Potassium Repolarization",
        type: "equilibrium",
        energyChange: "Potential Reset",
        description: "Calcium channels lock shut. Voltage-gated potassium (K⁺) channels trigger, dumping positive charges from the cell to restore the -60mV rest potential."
      }
    ],
    animal_hemoglobin: [
      {
        label: "Tense Quaternary Conformation",
        type: "barrier",
        energyChange: "High Barrier Target",
        description: "Deoxygenated hemoglobin exists in an un-flexed, rigid 'Tense' (T) conformation with very low affinity for gaseous oxygen."
      },
      {
        label: "Initial Heme Oxygen Dock",
        type: "intermediate",
        energyChange: "Coordination Change",
        description: "An oxygen (O₂) molecule squeezes in to coordinate with the divalent iron (Fe²⁺) center of the first subunit's heme ring."
      },
      {
        label: "Relayed Cooperative Transition",
        type: "transduction",
        energyChange: "R-Conformation Snap",
        description: "The bound iron pulls into the plane of the porphyrin ring, moving the proximal histidine and snapping adjacent subunits into high-affinity 'Relaxed' (R) state."
      },
      {
        label: "Oxygen Saturation Peak",
        type: "equilibrium",
        energyChange: "Saturated Hemoglobin",
        description: "Affinity multiplies by 300x. The remaining three heme pockets coordinate oxygen instantly, finalizing saturated transport (Hb(O₂)₄)."
      }
    ]
  };

  if (database[cleanId]) {
    return database[cleanId];
  }

  // Fallback dynamic step synthesizer based on equation text
  const sides = equation.split('→');
  const reactants = sides[0] ? sides[0].trim() : "Reactants";
  const products = sides[1] ? sides[1].trim() : "Products";

  return [
    {
      label: "Inter-molecular Collision & Alignment",
      type: "barrier",
      energyChange: "Activation Barrier",
      description: `The starting reagents and molecules (${reactants}) approach each other in highly localized spatial domains, needing adequate velocity to match orbital requirements.`
    },
    {
      label: "Electronic & Valency Restructuring",
      type: "intermediate",
      energyChange: "Transition State",
      description: "Electronic electron orbital spheres or nuclear alignments deform under extreme proximity stress, forming excited and transient intermediate bonds."
    },
    {
      label: "Surplus Thermodynamic Decoupling",
      type: "transduction",
      energyChange: "Exothermic Dispersal",
      description: "The systems snap into a lower-energy electronic/subatomic state, dropping their mass-energy excess and emitting thermodynamic or radiative energy (heat, light or photons)."
    },
    {
      label: "Dissipated Final Stabilization",
      type: "equilibrium",
      energyChange: "Stable Products",
      description: `The resulting products (${products}) settle into steady mechanical and subatomic rest states, raising local and global environmental entropy.`
    }
  ];
}

export function ReactionTimeline({ 
  reactionId, 
  reactionName, 
  equation, 
  color 
}: { 
  reactionId: string; 
  reactionName: string; 
  equation: string; 
  color: string;
}) {
  const steps = useMemo(() => getReactionTimelineSteps(reactionId, reactionName, equation), [reactionId, reactionName, equation]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'barrier':
        return <Zap className="w-3 h-3 text-amber-400" />;
      case 'intermediate':
        return <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />;
      case 'transduction':
        return <Sparkles className="w-3 h-3 text-purple-400" />;
      case 'equilibrium':
        return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      default:
        return <HelpCircle className="w-3 h-3 text-white/40" />;
    }
  };

  return (
    <div className="border border-white/5 rounded bg-black/40 p-3 space-y-3 font-mono">
      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[8px] uppercase tracking-widest font-bold text-white/50">Matter & Energy Conversion Timeline</span>
        </div>
        <span className="text-[7px] text-white/30 uppercase font-bold select-none">Interactive Stepper</span>
      </div>

      <div className="relative pl-1.5 space-y-2.5">
        {/* Continuous vertical connector line */}
        <div className="absolute top-4 bottom-4 left-4 w-[1px] bg-white/10" />

        {steps.map((step, idx) => {
          const isActive = activeStepIndex === idx;
          return (
            <div 
              key={idx}
              className={`relative flex gap-3 p-1.5 rounded transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-white/[0.02] border border-white/5 shadow-inner' 
                  : 'hover:bg-white/[0.01] border border-transparent'
              }`}
              onClick={() => setActiveStepIndex(idx)}
            >
              {/* Stepper active bar */}
              {isActive && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[2px]" 
                  style={{ backgroundColor: color }}
                />
              )}

              {/* Glowing vertical node */}
              <div className="relative z-10 flex items-center justify-center shrink-0">
                <div 
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-black text-white border' 
                      : 'bg-[#08080f] text-white/40 border border-white/10'
                  }`}
                  style={{ 
                    borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? `0 0 10px ${color}30` : 'none'
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-1.5">
                  <span 
                    className={`text-[9.5px] font-bold block truncate tracking-tight transition-colors ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {step.label}
                  </span>
                  
                  {step.energyChange && (
                    <span 
                      className="text-[6.5px] font-bold uppercase tracking-wider px-1 py-0.5 rounded shrink-0 leading-none bg-black/40 border select-none"
                      style={{ 
                        color: isActive ? color : 'rgba(255,255,255,0.4)',
                        borderColor: isActive ? `${color}35` : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      {step.energyChange}
                    </span>
                  )}
                </div>

                {/* Collapsible description container */}
                {isActive ? (
                  <div className="text-[8.5px] font-sans text-white/60 leading-relaxed pt-1 flex gap-2 items-start animate-fade-in">
                    <div className="mt-0.5 shrink-0 select-none">{getStepIcon(step.type)}</div>
                    <div>
                      <p className="font-sans leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 border-t border-white/5 pt-1 text-[7px] text-white/30 tracking-wider">
                        <span className="font-mono uppercase">PHASE TYPE:</span>
                        <span 
                          className="font-mono font-bold uppercase"
                          style={{ color: color }}
                        >
                          {step.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-[7.5px] font-sans text-white/35 block truncate select-none">
                    Click to view phase transition details...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ReactionCatalogProps {
  onAskAI: (question: string) => void;
  onTriggerReactionInChamber?: (reaction: ReactionItem) => void;
}

export function ReactionCatalog({ onAskAI, onTriggerReactionInChamber }: ReactionCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [expandedReactionIds, setExpandedReactionIds] = useState<Set<string>>(new Set());

  const activeDashboardId = useDashboardStore(s => s.activeDashboardId);
  const activeObj = useMemo(() => DASHBOARD_DATA[activeDashboardId], [activeDashboardId]);

  // Find reactions specifically happening inside this active object
  const activeObjectReactions = useMemo(() => {
    if (!activeDashboardId) return [];
    const all = REACTION_DOMAINS.flatMap(d => d.reactions.map(r => ({ ...r, domain: d })));
    return all.filter(rx => rxInvolvesObject(rx, activeDashboardId));
  }, [activeDashboardId]);

  // Toggle reaction card expand/collapse
  const toggleReaction = (id: string) => {
    setExpandedReactionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all list items helper
  const expandAll = (ids: string[]) => {
    setExpandedReactionIds(new Set(ids));
  };

  // Collapse all list items helper
  const collapseAll = () => {
    setExpandedReactionIds(new Set());
  };

  // Filter products intelligently
  const filteredDomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    return REACTION_DOMAINS.map(domain => {
      // If we filtered by specific domain, skip if not matching
      if (selectedDomainId !== 'all' && domain.id !== selectedDomainId) {
        return { ...domain, reactions: [] };
      }

      // Filter reactions in this domain
      const matchingReactions = domain.reactions.filter(rx => {
        const matchName = rx.name.toLowerCase().includes(q);
        const matchSub = rx.subCategory.toLowerCase().includes(q);
        const matchEq = rx.equation.toLowerCase().includes(q);
        const matchDesc = rx.description.toLowerCase().includes(q);
        const matchAtoms = rx.atoms.some(a => 
          a.name.toLowerCase().includes(q) || 
          a.specs.toLowerCase().includes(q)
        );
        return matchName || matchSub || matchEq || matchDesc || matchAtoms;
      });

      return {
        ...domain,
        reactions: matchingReactions
      };
    }).filter(d => d.reactions.length > 0);
  }, [searchQuery, selectedDomainId]);

  // Total matching reactions
  const totalCount = useMemo(() => {
    return filteredDomains.reduce((acc, d) => acc + d.reactions.length, 0);
  }, [filteredDomains]);

  // Get flat list of matches for expand/collapse all
  const allMatchingIds = useMemo(() => {
    return filteredDomains.flatMap(d => d.reactions.map(r => r.id));
  }, [filteredDomains]);

  // Get unique sub-color styles based on domain
  const getDomainLabelStyle = (id: string) => {
    switch (id) {
      case 'star': return 'text-amber-400 border-amber-500/15 bg-amber-950/15';
      case 'plant': return 'text-teal-400 border-teal-500/15 bg-teal-950/15';
      case 'cell': return 'text-emerald-400 border-emerald-500/15 bg-emerald-950/15';
      case 'tissue': return 'text-purple-400 border-purple-500/15 bg-purple-950/15';
      case 'planet': return 'text-sky-400 border-sky-500/15 bg-sky-950/15';
      case 'organ': return 'text-orange-400 border-orange-500/15 bg-orange-950/15';
      case 'animal': return 'text-rose-400 border-rose-500/15 bg-rose-950/15';
      default: return 'text-white/60 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#030305]">
      {/* Search & Header Selection Controller */}
      <div className="bg-[#050508] border-b border-white/5 p-4 shrink-0 space-y-3">
        {/* Micro search input element */}
        <div className="flex items-center bg-[#030305] border border-white/10 px-3 py-1.5 rounded-sm hover:border-purple-500/30 focus-within:border-purple-500/60 transition-all shadow-inner">
          <Search className="w-3.5 h-3.5 text-white/40 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equations, reactants, descriptions..."
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[11px] font-mono text-white placeholder:text-white/25 py-0.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white/80 text-[10px] font-mono cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Domain Toggles */}
        <div className="flex flex-wrap gap-1 select-none">
          <button
            onClick={() => setSelectedDomainId('all')}
            className={`px-2 py-1 rounded text-[8.5px] font-mono font-bold border transition-all cursor-pointer ${
              selectedDomainId === 'all'
                ? 'bg-purple-950/45 border-purple-500 text-purple-200 shadow-md'
                : 'bg-black/40 border-white/5 text-white/45 hover:border-white/20'
            }`}
          >
            ALL CORES ({REACTION_DOMAINS.reduce((acc, d) => acc + d.reactions.length, 0)})
          </button>
          {REACTION_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomainId(d.id)}
              className={`px-2 py-1 rounded text-[8.5px] font-mono font-bold border transition-all cursor-pointer ${
                selectedDomainId === d.id
                  ? 'bg-purple-950/45 border-purple-500 text-purple-200 shadow-md'
                  : 'bg-black/40 border-white/5 text-white/45 hover:border-white/20'
              }`}
              style={{
                borderColor: selectedDomainId === d.id ? d.color : undefined,
                color: selectedDomainId === d.id ? d.color : undefined
              }}
            >
              {d.id.toUpperCase()} ({d.reactions.length})
            </button>
          ))}
        </div>

        {/* Diagnostics & Expand Controllers */}
        <div className="flex items-center justify-between text-[8px] font-mono text-white/30 pt-1 border-t border-white/5">
          <span>MATCHING ENTRIES: {totalCount}</span>
          <div className="flex gap-2">
            <button
              onClick={() => expandAll(allMatchingIds)}
              className="hover:text-white/60 transition-colors uppercase cursor-pointer"
            >
              Expand All
            </button>
            <span>|</span>
            <button
              onClick={collapseAll}
              className="hover:text-white/60 transition-colors uppercase cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Main Scollable Reactions Deck */}
      <div id="reactions-deck" className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
        
        {/* RECOMMENDED REACTIONS WITHIN ACTIVE OBJECT TARGET */}
        {activeObjectReactions.length > 0 && searchQuery.trim() === '' && selectedDomainId === 'all' && (
          <div className="space-y-2 border border-purple-500/20 bg-purple-950/5 p-3 rounded shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-1.5 border-b border-purple-500/10 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <h4 className="text-[10px] font-mono font-black tracking-wider text-purple-200 uppercase">
                  Reactions in {activeObj?.name || activeDashboardId}
                </h4>
              </div>
              <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-bold uppercase">
                {activeObjectReactions.length} ACTIVE
              </span>
            </div>
            <p className="text-[8.5px] text-white/40 leading-relaxed font-sans mb-3">
              The following molecular & physical energy reactions take place inside or involve the structures of this active target object:
            </p>
            
            <div className="space-y-1.5">
              {activeObjectReactions.map(rx => {
                const isExpanded = expandedReactionIds.has(rx.id + '-rec');
                const labelStyle = getDomainLabelStyle(rx.domain.id);
                
                return (
                  <div 
                    key={rx.id + '-rec'}
                    className={`border rounded transition-all duration-300 ${
                      isExpanded 
                        ? 'bg-[#08080f]/90 border-purple-500/30 shadow-[0_4px_16px_rgba(168,85,247,0.15)]' 
                        : 'bg-[#040406]/20 border-purple-950/50 hover:border-purple-800/40 hover:bg-purple-950/10'
                    }`}
                  >
                    <div 
                      onClick={() => toggleReaction(rx.id + '-rec')}
                      className="p-2.5 flex items-center justify-between cursor-pointer select-none gap-3"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-purple-400/80 block">
                          🧩 {rx.subCategory}
                        </span>
                        <span className="text-[10px] font-mono font-bold tracking-tight text-white/90 block">
                          {rx.name}
                        </span>
                        <span className="text-[9.5px] text-purple-300/95 font-mono font-semibold block truncate select-all">
                          {rx.equation}
                        </span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-purple-400/60 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {isExpanded && (
                      <div className="px-2.5 pb-2.5 pt-2 border-t border-purple-950/40 space-y-3 font-mono text-[9.5px] leading-relaxed text-white/80">
                        {/* Equation Box */}
                        <div className="bg-black/95 border border-purple-500/10 p-2.5 rounded text-center">
                          <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Involved Quantum Formula</span>
                          <div className="text-purple-300 font-mono text-[10.5px] font-bold tracking-widest select-all">
                            {rx.equation}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Empirical Description</span>
                          <p className="text-white/70 font-sans text-[9.5px] leading-relaxed mt-0.5">
                            {rx.description}
                          </p>
                        </div>

                        {/* Reaction Evolution Timeline */}
                        <ReactionTimeline 
                          reactionId={rx.id} 
                          reactionName={rx.name} 
                          equation={rx.equation} 
                          color={rx.domain.color} 
                        />

                        {/* Specs Chips */}
                        {rx.atoms.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Reacting Components</span>
                            <div className="flex flex-wrap gap-1">
                              {rx.atoms.map((atom, aIdx) => (
                                <div 
                                  key={`${rx.id}-rec-atom-${aIdx}`}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono border flex items-center gap-1 select-none ${labelStyle}`}
                                >
                                  <span className="font-bold">{atom.name}</span>
                                  <span className="opacity-40">|</span>
                                  <span className="text-[7px] tracking-wide text-white/50">{atom.specs}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-1.5 pt-1 select-none">
                          <button
                            onClick={() => {
                              const prompt = `Tell me more about how the reaction "${rx.name}" (${rx.equation}) operates at scale within the domain: ${rx.domain.title}. Specifically, what are the energetic transformations, thermodynamic catalysts, and scientific importances?`;
                              onAskAI(prompt);
                            }}
                            className="flex-1 py-1 rounded bg-purple-950/25 border border-purple-500/25 hover:bg-purple-950/40 text-purple-300 font-mono text-[8.5px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Consult AI
                          </button>

                          {onTriggerReactionInChamber && (
                            <button
                              onClick={() => onTriggerReactionInChamber(rx)}
                              className="px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/35 hover:bg-emerald-950/50 text-emerald-300 font-mono text-[8.5px] uppercase transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> Trigger Chamber
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="w-full h-[1px] bg-purple-500/15 my-2" />
          </div>
        )}

        {filteredDomains.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-lg bg-black/20">
            <HelpCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <span className="text-xs font-mono text-white/40 block">No matching reaction files found</span>
            <span className="text-[9px] text-white/25 mt-1 block">Refine your query parameters</span>
          </div>
        ) : (
          filteredDomains.map(domain => {
            return (
              <div key={domain.id} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Domain Category Ribbon */}
                <div 
                  className="p-3 rounded-t border-b overflow-hidden flex items-center justify-between relative bg-[#09090e] border-white/5"
                  style={{ borderLeft: `3px solid ${domain.color}` }}
                >
                  <div className="flex items-center gap-2.5 z-10">
                    <span 
                      className="text-[10px] font-mono font-black border px-1.5 py-0.5 rounded"
                      style={{ color: domain.color, borderColor: `${domain.color}25` }}
                    >
                      {domain.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-mono font-black tracking-wider uppercase text-white">
                        {domain.title}
                      </h4>
                      <p className="text-[8.5px] text-white/30 font-sans mt-0.5 font-semibold">
                        Domain Category Catalog ({domain.reactions.length} active simulations)
                      </p>
                    </div>
                  </div>
                  <div 
                    className="absolute right-0 bottom-0 top-0 w-32 filter blur-2xl opacity-10 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${domain.color} 0%, transparent 70%)` }}
                  />
                </div>

                {/* Sub-reactions List */}
                <div className="space-y-1.5 pl-1 border-l border-white/5">
                  {domain.reactions.map(rx => {
                    const isExpanded = expandedReactionIds.has(rx.id);
                    const labelStyle = getDomainLabelStyle(domain.id);
                    
                    return (
                      <div 
                        key={rx.id} 
                        className={`border rounded transition-all duration-300 ${
                          isExpanded 
                            ? 'bg-[#06060a]/90 border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]' 
                            : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-[#040406]/55'
                        }`}
                      >
                        {/* Summary Header Block (Toggled) */}
                        <div 
                          onClick={() => toggleReaction(rx.id)}
                          className="p-3 flex items-center justify-between cursor-pointer select-none gap-3"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-white/35 block truncate">
                              🧩 {rx.subCategory}
                            </span>
                            <span className="text-[11px] font-mono font-bold tracking-tight text-white/90 block">
                              {rx.name}
                            </span>
                            <span className="text-[10px] text-purple-300/90 font-mono font-semibold tracking-wider block pt-0.5 truncate select-all">
                              {rx.equation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                            )}
                          </div>
                        </div>

                        {/* Interactive Drawer Panel */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-2.5 border-t border-white/5 space-y-3.5 font-mono text-[10px] leading-relaxed select-text animate-fade-in text-white/80">
                            {/* Equation Showcase Block */}
                            <div className="space-y-1.5 bg-black/60 border border-purple-500/10 p-2.5 rounded text-center animate-pulse">
                              <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Involved Quantum Formula</span>
                              <div className="text-purple-300 font-mono text-xs font-bold tracking-widest select-all">
                                {rx.equation}
                              </div>
                            </div>

                            {/* Detailed Explanation Text */}
                            <div className="space-y-1">
                              <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Empirical Description</span>
                              <p className="text-white/70 font-sans text-[10px] leading-relaxed">
                                {rx.description}
                              </p>
                            </div>

                            {/* Reaction Evolution Timeline */}
                            <ReactionTimeline 
                              reactionId={rx.id} 
                              reactionName={rx.name} 
                              equation={rx.equation} 
                              color={domain.color} 
                            />

                            {/* Involved Reactants & Elements (Colored Chips) */}
                            {rx.atoms.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Key Reactants / Metrics</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {rx.atoms.map((atom, aIdx) => (
                                    <div 
                                      key={`${rx.id}-atom-${aIdx}`}
                                      className={`px-2 py-1 rounded text-[8.5px] font-mono border flex items-center gap-1.5 select-none ${labelStyle}`}
                                    >
                                      <span className="font-bold">{atom.name}</span>
                                      <span className="opacity-40">|</span>
                                      <span className="text-[7.5px] tracking-wide text-white/50">{atom.specs}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Contextual Action Interfaces */}
                            <div className="flex gap-2 pt-1 font-mono select-none">
                              {/* Ask AI Trigger */}
                              <button
                                onClick={() => {
                                  const prompt = `Tell me more about how the reaction "${rx.name}" (${rx.equation}) operates at scale within the domain: ${domain.title}. Specifically, what are the energetic transformations, thermodynamic catalysts, and scientific importances?`;
                                  onAskAI(prompt);
                                }}
                                className="flex-1 py-1.5 rounded bg-purple-950/20 border border-purple-500/25 hover:bg-purple-950/40 text-purple-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Consult Spacetime AI
                              </button>

                              {/* Load / Trigger in chamber */}
                              {onTriggerReactionInChamber && (
                                <button
                                  onClick={() => onTriggerReactionInChamber(rx)}
                                  className="px-2.5 py-1.5 rounded bg-[#10101b] border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/60 hover:text-white/90 font-mono text-[9px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                                  title="Add to target chamber"
                                >
                                  <Zap className="w-3 h-3 text-amber-400" /> Deposit Core
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
