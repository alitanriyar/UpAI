import React from 'react';
import { ChevronLeft, ExternalLink, Mail, ShieldCheck, FileText } from 'lucide-react';

export default function AboutPage({ 
  onBack, 
  onViewPrivacy, 
  onViewTerms 
}: { 
  onBack: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-charcoal">About UpAI</h1>
      </header>

      <div className="flex-1 px-8 py-4 space-y-10 overflow-y-auto pb-20">
        <div className="text-center space-y-4 py-8">
          <div className="w-24 h-24 bg-charcoal rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
            <span className="text-4xl font-black text-white italic">U</span>
            <div className="absolute inset-0 bg-sunrise/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-charcoal">UpAI</h2>
            <p className="text-xs font-black text-charcoal/30 uppercase tracking-[0.2em] mt-1">Version 1.0.0</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest pl-2">The Mission</h3>
            <p className="text-sm font-bold text-charcoal/60 leading-relaxed bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              UpAI is designed to bridge the gap between "one more snooze" and a productive morning ritual. By using intelligent verification, we help you conquer the first 10 minutes of your day.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest pl-2">Legal & Links</h3>
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              <button 
                onClick={onViewPrivacy}
                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <span className="flex-1 text-left font-black text-charcoal text-sm">Privacy Policy</span>
                <ExternalLink size={16} className="text-charcoal/20" />
              </button>
              <button 
                onClick={onViewTerms}
                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                  <FileText size={20} />
                </div>
                <span className="flex-1 text-left font-black text-charcoal text-sm">Terms & Conditions</span>
                <ExternalLink size={16} className="text-charcoal/20" />
              </button>
              <a 
                href="mailto:support@upaiapp.com"
                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-50 text-green-500 rounded-xl">
                  <Mail size={20} />
                </div>
                <span className="flex-1 text-left font-black text-charcoal text-sm">Contact Support</span>
                <ExternalLink size={16} className="text-charcoal/20" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest leading-loose">
            © 2026 UpAI Rituals Inc.<br/>
            Engineered for Precision Mornings
          </p>
        </div>
      </div>
    </div>
  );
}
