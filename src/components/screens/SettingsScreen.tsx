import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, Shield, Smartphone, Info, Mail, LogOut } from 'lucide-react';
import { logout } from '../../lib/firebase';
import { useAlarms } from '../../context/AlarmContext';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAlarms();
  const sections = [
    {
      title: 'General',
      items: [
        { icon: Bell, label: 'Alarm Sounds', value: 'Morning Birds' },
        { icon: Smartphone, label: 'Haptics', value: 'Natural' },
      ]
    },
    {
      title: 'AI & Privacy',
      items: [
        { icon: Shield, label: 'AI Sensitivity', value: 'High' },
        { icon: Info, label: 'Task Permissions', value: 'Active' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Mail, label: 'Feedback', value: '' },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-morning-cream">
      <header className="p-6 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm">
          <ChevronLeft className="text-charcoal/40" />
        </button>
        <h2 className="text-xl font-black">Settings</h2>
        <div className="w-8" />
      </header>

      <div className="flex-1 px-6 space-y-8 overflow-y-auto pb-12">
        {user && (
          <div className="bg-white rounded-[2rem] p-6 flex items-center gap-4 shadow-sm border border-sunrise/10">
            <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-16 h-16 rounded-full border-4 border-morning-cream shadow-inner" />
            <div className="flex-1">
              <h3 className="font-black text-charcoal">{user.displayName}</h3>
              <p className="text-xs font-bold text-charcoal/40">{user.email}</p>
            </div>
          </div>
        )}

        {sections.map((section, si) => (
          <div key={si} className="space-y-3">
            <h3 className="text-xs font-bold text-charcoal/30 uppercase tracking-widest pl-2 font-black">{section.title}</h3>
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm">
              {section.items.map((item, ii) => (
                <button 
                  key={ii} 
                  className="w-full flex items-center justify-between p-5 hover:bg-morning-cream/20 transition-colors border-b border-morning-cream last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-morning-cream p-2.5 rounded-2xl">
                      <item.icon size={20} className="text-sunrise" />
                    </div>
                    <span className="font-bold text-charcoal">{item.label}</span>
                  </div>
                  <span className="text-xs font-black text-charcoal/30 bg-morning-cream px-3 py-1 rounded-full">{item.value}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button 
            onClick={() => logout()}
            className="w-full bg-red-50 text-red-500 py-5 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-sm"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <div className="pt-8 text-center">
          <p className="text-xs text-charcoal/20 font-black tracking-widest uppercase">UpAI v1.0.0</p>
          <p className="text-[10px] text-charcoal/10 font-bold mt-1 uppercase">Cloud Optimized Verification</p>
        </div>
      </div>
    </div>
  );
}

