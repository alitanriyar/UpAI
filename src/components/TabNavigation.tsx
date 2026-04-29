import React from 'react';
import { Home, AlarmClock, Flame, User } from 'lucide-react';

export type TabId = 'home' | 'alarms' | 'streaks' | 'profile';

export default function TabNavigation({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: TabId; 
  onTabChange: (tab: TabId) => void;
}) {
  const tabs = [
    { id: 'home', icon: <Home size={22} />, label: 'Home' },
    { id: 'alarms', icon: <AlarmClock size={22} />, label: 'Alarms' },
    { id: 'streaks', icon: <Flame size={22} />, label: 'Streaks' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-charcoal/5 px-6 pb-8 pt-4 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 relative"
          >
            <div className={`p-2 transition-all duration-300 ${isActive ? 'text-charcoal bg-sunrise/10 rounded-2xl scale-110 shadow-lg shadow-sunrise/5' : 'text-charcoal/20'}`}>
              {tab.icon}
            </div>
            {isActive && (
              <span className="text-[10px] font-black text-charcoal uppercase tracking-widest absolute -bottom-4 translate-y-full opacity-100 transition-opacity">
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
