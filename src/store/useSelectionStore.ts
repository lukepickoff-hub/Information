import { create } from 'zustand';

export interface CelestialObject {
  id: string;
  name: string;
  distance: number; // distance from Sun logically
  size: number;
  color: string;
  speed: number;
  orbitalPeriod: number; // days
  type: string;
  mass: string;
  radius: string;
  gravity: string;
  description: string;
  energy: string;
  force: string;
  existence: [number, number]; // [startMs, endMs]
}

interface SelectionState {
  selectedObject: CelestialObject | null;
  setSelectedObject: (obj: CelestialObject | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));
