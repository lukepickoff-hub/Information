import { useState, useRef, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Loader2, Send, RefreshCw, Clock, History, Info, FlaskConical, Atom, ChevronLeft, ChevronRight, ChevronDown, Compass, Leaf, Search, Sparkles } from 'lucide-react';
import { SpacetimeCanvas } from './components/SpacetimeCanvas';
import { ORGANISMS_DATA } from './data/organismsData';
import { useModeStore } from './store/useModeStore';
import { useAtomicStore } from './store/useAtomicStore';
import { useDashboardStore, DashboardId } from './store/useDashboardStore';
import { DASHBOARD_DATA } from './data/dashboardData';
import { ELEMENTS } from './data/elements';
import { PARTICLE_TABLE_DATA, QUANTITY_OVER_TIME, MOLECULE_COMPOSITIONS } from './data/chemistryData';
import { ChemistryMatrix } from './components/ChemistryMatrix';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { ReactionCatalog } from './components/ReactionCatalog';
import { ReactionItem } from './data/reactionData';

const TIME_MAPPING: Record<string, { start: number; label: string; unit: string }> = {
  sun: { start: 4.6, label: 'Billion Years Ago', unit: 'Ga' },
  mercury: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  venus: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  earth: { start: 4.54, label: 'Billion Years Ago', unit: 'Ga' },
  moon: { start: 4.51, label: 'Billion Years Ago', unit: 'Ga' },
  mars: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  jupiter: { start: 4.6, label: 'Billion Years Ago', unit: 'Ga' },
  saturn: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  uranus: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  neptune: { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' },
  cell: { start: 3.5, label: 'Billion Years Ago', unit: 'Ga' },
  mitochondria: { start: 1.5, label: 'Billion Years Ago', unit: 'Ga' },
  skeleton: { start: 500, label: 'Million Years Ago', unit: 'Ma' },
  human: { start: 300, label: 'Thousand Years Ago', unit: 'Ka' },
  hydrogen: { start: 13.8, label: 'Billion Years Ago', unit: 'Ga' },
  helium: { start: 13.8, label: 'Billion Years Ago', unit: 'Ga' },
  lithium: { start: 13.7, label: 'Billion Years Ago', unit: 'Ga' },
  beryllium: { start: 13.5, label: 'Billion Years Ago', unit: 'Ga' },
  boron: { start: 13.5, label: 'Billion Years Ago', unit: 'Ga' },
  carbon: { start: 13.0, label: 'Billion Years Ago', unit: 'Ga' },
  nitrogen: { start: 13.0, label: 'Billion Years Ago', unit: 'Ga' },
  oxygen: { start: 13.0, label: 'Billion Years Ago', unit: 'Ga' },
  fluorine: { start: 12.0, label: 'Billion Years Ago', unit: 'Ga' },
  neon: { start: 12.0, label: 'Billion Years Ago', unit: 'Ga' },
  sodium: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  magnesium: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  aluminum: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  silicon: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  phosphorus: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  sulfur: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  chlorine: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  argon: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  potassium: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
  calcium: { start: 11.0, label: 'Billion Years Ago', unit: 'Ga' },
};

const getContinuousTimeLabel = (percent: number, activeId: string) => {
  if (percent >= 99.8) {
    return 'Present Day (Now)';
  }

  const config = TIME_MAPPING[activeId] || { start: 4.5, label: 'Billion Years Ago', unit: 'Ga' };
  const currentVal = config.start * (1 - percent / 100);

  if (config.unit === 'Ka') {
    return `~${currentVal.toFixed(1)} Thousand Years Ago`;
  } else if (config.unit === 'Ma') {
    return `~${currentVal.toFixed(1)} Million Years Ago`;
  } else {
    if (currentVal < 0.001) {
      return `~${(currentVal * 1e6).toLocaleString(undefined, { maximumFractionDigits: 0 })} Thousand Years Ago`;
    } else if (currentVal < 1.0) {
      return `~${(currentVal * 1000).toFixed(1)} Million Years Ago`;
    } else {
      return `~${currentVal.toFixed(2)} Billion Years Ago`;
    }
  }
};

const preprocessScientificMath = (text: string): string => {
  if (!text) return '';

  let res = text;

  // 1. Convert any double-escaped or standard block LaTeX \[ ... \] to $$ ... $$
  res = res.replace(/\\\\\[([\s\S]*?)\\\\\]/g, '$$$$$1$$$$');
  res = res.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');

  // 2. Convert standard or double-escaped inline LaTeX \( ... \) to $ ... $
  res = res.replace(/\\\\\(([\s\S]*?)\\\\\)/g, '$$1$');
  res = res.replace(/\\\(([\s\S]*?)\\\)/g, '$$1$');

  return res;
};

const mapAtomsToDashboardIds = (rx: any): DashboardId[] => {
  const result: DashboardId[] = [];
  const lowercaseQuery = (rx.name + " " + rx.equation + " " + rx.subCategory + " " + rx.description).toLowerCase();
  
  const map: { keywords: string[], id: DashboardId }[] = [
    { keywords: ['hydrogen', '¹h', 'deuterium', '²h'], id: 'hydrogen' },
    { keywords: ['helium', '³he', '⁴he'], id: 'helium' },
    { keywords: ['lithium'], id: 'lithium' },
    { keywords: ['beryllium'], id: 'beryllium' },
    { keywords: ['boron'], id: 'boron' },
    { keywords: ['carbon', '¹²c', '¹³c', 'co₂', 'dioxide'], id: 'carbon' },
    { keywords: ['nitrogen', '¹³n', '¹⁴n', '¹⁵n', 'n₂', 'ammonia', 'nh₃'], id: 'nitrogen' },
    { keywords: ['oxygen', '¹⁵o', '¹⁶o', 'o₂'], id: 'oxygen' },
    { keywords: ['fluorine'], id: 'fluorine' },
    { keywords: ['neon'], id: 'neon' },
    { keywords: ['sodium', 'na⁺'], id: 'sodium' },
    { keywords: ['magnesium'], id: 'magnesium' },
    { keywords: ['aluminum'], id: 'aluminum' },
    { keywords: ['silicon'], id: 'silicon' },
    { keywords: ['phosphorus'], id: 'phosphorus' },
    { keywords: ['sulfur'], id: 'sulfur' },
    { keywords: ['chlorine', 'cl⁻', 'nacl'], id: 'chlorine' },
    { keywords: ['argon'], id: 'argon' },
    { keywords: ['potassium'], id: 'potassium' },
    { keywords: ['calcium', 'ca²⁺'], id: 'calcium' },
    { keywords: ['mitochondria'], id: 'mitochondria' },
    { keywords: ['cell', 'glucose', 'water', 'h₂o', 'photosynthesis'], id: 'cell' },
    { keywords: ['earth'], id: 'earth' },
    { keywords: ['moon'], id: 'moon' },
    { keywords: ['sun'], id: 'sun' },
    { keywords: ['human', 'adrenaline', 'serotonin', 'sweat', 'brain'], id: 'human' },
    { keywords: ['skeleton', 'hydroxyapatite', 'bone'], id: 'skeleton' }
  ];

  for (const entry of map) {
    if (entry.keywords.some(kw => lowercaseQuery.includes(kw))) {
      result.push(entry.id);
    }
  }

  return result.slice(0, 3);
};

export default function App() {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // Start collapsed on mobile sizes for visual space
    }
    return false;
  });
  const [sliderPercent, setSliderPercent] = useState(100);
  const [specsTab, setSpecsTab] = useState<'ledger' | 'biosphere' | 'reactions'>('ledger');
  const [bioSearch, setBioSearch] = useState('');
  const [bioCategory, setBioCategory] = useState('All');
  const [expandedBioIds, setExpandedBioIds] = useState<Set<string>>(new Set());
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
    }
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Real-time space states
  const { setMode } = useModeStore();
  const { setSelectedElement } = useAtomicStore();
  const { activeDashboardId, activeTimelineStep, interactMode, setDashboardId, setTimelineStep, setInteractMode } = useDashboardStore();

  useEffect(() => {
    const handleReaction = (e: any) => {
      const element = e.detail;
      setTopic('');
      setInteractMode(false);
      setExplanation(`## **Reaction Detected!**\n\nThe atoms have bonded to form **${element}** (Carbon Dioxide). \n\n* **Formula**: CO₂\n* **Structure**: Linear geometry (O=C=O)\n* **Nature**: A colorless gas pivotal to the carbon cycle, formed chemically when carbon bonds with an oxygen molecule.\n\nIn this spacetime representation, dragging standard stable carbon and oxygen together initiates strong nuclear and electromagnetic interactions that covalently bond them into this stable molecular configuration.`);
    };
    window.addEventListener('spacetime-reaction', handleReaction);
    return () => window.removeEventListener('spacetime-reaction', handleReaction);
  }, [setInteractMode]);

  useEffect(() => {
    const handleResetExplanation = () => {
      setExplanation(null);
    };
    window.addEventListener('spacetime-reset-explanation', handleResetExplanation);
    return () => window.removeEventListener('spacetime-reset-explanation', handleResetExplanation);
  }, []);

  const activeData = useMemo(() => {
    return DASHBOARD_DATA[activeDashboardId] || DASHBOARD_DATA.moon;
  }, [activeDashboardId]);

  // Adjust timeline boundaries to cover existence to present day (Steps 1 to 3)
  const isTimelineOutsideBounds = activeTimelineStep > 3;
  useEffect(() => {
    if (isTimelineOutsideBounds) {
      setTimelineStep(1); // default back to Birth/Formation when switching views
      setSliderPercent(0);
    }
  }, [activeDashboardId, isTimelineOutsideBounds, setTimelineStep]);

  // Synchronize continuous slider position with discrete timeline steps from store.
  // This ensures that when an object is selected/clicked (which resets the activeTimelineStep to 1),
  // the slider position automatically snaps to 0 (first epoch / earliest existence),
  // and we do not cause any infinite feedback loops or jumping when dragging the slider.
  useEffect(() => {
    if (activeTimelineStep === 1 && sliderPercent >= 33.3) {
      setSliderPercent(0);
    } else if (activeTimelineStep === 2 && (sliderPercent < 33.3 || sliderPercent >= 66.6)) {
      setSliderPercent(50);
    } else if (activeTimelineStep === 3 && sliderPercent < 66.6) {
      setSliderPercent(100);
    }
  }, [activeDashboardId, activeTimelineStep]);

  // Synchronize canvas settings with selected elements
  useEffect(() => {
    if (activeData) {
      setMode(activeData.mode);
      if (activeDashboardId === 'carbon') {
        const carbonEl = ELEMENTS.find(e => e.atomicNumber === 6);
        if (carbonEl) {
          setSelectedElement(carbonEl);
        }
      } else {
        setSelectedElement(null);
      }
    }
  }, [activeDashboardId, activeData, setMode, setSelectedElement]);

  // Handle dynamic textarea adjustment for the input box
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [topic]);

  // Local cache for object explanations
  const [explanationCache, setExplanationCache] = useState<Record<string, string>>({});

  // Automatically fetch AI explanation for the active object if not cached
  useEffect(() => {
    if (!activeData) return;
    const objectName = activeData.name;
    
    // Default to clear topic and use cached if available
    setTopic('');
    
    if (explanationCache[objectName]) {
      setExplanation(explanationCache[objectName]);
      return;
    }

    // Otherwise, generate it
    const generateObjectExplanation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            topic: `Comprehensive spacetime, energy, and force analysis of ${objectName}`,
            additionalRequirements: 'The response MUST contain all data about spacetime, energy, force about this specific object.'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to generate object data');
        }

        const data = await response.json();
        
        const ID_MAP: Record<string, string> = {
          'Sun': 'sun',
          'Mercury': 'mercury',
          'Venus': 'venus',
          'Earth': 'earth',
          'Moon': 'moon',
          'Mars': 'mars',
          'Jupiter': 'jupiter',
          'Saturn': 'saturn',
          'Uranus': 'uranus',
          'Neptune': 'neptune',
          'Skeleton': 'skeleton',
          'Cell': 'cell',
          'Mitochondria': 'mitochondria',
          'Mitochondrion': 'mitochondria',
          'Hydrogen': 'hydrogen',
          'Helium': 'helium',
          'Lithium': 'lithium',
          'Beryllium': 'beryllium',
          'Boron': 'boron',
          'Carbon': 'carbon',
          'Nitrogen': 'nitrogen',
          'Oxygen': 'oxygen',
          'Fluorine': 'fluorine',
          'Neon': 'neon',
          'Sodium': 'sodium',
          'Magnesium': 'magnesium',
          'Aluminum': 'aluminum',
          'Silicon': 'silicon',
          'Phosphorus': 'phosphorus',
          'Sulfur': 'sulfur',
          'Chlorine': 'chlorine',
          'Argon': 'argon',
          'Potassium': 'potassium',
          'Calcium': 'calcium'
        };

        let resultText = data.text;
        Object.entries(ID_MAP).forEach(([name, id]) => {
          const regex = new RegExp(`(?<!\\[)\\b(${name})\\b(?!\\])(?!\\(object:)`, 'g');
          resultText = resultText.replace(regex, `[$1](object:${id})`);
        });

        setExplanationCache(prev => ({ ...prev, [objectName]: resultText }));
        setExplanation(resultText);
      } catch (err) {
        console.error(err);
        // Fallback to null so static markdown takes over if needed
        setExplanation(null); 
      } finally {
        setIsLoading(false);
      }
    };

    generateObjectExplanation();
  }, [activeDashboardId, activeData]);

  const handleSubmit = async (e?: React.FormEvent, overrideTopic?: string) => {
    e?.preventDefault();
    const currentTopic = overrideTopic || topic;
    if (!currentTopic.trim()) return;

    const lowerTopic = currentTopic.toLowerCase().trim();

    // Map keywords directly to selected object structures with fuzzy search/substring checks
    const targetMappings: Array<{ keywords: string[]; id: DashboardId }> = [
      { keywords: ['earth', 'blue planet', 'terrestrial'], id: 'earth' },
      { keywords: ['moon', 'luna', 'lunar'], id: 'moon' },
      { keywords: ['sun', 'star', 'solar', 'sol', 'helios'], id: 'sun' },
      { keywords: ['mercury'], id: 'mercury' },
      { keywords: ['venus'], id: 'venus' },
      { keywords: ['mars', 'red planet'], id: 'mars' },
      { keywords: ['jupiter'], id: 'jupiter' },
      { keywords: ['saturn'], id: 'saturn' },
      { keywords: ['uranus'], id: 'uranus' },
      { keywords: ['neptune'], id: 'neptune' },
      { keywords: ['mitochondria', 'mitochondrion'], id: 'mitochondria' },
      { keywords: ['cell', 'cellular', 'cytoplasm'], id: 'cell' },
      { keywords: ['skeleton', 'bone', 'bones', 'skeletal', 'skull', 'anatomy', 'skeletons'], id: 'skeleton' },
      { keywords: ['human', 'body', 'person', 'homo sapiens', 'man', 'woman', 'people'], id: 'human' },
      { keywords: ['hydrogen'], id: 'hydrogen' },
      { keywords: ['helium'], id: 'helium' },
      { keywords: ['lithium'], id: 'lithium' },
      { keywords: ['beryllium'], id: 'beryllium' },
      { keywords: ['boron'], id: 'boron' },
      { keywords: ['carbon'], id: 'carbon' },
      { keywords: ['nitrogen'], id: 'nitrogen' },
      { keywords: ['oxygen'], id: 'oxygen' },
      { keywords: ['fluorine'], id: 'fluorine' },
      { keywords: ['neon'], id: 'neon' },
      { keywords: ['sodium'], id: 'sodium' },
      { keywords: ['magnesium'], id: 'magnesium' },
      { keywords: ['aluminum', 'aluminium'], id: 'aluminum' },
      { keywords: ['silicon'], id: 'silicon' },
      { keywords: ['phosphorus'], id: 'phosphorus' },
      { keywords: ['sulfur', 'sulphur'], id: 'sulfur' },
      { keywords: ['chlorine'], id: 'chlorine' },
      { keywords: ['argon'], id: 'argon' },
      { keywords: ['potassium'], id: 'potassium' },
      { keywords: ['calcium'], id: 'calcium' }
    ];

    let matchedId: DashboardId | null = null;
    for (const mapping of targetMappings) {
      const match = mapping.keywords.some(keyword => {
        if (keyword.length <= 2) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'i');
          return regex.test(lowerTopic);
        } else {
          return lowerTopic.includes(keyword);
        }
      });
      if (match) {
        matchedId = mapping.id;
        break;
      }
    }

    if (matchedId) {
      setDashboardId(matchedId);
      
      // If the query is just a simple jump/show command or simple name,
      // clear the topic state & explanation to let default state effect load.
      const isSimpleCommand = 
        lowerTopic.length < 25 && 
        (lowerTopic === matchedId || 
         targetMappings.find(m => m.id === matchedId)?.keywords.some(kw => 
           lowerTopic === kw || 
           lowerTopic.includes("go to " + kw) || 
           lowerTopic.includes("jump to " + kw) || 
           lowerTopic.includes("show " + kw) || 
           lowerTopic.includes("select " + kw) || 
           lowerTopic.includes("switch to " + kw) ||
           lowerTopic.includes("teleport to " + kw)
         ));
      
      if (isSimpleCommand) {
        setTopic('');
        setExplanation(null);
        return;
      }
    }

    // Dynamic fetch from Gemini proxy for spatial/physical analysis
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: currentTopic, 
          additionalRequirements: `Analyze ${activeData.name} context. Write a clean, highly structured response summarizing the science, background, dimensions, and spacetime properties of this object. Keep paragraphs readable and output beautiful Markdown.` 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to generate spatiotemporal answer');
      }

      const data = await response.json();
      setExplanation(data.text);
      setTopic('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred querying scientific databases');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Centralized high-performance entity connector for scientific terms
  const linkifyScienceText = useMemo(() => {
    return (rawMd: string) => {
      if (!rawMd) return '';
      const ID_MAP: Record<string, string> = {
        // Cosmic scales
        'Sun': 'sun',
        'Solar System Star': 'sun',
        'Solar Star': 'sun',
        'Yellow Dwarf': 'sun',
        'Mercury': 'mercury',
        'Venus': 'venus',
        'Earth': 'earth',
        'Biosphere': 'earth',
        'Moon': 'moon',
        'Mars': 'mars',
        'Jupiter': 'jupiter',
        'Saturn': 'saturn',
        'Uranus': 'uranus',
        'Neptune': 'neptune',

        // Atoms and chemical elements
        'Hydrogen': 'hydrogen',
        'Hydrogen Atom': 'hydrogen',
        'H': 'hydrogen',
        'Helium': 'helium',
        'Helium Atom': 'helium',
        'He': 'helium',
        'Lithium': 'lithium',
        'Lithium Atom': 'lithium',
        'Li': 'lithium',
        'Beryllium': 'beryllium',
        'Beryllium Atom': 'beryllium',
        'Be': 'beryllium',
        'Boron': 'boron',
        'Boron Atom': 'boron',
        'B': 'boron',
        'Carbon': 'carbon',
        'Carbon Atom': 'carbon',
        'C': 'carbon',
        'Nitrogen': 'nitrogen',
        'Nitrogen Atom': 'nitrogen',
        'N': 'nitrogen',
        'Oxygen': 'oxygen',
        'Oxygen Atom': 'oxygen',
        'O': 'oxygen',
        'Fluorine': 'fluorine',
        'Fluorine Atom': 'fluorine',
        'F': 'fluorine',
        'Neon': 'neon',
        'Neon Atom': 'neon',
        'Ne': 'neon',
        'Sodium': 'sodium',
        'Sodium Atom': 'sodium',
        'Na': 'sodium',
        'Magnesium': 'magnesium',
        'Magnesium Atom': 'magnesium',
        'Mg': 'magnesium',
        'Aluminum': 'aluminum',
        'Aluminum Atom': 'aluminum',
        'Al': 'aluminum',
        'Silicon': 'silicon',
        'Silicon Atom': 'silicon',
        'Si': 'silicon',
        'Phosphorus': 'phosphorus',
        'Phosphorus Atom': 'phosphorus',
        'P': 'phosphorus',
        'Sulfur': 'sulfur',
        'Sulfur Atom': 'sulfur',
        'S': 'sulfur',
        'Chlorine': 'chlorine',
        'Chlorine Atom': 'chlorine',
        'Cl': 'chlorine',
        'Argon': 'argon',
        'Argon Atom': 'argon',
        'Ar': 'argon',
        'Potassium': 'potassium',
        'Potassium Atom': 'potassium',
        'K': 'potassium',
        'Calcium': 'calcium',
        'Calcium Atom': 'calcium',
        'Ca': 'calcium',

        // Molecules and compounds
        'Water': 'cell',
        'H₂O': 'cell',
        'H2O': 'cell',
        'Carbon Dioxide': 'carbon',
        'CO₂': 'carbon',
        'CO2': 'carbon',
        'Glucose': 'cell',
        'C₆H₁₂O₆': 'cell',
        'Adenosine Triphosphate': 'mitochondria',
        'ATP': 'mitochondria',

        // Biological cells and organelles
        'Eukaryotic Cell': 'cell',
        'Eukaryotic Cells': 'cell',
        'Cell': 'cell',
        'Cells': 'cell',
        'Plasma Membrane': 'cell',
        'Membrane': 'cell',
        'Mitochondria': 'mitochondria',
        'Mitochondrion': 'mitochondria',
        'Powerhouse': 'mitochondria',
        'Organelle': 'mitochondria',
        'Organelles': 'mitochondria',

        // Anatomical structures
        'Skeleton': 'skeleton',
        'Skeletal System': 'skeleton',
        'Bone': 'skeleton',
        'Bones': 'skeleton',
        'Vertebrae': 'skeleton',
        'Skull': 'skeleton',
        'Tissue': 'skeleton',
        'Tissues': 'skeleton',
        'Organ': 'skeleton',
        'Organs': 'skeleton',
        'Human': 'human',
        'Human Body': 'human',
        'Homo Sapiens': 'human',
        'Brain': 'human',
        'Cardiovascular': 'human',
        'Neural Network': 'human'
      };

      // Split text strictly into tokens to ignore standard Markdown syntax
      const tokens = rawMd.split(/(\[.*?\]\(.*?\)|\`.*?\`|\<.*?\>)/g);
      const sortedKeys = Object.keys(ID_MAP).sort((a, b) => b.length - a.length);
      const pattern = sortedKeys.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
      
      // Lookarounds boundaries check Unicode word boundaries (e.g. ₂ / subscript support)
      const regex = new RegExp(`(?<![a-zA-Z0-9\\u0080-\\uFFFF])(${pattern})(?![a-zA-Z0-9\\u0080-\\uFFFF])`, 'gi');

      const processedTokens = tokens.map((segment) => {
        if (!segment) return '';
        if (segment.startsWith('[') || segment.startsWith('`') || segment.startsWith('<')) {
          return segment;
        }

        return segment.replace(regex, (match) => {
          const matchedKey = match.toLowerCase();
          const exactKey = Object.keys(ID_MAP).find(k => k.toLowerCase() === matchedKey);
          const destId = exactKey ? ID_MAP[exactKey] : 'carbon';
          return `[${match}](object:${destId})`;
        });
      });

      return processedTokens.join('');
    };
  }, []);

  // Compute narrative display based on timeline positioning
  const currentStepNum = Math.min(activeTimelineStep, 3);
  const currentStage = useMemo(() => {
    return activeData.timeline.find(s => s.step === currentStepNum) || activeData.timeline[0];
  }, [activeData, currentStepNum]);

  // Build markdown for standard scientific information showing all specs
  const activeStageMarkdown = useMemo(() => {
    if (!activeData) return '';
    const rawMd = `### **${activeData.name}**  
*${activeData.subtitle}*  

---

#### **Timeline Node: ${currentStage?.title || 'Stable Era'}**  
* **Chronological Epoch:** \`${currentStage?.time || 'Uncharted'}\`  
* **Thermal Core Level:** \`${currentStage?.temp || 'Constant'}\`  
* **Massive Energy Scale:** \`${currentStage?.massOrEnergy || 'Balanced'}\`  

**Past & Present Evolution Matrix:**  
${currentStage?.description || 'Active system state.'}  

---

#### **Core Architectural Layers**  
${activeData.structures.map(layer => `* **${layer.name}**: Size \`${layer.size}\` | Mass \`${layer.mass}\` (Layer energy: ${layer.energy})`).join('\n')}  

---

#### **Prevailing Spacetime Forces**  
${activeData.relationships.forces.map(f => `* **${f.name}**: ${f.desc}`).join('\n')}
`;
    
    return linkifyScienceText(rawMd);
  }, [activeData, currentStage, linkifyScienceText]);

  // Linkify custom search answers returned by AI agent
  const explanationMarkdown = useMemo(() => {
    if (!explanation) return null;
    return linkifyScienceText(explanation);
  }, [explanation, linkifyScienceText]);

  const finalActiveStageMarkdown = useMemo(() => {
    return preprocessScientificMath(activeStageMarkdown);
  }, [activeStageMarkdown]);

  const finalExplanationMarkdown = useMemo(() => {
    if (!explanationMarkdown) return '';
    return preprocessScientificMath(explanationMarkdown);
  }, [explanationMarkdown]);

  // Handle intercepting markdown links
  const MarkdownComponents = useMemo(() => ({
    a: ({ href, children }: any) => {
      if (href?.startsWith('object:')) {
        const id = href.replace('object:', '');
        return (
          <span 
            onClick={() => {
              setDashboardId(id as DashboardId);
              setExplanation(null);
            }}
            className="text-cyan-400 hover:text-cyan-300 border-b border-cyan-400/40 hover:border-cyan-300 font-bold tracking-wider cursor-pointer cursor-alias transition-all inline"
          >
            {children}
          </span>
        );
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{children}</a>;
    }
  }), [setDashboardId, setExplanation]);



  return (
    <div id="spacetime-workspace" className="h-screen w-screen bg-[#020204] text-[#eeeff4] font-sans flex flex-row selection:bg-cyan-500/20 selection:text-cyan-200 overflow-hidden relative">
      
      {/* LEFT PART: The interactive 3D universe space + Timeline */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* TOP LEFT: Visual Canvas */}
        <section id="viewport-three" className="flex-1 relative bg-black">
          <div className="absolute inset-0 z-0">
            <SpacetimeCanvas 
              activeId={activeDashboardId} 
              onSelectObject={(id) => {
                setDashboardId(id);
                setExplanation(null);
              }} 
            />
          </div>


          {/* Restore Specs panel bubble trigger when collapsed */}
          {isRightPanelCollapsed && (
            <div className={`absolute ${deviceType === 'mobile' ? 'left-6 top-6' : 'right-20 top-6'} z-50 animate-pulse`}>
              <button 
                onClick={() => setIsRightPanelCollapsed(false)}
                className="px-3.5 py-2.5 bg-[#050508]/90 border border-cyan-400/80 text-cyan-300 hover:bg-[#050508]/40 rounded shadow-lg backdrop-blur flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider transition-all"
                title="Expand Splitscreen Panel"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> {deviceType === 'mobile' ? 'Specs Panel' : 'Restore Specs'}
              </button>
            </div>
          )}
        </section>

        {/* BOTTOM LEFT: Timeline bar */}
        <div id="timeline-container" className={`w-full bg-[#08080d] border-t border-r border-[#ffffff]/5 ${deviceType === 'mobile' ? 'px-4 py-2.5' : 'px-6 py-4'} flex flex-col items-center shrink-0 z-10 shadow-[0_-15px_30px_rgba(0,0,0,0.85)]`}>
          <div className="w-full max-w-5xl flex flex-col justify-center">
            <div className="relative flex items-center mb-1">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={sliderPercent}
                onChange={(e) => {
                  const percent = parseFloat(e.target.value);
                  setSliderPercent(percent);
                  
                  // Map continuous percent smoothly to discrete steps for visual updates
                  let step = 3;
                  if (percent < 33.3) {
                    step = 1;
                  } else if (percent < 66.6) {
                    step = 2;
                  }
                  setTimelineStep(step);
                }}
                className="w-full h-1 bg-white/10 hover:bg-white/15 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-colors focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #22d3ee ${sliderPercent}%, rgb(38 38 38 / 0.4) ${sliderPercent}%)`
                }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono mt-1.5 select-none text-white/40 px-1">
              {deviceType !== 'mobile' && (
                <span className="text-left text-white/50 truncate max-w-[124px] sm:max-w-[220px]" title="First epoch of existence">
                  {getContinuousTimeLabel(0, activeDashboardId)}
                </span>
              )}
              <span className={`text-cyan-400 font-bold font-mono text-center flex-1 ${deviceType === 'mobile' ? 'text-[10px]' : 'text-[11px]'} animate-pulse`}>
                {getContinuousTimeLabel(sliderPercent, activeDashboardId)}
              </span>
              {deviceType !== 'mobile' && (
                <span className="text-right text-white/50 truncate max-w-[120px] sm:max-w-[180px]" title="Current time">
                  Present Day (Now)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PART: Information Panel */}
      <aside 
        id="info-panel-right" 
        className={`${
          isRightPanelCollapsed 
            ? 'w-0 border-none opacity-0 invisible pointer-events-none' 
            : deviceType === 'mobile'
              ? 'w-full opacity-100 visible absolute inset-0 z-50'
              : 'w-[400px] lg:w-[455px] border-l border-white/5 opacity-100 visible relative'
        } h-full bg-[#050508] flex flex-col z-30 shadow-[-15px_0_30px_rgba(0,0,0,0.85)] shrink-0 transition-all duration-300 overflow-hidden`}
      >
        
        {/* Unified Command & Science Header */}
        <div id="right-panel-header" className="flex border-b border-white/5 p-3.5 shrink-0 select-none bg-[#07070a] items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-[#f4f4f5]">Physical Core Ledger</span>
              <span className="text-[8px] font-mono text-amber-300/60 uppercase font-semibold">Specs + Molecular Topology</span>
            </div>
          </div>
          {/* Quick collapse icon button */}
          <button
            onClick={() => setIsRightPanelCollapsed(true)}
            className="p-1 px-2.5 rounded bg-white/5 text-white/40 hover:text-red-400 hover:bg-white/10 border border-white/5 transition-all text-[9px] font-mono uppercase flex items-center gap-1 cursor-pointer"
            title="Collapse Details Panel"
          >
            Hide Specs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* COMMAND PANEL & TEXT DISPLAY DECK */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          
          {/* Unified Tab Headers inside specs ledger */}
          <div className="flex border-b border-white/5 bg-[#07070a] shrink-0 font-mono text-[9px] font-bold select-none divide-x divide-white/5">
            <button
              onClick={() => setSpecsTab('ledger')}
              className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                specsTab === 'ledger'
                  ? 'text-cyan-300 bg-cyan-950/10 shadow-[inset_0_-2px_0_#22d3ee]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Compass className={`w-3 h-3 ${specsTab === 'ledger' ? 'text-cyan-400' : 'text-white/30'}`} />
              CORE LEDGER
            </button>
            <button
              onClick={() => setSpecsTab('biosphere')}
              className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                specsTab === 'biosphere'
                  ? 'text-emerald-300 bg-emerald-950/10 shadow-[inset_0_-2px_0_#10b981]'
                  : 'text-white/40 hover:text-emerald-400/60 hover:bg-emerald-950/5'
              }`}
            >
              <Leaf className={`w-3 h-3 ${specsTab === 'biosphere' ? 'text-emerald-400' : 'text-white/30'}`} />
              BIOSPHERE ({ORGANISMS_DATA.length})
            </button>
            <button
              onClick={() => setSpecsTab('reactions')}
              className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                specsTab === 'reactions'
                  ? 'text-purple-300 bg-purple-950/10 shadow-[inset_0_-2px_0_#a855f7]'
                  : 'text-white/40 hover:text-purple-400/60 hover:bg-purple-950/5'
              }`}
            >
              <FlaskConical className={`w-3 h-3 ${specsTab === 'reactions' ? 'text-purple-400' : 'text-white/30'}`} />
              REACTIONS
            </button>
          </div>

          {specsTab === 'ledger' && (
            <>
              {/* Glowing input bar for questions */}
              <div className="bg-[#050508] border-b border-white/5 p-4 shrink-0">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center bg-[#030305] border border-white/10 px-3 py-2 rounded-sm hover:border-cyan-500/30 focus-within:border-cyan-500/60 transition-all shadow-inner relative">
                    <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
                      <textarea
                        ref={textareaRef}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask any question about the ${activeData.name}...`}
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[11px] font-mono text-white placeholder:text-white/25 py-0.5 resize-none h-[22px] min-h-[22px] max-h-24 leading-relaxed"
                        rows={1}
                      />
                      <button
                        type="submit"
                        disabled={!topic.trim() || isLoading}
                        className="text-cyan-400 hover:text-cyan-300 disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0 p-1.5 bg-cyan-950/20 rounded border border-cyan-500/15"
                        title="Transmit"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Main scrollable textarea / information reader containing markdown layout of the active body */}
              <div id="data-readout-panel" className="flex-1 bg-[#030305] p-6 overflow-y-auto scrollbar-thin">
                <div className="max-w-5xl mx-auto min-h-full flex flex-col gap-6">
                  {isLoading ? (
                    <div className="h-full w-full flex-1 flex flex-col items-center justify-center text-center py-20">
                      <Loader2 className="w-7 h-7 text-cyan-400 animate-spin mb-2" />
                      <span className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase animate-pulse">Consulting Galactic Core...</span>
                    </div>
                  ) : error ? (
                    <div className="h-full w-full flex-1 flex flex-col items-center justify-center text-center p-4 py-20">
                      <span className="text-xs font-mono text-red-400 border border-red-500/10 bg-red-950/10 px-3 py-2 rounded-sm mb-2 uppercase tracking-wide">
                        Transmission Error: {error}
                      </span>
                      <button 
                        onClick={() => { setError(null); setExplanation(null); }}
                        className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 uppercase transition-colors"
                      >
                        Reset Telemetry
                      </button>
                    </div>
                  ) : (
                    <>
                      {explanation ? (
                        <div className="animate-in fade-in duration-150 space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 border-b border-cyan-500/10 pb-1 shrink-0">
                            <span className="tracking-widest uppercase font-semibold">&gt; Custom Search Result</span>
                            <button 
                              onClick={() => setExplanation(null)}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold uppercase text-[8px] bg-cyan-950/15 border border-cyan-500/15 px-2 py-0.5 rounded-sm transition-colors flex items-center gap-1"
                            >
                              <RefreshCw className="w-2.5 h-2.5" /> Restore Default Specs
                            </button>
                          </div>
                          <div className="markdown-body text-xs font-mono text-white/90 leading-relaxed space-y-2">
                            <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, [rehypeKatex, { throwOnError: false, strict: false }]]} components={MarkdownComponents}>{finalExplanationMarkdown}</Markdown>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-150 markdown-body text-xs font-mono text-white/90 leading-relaxed pr-2">
                          <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, [rehypeKatex, { throwOnError: false, strict: false }]]} components={MarkdownComponents}>{finalActiveStageMarkdown}</Markdown>
                        </div>
                      )}

                      {/* Unified Spacetime-Chemistry Bridge Separator */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[9px] font-mono text-purple-400/60 uppercase tracking-widest font-bold">
                          Quantic Core Elements
                        </span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      {/* Integrated Chemistry Specs for the Selected Object Only */}
                      <ChemistryMatrix activeId={activeDashboardId} />
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {specsTab === 'biosphere' && (
            /* Biosphere Explorer View integrated inside the panel */
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#030305]">
              {/* Search & Filter bar inside the panel */}
              <div className="bg-[#050508] border-b border-white/5 p-4 shrink-0 space-y-3">
                {/* Micro-search input */}
                <div className="flex items-center bg-[#030305] border border-white/10 px-3 py-1.5 rounded-sm hover:border-emerald-500/30 focus-within:border-emerald-500/60 transition-all shadow-inner">
                  <Search className="w-3.5 h-3.5 text-white/40 mr-2" />
                  <input
                    type="text"
                    value={bioSearch}
                    onChange={(e) => setBioSearch(e.target.value)}
                    placeholder="Filter organisms or cell adaptations..."
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[11px] font-mono text-white placeholder:text-white/25 py-0.5"
                  />
                  {bioSearch && (
                    <button
                      onClick={() => setBioSearch('')}
                      className="text-white/40 hover:text-white/80 text-[10px] font-mono select-none"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Elegant micro category carousel */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin select-none">
                  {['All', 'Plant', 'Marine Plant', 'Fungi', 'Mammal', 'Bird', 'Reptile', 'Marine Animal', 'Insect', 'Amphibian', 'Mollusk'].map((cat) => {
                    const isSelected = bioCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setBioCategory(cat)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase whitespace-nowrap transition-all border ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-black/30 border-white/5 text-white/40 hover:border-emerald-500/20 hover:text-white/80'
                        }`}
                      >
                        {cat === 'All' ? 'ALL SPECIMENS' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtered items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
                {(() => {
                  const filtered = ORGANISMS_DATA.filter((o) => {
                    const matchesCategory = bioCategory === 'All' || o.cat === bioCategory;
                    const matchesSearch =
                      o.name.toLowerCase().includes(bioSearch.toLowerCase()) ||
                      o.sub.toLowerCase().includes(bioSearch.toLowerCase()) ||
                      o.env.toLowerCase().includes(bioSearch.toLowerCase()) ||
                      o.cell.toLowerCase().includes(bioSearch.toLowerCase());
                    return matchesCategory && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 font-mono text-xs text-white/30 border border-dashed border-white/5 rounded p-4">
                        No dynamic adapters match your criteria.
                      </div>
                    );
                  }

                  return filtered.map((org) => {
                    const id = `${org.cat}-${org.sub}`;
                    const isExpanded = expandedBioIds.has(id);
                    return (
                      <div
                        key={id}
                        className={`border rounded transition-all duration-200 overflow-hidden ${
                          isExpanded
                            ? 'border-emerald-500/30 bg-[#070a09]/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                            : 'border-white/5 bg-black/20 hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {/* Clickable Header */}
                        <div
                          onClick={() => {
                            const next = new Set(expandedBioIds);
                            if (next.has(id)) next.delete(id);
                            else next.add(id);
                            setExpandedBioIds(next);
                          }}
                          className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0 select-none">{org.emoji}</span>
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-[11.5px] font-mono font-bold text-white leading-tight">
                                  {org.name}
                                </span>
                                <span className="text-[9.5px] font-mono text-white/50 leading-tight">
                                  ({org.sub})
                                </span>
                              </div>
                              <span className="text-[8px] font-mono text-emerald-400/80 uppercase font-semibold mt-0.5 block tracking-widest">
                                {org.cat}
                              </span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-emerald-400' : ''
                            }`}
                          />
                        </div>

                        {/* Expanded Body Content */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-white/5 space-y-3 font-mono text-[10px] leading-relaxed select-text animate-fade-in text-white/80">
                            <div className="space-y-1.5 bg-black/40 p-2.5 rounded border border-white/5">
                              <div className="text-emerald-400 font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                Physical Habitat &amp; Stressor
                              </div>
                              <p className="text-white/70 leading-normal text-[9.5px] font-sans">
                                {org.env}
                              </p>
                            </div>

                            <div className="space-y-1.5 bg-black/40 p-2.5 rounded border border-white/5">
                              <div className="text-emerald-400 font-bold text-[8.5px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                Adaptive Cellular Systems
                              </div>
                              <p className="text-white/70 leading-normal text-[9.5px] font-sans">
                                {org.cell}
                              </p>
                            </div>

                            <div className="pt-1 select-none">
                              <button
                                onClick={() => {
                                  const askTemplate = `Tell me more about how the ${org.sub} (${org.name}) uses cellular and molecular systems to survive in its ecosystem: ${org.env.toLowerCase()}`;
                                  setTopic(askTemplate);
                                  setSpecsTab('ledger');
                                  handleSubmit(undefined, askTemplate);
                                }}
                                className="w-full py-1.5 rounded bg-emerald-950/20 border border-emerald-500/25 hover:bg-emerald-950/40 text-emerald-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                              >
                                <Sparkles className="w-3 h-3 text-emerald-400" /> Consult Spacetime AI
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {specsTab === 'reactions' && (
            <ReactionCatalog 
              onAskAI={(question) => {
                setTopic(question);
                setSpecsTab('ledger');
                handleSubmit(undefined, question);
              }}
              onTriggerReactionInChamber={(rx) => {
                const elementsToDeposit = mapAtomsToDashboardIds(rx);
                // Turn on simulation mode
                useDashboardStore.getState().setSimulationMode(true);
                // Reset simulation selected
                useDashboardStore.setState({ simulationSelected: [] });
                // Deposit elements sequentially
                for (const el of elementsToDeposit) {
                  useDashboardStore.getState().toggleSimulationSelected(el);
                }
                // Automatically set simulation active/trigger collision!
                useDashboardStore.getState().setSimulationActive(true);
              }}
            />
          )}
        </div>

      </aside>
    </div>
  );
}
