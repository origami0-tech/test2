
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setCode(codeParam);
    }
  }, []);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert("Code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center">Login Successful</h1>

          <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
            <p>You have successfully logged in with TikTok.</p>
            <p>To complete the connection, please follow these steps:</p>
            
            <div className="bg-black/40 p-5 rounded-xl border border-zinc-800 space-y-3 font-mono text-xs">
              <p>1. Copy the <strong>Authorization Code</strong> below.</p>
              
              <p>2. Return to the main app window.</p>
              
              <p>3. Select <strong>"Exchange Code"</strong> in the Link Account menu.</p>

              <p>4. Paste your code and your TikTok App's Client Key/Secret.</p>
            </div>
          </div>

          {code && (
            <div className="w-full animate-fadeIn mt-4">
               <label className="block text-xs font-medium text-zinc-500 mb-2">Authorization Code:</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={code} 
                   readOnly 
                   className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-[#25F4EE] text-sm outline-none font-mono"
                 />
                 <button 
                   onClick={handleCopy}
                   className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
                   title="Copy Code"
                 >
                   <Copy size={18}/>
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
