import React from 'react';
import { ContentStep } from '../types';
import { Lightbulb, FileText, Hash, Image, UploadCloud } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: ContentStep;
  setStep: (step: ContentStep) => void;
}

const steps = [
  { id: ContentStep.IDEATION, label: 'Ideation', icon: Lightbulb },
  { id: ContentStep.SCRIPTING, label: 'Scripting', icon: FileText },
  { id: ContentStep.METADATA, label: 'Metadata', icon: Hash },
  { id: ContentStep.THUMBNAIL, label: 'Thumbnail', icon: Image },
  { id: ContentStep.UPLOAD, label: 'Upload', icon: UploadCloud },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep }) => {
  return (
    <div className="flex justify-between items-center mb-8 px-2 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isPast = steps.findIndex(s => s.id === currentStep) > index;

        return (
          <button
            key={step.id}
            onClick={() => setStep(step.id)}
            className={`flex flex-col items-center min-w-[64px] group transition-all duration-300 ${
              isActive ? 'text-[#25F4EE] scale-110' : isPast ? 'text-white/80' : 'text-zinc-600'
            }`}
          >
            <div className={`p-3 rounded-full mb-2 transition-all duration-300 border-2 ${
              isActive 
                ? 'bg-[#25F4EE]/10 border-[#25F4EE] shadow-[0_0_15px_rgba(37,244,238,0.3)]' 
                : isPast 
                  ? 'bg-zinc-800 border-zinc-500' 
                  : 'bg-zinc-900 border-zinc-800 group-hover:border-zinc-700'
            }`}>
              <Icon size={20} />
            </div>
            <span className="text-xs font-medium tracking-wide">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StepIndicator;