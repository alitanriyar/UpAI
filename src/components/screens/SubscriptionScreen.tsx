import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Crown, CheckCircle2, Sparkles, Zap, Smartphone, Bell, History, ArrowRight } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';

export default function SubscriptionScreen({ onBack, onRestore }: { onBack: () => void; onRestore: () => void }) {
  const { profile, updateProfile } = useAlarms();
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const isPro = profile?.subscriptionStatus === 'pro';

  const proFeatures = [
    { label: 'Unlimited active alarms', free: 'Max 3', pro: 'Unlimited' },
    { label: 'AI Rituals (Vision/Audio)', free: 'Limited', pro: 'Unlimited' },
    { label: 'Movement & Brush tasks', free: 'Locked', pro: 'Unlocked' },
    { label: 'Multi-step wake-up system', free: 'No', pro: 'Yes' },
    { label: 'Advanced streak analytics', free: 'Basic', pro: 'Advanced' },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateProfile({ subscriptionStatus: 'pro' });
      onBack();
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      if (profile) setLoading(false); // Only if component still exists
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-charcoal">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-charcoal/40">
          <ChevronLeft size={24} />
        </button>
        <button onClick={onRestore} className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Restore</button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-black text-charcoal leading-tight tracking-tight">
            Stop snoozing.<br/>
            <span className="text-sunrise">Start waking up.</span>
          </h2>
          <p className="text-charcoal/40 font-bold max-w-[240px] mx-auto leading-relaxed">
            UpAI makes sure you’re actually awake.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-gray-50 rounded-[2.5rem] p-6 mb-10 overflow-hidden relative">
          <div className="flex justify-between items-end mb-6 px-2">
            <div className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest">Plan Comparison</div>
            <div className="flex gap-8 pr-2">
              <span className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest">Free</span>
              <span className="text-[10px] font-black text-sunrise uppercase tracking-widest">Pro</span>
            </div>
          </div>
          <div className="space-y-4">
            {proFeatures.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-charcoal/5 last:border-0 pb-3">
                <span className="text-xs font-bold text-charcoal/70">{f.label}</span>
                <div className="flex gap-4 min-w-[100px] justify-end">
                  <span className="text-[10px] font-black text-charcoal/30 uppercase">{f.free}</span>
                  <span className="text-[10px] font-black text-sunrise uppercase">{f.pro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        <div className="space-y-3 mb-10">
          <div 
            onClick={() => setSelectedPlan('yearly')}
            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative ${
              selectedPlan === 'yearly' ? 'border-amber-400 bg-amber-50 shadow-xl' : 'border-gray-100 bg-white'
            }`}
          >
            {selectedPlan === 'yearly' && (
              <div className="absolute -top-3 -right-3 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles size={10} />
                BEST VALUE
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-charcoal/30 uppercase tracking-widest mb-1">Yearly Plan</p>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-black text-charcoal">$24.99</h4>
                  <span className="text-charcoal/30 font-bold mb-1">/ year</span>
                </div>
                <p className="text-[10px] font-bold text-amber-600 mt-1">3-Day Free Trial included</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'yearly' ? 'border-amber-400 bg-amber-400' : 'border-gray-200'
              }`}>
                {selectedPlan === 'yearly' && <CheckCircle2 size={16} className="text-white" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setSelectedPlan('weekly')}
              className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${
                selectedPlan === 'weekly' ? 'border-charcoal bg-charcoal/5' : 'border-gray-100 bg-white'
              }`}
            >
              <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest mb-1">Weekly</p>
              <h4 className="text-xl font-black text-charcoal">$2.49</h4>
            </div>
            <div 
              onClick={() => setSelectedPlan('monthly')}
              className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${
                selectedPlan === 'monthly' ? 'border-charcoal bg-charcoal/5' : 'border-gray-100 bg-white'
              }`}
            >
              <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest mb-1">Monthly</p>
              <h4 className="text-xl font-black text-charcoal">$4.99</h4>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 text-center">
          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-charcoal text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Sparkles className="animate-spin" size={20} />
            ) : (
              <>
                Start Free Trial
                <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <button 
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 hover:text-charcoal transition-colors"
          >
            Continue Free
          </button>

          <p className="text-[10px] font-bold text-charcoal/20 leading-relaxed max-w-[280px] mx-auto italic">
            Start your 3-day free trial. Then $4.99/month. Cancel anytime in your App Store settings. Terms and Privacy apply.
          </p>
        </div>
      </div>
    </div>
  );
}
