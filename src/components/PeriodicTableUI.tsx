import { useAtomicStore } from '../store/useAtomicStore';
import { ELEMENTS, ElementData } from '../data/elements';
import { X, Search, Link2 } from 'lucide-react';
import { useState, useMemo } from 'react';

export function PeriodicTableUI() {
  const { isTableOpen, setTableOpen, selectedElement, setSelectedElement, selectedElement2, setSelectedElement2, bondingMode, setBondingMode } = useAtomicStore();
  const [filter, setFilter] = useState('');

  const handleElementClick = (el: ElementData) => {
    if (bondingMode) {
      if (!selectedElement) {
        setSelectedElement(el);
      } else if (!selectedElement2 && el.atomicNumber !== selectedElement.atomicNumber) {
        setSelectedElement2(el);
        setTableOpen(false);
      } else if (selectedElement && selectedElement2) {
        setSelectedElement(el);
        setSelectedElement2(null);
      }
    } else {
      setSelectedElement(el);
      setSelectedElement2(null);
      setTableOpen(false);
    }
  };

  const filteredElements = useMemo(() => {
    if (!filter) return ELEMENTS;
    return ELEMENTS.filter(e => 
      e.name.toLowerCase().includes(filter.toLowerCase()) || 
      e.symbol.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  if (!isTableOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-8 font-sans overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-purple-400">Periodic Table of Elements</h2>
          <button 
            onClick={() => {
              setBondingMode(!bondingMode);
              if (bondingMode) setSelectedElement2(null); // Clear second target if turning off
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-colors ${bondingMode ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
          >
            <Link2 className="w-4 h-4" />
            Bonding Mode {bondingMode ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          {bondingMode && selectedElement && (
            <div className="text-sm font-mono text-fuchsia-300 mr-4">
              {selectedElement.symbol} + {selectedElement2 ? selectedElement2.symbol : '?'}
            </div>
          )}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input 
              type="text" 
              placeholder="Search elements..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white/90 focus:border-purple-500/50 outline-none transition-colors"
            />
          </div>
          <button onClick={() => setTableOpen(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto overflow-x-auto pb-10 custom-scrollbar">
        {filter ? (
           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start">
             {filteredElements.map(el => (
               <ElementCard 
                 key={el.atomicNumber} 
                 el={el} 
                 onClick={() => handleElementClick(el)} 
                 selected={selectedElement?.atomicNumber === el.atomicNumber || selectedElement2?.atomicNumber === el.atomicNumber}
                 isSecond={selectedElement2?.atomicNumber === el.atomicNumber} 
               />
             ))}
           </div>
        ) : (
          <div className="relative min-w-[1200px]" style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: '6px' }}>
            {ELEMENTS.map(el => {
              let gridColumn = el.group;
              let gridRow = el.period;
              
              return (
                <div key={el.atomicNumber} style={{ gridColumn, gridRow }}>
                  <ElementCard 
                    el={el} 
                    onClick={() => handleElementClick(el)} 
                    selected={selectedElement?.atomicNumber === el.atomicNumber || selectedElement2?.atomicNumber === el.atomicNumber} 
                    isSecond={selectedElement2?.atomicNumber === el.atomicNumber}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ElementCard({ el, onClick, selected, isSecond }: { el: ElementData, onClick: () => void, selected: boolean, isSecond?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full aspect-square border cursor-pointer flex flex-col items-center justify-center gap-1 transition-all group overflow-hidden ${selected ? (isSecond ? 'bg-fuchsia-900/40 border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.4)]' : 'bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]') : 'bg-black/50 border-white/10 hover:border-white/40 hover:bg-white/5'}`}
    >
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: el.color }} />
      
      <div className="text-[10px] text-white/40 absolute top-1 left-2 font-mono">{el.atomicNumber}</div>
      <div className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-[-4px]" style={{ color: el.color }}>{el.symbol}</div>
      <div className="text-[9px] text-white/60 lowercase tracking-wider truncate w-full text-center px-1">{el.name}</div>
      <div className="text-[8px] text-white/30 font-mono absolute bottom-1 right-2">{el.mass.toFixed(2)}</div>
    </div>
  );
}
