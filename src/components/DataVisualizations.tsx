import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DataVisualizations({ topic }: { topic: string }) {
  // Generate some illustrative data based on the topic
  // In a real app, the AI could return specific structured JSON for charting
  const data = useMemo(() => {
    const isEnergy = topic.toLowerCase().includes('sun') || topic.toLowerCase().includes('energy') || topic.toLowerCase().includes('star');
    const baseVal = isEnergy ? 100 : 20;

    return Array.from({ length: 7 }, (_, i) => ({
      name: `T+${i}`,
      value: Math.max(5, baseVal * Math.exp(-i * 0.3) + (Math.random() * 10 - 5)),
      force: Math.log(i + 2) * 15 + (Math.random() * 5)
    }));
  }, [topic]);

  return (
    <div className="w-full mt-8 bg-[#0c0c12] border border-white/5 rounded-lg p-6 font-sans">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#f97316] mb-6">Theoretical Analysis: Energy & Force Distribution</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForce" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 12 }} />
            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#ffffff10', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="value" name="Energy (Joules)" stroke="#f97316" fillOpacity={1} fill="url(#colorValue)" />
            <Area type="monotone" dataKey="force" name="Force (Newtons)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorForce)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-white/30 text-center mt-4 uppercase tracking-widest">
        * Simulated distribution model for illustrative purposes
      </div>
    </div>
  );
}
