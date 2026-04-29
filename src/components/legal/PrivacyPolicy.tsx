import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect name, email, profile settings, alarm configurations, task preferences, streak history, and app usage data. We also process camera and microphone input for task verification.' },
    { title: '2. How We Use Information', content: 'To create and manage accounts, operate alarms, verify wake-up tasks using AI, track streaks, improve performance, and provide customer support.' },
    { title: '3. Camera and Microphone', content: 'Camera and microphone are used only for verification tasks selected by the user. We do not listen or watch in the background.' },
    { title: '4. AI Processing', content: 'Images, audio, or video frames may be processed by secure AI services to verify tasks. This processing happens in real-time.' },
    { title: '5. Data Storage', content: 'We store only what is necessary. We do not store raw camera or microphone recordings unless you explicitly opt in for debugging or improvement.' },
    { title: '6. Data Sharing', content: 'We do not sell personal data. We share data only with service providers needed to operate the app (Cloud hosting, AI processing, Authentication).' },
    { title: '7. Children', content: 'The app is not intended for children under 13 years of age.' },
    { title: '8. User Rights', content: 'Users can access, update, or delete their account and personal data at any time via the Privacy Center.' },
    { title: '9. Account Deletion', content: 'You can delete your account in the app from Profile > Privacy Center > Delete Account & Data.' },
    { title: '10. Contact', content: 'Questions? Reach out to support@upaiapp.com' },
  ];

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4 border-b border-charcoal/5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-charcoal">Privacy Policy</h1>
      </header>

      <div className="flex-1 px-8 py-10 space-y-10 overflow-y-auto pb-20">
        <div className="space-y-4">
          <p className="text-xs font-black text-sunrise uppercase tracking-widest">Effective Date: April 2026</p>
          <p className="text-sm font-bold text-charcoal/60 leading-relaxed italic">
            Your privacy is the foundation of a peaceful morning.
          </p>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="space-y-3">
            <h3 className="font-black text-charcoal uppercase tracking-wider text-xs">{section.title}</h3>
            <p className="text-sm font-bold text-charcoal/50 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
