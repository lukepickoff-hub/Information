import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

type RowData = {
  id: string;
  category: string;
  name: string;
  definition: string;
  actions: string;
  signals: string;
};

const ENERGY_DATA: RowData[] = [
  { id: '1', category: 'Energy', name: 'ATP', definition: 'Adenosine triphosphate; the primary energy carrier in cells.', actions: 'Releases energy via hydrolysis of phosphate bonds.', signals: 'High AMP/ATP ratio signals energy depletion.' },
  { id: '2', category: 'Information', name: 'DNA', definition: 'Deoxyribonucleic acid; stores genetic instructions.', actions: 'Replicates before cell division; transcribed to RNA.', signals: 'DNA damage signals p53 activation.' },
  { id: '3', category: 'Matter', name: 'Carbon Machine', definition: 'Organic compounds and enzymes that structure cells.', actions: 'Catalyze reactions, build cellular structures.', signals: 'Unfolded proteins signal ER stress.' },
  { id: '4', category: 'Entropy', name: 'Heat/Waste', definition: 'Disorder inevitably increasing from energy usage.', actions: 'Dissipates from the body/cell to environment.', signals: 'Excess heat signals heat shock response.' },
];

export function ScientificTables() {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState<keyof RowData>('category');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredAndSorted = useMemo(() => {
    let result = ENERGY_DATA.filter(row => 
      row.name.toLowerCase().includes(filter.toLowerCase()) || 
      row.category.toLowerCase().includes(filter.toLowerCase()) ||
      row.definition.toLowerCase().includes(filter.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [filter, sortField, sortDir]);

  const toggleSort = (field: keyof RowData) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full mt-8 bg-[#0c0c12] border border-white/5 rounded-lg overflow-hidden font-sans">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Systems Overview</h3>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text" 
            placeholder="Filter keywords..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white/90 focus:border-emerald-500/50 outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/20 text-white/40 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('category')}>Category {sortField === 'category' && (sortDir === 'asc' ? '↑' : '↓')}</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>Topic {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAndSorted.map(row => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => toggleExpand(row.id)}>
                  <td className="px-4 py-3 font-medium text-emerald-400">{row.category}</td>
                  <td className="px-4 py-3 text-white/90">{row.name}</td>
                  <td className="px-4 py-3 text-white/40 flex items-center gap-2">
                    {expandedIds.has(row.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="text-xs">Click to {expandedIds.has(row.id) ? 'collapse' : 'expand'}</span>
                  </td>
                </tr>
                {expandedIds.has(row.id) && (
                  <tr className="bg-black/30">
                    <td colSpan={3} className="px-6 py-4 whitespace-normal text-white/70 space-y-3">
                      <div><strong className="text-emerald-500/80 mr-2 uppercase text-[10px] tracking-widest">Definition:</strong> {row.definition}</div>
                      <div><strong className="text-emerald-500/80 mr-2 uppercase text-[10px] tracking-widest">Actions:</strong> {row.actions}</div>
                      <div><strong className="text-emerald-500/80 mr-2 uppercase text-[10px] tracking-widest">Signals:</strong> {row.signals}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
