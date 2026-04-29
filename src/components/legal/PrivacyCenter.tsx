import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Mic, Bell, Brain, Trash2, Download } from 'lucide-react';

export default function PrivacyCenter({ 
  onBack, 
  onDeleteData, 
  onRequestData 
}: { 
  onBack: () => void;
  onDeleteData: () => void;
  onRequestData: () => void;
}) {
  const sections = [
    {
      icon: <Camera size={20} className="text-blue-500" />,
      title: 'Camera Data',
      text: 'Camera is used only to verify wake-up tasks like coffee, movement, and brushing teeth.'
    },
    {
      icon: <Mic size={20} className="text-purple-500" />,
      title: 'Microphone Data',
      text: 'Microphone is used only to verify spoken affirmations.'
    },
    {
      icon: <Bell size={20} className="text-sunrise" />,
      title: 'Alarm Data',
      text: 'We store your alarm times, task choices, and streak history to operate the app.'
    },
    {
      icon: <Brain size={20} className="text-indigo-500" />,
      title: 'AI Verification',
      text: 'Images, videos, or audio may be processed to verify your task. Do not use the app if you do not want this processing.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-charcoal">Privacy Center</h1>
      </header>

      <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-10">
        <p className="text-sm font-bold text-charcoal/40 leading-relaxed pl-2 uppercase tracking-widest text-[10px]">
          How we protect your ritual
        </p>

        <div className="grid gap-4">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex gap-4 items-start"
            >
              <div className="p-3 bg-gray-50 rounded-2xl">
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-charcoal mb-1">{section.title}</h3>
                <p className="text-xs font-bold text-charcoal/50 leading-relaxed">{section.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 space-y-3">
          <button 
            onClick={onDeleteData}
            className="w-full bg-red-50 text-red-500 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-colors active:scale-95"
          >
            <Trash2 size={20} />
            Delete Account & Data
          </button>
          <button 
            onClick={onRequestData}
            className="w-full bg-charcoal text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-colors active:scale-95 shadow-lg"
          >
            <Download size={20} />
            Request My Data
          </button>
        </div>
      </div>
    </div>
  );
}
