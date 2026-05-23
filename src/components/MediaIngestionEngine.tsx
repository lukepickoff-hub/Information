import { useState } from 'react';
import { Upload, Film, Music, Book, Settings2, Sparkles, X, Play } from 'lucide-react';

export function MediaIngestionEngine({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings
  const [targetMedium, setTargetMedium] = useState('script');
  const [themeFocus, setThemeFocus] = useState('maintain');

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*,audio/*,text/plain,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setSelectedFile(file);
    };
    input.click();
  };

  const handleProcess = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing pipeline
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setActiveTab('generate');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a0f] border border-cyan-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col font-sans shadow-[0_0_50px_rgba(34,211,238,0.15)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-white/5 p-4 items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm uppercase font-bold tracking-widest text-cyan-400">Media Generation Engine</h2>
        </div>

        <div className="flex p-4 gap-4 bg-black/40 border-b border-white/5">
          <button 
            className={`flex-1 flex gap-2 items-center justify-center py-2 text-xs font-bold uppercase tracking-widest border-b-2 ${activeTab === 'upload' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/30 hover:text-white/60'}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="w-4 h-4" /> 1. Ingest
          </button>
          <button 
            className={`flex-1 flex gap-2 items-center justify-center py-2 text-xs font-bold uppercase tracking-widest border-b-2 ${activeTab === 'generate' ? 'border-purple-400 text-purple-400' : 'border-transparent text-white/30 hover:text-white/60'}`}
            onClick={() => setActiveTab('generate')}
          >
            <Settings2 className="w-4 h-4" /> 2. Generate
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors bg-white/5"
                onClick={handleUploadClick}
              >
                <div className="flex gap-4 text-white/20">
                  <Film className="w-8 h-8" />
                  <Music className="w-8 h-8" />
                  <Book className="w-8 h-8" />
                </div>
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-cyan-400 font-bold">{selectedFile.name}</p>
                    <p className="text-xs text-white/40 mt-1">Ready for analysis</p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest text-center">Click to upload Video, Audio, or Text<br/><span className="text-xs font-mono lowercase">(.mp4, .mp3, .txt, .pdf supported)</span></p>
                )}
              </div>

              <button 
                onClick={handleProcess}
                disabled={!selectedFile || isProcessing}
                className="w-full py-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 rounded-lg uppercase tracking-widest text-xs font-bold disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Analyzing Themes & Narratives...' : 'Start Complete Analysis'}
              </button>

              {isProcessing && (
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              )}
              
              <div className="text-xs text-center text-white/30">
                Core engine parses raw structural data to find overarching themes and logical narratives.
              </div>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 block">Target Form</label>
                  <select 
                    value={targetMedium}
                    onChange={(e) => setTargetMedium(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded p-3 text-sm text-white/80 focus:border-purple-500 outline-none"
                  >
                    <option value="script">Video Script Adaptation</option>
                    <option value="soundtrack">Anime Soundtrack Arrangement</option>
                    <option value="visual-novel">Visual Novel Game Text</option>
                    <option value="book">Prose Expansion</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 block">Thematic Bias</label>
                  <select 
                    value={themeFocus}
                    onChange={(e) => setThemeFocus(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded p-3 text-sm text-white/80 focus:border-purple-500 outline-none"
                  >
                    <option value="maintain">Maintain Original Themes</option>
                    <option value="darker">Shift to Darker Subtext</option>
                    <option value="hopeful">Shift to Hopeful Outlook</option>
                    <option value="sci-fi">Re-contextualize as Sci-Fi</option>
                  </select>
                </div>
              </div>

              <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-lg flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-purple-100 font-bold mb-1">Semantic Pipeline Ready</p>
                  <p className="text-xs text-purple-300/60 leading-relaxed mb-4">
                    The engine has extracted the core narrative beats. It will now construct a '{targetMedium}' applying a '{themeFocus}' thematic shift.
                  </p>
                  <button className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-500/50 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                    <Play className="w-4 h-4" /> Generate Media
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
