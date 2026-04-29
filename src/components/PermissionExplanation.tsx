import React from 'react';
import { motion } from 'motion/react';
import { Bell, Camera, Mic, ChevronRight, X } from 'lucide-react';

export type PermissionType = 'notifications' | 'camera' | 'microphone';

export default function PermissionExplanation({ 
  type, 
  onConfirm, 
  onSkip 
}: { 
  type: PermissionType; 
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const content = {
    notifications: {
      icon: <Bell size={48} className="text-sunrise" />,
      title: 'Allow alarms',
      text: 'UpAI needs notifications to alert you when it’s time to wake up. We use critical alerts to ensure your ritual starts on time.',
      button: 'Enable Notifications'
    },
    camera: {
      icon: <Camera size={48} className="text-blue-500" />,
      title: 'Camera verification',
      text: 'Camera is used for tasks like showing coffee, movement, or brushing teeth. We only use visuals for real-time AI verification.',
      button: 'Enable Camera'
    },
    microphone: {
      icon: <Mic size={48} className="text-purple-500" />,
      title: 'Affirmation verification',
      text: 'Microphone is used only when you choose Affirmation Mode. We listen for your positive declarations to verify your wake-up.',
      button: 'Enable Microphone'
    }
  };

  const current = content[type];

  return (
    <div className="flex flex-col h-full bg-white p-8 justify-center items-center text-center relative">
      <button onClick={onSkip} className="absolute top-8 right-8 text-charcoal/20 p-2 hover:text-charcoal transition-colors">
        <X size={24} />
      </button>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-12 max-w-sm"
      >
        <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner">
          {current.icon}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-charcoal">{current.title}</h1>
          <p className="text-charcoal/50 font-bold leading-relaxed px-4">
            {current.text}
          </p>
        </div>

        <button 
          onClick={onConfirm}
          className="w-full bg-charcoal text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all group"
        >
          {current.button}
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[10px] uppercase font-black text-charcoal/20 tracking-widest pl-2">
          Your privacy is part of the ritual
        </p>
      </motion.div>
    </div>
  );
}
