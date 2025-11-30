
import React, { useState, useEffect } from 'react';
import StepIndicator from './components/StepIndicator';
import IdeationStep from './components/IdeationStep';
import ScriptStep from './components/ScriptStep';
import MetadataStep from './components/MetadataStep';
import ThumbnailStep from './components/ThumbnailStep';
import UploadStep from './components/UploadStep';
import { PrivacyPolicyPage, TermsOfServicePage } from './components/LegalPages';
import AuthCallback from './components/AuthCallback';
import { ContentStep, GeneratedContent, VideoIdea, TikTokAccount, ScheduledPost } from './types';
import { Video } from 'lucide-react';

const App: React.FC = () => {
  // Simple Routing Logic
  const pathname = window.location.pathname;
  if (pathname === '/auth/callback') {
    return <AuthCallback />;
  }
  if (pathname === '/privacy-policy') {
    return <PrivacyPolicyPage />;
  }
  if (pathname === '/terms-of-service') {
    return <TermsOfServicePage />;
  }

  const [currentStep, setCurrentStep] = useState<ContentStep>(ContentStep.IDEATION);
  
  // State for Linked Accounts with Persistence
  const [accounts, setAccounts] = useState<TikTokAccount[]>(() => {
    const saved = localStorage.getItem('tiktok_accounts');
    return saved ? JSON.parse(saved) : [
      { id: '1', username: '@creator_one', avatarColor: '#25F4EE' }
    ];
  });

  // State for Scheduled Posts with Persistence
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem('tiktok_scheduled');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist accounts
  useEffect(() => {
    localStorage.setItem('tiktok_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Persist schedule
  useEffect(() => {
    localStorage.setItem('tiktok_scheduled', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  // Central State for the Content Pipeline
  const [content, setContent] = useState<GeneratedContent>({
    ideas: [],
    selectedIdea: null,
    script: '',
    caption: '',
    hashtags: [],
    thumbnailUrl: null,
    targetAccountId: '1',
    scheduledTime: null
  });

  const handleIdeaSelect = (idea: VideoIdea) => {
    setContent(prev => ({ ...prev, selectedIdea: idea }));
    setCurrentStep(ContentStep.SCRIPTING);
  };

  const updateScript = (script: string) => {
    setContent(prev => ({ ...prev, script }));
  };

  const updateMetadata = (caption: string, hashtags: string[]) => {
    setContent(prev => ({ ...prev, caption, hashtags }));
  };

  const updateThumbnail = (url: string | null) => {
    setContent(prev => ({ ...prev, thumbnailUrl: url }));
  };

  const handleAddAccount = (account: TikTokAccount) => {
    setAccounts(prev => [...prev, account]);
    // Auto select new account
    setContent(prev => ({ ...prev, targetAccountId: account.id }));
  };

  const handleSchedulePost = (post: ScheduledPost) => {
    setScheduledPosts(prev => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#25F4EE] selection:text-black font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="mb-10 text-center space-y-2">
           <div className="inline-flex items-center gap-3 bg-zinc-900/80 px-5 py-2 rounded-full border border-zinc-800 backdrop-blur-sm mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#25F4EE] to-[#FE2C55] rounded-full">
                <Video size={16} className="text-white fill-white" />
              </span>
              <span className="font-bold tracking-tight">TikTok Automation Assistant</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
             Create Viral Content <br/>
             <span className="text-white">In Seconds</span>
           </h1>
           <p className="text-zinc-500 max-w-lg mx-auto text-sm">
             Powered by Gemini 2.5. Generate scripts, optimize metadata, create thumbnails, and schedule uploads in one workflow.
           </p>
        </header>

        {/* Navigation */}
        <StepIndicator currentStep={currentStep} setStep={setCurrentStep} />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentStep === ContentStep.IDEATION && (
            <IdeationStep 
              onSelectIdea={handleIdeaSelect} 
              savedIdeas={content.ideas}
            />
          )}

          {currentStep === ContentStep.SCRIPTING && (
            <ScriptStep 
              selectedIdea={content.selectedIdea}
              currentScript={content.script}
              setScript={updateScript}
              onNext={() => setCurrentStep(ContentStep.METADATA)}
            />
          )}

          {currentStep === ContentStep.METADATA && (
            <MetadataStep 
              currentScript={content.script}
              caption={content.caption}
              hashtags={content.hashtags}
              setCaption={(c) => setContent(p => ({...p, caption: c}))}
              setHashtags={(h) => setContent(p => ({...p, hashtags: h}))}
              onNext={() => setCurrentStep(ContentStep.THUMBNAIL)}
            />
          )}

          {currentStep === ContentStep.THUMBNAIL && (
            <ThumbnailStep 
              selectedIdeaHook={content.selectedIdea?.hook || ''}
              thumbnailUrl={content.thumbnailUrl}
              setThumbnailUrl={updateThumbnail}
              onNext={() => setCurrentStep(ContentStep.UPLOAD)}
            />
          )}

          {currentStep === ContentStep.UPLOAD && (
            <UploadStep 
              content={content} 
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onUpdateConfig={(updates) => setContent(prev => ({...prev, ...updates}))}
              scheduledPosts={scheduledPosts}
              onSchedule={handleSchedulePost}
            />
          )}
        </main>

        <footer className="mt-20 border-t border-zinc-900 pt-8 flex flex-col items-center gap-4 text-zinc-600 text-xs">
           <p>Designed for Creator Productivity. Not affiliated with TikTok.</p>
           <div className="flex gap-6">
              <a 
                href="/terms-of-service"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
