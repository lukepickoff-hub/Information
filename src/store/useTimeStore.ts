import { create } from 'zustand';

interface TimeState {
  currentTime: number; // Unix timestamp in milliseconds
  timeSpeed: number; // multiplier, e.g., 1 day per second
  isPlaying: boolean;
  filterRange: [number, number]; // [startMs, endMs]
  setTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  togglePlaying: () => void;
  advanceTime: (deltaMs: number) => void;
  setFilterRange: (range: [number, number]) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  currentTime: new Date('2000-01-01').getTime(),
  timeSpeed: 86400, // Default: 1 day per real-time second
  isPlaying: true,
  filterRange: [new Date('1900-01-01').getTime(), new Date('2100-01-01').getTime()],
  setTime: (time) => set({ currentTime: time }),
  setSpeed: (speed) => set({ timeSpeed: speed }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  advanceTime: (deltaMs) => set((state) => ({
    currentTime: state.isPlaying ? state.currentTime + (deltaMs * state.timeSpeed) : state.currentTime
  })),
  setFilterRange: (range) => set({ filterRange: range }),
}));
