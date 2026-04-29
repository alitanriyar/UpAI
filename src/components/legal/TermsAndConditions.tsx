import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function TermsAndConditions({ onBack }: { onBack: () => void }) {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By using UpAI, you agree to these terms in full.' },
    { title: '2. App Purpose', content: 'UpAI is an alarm and habit-building app designed to help users wake up by completing optional verification tasks.' },
    { title: '3. No Medical or Fitness Advice', content: 'UpAI is not a medical, health, fitness, or emergency service app. Movement tasks are for general motivation and should not be used as professional advice.' },
    { title: '4. User Responsibility', content: 'Users are responsible for setting alarms correctly and ensuring their device settings allow notifications and sounds at the appropriate times.' },
    { title: '5. Alarm Limitations', content: 'UpAI cannot guarantee that alarms will always sound if device settings, battery restrictions, Focus Mode, silent mode, permissions, operating system limitations, or user actions prevent alerts.' },
    { title: '6. AI Verification', content: 'AI verification may be imperfect. The app may incorrectly approve or reject a task based on lighting, camera angle, or sound quality.' },
    { title: '7. Safe Use', content: 'Users should not perform unsafe tasks, pushups, squats, brushing, or coffee preparation in a dangerous environment. Always prioritize your safety.' },
    { title: '8. Subscriptions', content: 'If subscriptions are added, billing will be handled through Apple App Store or Google Play. Users can manage or cancel subscriptions through their store account.' },
    { title: '9. Account Deletion', content: 'Users can delete their account from inside the app settings at any time.' },
    { title: '10. Limitation of Liability', content: 'UpAI is provided "as-is". The company is not liable for missed alarms, late arrivals, lost income, or any indirect damages resulting from app performance.' },
    { title: '11. Contact', content: 'For support, contact: support@upaiapp.com' },
  ];

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4 border-b border-charcoal/5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-charcoal">Terms & Conditions</h1>
      </header>

      <div className="flex-1 px-8 py-10 space-y-10 overflow-y-auto pb-20">
        <div className="space-y-4">
          <p className="text-xs font-black text-sunrise uppercase tracking-widest">Last Updated: April 2026</p>
          <p className="text-sm font-bold text-charcoal/60 leading-relaxed italic">
            Please read these terms carefully before starting your morning ritual with UpAI.
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
