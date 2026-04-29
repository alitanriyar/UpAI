import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, ChevronRight, Volume2, Smartphone, RotateCcw, Check } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export default function CreateAlarm({ onBack, onChooseTask, editingAlarm }: any) {
  const [time, setTime] = useState(editingAlarm?.time || '07:00');
  const [label, setLabel] = useState(editingAlarm?.label || 'Rise & Shine');
  const [selectedDays, setSelectedDays] = useState(editingAlarm?.days || [1, 2, 3, 4, 5]);
  const [sound, setSound] = useState(editingAlarm?.sound || 'Sunrise');
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [switches, setSwitches] = useState({
    vibration: editingAlarm?.vibration ?? true,
    snooze: editingAlarm?.snooze ?? true,
    gradualVolume: editingAlarm?.gradualVolume ?? true,
    pitchShift: editingAlarm?.pitchShift ?? false
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (idx: number) => {
    setSelectedDays(prev => 
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]
    );
  };

  const sounds = ['Sunrise', 'Forest', 'Ocean', 'Classic', 'Zen'];

  const handleSave = () => {
    onChooseTask({ 
      id: editingAlarm?.id,
      tasks: editingAlarm?.tasks || [],
      time, 
      label, 
      days: selectedDays, 
      sound,
      vibration: switches.vibration, 
      snooze: switches.snooze,
      gradualVolume: switches.gradualVolume,
      pitchShift: switches.pitchShift
    });
  };

  return (
    <div className="h-full flex flex-col bg-morning-cream">
      <header className="p-6 flex items-center justify-between">
        <button onClick={onBack} className="w-11 h-11 bg-white rounded-2xl shadow-minimal flex items-center justify-center border border-minimal-gray transition-transform active:scale-95">
          <X size={20} className="text-charcoal-light" />
        </button>
        <h2 className="text-xl font-heading font-black">{editingAlarm?.id ? 'Adjust Ritual' : 'New Ritual'}</h2>
        <div className="w-11" />
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-20">
        {/* Time Picker */}
        <div className="py-8 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-sunrise/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-8xl font-black bg-transparent text-charcoal focus:outline-none relative z-10 selection:bg-sunrise/20 cursor-pointer"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-minimal border border-minimal-gray">
             <Clock size={14} className="text-sunrise" />
             <p className="text-[10px] text-charcoal-light font-black uppercase tracking-widest leading-none">Wake up time</p>
          </div>
        </div>

        {/* Selected Tasks Preview */}
        {editingAlarm?.tasks && editingAlarm.tasks.length > 0 && (
          <div className="space-y-3">
             <p className="text-[10px] font-black text-charcoal-light uppercase tracking-widest pl-2 opacity-40">Proof sequence</p>
             <div className="premium-card space-y-4">
               {editingAlarm.tasks.map((t: string, i: number) => (
                 <div key={i} className="flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-xl bg-morning-yellow/30 flex items-center justify-center">
                        <span className="text-xs font-black text-sunrise">{i + 1}</span>
                     </div>
                     <span className="font-bold text-sm text-charcoal capitalize">{t} Verification</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Days Selection */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-charcoal-light uppercase tracking-widest pl-2 opacity-40">Repeats On</p>
          <div className="flex justify-between gap-1.5 overflow-x-auto no-scrollbar py-2">
            {days.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                className={`flex-shrink-0 w-11 h-11 rounded-2xl font-black text-[10px] uppercase transition-all duration-300 ${selectedDays.includes(i) ? 'bg-charcoal text-white scale-110 shadow-premium' : 'bg-white text-charcoal/20 border border-minimal-gray'}`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="premium-card py-4">
          <input 
            placeholder="Name your ritual (e.g. Early Bird)" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-transparent px-2 font-bold text-charcoal placeholder:text-charcoal/20 focus:outline-none text-sm"
          />
        </div>

        {/* Settings */}
        <div className="space-y-3 pb-8">
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="bg-mint/20 p-2 rounded-xl">
                  <Volume2 size={20} className="text-mint" />
                </div>
                <span className="font-bold">Sound</span>
               </div>
               <button 
                 onClick={() => setShowSoundPicker(!showSoundPicker)}
                 className="flex items-center gap-1 text-charcoal-light font-black text-[10px] uppercase tracking-widest bg-minimal-gray/30 px-3 py-1.5 rounded-xl transition-colors hover:bg-minimal-gray/50"
               >
                {sound} <ChevronRight size={14} className={`transition-transform ${showSoundPicker ? 'rotate-90' : ''}`} />
               </button>
             </div>

             <AnimatePresence>
               {showSoundPicker && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="grid grid-cols-2 gap-2 pt-2">
                      {sounds.map(s => (
                        <button 
                           key={s}
                           onClick={() => { setSound(s); setShowSoundPicker(false); }}
                           className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sound === s ? 'bg-charcoal text-white shadow-premium' : 'bg-morning-cream text-charcoal/40 border border-minimal-gray'}`}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
             <div className="pt-4 border-t border-minimal-gray/50">
               <p className="text-[9px] font-black uppercase text-charcoal-light/40 mb-4 tracking-widest">Premium Features</p>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal-light">Gradual Volume</span>
                    <Toggle 
                      checked={switches.gradualVolume} 
                      onChange={() => setSwitches(s => ({ ...s, gradualVolume: !s.gradualVolume }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal-light">Sonic Evolution</span>
                    <Toggle 
                      checked={switches.pitchShift} 
                      onChange={() => setSwitches(s => ({ ...s, pitchShift: !s.pitchShift }))} 
                    />
                  </div>
               </div>
             </div>
          </div>

          <div className="premium-card flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky/10 rounded-2xl flex items-center justify-center">
                <Smartphone size={20} className="text-sky" />
              </div>
              <span className="font-bold text-charcoal">Haptic Feedback</span>
            </div>
            <Toggle 
              checked={switches.vibration} 
              onChange={() => setSwitches(s => ({ ...s, vibration: !s.vibration }))} 
            />
          </div>

          <div className="premium-card flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-morning-yellow/30 rounded-2xl flex items-center justify-center">
                <RotateCcw size={20} className="text-sunrise" />
              </div>
              <span className="font-bold text-charcoal">Morning Snooze</span>
            </div>
            <Toggle 
              checked={switches.snooze} 
              onChange={() => setSwitches(s => ({ ...s, snooze: !s.snooze }))} 
            />
          </div>
        </div>
      </div>

      <div className="p-6 pt-2">
        <button
          onClick={handleSave}
          className="w-full sunrise-gradient text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-premium active:scale-95 transition-transform"
        >
          Save Ritual
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: any) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-12 h-7 bg-minimal-gray/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:shadow-sm after:transition-all peer-checked:bg-mint"></div>
    </label>
  );
}
