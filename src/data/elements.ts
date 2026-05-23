export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: string;
  electrons: number[];
  color: string;
  mass: number;
}

export const ELEMENTS: ElementData[] = [
  { atomicNumber: 1, symbol: "H", name: "Hydrogen", group: 1, period: 1, mass: 1.008, category: "diatomic nonmetal", color: "#ffffff", electrons: [1] },
  { atomicNumber: 2, symbol: "He", name: "Helium", group: 18, period: 1, mass: 4.0026, category: "noble gas", color: "#d9ffff", electrons: [2] },
  { atomicNumber: 3, symbol: "Li", name: "Lithium", group: 1, period: 2, mass: 6.94, category: "alkali metal", color: "#cc80ff", electrons: [2, 1] },
  { atomicNumber: 4, symbol: "Be", name: "Beryllium", group: 2, period: 2, mass: 9.0122, category: "alkaline earth metal", color: "#c2ff00", electrons: [2, 2] },
  { atomicNumber: 5, symbol: "B", name: "Boron", group: 13, period: 2, mass: 10.81, category: "metalloid", color: "#ffb5b5", electrons: [2, 3] },
  { atomicNumber: 6, symbol: "C", name: "Carbon", group: 14, period: 2, mass: 12.011, category: "polyatomic nonmetal", color: "#909090", electrons: [2, 4] },
  { atomicNumber: 7, symbol: "N", name: "Nitrogen", group: 15, period: 2, mass: 14.007, category: "diatomic nonmetal", color: "#3050f8", electrons: [2, 5] },
  { atomicNumber: 8, symbol: "O", name: "Oxygen", group: 16, period: 2, mass: 15.999, category: "diatomic nonmetal", color: "#ff0d0d", electrons: [2, 6] },
  { atomicNumber: 9, symbol: "F", name: "Fluorine", group: 17, period: 2, mass: 18.998, category: "diatomic nonmetal", color: "#9e5128", electrons: [2, 7] },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", group: 18, period: 2, mass: 20.18, category: "noble gas", color: "#b3e3f5", electrons: [2, 8] },
  { atomicNumber: 11, symbol: "Na", name: "Sodium", group: 1, period: 3, mass: 22.99, category: "alkali metal", color: "#ab5cf2", electrons: [2, 8, 1] },
  { atomicNumber: 12, symbol: "Mg", name: "Magnesium", group: 2, period: 3, mass: 24.305, category: "alkaline earth metal", color: "#8aff00", electrons: [2, 8, 2] },
  { atomicNumber: 13, symbol: "Al", name: "Aluminum", group: 13, period: 3, mass: 26.982, category: "post-transition metal", color: "#bfa6a6", electrons: [2, 8, 3] },
  { atomicNumber: 14, symbol: "Si", name: "Silicon", group: 14, period: 3, mass: 28.085, category: "metalloid", color: "#f0c8a0", electrons: [2, 8, 4] },
  { atomicNumber: 15, symbol: "P", name: "Phosphorus", group: 15, period: 3, mass: 30.974, category: "polyatomic nonmetal", color: "#ff8000", electrons: [2, 8, 5] },
  { atomicNumber: 16, symbol: "S", name: "Sulfur", group: 16, period: 3, mass: 32.06, category: "polyatomic nonmetal", color: "#ffff30", electrons: [2, 8, 6] },
  { atomicNumber: 17, symbol: "Cl", name: "Chlorine", group: 17, period: 3, mass: 35.45, category: "diatomic nonmetal", color: "#1ff01f", electrons: [2, 8, 7] },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", group: 18, period: 3, mass: 39.95, category: "noble gas", color: "#80d1e3", electrons: [2, 8, 8] },
  { atomicNumber: 19, symbol: "K", name: "Potassium", group: 1, period: 4, mass: 39.098, category: "alkali metal", color: "#8f40d4", electrons: [2, 8, 8, 1] },
  { atomicNumber: 20, symbol: "Ca", name: "Calcium", group: 2, period: 4, mass: 40.078, category: "alkaline earth metal", color: "#3dff00", electrons: [2, 8, 8, 2] },
  { atomicNumber: 21, symbol: "Sc", name: "Scandium", group: 3, period: 4, mass: 44.956, category: "transition metal", color: "#e6e6e6", electrons: [2, 8, 9, 2] },
  { atomicNumber: 22, symbol: "Ti", name: "Titanium", group: 4, period: 4, mass: 47.867, category: "transition metal", color: "#bfc2c7", electrons: [2, 8, 10, 2] },
  { atomicNumber: 23, symbol: "V", name: "Vanadium", group: 5, period: 4, mass: 50.942, category: "transition metal", color: "#a6a6ab", electrons: [2, 8, 11, 2] },
  { atomicNumber: 24, symbol: "Cr", name: "Chromium", group: 6, period: 4, mass: 51.996, category: "transition metal", color: "#8a99c7", electrons: [2, 8, 13, 1] },
  { atomicNumber: 25, symbol: "Mn", name: "Manganese", group: 7, period: 4, mass: 54.938, category: "transition metal", color: "#9c7ac7", electrons: [2, 8, 13, 2] },
  { atomicNumber: 26, symbol: "Fe", name: "Iron", group: 8, period: 4, mass: 55.845, category: "transition metal", color: "#e06633", electrons: [2, 8, 14, 2] },
  { atomicNumber: 27, symbol: "Co", name: "Cobalt", group: 9, period: 4, mass: 58.933, category: "transition metal", color: "#f090a0", electrons: [2, 8, 15, 2] },
  { atomicNumber: 28, symbol: "Ni", name: "Nickel", group: 10, period: 4, mass: 58.693, category: "transition metal", color: "#50d050", electrons: [2, 8, 16, 2] },
  { atomicNumber: 29, symbol: "Cu", name: "Copper", group: 11, period: 4, mass: 63.546, category: "transition metal", color: "#c88033", electrons: [2, 8, 18, 1] },
  { atomicNumber: 30, symbol: "Zn", name: "Zinc", group: 12, period: 4, mass: 65.38, category: "transition metal", color: "#7d80b0", electrons: [2, 8, 18, 2] },
  { atomicNumber: 31, symbol: "Ga", name: "Gallium", group: 13, period: 4, mass: 69.723, category: "post-transition metal", color: "#c28f8f", electrons: [2, 8, 18, 3] },
  { atomicNumber: 32, symbol: "Ge", name: "Germanium", group: 14, period: 4, mass: 72.63, category: "metalloid", color: "#668f8f", electrons: [2, 8, 18, 4] },
  { atomicNumber: 33, symbol: "As", name: "Arsenic", group: 15, period: 4, mass: 74.922, category: "metalloid", color: "#bd80e3", electrons: [2, 8, 18, 5] },
  { atomicNumber: 34, symbol: "Se", name: "Selenium", group: 16, period: 4, mass: 78.971, category: "polyatomic nonmetal", color: "#ffa100", electrons: [2, 8, 18, 6] },
  { atomicNumber: 35, symbol: "Br", name: "Bromine", group: 17, period: 4, mass: 79.904, category: "diatomic nonmetal", color: "#a62929", electrons: [2, 8, 18, 7] },
  { atomicNumber: 36, symbol: "Kr", name: "Krypton", group: 18, period: 4, mass: 83.798, category: "noble gas", color: "#5cb8d1", electrons: [2, 8, 18, 8] }
];
