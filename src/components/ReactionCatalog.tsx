import { useState, useMemo } from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';
import { REACTION_DOMAINS, ReactionDomain, ReactionItem } from '../data/reactionData';

interface ReactionCatalogProps {
  onAskAI: (question: string) => void;
  onTriggerReactionInChamber?: (reaction: ReactionItem) => void;
}

export function ReactionCatalog({ onAskAI, onTriggerReactionInChamber }: ReactionCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [expandedReactionIds, setExpandedReactionIds] = useState<Set<string>>(new Set());

  // Toggle reaction card expand/collapse
  const toggleReaction = (id: string) => {
    setExpandedReactionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all list items helper
  const expandAll = (ids: string[]) => {
    setExpandedReactionIds(new Set(ids));
  };

  // Collapse all list items helper
  const collapseAll = () => {
    setExpandedReactionIds(new Set());
  };

  // Filter products intelligently
  const filteredDomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    return REACTION_DOMAINS.map(domain => {
      // If we filtered by specific domain, skip if not matching
      if (selectedDomainId !== 'all' && domain.id !== selectedDomainId) {
        return { ...domain, reactions: [] };
      }

      // Filter reactions in this domain
      const matchingReactions = domain.reactions.filter(rx => {
        const matchName = rx.name.toLowerCase().includes(q);
        const matchSub = rx.subCategory.toLowerCase().includes(q);
        const matchEq = rx.equation.toLowerCase().includes(q);
        const matchDesc = rx.description.toLowerCase().includes(q);
        const matchAtoms = rx.atoms.some(a => 
          a.name.toLowerCase().includes(q) || 
          a.specs.toLowerCase().includes(q)
        );
        return matchName || matchSub || matchEq || matchDesc || matchAtoms;
      });

      return {
        ...domain,
        reactions: matchingReactions
      };
    }).filter(d => d.reactions.length > 0);
  }, [searchQuery, selectedDomainId]);

  // Total matching reactions
  const totalCount = useMemo(() => {
    return filteredDomains.reduce((acc, d) => acc + d.reactions.length, 0);
  }, [filteredDomains]);

  // Get flat list of matches for expand/collapse all
  const allMatchingIds = useMemo(() => {
    return filteredDomains.flatMap(d => d.reactions.map(r => r.id));
  }, [filteredDomains]);

  // Get unique sub-color styles based on domain
  const getDomainLabelStyle = (id: string) => {
    switch (id) {
      case 'star': return 'text-amber-400 border-amber-500/15 bg-amber-950/15';
      case 'plant': return 'text-teal-400 border-teal-500/15 bg-teal-950/15';
      case 'cell': return 'text-emerald-400 border-emerald-500/15 bg-emerald-950/15';
      case 'tissue': return 'text-purple-400 border-purple-500/15 bg-purple-950/15';
      case 'planet': return 'text-sky-400 border-sky-500/15 bg-sky-950/15';
      case 'organ': return 'text-orange-400 border-orange-500/15 bg-orange-950/15';
      case 'animal': return 'text-rose-400 border-rose-500/15 bg-rose-950/15';
      default: return 'text-white/60 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#030305]">
      {/* Search & Header Selection Controller */}
      <div className="bg-[#050508] border-b border-white/5 p-4 shrink-0 space-y-3">
        {/* Micro search input element */}
        <div className="flex items-center bg-[#030305] border border-white/10 px-3 py-1.5 rounded-sm hover:border-purple-500/30 focus-within:border-purple-500/60 transition-all shadow-inner">
          <Search className="w-3.5 h-3.5 text-white/40 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equations, reactants, descriptions..."
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[11px] font-mono text-white placeholder:text-white/25 py-0.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white/80 text-[10px] font-mono cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Domain Toggles */}
        <div className="flex flex-wrap gap-1 select-none">
          <button
            onClick={() => setSelectedDomainId('all')}
            className={`px-2 py-1 rounded text-[8.5px] font-mono font-bold border transition-all cursor-pointer ${
              selectedDomainId === 'all'
                ? 'bg-purple-950/45 border-purple-500 text-purple-200 shadow-md'
                : 'bg-black/40 border-white/5 text-white/45 hover:border-white/20'
            }`}
          >
            ALL CORES ({REACTION_DOMAINS.reduce((acc, d) => acc + d.reactions.length, 0)})
          </button>
          {REACTION_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomainId(d.id)}
              className={`px-2 py-1 rounded text-[8.5px] font-mono font-bold border transition-all cursor-pointer ${
                selectedDomainId === d.id
                  ? 'bg-purple-950/45 border-purple-500 text-purple-200 shadow-md'
                  : 'bg-black/40 border-white/5 text-white/45 hover:border-white/20'
              }`}
              style={{
                borderColor: selectedDomainId === d.id ? d.color : undefined,
                color: selectedDomainId === d.id ? d.color : undefined
              }}
            >
              {d.id.toUpperCase()} ({d.reactions.length})
            </button>
          ))}
        </div>

        {/* Diagnostics & Expand Controllers */}
        <div className="flex items-center justify-between text-[8px] font-mono text-white/30 pt-1 border-t border-white/5">
          <span>MATCHING ENTRIES: {totalCount}</span>
          <div className="flex gap-2">
            <button
              onClick={() => expandAll(allMatchingIds)}
              className="hover:text-white/60 transition-colors uppercase cursor-pointer"
            >
              Expand All
            </button>
            <span>|</span>
            <button
              onClick={collapseAll}
              className="hover:text-white/60 transition-colors uppercase cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Main Scollable Reactions Deck */}
      <div id="reactions-deck" className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
        {filteredDomains.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-lg bg-black/20">
            <HelpCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <span className="text-xs font-mono text-white/40 block">No matching reaction files found</span>
            <span className="text-[9px] text-white/25 mt-1 block">Refine your query parameters</span>
          </div>
        ) : (
          filteredDomains.map(domain => {
            return (
              <div key={domain.id} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Domain Category Ribbon */}
                <div 
                  className="p-3 rounded-t border-b overflow-hidden flex items-center justify-between relative bg-[#09090e] border-white/5"
                  style={{ borderLeft: `3px solid ${domain.color}` }}
                >
                  <div className="flex items-center gap-2.5 z-10">
                    <span 
                      className="text-[10px] font-mono font-black border px-1.5 py-0.5 rounded"
                      style={{ color: domain.color, borderColor: `${domain.color}25` }}
                    >
                      {domain.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-mono font-black tracking-wider uppercase text-white">
                        {domain.title}
                      </h4>
                      <p className="text-[8.5px] text-white/30 font-sans mt-0.5 font-semibold">
                        Domain Category Catalog ({domain.reactions.length} active simulations)
                      </p>
                    </div>
                  </div>
                  <div 
                    className="absolute right-0 bottom-0 top-0 w-32 filter blur-2xl opacity-10 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${domain.color} 0%, transparent 70%)` }}
                  />
                </div>

                {/* Sub-reactions List */}
                <div className="space-y-1.5 pl-1 border-l border-white/5">
                  {domain.reactions.map(rx => {
                    const isExpanded = expandedReactionIds.has(rx.id);
                    const labelStyle = getDomainLabelStyle(domain.id);
                    
                    return (
                      <div 
                        key={rx.id} 
                        className={`border rounded transition-all duration-300 ${
                          isExpanded 
                            ? 'bg-[#06060a]/90 border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]' 
                            : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-[#040406]/55'
                        }`}
                      >
                        {/* Summary Header Block (Toggled) */}
                        <div 
                          onClick={() => toggleReaction(rx.id)}
                          className="p-3 flex items-center justify-between cursor-pointer select-none gap-3"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-white/35 block truncate">
                              🧩 {rx.subCategory}
                            </span>
                            <span className="text-[11px] font-mono font-bold tracking-tight text-white/90 block">
                              {rx.name}
                            </span>
                            <span className="text-[10px] text-purple-300/90 font-mono font-semibold tracking-wider block pt-0.5 truncate select-all">
                              {rx.equation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                            )}
                          </div>
                        </div>

                        {/* Interactive Drawer Panel */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-2.5 border-t border-white/5 space-y-3.5 font-mono text-[10px] leading-relaxed select-text animate-fade-in text-white/80">
                            {/* Equation Showcase Block */}
                            <div className="space-y-1.5 bg-black/60 border border-purple-500/10 p-2.5 rounded text-center animate-pulse">
                              <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Involved Quantum Formula</span>
                              <div className="text-purple-300 font-mono text-xs font-bold tracking-widest select-all">
                                {rx.equation}
                              </div>
                            </div>

                            {/* Detailed Explanation Text */}
                            <div className="space-y-1">
                              <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Empirical Description</span>
                              <p className="text-white/70 font-sans text-[10px] leading-relaxed">
                                {rx.description}
                              </p>
                            </div>

                            {/* Involved Reactants & Elements (Colored Chips) */}
                            {rx.atoms.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[7px] text-white/30 uppercase tracking-widest block font-bold">Key Reactants / Metrics</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {rx.atoms.map((atom, aIdx) => (
                                    <div 
                                      key={`${rx.id}-atom-${aIdx}`}
                                      className={`px-2 py-1 rounded text-[8.5px] font-mono border flex items-center gap-1.5 select-none ${labelStyle}`}
                                    >
                                      <span className="font-bold">{atom.name}</span>
                                      <span className="opacity-40">|</span>
                                      <span className="text-[7.5px] tracking-wide text-white/50">{atom.specs}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Contextual Action Interfaces */}
                            <div className="flex gap-2 pt-1 font-mono select-none">
                              {/* Ask AI Trigger */}
                              <button
                                onClick={() => {
                                  const prompt = `Tell me more about how the reaction "${rx.name}" (${rx.equation}) operates at scale within the domain: ${domain.title}. Specifically, what are the energetic transformations, thermodynamic catalysts, and scientific importances?`;
                                  onAskAI(prompt);
                                }}
                                className="flex-1 py-1.5 rounded bg-purple-950/20 border border-purple-500/25 hover:bg-purple-950/40 text-purple-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Consult Spacetime AI
                              </button>

                              {/* Load / Trigger in chamber */}
                              {onTriggerReactionInChamber && (
                                <button
                                  onClick={() => onTriggerReactionInChamber(rx)}
                                  className="px-2.5 py-1.5 rounded bg-[#10101b] border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/60 hover:text-white/90 font-mono text-[9px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                                  title="Add to target chamber"
                                >
                                  <Zap className="w-3 h-3 text-amber-400" /> Deposit Core
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
