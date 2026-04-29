import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Zap, CheckCircle2, Sparkles } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason?: string;
}

export default function PaywallModal({ isOpen, onClose, onUpgrade, reason }: PaywallModalProps) {
  const features = [
    'Unlimited Vision & Audio tasks',
    'Multi-step wake-up sequences',
    'Movement & Brush Teeth modes',
    'Unlimited active alarms',
    'Advanced streak analytics'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-sm bg-morning-cream rounded-[3rem] overflow-hidden shadow-premium relative z-10 border border-white"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-10 h-10 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-charcoal/20 hover:text-charcoal transition-colors z-20 shadow-minimal"
            >
              <X size={20} />
            </button>

            <div className="p-10 pb-4 text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-minimal relative">
                <div className="absolute inset-0 bg-sunrise/10 animate-pulse rounded-3xl" />
                <Crown size={40} className="text-sunrise relative z-10" />
              </div>
              
              <h2 className="text-3xl font-heading font-black text-charcoal mb-3">Proof Pro</h2>
              {reason && (
                <div className="mb-4 px-4 py-1.5 bg-sunrise rounded-full inline-block">
                  <p className="text-white text-[9px] font-black uppercase tracking-widest leading-none">{reason}</p>
                </div>
              )}
              <p className="text-charcoal-light font-medium text-sm leading-relaxed mb-10 px-4">
                Redesign your mornings with the ultimate proof-based wake-up ritual.
              </p>

              <div className="space-y-4 text-left px-2 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 bg-mint/10 rounded-lg flex items-center justify-center transition-colors group-hover:bg-mint/20">
                      <CheckCircle2 size={14} className="text-mint" />
                    </div>
                    <span className="text-xs font-black text-charcoal tracking-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-0 space-y-4">
              <button 
                onClick={onUpgrade}
                className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-premium active:scale-95 transition-all"
              >
                <Sparkles size={20} />
                Get Full Proof Access
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 text-[10px] font-black text-charcoal-light/30 uppercase tracking-widest transition-colors hover:text-charcoal-light"
              >
                Continue for free
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
