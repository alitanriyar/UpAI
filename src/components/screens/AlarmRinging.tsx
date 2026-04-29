import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Alarm } from '../../types';
import { Bell, Sparkles, AlertTriangle } from 'lucide-react';

export default function AlarmRinging({ alarm, onStartTask }: { alarm: Alarm; onStartTask: () => void }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Basic oscillation sound as fallback if no audio file
    const playAlarmSound = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      
      // Gradually increase volume over 60 seconds if enabled
      let maxVolume = 0.1;
      if (alarm.gradualVolume) {
        maxVolume = Math.min(0.1, 0.01 + (elapsedSeconds / 60) * 0.09);
      }
      
      // Pitch shifting: Start low, go high over time if enabled
      let baseFreq = 440;
      if (alarm.pitchShift) {
        // Shift pitch up by one octave over 60 seconds
        baseFreq = 440 + (Math.min(60, elapsedSeconds) / 60) * 440;
      }
      
      osc.type = alarm.pitchShift ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(maxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    };

    const interval = setInterval(playAlarmSound, 1000);
    return () => {
      clearInterval(interval);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal text-white flex flex-col items-center justify-center p-10 overflow-hidden border-[12px] border-black rounded-[50px] shadow-2xl">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 tracking-tighter">{alarm.time}</h1>
        <p className="text-sm tracking-[0.3em] opacity-40 uppercase font-black">{alarm.label || 'Rise & Shine'}</p>
      </div>

      <div className="relative w-full aspect-square bg-white/5 rounded-[40px] mb-12 flex flex-col items-center justify-center overflow-hidden border border-white/10 shadow-inner">
        <div className="absolute top-4 left-4 flex gap-2">
           <div className="px-2 py-1 bg-red-500 text-[8px] text-white font-bold rounded uppercase animate-pulse">Live AI</div>
           <div className="px-2 py-1 bg-white/10 text-[8px] text-white font-bold rounded uppercase tracking-widest">{alarm.tasks[0]}</div>
        </div>
        
        <motion.div
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
        >
           <Sparkles size={64} className="text-white/20" />
        </motion.div>
        
        <p className="absolute bottom-6 text-xs text-white/40 font-bold uppercase tracking-widest">Awaiting Verification...</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onStartTask}
        className="w-full py-5 bg-white rounded-3xl text-charcoal text-sm font-bold shadow-2xl transition-transform active:scale-95"
      >
        I'm Awake
      </motion.button>
    </div>
  );
}
