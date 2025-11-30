import React, { useState } from 'react';
import { generateThumbnail } from '../services/geminiService';
import { Loader2, Image as ImageIcon, Download } from 'lucide-react';

interface ThumbnailStepProps {
  selectedIdeaHook: string;
  thumbnailUrl: string | null;
  setThumbnailUrl: (url: string | null) => void;
  onNext: () => void;
}

const ThumbnailStep: React.FC<ThumbnailStepProps> = ({ 
  selectedIdeaHook, thumbnailUrl, setThumbnailUrl, onNext 
}) => {
  const [prompt, setPrompt] = useState(selectedIdeaHook || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const url = await generateThumbnail(prompt);
      if (url) {
        setThumbnailUrl(url);
      } else {
        alert("Failed to generate thumbnail. The model might have blocked the request due to safety settings.");
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error generating thumbnail: ${e.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Controls */}
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-fit">
            <h3 className="text-white font-bold text-lg mb-4">Thumbnail Generator</h3>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Visual Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-[#25F4EE] outline-none h-32 mb-4"
              placeholder="Describe the background image..."
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#FE2C55] hover:bg-[#D91B40] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <ImageIcon size={20} />}
              Generate AI Image
            </button>
         </div>

         {/* Preview */}
         <div className="flex flex-col items-center">
            <div className="relative w-[280px] h-[498px] bg-black border-4 border-zinc-800 rounded-[30px] overflow-hidden shadow-2xl shadow-black/50">
               {/* TikTok UI Overlay Simulation */}
               <div className="absolute top-4 left-0 right-0 z-20 flex justify-center text-white/50 text-xs font-bold">Following | For You</div>
               <div className="absolute right-2 bottom-20 z-20 flex flex-col gap-4 items-center opacity-80">
                  <div className="w-10 h-10 rounded-full bg-zinc-700/50"></div>
                  <div className="w-8 h-8 rounded-full bg-zinc-700/50"></div>
                  <div className="w-8 h-8 rounded-full bg-zinc-700/50"></div>
               </div>
               
               {thumbnailUrl ? (
                 <img src={thumbnailUrl} alt="Generated Thumbnail" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                    <p className="text-center px-4">Preview will appear here</p>
                 </div>
               )}
            </div>
            
            {thumbnailUrl && (
              <div className="mt-6 flex gap-3">
                 <a 
                   href={thumbnailUrl} 
                   download="tiktok-thumbnail.png"
                   className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                 >
                   <Download size={16}/> Download
                 </a>
                 <button
                    onClick={onNext}
                    className="bg-[#25F4EE] text-black hover:bg-[#1FD6D1] px-6 py-2 rounded-lg font-bold transition-colors text-sm"
                  >
                    Next: Upload
                  </button>
              </div>
            )}
         </div>
       </div>
    </div>
  );
};

export default ThumbnailStep;