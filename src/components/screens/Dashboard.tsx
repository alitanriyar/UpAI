import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Bell, Flame, Settings, Calendar, MoreHorizontal, Sparkles, Crown } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import { format } from 'date-fns';
import PaywallModal from '../PaywallModal';

export default function Dashboard({ onCreateAlarm, onEditAlarm, onViewStreaks, onViewSettings, onUpgrade }: any) {
  const { alarms, stats, toggleAlarm, profile } = useAlarms();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState('');
  
  const enabledAlarms = alarms.filter(a => a.enabled);
  const nextAlarm = enabledAlarms.length > 0 ? enabledAlarms[0] : null;

  const handleCreate = (type?: string) => {
    if (profile?.subscriptionStatus === 'free' && alarms.length >= 3) {
      setPaywallReason('Free plan is limited to 3 active alarms');
      setIsPaywallOpen(true);
      return;
    }
    onCreateAlarm(type);
  };

  return (
    <div className="h-full flex flex-col p-6 no-scrollbar overflow-y-auto pb-32">
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onUpgrade={() => {
          setIsPaywallOpen(false);
          onUpgrade();
        }}
        reason={paywallReason}
      />

      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <p className="text-charcoal-light font-bold tracking-tight text-xs mb-1 italic opacity-60">Good morning</p>
          <h2 className="text-3xl font-heading font-black text-charcoal">{profile?.name || 'Up Hero'} 👋</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={onViewStreaks} className="px-4 h-11 bg-mint text-charcoal rounded-2xl flex items-center gap-2 font-black text-sm shadow-minimal transition-transform active:scale-95">
            <Flame size={16} fill="white" className="text-white" />
            {stats.streak}
          </button>
          <button onClick={onViewSettings} className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-minimal border border-minimal-gray transition-transform active:scale-95">
            <Settings size={20} className="text-charcoal-light" />
          </button>
        </div>
      </header>

      {/* Streak Banner */}
      <section 
        onClick={onViewStreaks}
        className="sunrise-gradient rounded-[2rem] p-6 mb-8 text-white flex justify-between items-center shadow-premium relative overflow-hidden cursor-pointer group transition-transform active:scale-[0.98]"
      >
        <div className="relative z-10 ">
          <p className="text-white font-bold text-sm mb-1 opacity-80">Morning Momentum</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter">{stats.streak}</span>
            <span className="text-lg font-black uppercase opacity-60">Day Streak</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
           <Flame size={120} />
        </div>
      </section>

      {/* Next Alarm Card */}
      {nextAlarm ? (
        <section 
          onClick={() => onEditAlarm(nextAlarm)}
          className="premium-card mb-8 cursor-pointer active:scale-[0.98] transition-transform relative group"
        >
          {profile?.subscriptionStatus === 'free' && alarms.length >= 2 && (
             <div className="absolute top-4 right-4 text-sunrise animate-pulse">
                <Crown size={14} />
             </div>
          )}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-black text-sunrise tracking-widest mb-2 px-2 py-0.5 bg-sunrise/10 rounded-full inline-block">Next Ritual</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-5xl font-black text-charcoal">{nextAlarm.time}</h3>
                <p className="text-xl font-black text-charcoal/20">AM</p>
              </div>
            </div>
            <div className="w-14 h-14 sky-gradient rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="text-white" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-minimal-gray/50">
            <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <p className="text-[10px] text-charcoal-light uppercase font-black tracking-tighter">
              AI Verification Active: {nextAlarm.tasks[0]?.charAt(0).toUpperCase() + nextAlarm.tasks[0]?.slice(1)}
            </p>
          </div>
        </section>
      ) : (
        <section 
          onClick={() => handleCreate()}
          className="premium-card mb-8 p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-minimal-gray bg-transparent shadow-none cursor-pointer hover:bg-white/50 transition-colors"
        >
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-minimal mb-4">
              <Plus size={32} className="text-charcoal/20" />
           </div>
           <p className="text-sm font-bold text-charcoal/40">No rituals set. Start your morning right.</p>
        </section>
      )}

      {/* Tasks Shortcut */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-charcoal-light uppercase tracking-[0.2em] opacity-40">Morning rituals</h4>
        {profile?.subscriptionStatus === 'free' && (
          <button onClick={onUpgrade} className="flex items-center gap-1.5 px-3 py-1.5 bg-morning-yellow/30 rounded-full transition-transform active:scale-95">
            <Sparkles size={12} className="text-sunrise" />
            <span className="text-[10px] font-black text-sunrise uppercase">Upgrade</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 pb-8">
        {[
          { id: 'coffee', icon: '☕', label: 'Coffee' },
          { id: 'math', icon: '🧠', label: 'Mind' },
          { id: 'movement', icon: '🏃', label: 'Body' },
          { id: 'brush', icon: '🪥', label: 'Smile' },
          { id: 'affirmation', icon: '🎤', label: 'Spirit' },
        ].map((task) => (
          <motion.button
            key={task.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCreate(task.id)}
            className="flex flex-col items-center justify-center gap-3 bg-white rounded-3xl p-6 h-36 shadow-premium border border-minimal-gray/20 transition-all active:ring-4 active:ring-sunrise/10 group relative overflow-hidden"
          >
            {(task.id === 'movement' || task.id === 'brush') && profile?.subscriptionStatus === 'free' && (
              <div className="absolute top-4 right-4 text-sunrise opacity-40 group-hover:opacity-100">
                <Crown size={14} />
              </div>
            )}
            <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform transform-gpu">{task.icon}</span>
            <span className="text-[11px] font-black uppercase text-charcoal tracking-tight opacity-70">{task.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Alarms List */}
      <div className="flex items-center justify-between mb-4 mt-4">
        <h4 className="text-xl font-black text-charcoal">Ritual Log</h4>
        <button 
          onClick={() => handleCreate()}
          className="w-11 h-11 bg-charcoal text-white rounded-2xl shadow-premium flex items-center justify-center transition-all active:scale-90"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {alarms.map((alarm, idx) => (
          <div 
            key={alarm.id} 
            className="bg-white rounded-3xl p-5 flex items-center justify-between border border-minimal-gray shadow-premium transition-all relative overflow-hidden"
          >
            {profile?.subscriptionStatus === 'free' && idx >= 2 && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div onClick={onUpgrade} className="bg-white px-4 py-2 rounded-2xl shadow-premium border border-minimal-gray flex items-center gap-2 cursor-pointer active:scale-95">
                  <Crown size={14} className="text-sunrise" />
                  <span className="text-[10px] font-black uppercase text-sunrise">Unlock with Pro</span>
                </div>
              </div>
            )}
            <div 
              onClick={() => onEditAlarm(alarm)}
              className={`flex-1 cursor-pointer transition-opacity ${alarm.enabled ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className="flex flex-col">
                <h5 className="text-2xl font-black text-charcoal leading-none">{alarm.time} <span className="text-sm font-black text-charcoal/20">AM</span></h5>
                <span className="text-[9px] font-black uppercase text-sunrise tracking-widest mt-1">
                  {alarm.tasks.length > 1 ? `${alarm.tasks.length} Step Protocol` : `${alarm.tasks[0]} Proof`}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-90">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={alarm.enabled} 
                onChange={() => toggleAlarm(alarm.id)}
              />
              <div className="w-14 h-8 bg-minimal-gray/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:shadow-sm after:transition-all peer-checked:bg-mint"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
