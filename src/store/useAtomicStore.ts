import { create } from 'zustand';
import { ElementData } from '../data/elements';

interface AtomicState {
  selectedElement: ElementData | null;
  setSelectedElement: (element: ElementData | null) => void;
  selectedElement2: ElementData | null;
  setSelectedElement2: (element: ElementData | null) => void;
  isTableOpen: boolean;
  setTableOpen: (open: boolean) => void;
  bondingMode: boolean;
  setBondingMode: (bondingMode: boolean) => void;
}

export const useAtomicStore = create<AtomicState>((set) => ({
  selectedElement: null,
  setSelectedElement: (selectedElement) => set({ selectedElement }),
  selectedElement2: null,
  setSelectedElement2: (selectedElement2) => set({ selectedElement2 }),
  isTableOpen: false,
  setTableOpen: (isTableOpen) => set({ isTableOpen }),
  bondingMode: false,
  setBondingMode: (bondingMode) => set({ bondingMode }),
}));
