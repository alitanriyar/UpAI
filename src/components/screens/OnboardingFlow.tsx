import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAlarms } from '../../context/AlarmContext';
import { ArrowRight, Zap, Check, Sparkles, ChevronRight, X } from 'lucide-react';

type OnboardingStage = 'WELCOME' | 'ONBOARDING' | 'QUIZ' | 'RESULT' | 'PAYWALL_TRIAL' | 'PAYWALL_EXIT';

const ONBOARDING_STEPS = [
  {
    title: "Stop snoozing.",
    text: "Wake up by completing a real action.",
    icon: '😴',
  },
  {
    title: "Prove you're awake.",
    text: "Coffee, movement, math, or affirmations.",
    icon: '⚡',
  },
  {
    title: "Build better mornings.",
    text: "One small action can change your entire day.",
    icon: '☀️',
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 'difficulty',
    question: "How hard is it for you to wake up?",
    options: [
      { label: "Easy", icon: '😊' },
      { label: "Sometimes hard", icon: '😐' },
      { label: "Very hard", icon: '😫' }
    ]
  },
  {
    id: 'habit',
    question: "What usually happens?",
    options: [
      { label: "I snooze a lot", icon: '⏰' },
      { label: "I wake up but feel tired", icon: '🥱' },
      { label: "I miss alarms", icon: '🚫' }
    ]
  },
  {
    id: 'preference',
    question: "What would help you most?",
    options: [
      { label: "Something physical (coffee / movement)", type: 'physical', icon: '🏃' },
      { label: "Something mental (math)", type: 'mental', icon: '🧠' },
      { label: "Something motivational (affirmations)", type: 'motivational', icon: '🎤' }
    ]
  },
  {
    id: 'frequency',
    question: "How many alarms do you set?",
    options: [
      { label: "1", icon: '1️⃣' },
      { label: "2–3", icon: '2️⃣' },
      { label: "4+", icon: '🔥' }
    ]
  },
  {
    id: 'goal',
    question: "What is your goal?",
    options: [
      { label: "Wake up on time", icon: '✅' },
      { label: "Feel energized", icon: '🔋' },
      { label: "Build discipline", icon: '🧱' }
    ]
  }
];

