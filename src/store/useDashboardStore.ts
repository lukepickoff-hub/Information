import { create } from 'zustand';

export type DashboardId = 'sun' | 'mercury' | 'venus' | 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'cell' | 'mitochondria' | 'skeleton' | 'human' | 'hydrogen' | 'helium' | 'lithium' | 'beryllium' | 'boron' | 'carbon' | 'nitrogen' | 'oxygen' | 'fluorine' | 'neon' | 'sodium' | 'magnesium' | 'aluminum' | 'silicon' | 'phosphorus' | 'sulfur' | 'chlorine' | 'argon' | 'potassium' | 'calcium';

interface DashboardState {
  activeDashboardId: DashboardId;
  activeTimelineStep: number;  // 1 to 5
  interactMode: boolean;       // Also used for simulation setup mode
  simulationMode: boolean;     // Whether simulation setup/run mode is enabled
  simulationSelected: DashboardId[]; // Objects chosen for reaction together
  simulationActive: boolean;   // Whether the simulator is running/active in the UI
  activeReaction: any | null;  // Stored reaction from catalog
  showAnnotations: boolean;
  quantumView: boolean;
  setShowAnnotations: (show: boolean) => void;
  setQuantumView: (val: boolean) => void;
  setDashboardId: (id: DashboardId) => void;
  setTimelineStep: (step: number) => void;
  setInteractMode: (mode: boolean) => void;
  setSimulationMode: (enabled: boolean) => void;
  toggleSimulationSelected: (id: DashboardId) => void;
  setSimulationActive: (active: boolean) => void;
  clearSimulation: () => void;
  setActiveReaction: (rx: any | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeDashboardId: 'moon',
  activeTimelineStep: 3, // Default is "Present Active" phase
  interactMode: false,
  simulationMode: false,
  simulationSelected: [],
  simulationActive: false,
  activeReaction: null,
  showAnnotations: true,
  quantumView: true,
  setShowAnnotations: (show) => set({ showAnnotations: show }),
  setQuantumView: (val) => set({ quantumView: val }),
  setDashboardId: (id) => set({ 
    activeDashboardId: id, 
    activeTimelineStep: 1,
    simulationMode: false,
    simulationActive: false,
    interactMode: false,
    activeReaction: null
  }), // default to birth and clear simulation mode on object swap
  setTimelineStep: (step) => set({ activeTimelineStep: step }),
  setInteractMode: (mode) => set({ interactMode: mode }),
  setSimulationMode: (enabled) => set((state) => {
    if (!enabled) {
      return { simulationMode: false, simulationActive: false, simulationSelected: [], interactMode: false, activeReaction: null };
    }
    return { simulationMode: true, interactMode: true };
  }),
  toggleSimulationSelected: (id) => set((state) => {
    const isSelected = state.simulationSelected.includes(id);
    let newSelected = [...state.simulationSelected];
    if (isSelected) {
      newSelected = newSelected.filter(x => x !== id);
    } else {
      // Limit to max 3 items for crisp interaction
      if (newSelected.length < 3) {
        newSelected.push(id);
      }
    }
    return { simulationSelected: newSelected };
  }),
  setSimulationActive: (active) => set({ simulationActive: active }),
  clearSimulation: () => set({ simulationSelected: [], simulationActive: false, activeReaction: null }),
  setActiveReaction: (rx) => set({ activeReaction: rx })
}));
