import React, { useEffect, useState } from 'react';
import { Play, Pause, FastForward, Rewind, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useTimeStore } from '../store/useTimeStore';

export const TimelineBar = () => {
  const { isPlaying, timeSpeed, togglePlaying, setSpeed, setTime, filterRange, setFilterRange } = useTimeStore();
  
  // Use a local state for the UI time to avoid constant re-renders from Zustand store changes inside requestAnimationFrame
  const [displayTime, setDisplayTime] = useState(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    
    // Sync UI with the fast-moving store time
    const syncTimeUI = () => {
      setDisplayTime(useTimeStore.getState().currentTime);
      animationFrameId = requestAnimationFrame(syncTimeUI);
    };
    
    syncTimeUI();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const speeds = [
    { label: '1x', multiplier: 1 },
    { label: 'Hour/s', multiplier: 3600 },
    { label: 'Day/s', multiplier: 86400 },
    { label: 'Week/s', multiplier: 604800 },
    { label: 'Month/s', multiplier: 2592000 },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    // Simple mapping: 0 to 100 maps to year 2000 to 2050
    const startYear = new Date('2000-01-01').getTime();
    const endYear = new Date('2050-01-01').getTime();
    
    const newTime = startYear + (val / 100) * (endYear - startYear);
    setTime(newTime);
  };

  const filterMinYear = new Date(filterRange[0]).getFullYear();
  const filterMaxYear = new Date(filterRange[1]).getFullYear();

  const handleMinYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value, 10);
    const max = new Date(filterRange[1]).getFullYear();
    if (!isNaN(min)) {
      setFilterRange([new Date(`${min}-01-01`).getTime(), new Date(`${Math.max(min, max)}-12-31`).getTime()]);
    }
  };

  const handleMaxYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value, 10);
    const min = new Date(filterRange[0]).getFullYear();
    if (!isNaN(max)) {
      setFilterRange([new Date(`${Math.min(min, max)}-01-01`).getTime(), new Date(`${max}-12-31`).getTime()]);
    }
  };

  // Safe mapping back to slider
  const startYear = new Date('2000-01-01').getTime();
  const endYear = new Date('2050-01-01').getTime();
  const sliderPercentage = Math.max(0, Math.min(100, ((displayTime - startYear) / (endYear - startYear)) * 100));

  return (
    <div className="h-44 w-full bg-[#080b12] border-t border-white/10 p-8 flex flex-col justify-between z-20 relative">
      <div className="flex justify-between items-center mb-2 font-mono text-[10px] tracking-widest text-cyan-400/60 uppercase">
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            onClick={togglePlaying}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-1">
            {speeds.map((s) => (
              <button
                key={s.label}
                onClick={() => setSpeed(s.multiplier)}
                className={`px-3 py-1.5 text-[9px] font-mono rounded transition-colors ${
                  timeSpeed === s.multiplier 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-4 bg-black/40 rounded-lg border border-white/10 p-1.5 px-3">
            <Filter size={12} className="text-cyan-500 mr-1" />
            <span className="text-white/60">ERA FILTER:</span>
            <input 
              type="number" 
              value={filterMinYear} 
              onChange={handleMinYearChange} 
              className="bg-transparent border-b border-cyan-500/30 w-12 text-center text-white focus:outline-none focus:border-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-white/40">-</span>
            <input 
              type="number" 
              value={filterMaxYear} 
              onChange={handleMaxYearChange} 
              className="bg-transparent border-b border-cyan-500/30 w-12 text-center text-white focus:outline-none focus:border-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="text-white opacity-100 flex items-center bg-black/40 border border-white/10 rounded px-4 py-2 shadow-inner">
           <Clock size={14} className="text-cyan-500 mr-2" />
           <span className="hidden sm:inline">OBSERVATION EPOCH: </span> {format(new Date(displayTime), 'MMM dd, yyyy HH:mm:ss')}
        </div>
      </div>
      
      {/* Bottom row: Extensible Timeline Slider */}
      <div className="relative h-12 flex flex-col justify-center w-full">
        <input 
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={sliderPercentage}
          onChange={handleSliderChange}
          className="w-full h-6 appearance-none cursor-pointer absolute z-20 opacity-0"
        />

        {/* Visual Track matching Immersive Theme */}
        <div className="w-full h-[1px] bg-white/20 relative pointer-events-none z-10">
           <div className="absolute left-0 top-0 h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" style={{ width: `${sliderPercentage}%` }}></div>
           
           <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${sliderPercentage}%` }}>
             <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee] border-2 border-white"></div>
           </div>
        </div>
        
        {/* Axis markers */}
        <div className="flex justify-between mt-8 text-[9px] font-mono text-white/40 uppercase tracking-tighter w-full px-0 pointer-events-none">
          <span>2000</span>
          <span>2010</span>
          <span>2020</span>
          <span>2030</span>
          <span>2040</span>
          <span>2050</span>
        </div>
      </div>
    </div>
  );
};
