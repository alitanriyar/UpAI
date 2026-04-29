import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Flame, Calendar, Trophy, Zap, Crown, BarChart3, Lock } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import PaywallModal from '../PaywallModal';

export default function StreakScreen({ onBack, onUpgrade }: { onBack: () => void; onUpgrade?: () => void }) {
  const { stats, profile } = useAlarms();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const isPro = profile?.subscriptionStatus === 'pro';

  const statsList = [
    { label: 'Current Streak', value: stats.streak, color: 'text-sunrise', icon: Flame },
    { label: 'Best Streak', value: stats.bestStreak, color: 'text-orange-600', icon: Trophy },
    { label: 'Total Rising', value: stats.totalWakes, color: 'text-mint', icon: Zap },
  ];

  return (
    <div className="h-full flex flex-col bg-morning-cream">
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onUpgrade={() => {
          setIsPaywallOpen(false);
          onUpgrade?.();
        }}
        reason="Advanced Analytics is a Pro feature"
      />

      <header className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm">
          <ChevronLeft className="text-charcoal/40" />
        </button>
        <h2 className="text-xl font-black">Your Progress</h2>
        <div className="w-8" />
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {statsList.map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-4 text-center shadow-sm"
            >
              <item.icon size={20} className={`mx-auto mb-2 ${item.color}`} />
              <p className="text-[10px] uppercase font-bold text-charcoal/30 mb-1 leading-tight">{item.label}</p>
              <span className="text-2xl font-black">{item.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Pro Analytics Section */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 size={24} className="text-sunrise" />
              <h3 className="text-lg font-black">Advanced Stats</h3>
            </div>
            {!isPro && <Crown size={18} className="text-amber-500" />}
          </div>

          {!isPro ? (
            <div className="relative py-8 text-center flex flex-col items-center">
              <div className="w-48 h-24 bg-gray-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                 <div className="flex gap-2 items-end opacity-20">
                    <div className="w-4 h-8 bg-charcoal rounded-t-sm" />
                    <div className="w-4 h-12 bg-charcoal rounded-t-sm" />
                    <div className="w-4 h-10 bg-charcoal rounded-t-sm" />
                    <div className="w-4 h-16 bg-charcoal rounded-t-sm" />
                    <div className="w-4 h-6 bg-charcoal rounded-t-sm" />
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                   <Lock size={20} className="text-charcoal/30" />
                 </div>
              </div>
              <p className="text-xs font-bold text-charcoal/40 mb-6 max-w-[200px]">Unlock detailed charts and sleep consistency analysis.</p>
              <button 
                onClick={() => setIsPaywallOpen(true)}
                className="bg-charcoal text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
              >
                Go Pro Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-32 flex items-end gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-sunrise/20 rounded-t-lg relative group"
                  >
                    <div className="absolute inset-0 bg-sunrise opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] text-center font-black text-charcoal/20 uppercase tracking-[0.2em]">Morning Consistency Score: 84%</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={24} className="text-sunrise" />
            <h3 className="text-lg font-black">Morning Log</h3>
          </div>
          
          <div className="space-y-4">
            {stats.history.length === 0 ? (
              <p className="text-center py-10 text-charcoal/30 font-bold">No mornings logged yet. Start tomorrow!</p>
            ) : (
              stats.history.slice().reverse().map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-morning-cream last:border-0">
                  <div>
                    <p className="font-black text-sm">{entry.date}</p>
                    <p className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">{entry.taskType} completed</p>
                  </div>
                  <span className="bg-morning-cream text-sunrise px-3 py-1 rounded-full text-xs font-bold">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
