import React, { useState } from 'react';
import { VideoIdea } from '../types';
import { generateVideoIdeas } from '../services/geminiService';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface IdeationStepProps {
  onSelectIdea: (idea: VideoIdea) => void;
  savedIdeas: VideoIdea[];
}

const IdeationStep: React.FC<IdeationStepProps> = ({ onSelectIdea, savedIdeas }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>(savedIdeas);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateVideoIdeas(topic);
      const newIdeas = result.map((item, idx) => ({
        id: Date.now().toString() + idx,
        hook: item.hook,
        angle: item.angle
      }));
      setIdeas(newIdeas);
    } catch (e) {
      alert("Failed to generate ideas. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <label className="block text-sm font-medium text-zinc-400 mb-2">What's your niche or topic?</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Healthy meal prep for beginners..."
            className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#25F4EE] transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="bg-[#FE2C55] hover:bg-[#D91B40] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(254,44,85,0.3)]"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            Generate
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {ideas.map((idea) => (
          <div 
            key={idea.id}
            onClick={() => onSelectIdea(idea)}
            className="group bg-zinc-900/50 border border-zinc-800 hover:border-[#25F4EE]/50 p-5 rounded-2xl cursor-pointer transition-all hover:bg-zinc-900 hover:shadow-lg hover:shadow-[#25F4EE]/10 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#25F4EE] transition-colors">
                {idea.hook}
              </h3>
              <p className="text-sm text-zinc-400">{idea.angle}</p>
            </div>
            <div className="bg-zinc-800 p-2 rounded-full group-hover:bg-[#25F4EE] group-hover:text-black transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeationStep;