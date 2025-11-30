
import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

const LegalPageLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="min-h-screen bg-black text-white font-sans selection:bg-[#25F4EE] selection:text-black">
    <div className="max-w-3xl mx-auto px-6 py-12">
      <a href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Tool
      </a>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-5 mb-10 border-b border-zinc-800 pb-8">
           <div className="p-4 bg-zinc-800/50 rounded-2xl text-[#25F4EE] border border-zinc-700">
             {icon}
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
        </div>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed text-base md:text-lg">
          {children}
        </div>
      </div>
      
      <footer className="mt-12 text-center text-zinc-600 text-sm border-t border-zinc-900 pt-8">
        <p>&copy; {new Date().getFullYear()} TikTok Content Commander. All rights reserved.</p>
      </footer>
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC = () => (
  <LegalPageLayout title="Privacy Policy" icon={<Shield size={32} />}>
    <section>
        <h3 className="text-white font-bold text-xl mb-3">1. Introduction</h3>
        <p>Welcome to TikTok Content Commander ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our automation tool. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">2. Information We Collect</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-zinc-500">
            <li><strong>TikTok Account Information:</strong> When you link your TikTok account, we process your username and access tokens to facilitate video uploads.</li>
            <li><strong>User Content:</strong> We process the text inputs, scripts, and video files you upload solely for the purpose of generating content and publishing it to TikTok.</li>
            <li><strong>Local Storage:</strong> We do not store your TikTok Access Tokens or generated content on our servers. All sensitive data is stored locally in your browser's <code>localStorage</code>.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">3. How We Use Your Information</h3>
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-zinc-500">
            <li>To provide and maintain the Service.</li>
            <li>To integrate with the TikTok API for video publishing.</li>
            <li>To generate creative content using Google Gemini AI.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">4. Data Sharing and Third Parties</h3>
        <p>We do not sell your personal data. However, we share data with specific third-party service providers to function:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-zinc-500">
            <li><strong>TikTok:</strong> We transmit your video content and metadata to TikTok via their API upon your request.</li>
            <li><strong>Google Gemini:</strong> We send text prompts to Google's Gemini API to generate scripts and metadata.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">5. Data Security</h3>
        <p>We prioritize the security of your data. Since your Access Tokens are stored locally on your device, we do not have access to them. You are responsible for keeping your device secure. You can revoke the app's access at any time via your TikTok account settings.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">6. Changes to This Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
    </section>
    
    <section>
        <h3 className="text-white font-bold text-xl mb-3">7. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
    </section>
  </LegalPageLayout>
);

export const TermsOfServicePage: React.FC = () => (
  <LegalPageLayout title="Terms of Service" icon={<FileText size={32} />}>
     <section>
        <h3 className="text-white font-bold text-xl mb-3">1. Acceptance of Terms</h3>
        <p>By accessing or using TikTok Content Commander, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">2. Use of Service</h3>
        <p>This tool is designed to assist creators in automating content creation and scheduling. You agree to use this tool only for lawful purposes and in accordance with TikTok's Terms of Service and Community Guidelines.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">3. User Responsibilities</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-zinc-500">
            <li>You are solely responsible for the content you generate and upload using this tool.</li>
            <li>You must ensure that your content does not violate any copyright, trademark, or other proprietary rights.</li>
            <li>You agree not to use this tool to spam, harass, or violate TikTok's Community Guidelines.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">4. Intellectual Property</h3>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of TikTok Content Commander and its licensors. The content you generate (scripts, videos) belongs to you.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">5. Termination</h3>
        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
    </section>

    <section>
        <h3 className="text-white font-bold text-xl mb-3">6. Disclaimer of Warranties</h3>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the Service will function uninterrupted, secure, or available at any particular time or location.</p>
    </section>
    
    <section>
        <h3 className="text-white font-bold text-xl mb-3">7. Limitation of Liability</h3>
        <p>In no event shall TikTok Content Commander, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
    </section>
    
    <section>
        <h3 className="text-white font-bold text-xl mb-3">8. API Usage</h3>
        <p>This application uses the TikTok API and Google Gemini API. By using this application, you are also bound by the Google Terms of Service and TikTok Terms of Service.</p>
    </section>
  </LegalPageLayout>
);
