import React from 'react';
import { motion } from 'motion/react';
import { Check, Flame, ArrowRight, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAlarms } from '../../context/AlarmContext';

export default function SuccessScreen({ task, onDone }: { task: string; onDone: () => void }) {
  const { stats } = useAlarms();

  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB86C', '#FFE8A3', '#A8E6CF']
    });
  }, []);

  return (
    <div className="h-full w-full bg-sunrise flex flex-col items-center justify-between p-12 text-center text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]" />

      <div className="mt-20 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-white rounded-full mx-auto mb-10 flex items-center justify-center shadow-2xl"
        >
          <Sun size={64} className="text-sunrise" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black mb-4"
        >
          You're up.
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold opacity-80"
        >
          Great start to your day.
        </motion.p>
      </div>

      <div className="w-full space-y-6 relative z-10 mb-10">
        <div className="flex gap-4">
          <div className="flex-1 bg-white/20 backdrop-blur-md p-6 rounded-[2.5rem] text-center border border-white/10">
            <Flame size={24} className="mx-auto mb-2 text-white" />
            <p className="text-[10px] uppercase font-black opacity-60 mb-1">Streak</p>
            <p className="text-3xl font-black">{stats.streak}</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-md p-6 rounded-[2.5rem] text-center border border-white/10">
            <Check size={24} className="mx-auto mb-2 text-white" />
            <p className="text-[10px] uppercase font-black opacity-60 mb-1">Task</p>
            <p className="text-2xl font-black truncate">{task.charAt(0).toUpperCase() + task.slice(1)}</p>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full bg-white text-sunrise py-6 rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          Back to Dashboard
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
