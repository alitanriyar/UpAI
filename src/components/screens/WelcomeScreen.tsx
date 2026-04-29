import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Apple, Check } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import { loginWithGoogle, loginWithApple } from '../../lib/firebase';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleGoogleLogin = async () => {
    if (!agreed) return;
    setLoading('google');
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    if (!agreed) return;
    setLoading('apple');
    try {
      await loginWithApple();
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(null);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const renderButtons = () => {
    const buttons = [
      <button
        key="apple"
        onClick={handleAppleLogin}
        disabled={!!loading || !agreed}
        className={`w-full bg-charcoal text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${!agreed ? 'opacity-50 grayscale' : ''}`}
      >
        {loading === 'apple' ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Apple size={20} fill="currentColor" />
            Continue with Apple
          </>
        )}
      </button>,
      <button
        key="google"
        onClick={handleGoogleLogin}
        disabled={!!loading || !agreed}
        className={`w-full bg-white text-charcoal py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-minimal border border-gray-100 ${!agreed ? 'opacity-50 grayscale' : ''}`}
      >
        {loading === 'google' ? (
          <Loader2 className="animate-spin text-charcoal" size={20} />
        ) : (
          <>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </>
        )}
      </button>
    ];

    if (isIOS) return buttons;
    return [buttons[1], buttons[0]]; // Google first on non-iOS
  };

  return (
    <div className="flex flex-col h-full bg-morning-cream p-10 text-center justify-between overflow-y-auto">
      <div className="mt-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-24 h-24 sunrise-gradient rounded-[2.5rem] mx-auto mb-8 shadow-2xl flex items-center justify-center relative overflow-hidden"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black mb-2 text-charcoal tracking-tighter"
        >
          UpAI
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-sunrise mb-12"
        >
          Wake up with proof.
        </motion.p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div 
            onClick={() => setAgreed(!agreed)}
            className="flex items-center gap-4 px-6 py-4 bg-white/50 backdrop-blur-sm rounded-2xl cursor-pointer group transition-all active:scale-95"
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-charcoal border-charcoal' : 'border-charcoal/10 bg-white'}`}>
              {agreed && <Check size={14} className="text-white" />}
            </div>
            <p className="text-[10px] text-left text-charcoal/40 font-bold uppercase tracking-wider leading-relaxed">
              I agree to the <span className="text-charcoal underline">Terms & Conditions</span> and <span className="text-charcoal underline">Privacy Policy</span>.
            </p>
          </div>

          <div className="space-y-3">
            {renderButtons()}
          </div>
        </div>
        
        <p className="text-[9px] text-charcoal/20 font-black uppercase tracking-[0.2em] leading-relaxed px-6">
          Premium habit building powered by AI. No passwords required.
        </p>
      </div>
    </div>
  );
}