export default function OnboardingFlow({ onComplete }: { onComplete?: (data: any) => void }) {
  const [stage, setStage] = useState<OnboardingStage>('WELCOME');
  const [onboardingIdx, setOnboardingIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  
  const { completeOnboarding, updateProfile } = useAlarms();

  const handleNextOnboarding = () => {
    if (onboardingIdx < ONBOARDING_STEPS.length - 1) {
      setOnboardingIdx(onboardingIdx + 1);
    } else {
      setStage('QUIZ');
    }
  };

  const handleQuizAnswer = (answer: any) => {
    const currentQ = QUIZ_QUESTIONS[quizIdx];
    // Map answer labels to values we want to store
    let val = answer.label;
    if (answer.type) val = answer.type;
    
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx(quizIdx + 1);
    } else {
      setStage('RESULT');
    }
  };

  const finalizeOnboarding = async (isPro: boolean = false) => {
    setLoading(true);
    try {
      const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
        'Easy': 'easy',
        'Sometimes hard': 'medium',
        'Very hard': 'hard'
      };

      const profileData: any = {
        difficulty: difficultyMap[quizAnswers.difficulty] || 'medium',
        preferredTask: quizAnswers.preference || 'coffee',
        subscriptionStatus: isPro ? 'pro' : 'free',
        wakeGoal: '07:00' // Default
      };

      await completeOnboarding(profileData);
      if (onComplete) onComplete(profileData);
    } catch (error) {
      console.error("Failed to finish onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier: 'pro' | 'one_time' = 'pro') => {
    setLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      await finalizeOnboarding(true);
    } catch (error) {
      console.error("Subscription failed:", error);
      setLoading(false);
    }
  };

  const getRecommendedTask = () => {
    const pref = quizAnswers.preference;
    if (pref === 'physical') return { label: 'Coffee or Movement', icon: '☕' };
    if (pref === 'mental') return { label: 'Math Challenges', icon: '🧠' };
    return { label: 'Daily Affirmations', icon: '🎤' };
  };

  const renderWelcome = () => (
    <motion.div 
      key="welcome"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center p-10 bg-morning-cream relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-morning-yellow rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-sunrise rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        className="w-28 h-28 sunrise-gradient rounded-[3rem] flex items-center justify-center mb-10 shadow-premium relative z-10"
      >
        <Zap size={48} className="text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-7xl font-heading font-black text-charcoal mb-4 relative z-10"
      >
        UpAI
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-bold text-charcoal-light mb-16 relative z-10"
      >
        Wake up with proof.
      </motion.p>
      
      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setStage('QUIZ')}
        className="w-full max-w-xs bg-charcoal text-white py-6 rounded-[2.5rem] font-black text-xl shadow-premium active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10 group"
      >
        Start the Proof
        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );

  const renderOnboarding = () => (
    <motion.div 
      key="onboarding"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-morning-cream p-10 justify-between"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingIdx}
            initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-9xl mb-12 drop-shadow-xl select-none">{ONBOARDING_STEPS[onboardingIdx].icon}</div>
            <h2 className="text-4xl font-heading font-black text-charcoal leading-tight tracking-tight">{ONBOARDING_STEPS[onboardingIdx].title}</h2>
            <p className="text-charcoal-light text-lg font-medium px-4 opacity-70 leading-relaxed">{ONBOARDING_STEPS[onboardingIdx].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-10">
        <div className="flex justify-center gap-2.5">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`h-2 transition-all duration-300 rounded-full ${i === onboardingIdx ? 'w-10 bg-charcoal' : 'w-2 bg-charcoal/10'}`} />
          ))}
        </div>
        <button 
          onClick={handleNextOnboarding}
          className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-premium transition-all active:scale-95"
        >
          {onboardingIdx === ONBOARDING_STEPS.length - 1 ? "Take the Morning Quiz" : "Continue"}
          <ArrowRight size={24} />
        </button>
      </div>
    </motion.div>
  );

  const renderQuiz = () => {
    const currentQ = QUIZ_QUESTIONS[quizIdx];
    return (
      <motion.div 
        key="quiz"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full flex flex-col bg-morning-cream p-10"
      >
        <div className="w-full h-2 bg-white rounded-full mb-12 overflow-hidden shadow-minimal border border-minimal-gray/50">
          <motion.div 
            className="h-full sunrise-gradient rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((quizIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h2 className="text-3xl font-heading font-black text-charcoal mb-10 leading-tight">
          {currentQ.question}
        </h2>

        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div 
              key={quizIdx}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="space-y-4"
            >
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(opt)}
                  className="w-full bg-white p-6 rounded-[2.5rem] flex items-center gap-5 text-left border-2 border-transparent hover:border-sunrise active:scale-[0.98] transition-all shadow-premium group"
                >
                  <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="text-base font-black text-charcoal tracking-tight flex-1">{opt.label}</span>
                  <div className="w-10 h-10 bg-morning-cream rounded-2xl flex items-center justify-center group-hover:bg-sunrise/10 transition-colors">
                    <ChevronRight size={20} className="text-charcoal/20 group-hover:text-sunrise" />
                  </div>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderResult = () => {
    const rec = getRecommendedTask();
    return (
      <motion.div 
        key="result"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full flex flex-col bg-morning-cream p-10 items-center justify-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-sunrise/5 animate-pulse opacity-20 pointer-events-none" />
        
        <div className="w-24 h-24 sunrise-gradient text-white rounded-[3rem] flex items-center justify-center mb-10 shadow-premium relative">
           <Zap size={40} className="drop-shadow-sm" />
           <div className="absolute inset-0 bg-white/20 rounded-[3rem] mix-blend-overlay" />
        </div>
        
        <h2 className="text-4xl font-heading font-black text-charcoal mb-4 leading-tight">Mornings built for you.</h2>
        <p className="text-charcoal-light font-medium mb-12 leading-relaxed max-w-[300px]">
          Based on your quiz, here is your perfect morning proof protocol.
        </p>

        <div className="w-full premium-card p-10 mb-16 relative group transition-transform hover:scale-[1.02]">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
             Your Recommended Step
           </div>
           <div className="flex flex-col items-center gap-6 pt-2">
              <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{rec.icon}</span>
              <span className="text-2xl font-black text-charcoal tracking-tight">{rec.label} Verification</span>
           </div>
        </div>

        <button 
          onClick={() => setStage('PAYWALL_TRIAL')}
          className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-premium active:scale-95 transition-all group"
        >
          Level Up Your Mornings
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    );
  };

  const renderPaywallTrial = () => (
    <motion.div 
      key="paywall-trial"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-white text-charcoal overflow-y-auto"
    >
      <div className="p-10 pb-32">
        <header className="flex justify-end mb-8">
           <button className="text-[10px] font-black uppercase tracking-widest text-charcoal-light/40 hover:text-charcoal transition-colors">Restore Purchases</button>
        </header>

        <div className="text-center space-y-4 mb-12">
          <h2 className="text-5xl font-heading font-black text-charcoal leading-none tracking-tight">Unlock UpAI Pro</h2>
          <p className="text-xl font-bold text-charcoal-light opacity-60">You'll never snooze again.</p>
        </div>

        {/* Price Anchoring */}
        <div className="premium-card p-6 mb-10 bg-mint/5 border-mint/20 text-center">
          <p className="text-[11px] font-black text-mint-dark uppercase tracking-widest mb-2 opacity-50">Value Comparison</p>
          <div className="flex flex-col gap-1">
             <p className="text-sm font-bold text-charcoal/40 line-through">Most users pay $4.99/mo ($60/year)</p>
             <p className="text-lg font-black text-charcoal">Get full access for just $24.99/year</p>
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-12">
          <div 
            onClick={() => setSelectedPlan('yearly')}
            className={`p-1 bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer relative shadow-premium ${
              selectedPlan === 'yearly' ? 'border-sunrise ring-4 ring-sunrise/5' : 'border-transparent'
            }`}
          >
            <div className="p-7 flex justify-between items-center bg-white rounded-[2.2rem]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-sunrise text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Best Value</span>
                  <p className="text-[10px] font-black text-charcoal-light/40 uppercase tracking-widest">Yearly Enrollment</p>
                </div>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-heading font-black text-charcoal">$24.99</h4>
                  <span className="text-charcoal-light font-bold mb-1.5 opacity-40">/ year</span>
                </div>
                <p className="text-[11px] font-bold text-mint-dark mt-1">Only $2.08/month</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${selectedPlan === 'yearly' ? 'bg-charcoal border-charcoal' : 'border-minimal-gray'}`}>
                {selectedPlan === 'yearly' && <Check size={20} className="text-white" />}
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedPlan('monthly')}
            className={`p-1 bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer relative shadow-minimal ${
              selectedPlan === 'monthly' ? 'border-charcoal ring-4 ring-charcoal/5' : 'border-transparent'
            }`}
          >
            <div className="p-7 flex justify-between items-center bg-white rounded-[2.2rem]">
              <div>
                <p className="text-[10px] font-black text-charcoal-light/40 uppercase tracking-widest mb-2">Flexible Plan</p>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-heading font-black text-charcoal">$4.99</h4>
                  <span className="text-charcoal-light font-bold mb-1.5 opacity-40">/ month</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${selectedPlan === 'monthly' ? 'bg-charcoal border-charcoal' : 'border-minimal-gray'}`}>
                {selectedPlan === 'monthly' && <Check size={20} className="text-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-[11px] font-black text-mint-dark uppercase tracking-widest">Start your 3-day free trial</p>
            <p className="text-[10px] font-bold text-charcoal/30">Then ${selectedPlan === 'yearly' ? '24.99' : '4.99'}/{selectedPlan === 'yearly' ? 'year' : 'month'}</p>
          </div>

          <button 
            onClick={() => handleSubscribe()}
            disabled={loading}
            className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-premium active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles size={20} className="animate-spin" /> : "Start Free Trial"}
            {!loading && <ArrowRight size={20} />}
          </button>
          
          <button 
            onClick={() => setStage('PAYWALL_EXIT')}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal-light/30 hover:text-charcoal-light transition-colors py-2"
          >
            Continue with limited version
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPaywallExit = () => (
    <motion.div 
      key="paywall-exit"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col bg-charcoal p-10 items-center justify-center text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-sunrise rounded-full blur-[100px]" />
      </div>

      <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-8 backdrop-blur-xl">
        <Zap size={32} className="text-sunrise" />
      </div>

      <h2 className="text-5xl font-heading font-black text-white mb-4 leading-tight">Wait — one last thing.</h2>
      <p className="text-xl font-bold text-white/60 mb-12">Special offer just for you.</p>

      <div className="w-full premium-card p-10 mb-16 bg-white/5 border-white/10 backdrop-blur-xl">
        <p className="text-white/40 line-through font-bold text-lg mb-2">Normally $24.99/year</p>
        <h3 className="text-6xl font-heading font-black text-sunrise leading-none mb-4">$14.99</h3>
        <p className="text-white/80 font-black uppercase tracking-widest text-xs">Today only: $14.99</p>
        <div className="mt-8 bg-sunrise/10 py-2 rounded-full border border-sunrise/20">
          <p className="text-[10px] font-black text-sunrise uppercase tracking-widest">This offer won’t be shown again</p>
        </div>
      </div>

      <div className="w-full space-y-6">
        <button 
          onClick={() => handleSubscribe('one_time')}
          disabled={loading}
          className="w-full bg-white text-charcoal py-6 rounded-[2.5rem] font-black text-xl shadow-premium active:scale-95 transition-all"
        >
          {loading ? <Sparkles size={20} className="animate-spin" /> : "Unlock for $14.99/year"}
        </button>
        <button 
          onClick={() => finalizeOnboarding(false)}
          className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white/60 transition-colors"
        >
          Continue Free
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full w-full bg-morning-cream relative overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {stage === 'WELCOME' && renderWelcome()}
        {stage === 'QUIZ' && renderQuiz()}
        {stage === 'RESULT' && renderResult()}
        {stage === 'PAYWALL_TRIAL' && renderPaywallTrial()}
        {stage === 'PAYWALL_EXIT' && renderPaywallExit()}
      </AnimatePresence>
    </div>
  );
}
