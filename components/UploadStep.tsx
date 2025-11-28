
import React, { useState } from 'react';
import { GeneratedContent, TikTokAccount, ScheduledPost } from '../types';
import { validateTikTokToken, uploadVideoToTikTok } from '../services/tikTokService';
import { TIKTOK_COLORS } from '../constants';
import { UploadCloud, CheckCircle2, AlertTriangle, FileVideo, Copy, Calendar, UserPlus, Users, Clock, Trash2, ExternalLink, Key } from 'lucide-react';

interface UploadStepProps {
  content: GeneratedContent;
  accounts: TikTokAccount[];
  onAddAccount: (account: TikTokAccount) => void;
  onUpdateConfig: (updates: Partial<GeneratedContent>) => void;
  scheduledPosts: ScheduledPost[];
  onSchedule: (post: ScheduledPost) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ 
  content, accounts, onAddAccount, onUpdateConfig, scheduledPosts, onSchedule 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // UI States for adding account
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [useRealApi, setUseRealApi] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(!!content.scheduledTime);
  const [scheduleDate, setScheduleDate] = useState(content.scheduledTime || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useRealApi) {
      if (!accessToken.trim()) return;
      setIsValidating(true);
      const userInfo = await validateTikTokToken(accessToken);
      setIsValidating(false);

      if (userInfo) {
         const newAccount: TikTokAccount = {
           id: Date.now().toString(),
           username: userInfo.username,
           avatarColor: TIKTOK_COLORS.cyan, // We could use userInfo.avatarUrl if we built a proper image component
           accessToken: accessToken
         };
         onAddAccount(newAccount);
         resetAddForm();
      } else {
         alert("Invalid Access Token or API Error. Please check your credentials.");
      }
    } else {
      // Simulation Mode
      if (newUsername.trim()) {
        const newAccount: TikTokAccount = {
          id: Date.now().toString(),
          username: newUsername.startsWith('@') ? newUsername : `@${newUsername}`,
          avatarColor: [TIKTOK_COLORS.cyan, TIKTOK_COLORS.red, '#FEC200', '#00D26A'][Math.floor(Math.random() * 4)]
        };
        onAddAccount(newAccount);
        resetAddForm();
      }
    }
  };

  const resetAddForm = () => {
    setNewUsername('');
    setAccessToken('');
    setUseRealApi(false);
    setShowAddAccount(false);
  };

  const selectedAccount = accounts.find(a => a.id === content.targetAccountId) || accounts[0];

  const handleUploadAction = async () => {
    if (!file) return;
    
    // Save schedule config
    onUpdateConfig({ 
      scheduledTime: isScheduling ? scheduleDate : null 
    });

    setUploading(true);
    setProgress(0);

    if (selectedAccount.accessToken && !isScheduling) {
      // --- REAL API UPLOAD ---
      try {
        await uploadVideoToTikTok(
           selectedAccount.accessToken, 
           file, 
           content.caption,
           (p) => setProgress(p)
        );
        setUploading(false);
        setIsCompleted(true);
      } catch (error) {
        alert("Real API Upload Failed. Falling back to simulation for demo.");
        console.error(error);
        runSimulation();
      }
    } else {
      // --- SIMULATION (Or Scheduled) ---
      // TikTok API V2 does not support scheduling via API easily for personal accounts.
      // We assume scheduling is handled by our "backend" (simulation).
      runSimulation();
    }
  };

  const runSimulation = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setUploading(false);
        setIsCompleted(true);

        // Add to persistent schedule if scheduling is active
        if (isScheduling && scheduleDate) {
          onSchedule({
            id: Date.now().toString(),
            accountId: selectedAccount.id,
            accountUsername: selectedAccount.username,
            accountAvatar: selectedAccount.avatarColor,
            caption: content.caption,
            thumbnailUrl: content.thumbnailUrl,
            scheduledTime: scheduleDate,
            status: 'SCHEDULED'
          });
        }
      }
      setProgress(p);
    }, 200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          {/* Account Selection */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Users size={20} className="text-[#25F4EE]"/> Target Account
              </h3>
              <button 
                onClick={() => setShowAddAccount(!showAddAccount)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <UserPlus size={14}/> {showAddAccount ? 'Cancel' : 'Link Account'}
              </button>
            </div>

            {showAddAccount && (
              <form onSubmit={handleAddAccountSubmit} className="mb-4 bg-black/50 p-4 rounded-xl border border-zinc-800 animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                   <input 
                     type="checkbox" 
                     id="useRealApi"
                     checked={useRealApi}
                     onChange={(e) => setUseRealApi(e.target.checked)}
                     className="accent-[#25F4EE]"
                   />
                   <label htmlFor="useRealApi" className="text-xs text-zinc-400 select-none cursor-pointer">Use Real TikTok API (Developer Mode)</label>
                </div>

                {useRealApi ? (
                   <div className="space-y-2 mb-3">
                      <div className="relative">
                        <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
                        <input
                          type="password"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                          placeholder="Paste TikTok Access Token"
                          className="w-full bg-black border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-[#25F4EE] outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-600">Requires 'video.publish' and 'user.info.basic' scopes.</p>
                   </div>
                ) : (
                  <div className="mb-3">
                     <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#25F4EE] outline-none"
                      autoFocus
                    />
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={(useRealApi && !accessToken) || (!useRealApi && !newUsername) || isValidating}
                  className="w-full bg-[#25F4EE] text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1FD6D1] disabled:opacity-50 transition-colors"
                >
                  {isValidating ? 'Connecting...' : 'Connect Account'}
                </button>
              </form>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {accounts.map((acc) => (
                <div 
                  key={acc.id}
                  onClick={() => onUpdateConfig({ targetAccountId: acc.id })}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    content.targetAccountId === acc.id 
                      ? 'bg-[#25F4EE]/10 border-[#25F4EE]' 
                      : 'bg-black border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black relative"
                    style={{ backgroundColor: acc.avatarColor }}
                  >
                    {acc.username.substring(0, 2).toUpperCase()}
                    {acc.accessToken && (
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-white"/>
                       </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{acc.username}</p>
                    <p className="text-xs text-zinc-500">{acc.accessToken ? 'API Connected' : 'Simulated'}</p>
                  </div>
                  {content.targetAccountId === acc.id && (
                    <CheckCircle2 className="text-[#25F4EE]" size={18} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling Configuration */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
             <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
                <Clock size={20} className="text-[#FE2C55]"/> Schedule
              </h3>
             
             <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => { setIsScheduling(false); setScheduleDate(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    !isScheduling ? 'bg-white text-black' : 'bg-black text-zinc-500 border border-zinc-800'
                  }`}
                >
                  Post Now
                </button>
                <button 
                   onClick={() => setIsScheduling(true)}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    isScheduling ? 'bg-white text-black' : 'bg-black text-zinc-500 border border-zinc-800'
                  }`}
                >
                  Schedule
                </button>
             </div>

             {isScheduling && (
               <div className="animate-fadeIn">
                 <label className="block text-xs text-zinc-400 mb-2">Publish Date & Time</label>
                 <div className="relative">
                   <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
                   <input 
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-lg pl-10 pr-3 py-3 text-white text-sm focus:border-[#25F4EE] outline-none"
                   />
                 </div>
                 <p className="text-xs text-zinc-500 mt-2">
                   Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                 </p>
               </div>
             )}
          </div>
          
          {/* Asset Info Summary */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-3">Asset Summary</h3>
            <div className="space-y-2">
               <div className="p-2 bg-black rounded border border-zinc-800 flex justify-between items-center">
                 <span className="text-xs text-zinc-400">Caption</span>
                 <button onClick={() => copyToClipboard(content.caption)} className="text-[#25F4EE] text-xs"><Copy size={12}/></button>
               </div>
               <div className="p-2 bg-black rounded border border-zinc-800 flex justify-between items-center">
                 <span className="text-xs text-zinc-400">Tags</span>
                 <button onClick={() => copyToClipboard(content.hashtags.join(' '))} className="text-[#25F4EE] text-xs"><Copy size={12}/></button>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Action */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col h-full">
           <h3 className="font-bold text-white text-lg mb-6">Finalize</h3>
           
           {!isCompleted ? (
             <div className="flex-1 flex flex-col">
                <div className="border-2 border-dashed border-zinc-700 rounded-xl flex-1 min-h-[200px] flex flex-col items-center justify-center text-center transition-colors hover:border-zinc-500 bg-black/20 relative group">
                  <input 
                    type="file" 
                    id="video-upload" 
                    className="hidden" 
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center p-6">
                    {file ? (
                      <>
                        <FileVideo size={48} className="text-[#25F4EE] mb-4" />
                        <p className="text-white font-medium mb-1 break-all">{file.name}</p>
                        <p className="text-zinc-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={48} className="text-zinc-600 mb-4 group-hover:text-zinc-400 transition-colors" />
                        <p className="text-white font-medium mb-1">Upload Video File</p>
                        <p className="text-zinc-500 text-sm">Drag & drop or click to select</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-6">
                  {/* Warning Box */}
                  <div className={`p-3 rounded-lg flex gap-2 mb-4 border ${selectedAccount.accessToken ? 'bg-green-500/10 border-green-500/30' : 'bg-[#FE2C55]/10 border-[#FE2C55]/30'}`}>
                    {selectedAccount.accessToken ? (
                       <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                    ) : (
                       <AlertTriangle className="text-[#FE2C55] shrink-0" size={16} />
                    )}
                    <p className="text-xs text-zinc-300">
                      {selectedAccount.accessToken 
                        ? `Connected to TikTok API. Publishing as ${selectedAccount.username}.` 
                        : `Using simulation. Video will be prepared for ${selectedAccount.username}.`}
                    </p>
                  </div>

                  {file && !uploading && (
                    <button 
                      onClick={handleUploadAction}
                      disabled={isScheduling && !scheduleDate}
                      className="w-full bg-[#FE2C55] hover:bg-[#D91B40] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(254,44,85,0.3)] flex items-center justify-center gap-2"
                    >
                      {isScheduling ? <Calendar size={20}/> : <UploadCloud size={20}/>}
                      {isScheduling ? 'Schedule Upload' : 'Post Now'}
                    </button>
                  )}

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>{isScheduling ? 'Scheduling...' : 'Uploading...'}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#25F4EE] transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fadeIn">
               <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                 <CheckCircle2 size={48} className="text-green-500" />
               </div>
               
               <h3 className="text-2xl font-bold text-white mb-2">
                 {isScheduling ? 'Scheduled Successfully!' : 'Posted Successfully!'}
               </h3>
               
               <div className="bg-zinc-800/50 rounded-xl p-4 max-w-xs w-full mb-8 text-left border border-zinc-700">
                 <div className="flex justify-between mb-2">
                   <span className="text-zinc-400 text-xs">Account</span>
                   <span className="text-white text-xs font-bold">{selectedAccount.username}</span>
                 </div>
                 {isScheduling && (
                   <div className="flex justify-between mb-2">
                     <span className="text-zinc-400 text-xs">Date</span>
                     <span className="text-white text-xs">{new Date(scheduleDate).toLocaleDateString()} {new Date(scheduleDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                 )}
                 <div className="flex justify-between">
                    <span className="text-zinc-400 text-xs">Status</span>
                    <span className="text-[#25F4EE] text-xs">
                      {selectedAccount.accessToken && !isScheduling ? 'Published' : 'Pending Approval'}
                    </span>
                 </div>
               </div>

               <button 
                 onClick={() => window.location.reload()}
                 className="text-zinc-500 hover:text-white text-sm hover:underline"
               >
                 Start New Project
               </button>
             </div>
           )}
        </div>
      </div>

      {/* Scheduled Queue */}
      {scheduledPosts.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mt-8">
           <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
             <Calendar size={20} className="text-zinc-400"/> Scheduled Queue ({scheduledPosts.length})
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {scheduledPosts.map((post) => (
               <div key={post.id} className="bg-black border border-zinc-800 rounded-xl p-4 flex gap-4 hover:border-zinc-700 transition-colors">
                  <div className="w-16 h-24 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                     {post.thumbnailUrl ? (
                       <img src={post.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover opacity-80" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-zinc-600"><FileVideo size={20}/></div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-black font-bold" style={{backgroundColor: post.accountAvatar}}>
                            {post.accountUsername.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-xs text-zinc-400 truncate">{post.accountUsername}</span>
                       </div>
                       <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{post.caption.substring(0, 50)}...</p>
                     </div>
                     <div className="flex items-center gap-1 text-xs text-[#25F4EE]">
                        <Clock size={12} />
                        <span>{new Date(post.scheduledTime).toLocaleDateString()} {new Date(post.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default UploadStep;
