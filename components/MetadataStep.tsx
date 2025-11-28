import React, { useState } from 'react';
import { generateMetadata } from '../services/geminiService';
import { Loader2, Hash, RefreshCw } from 'lucide-react';

interface MetadataStepProps {
  currentScript: string;
  caption: string;
  hashtags: string[];
  setCaption: (c: string) => void;
  setHashtags: (h: string[]) => void;
  onNext: () => void;
}

const MetadataStep: React.FC<MetadataStepProps> = ({ 
  currentScript, caption, hashtags, setCaption, setHashtags, onNext 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!currentScript) return;
    setIsGenerating(true);
    try {
      const data = await generateMetadata(currentScript);
      setCaption(data.caption);
      setHashtags(data.hashtags);
    } catch (e) {
      alert("Error generating metadata");
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate if empty on mount
  React.useEffect(() => {
    if (currentScript && !caption && !isGenerating) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentScript) {
     return <div className="text-center text-zinc-500 py-10">Please generate a script first.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Hash className="text-[#FE2C55]" /> Optimized Metadata
        </h3>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-[#25F4EE]" size={40} />
            <p className="text-zinc-500">Analyzing script for viral potential...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-[#25F4EE] outline-none h-24"
                placeholder="Caption will appear here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Hashtags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-zinc-800 text-[#25F4EE] px-3 py-1 rounded-full text-sm font-medium border border-zinc-700">
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>
              <button 
                onClick={handleGenerate}
                className="text-xs flex items-center gap-1 text-zinc-500 hover:text-white transition-colors"
              >
                <RefreshCw size={12}/> Regenerate Tags
              </button>
            </div>

            <div className="flex justify-end pt-4">
               <button
                onClick={onNext}
                className="bg-[#25F4EE] text-black hover:bg-[#1FD6D1] px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Next: Thumbnail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataStep;