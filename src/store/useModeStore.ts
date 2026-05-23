import { create } from 'zustand';

type ViewMode = 'universe' | 'atomic' | 'anatomy' | 'cell' | 'quantum';

interface ModeState {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: 'universe',
  setMode: (mode) => set({ mode }),
}));
