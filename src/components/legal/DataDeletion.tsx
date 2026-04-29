import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, AlertTriangle, Trash2, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

export default function DataDeletion({ 
  onBack, 
  onConfirm 
}: { 
  onBack: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFinalDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await onConfirm();
      setDone(true);
    } catch (e: any) {
      console.error(e);
      if (e.message === 'REAUTH_REQUIRED') {
        alert("Your data has been deleted, but your account deletion requires a recent login. Please log in again to permanently delete your auth account. You have been signed out.");
        onBack();
      } else {
        setDeleting(false);
      }
    }
  };

  if (done) {
    return (
      <div className="flex flex-col h-full bg-white p-10 items-center justify-center text-center">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h1 className="text-2xl font-black text-charcoal mb-4">Account Deleted</h1>
        <p className="text-charcoal/50 font-bold mb-8">Your account deletion request has been submitted and your data has been removed from our active systems.</p>
        <p className="text-xs font-black text-charcoal/20 uppercase tracking-widest">Ritual Closed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4">
        <button onClick={onBack} className="w-11 h-11 bg-white rounded-2xl shadow-minimal flex items-center justify-center border border-minimal-gray transition-transform active:scale-95" disabled={deleting}>
          <ChevronLeft size={20} className="text-charcoal-light" />
        </button>
        <h1 className="text-xl font-heading font-black text-charcoal">Security & Data</h1>
      </header>

      <div className="flex-1 px-8 py-6 space-y-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="premium-card bg-red-50/50 border-red-100/50 flex gap-4 items-start py-8">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="text-red-500" size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-red-600 uppercase text-[10px] tracking-widest">Permanent Action</h3>
                  <p className="text-xs font-bold text-red-500/70 leading-relaxed">
                    Deleting your account is irreversible. Your profile, rituals, streaks, and history will be completely erased.
                  </p>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <p className="text-sm font-medium text-charcoal-light leading-relaxed px-2">
                  You can delete your UpAI account and associated personal data at any time. This includes your identity profile, ritual history, streaks, and verification data.
                </p>
                <div className="pt-6 space-y-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-red-500 text-white py-5 rounded-[2.5rem] font-black shadow-premium active:scale-95 transition-transform"
                  >
                    Continue to Process Deletion
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full bg-white text-charcoal-light py-5 rounded-[2.5rem] font-black border border-minimal-gray active:scale-95 transition-transform"
                  >
                    Keep My Account
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-minimal">
                  <AlertTriangle size={40} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-black text-charcoal">Final Security Protocol</h3>
                  <p className="text-sm font-medium text-charcoal-light px-8 leading-relaxed">
                    To authorize the permanent destruction of your data, please type <span className="text-red-500 font-black">DELETE</span> below.
                  </p>
                </div>
              </div>

              <div className="px-2">
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Verification Key"
                  className="w-full bg-white border-2 border-red-100 rounded-[2.5rem] py-6 px-8 text-center font-black text-red-500 shadow-premium focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-red-200"
                  disabled={deleting}
                />
              </div>

              <button 
                onClick={handleFinalDelete}
                disabled={confirmText !== 'DELETE' || deleting}
                className="w-full bg-charcoal text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-premium disabled:opacity-30 disabled:grayscale active:scale-95 transition-all"
              >
                {deleting ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                Invoke Data Deletion
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
