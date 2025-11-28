import React, { useState } from 'react';
import { VideoIdea } from '../types';
import { generateScript } from '../services/geminiService';
import { Loader2, Zap, Copy, Check } from 'lucide-react';

interface ScriptStepProps {
  selectedIdea: VideoIdea | null;
  currentScript: string;
  setScript: (script: string) => void;
  onNext: () => void;
}

const ScriptStep: React.FC<ScriptStepProps> = ({ selectedIdea, currentScript, setScript, onNext }) => {
  const [duration, setDuration] = useState('30 seconds');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedIdea) return;
    setIsGenerating(true);
    try {
      const text = await generateScript(selectedIdea.hook, duration);
      setScript(text);
    } catch (e) {
      alert("Error generating script");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedIdea) {
    return <div className="text-center text-zinc-500 py-10">Please select an idea from the previous step.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Selected Hook</h3>
            <p className="text-xl text-white font-bold">"{selectedIdea.hook}"</p>
          </div>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-black border border-zinc-700 text-white text-sm rounded-lg p-2.5 focus:border-[#25F4EE] outline-none"
          >
            <option>15 seconds</option>
            <option>30 seconds</option>
            <option>60 seconds</option>
          </select>
        </div>

        {!currentScript ? (
          <div className="flex justify-center py-8">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-[#25F4EE] text-black hover:bg-[#1FD6D1] px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,244,238,0.4)]"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
              Generate Viral Script
            </button>
          </div>
        ) : (
          <div className="relative">
             <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-300 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                </button>
             </div>
            <textarea
              value={currentScript}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-96 bg-black border border-zinc-700 rounded-xl p-5 text-zinc-300 font-mono text-sm leading-relaxed focus:border-[#25F4EE] outline-none resize-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-zinc-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={onNext}
                className="bg-[#FE2C55] hover:bg-[#D91B40] text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Next: Metadata
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptStep;