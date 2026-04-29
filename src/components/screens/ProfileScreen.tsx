import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Shield, 
  FileText, 
  Lock, 
  HelpCircle, 
  Trash2, 
  LogOut, 
  Crown,
  ChevronRight,
  Flame,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import { logout } from '../../lib/firebase';

export default function ProfileScreen({ 
  onEdit, 
  onSubscription, 
  onPrivacyCenter, 
  onTerms, 
  onPrivacyPolicy, 
  onSupport, 
  onDeleteAccount,
  onAlarmSettings
}: { 
  onEdit: () => void;
  onSubscription: () => void;
  onPrivacyCenter: () => void;
  onTerms: () => void;
  onPrivacyPolicy: () => void;
  onSupport: () => void;
  onDeleteAccount: () => void;
  onAlarmSettings: () => void;
}) {
  const { profile, stats } = useAlarms();

  const menuItems = [
    { icon: <Crown size={18} />, label: 'Subscription', action: onSubscription, color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: <Settings size={18} />, label: 'Alarm Settings', action: onAlarmSettings, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: <Shield size={18} />, label: 'Privacy Center', action: onPrivacyCenter, color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: <FileText size={18} />, label: 'Terms & Conditions', action: onTerms, color: 'text-charcoal/40', bg: 'bg-gray-50' },
    { icon: <Lock size={18} />, label: 'Privacy Policy', action: onPrivacyPolicy, color: 'text-charcoal/40', bg: 'bg-gray-50' },
    { icon: <HelpCircle size={18} />, label: 'Contact Support', action: onSupport, color: 'text-green-500', bg: 'bg-green-50' },
    { icon: <Trash2 size={18} />, label: 'Delete Account', action: onDeleteAccount, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  if (!profile) return null;

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-8 pt-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sunrise/5 to-transparent opacity-50" />
        
        <div className="relative z-10 space-y-6">
          <div className="relative inline-block group">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-500">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-charcoal text-white text-3xl font-black">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            {profile.subscriptionStatus === 'pro' && (
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                <Crown size={16} />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-black text-charcoal leading-none mb-1">{profile.name || 'Hero'}</h1>
            <p className="text-xs font-bold text-charcoal/30 uppercase tracking-widest">{profile.email || 'Mystery Guest'}</p>
            {profile.providerId && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-charcoal/5 rounded-full">
                <span className="text-[8px] font-black uppercase text-charcoal/30 tracking-widest leading-none">Signed in with</span>
                <span className="text-[8px] font-black uppercase text-charcoal/60 tracking-widest leading-none capitalize">{profile.providerId.replace('.com', '')}</span>
              </div>
            )}
          </div>

          <button 
            onClick={onEdit}
            className="px-6 py-2 bg-charcoal text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg active:scale-95 transition-transform"
          >
            Edit Profile
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 space-y-10 overflow-y-auto pb-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <Flame size={24} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-charcoal">{stats.streak}</p>
              <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Day Streak</p>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-charcoal">{stats.totalWakes}</p>
              <p className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Rituals Done</p>
            </div>
          </div>
        </div>

        {/* Preference Card */}
        <div className="bg-charcoal rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Zap size={20} className="text-sunrise" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Fav Ritual</p>
              <p className="font-black capitalize">{profile.preferredTask} Mode</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-sunrise">PRO</p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest pl-2">Settings & Rituals</h3>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {menuItems.map((item, i) => (
              <button 
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2.5 ${item.bg} ${item.color} rounded-2xl group-active:scale-90 transition-transform`}>
                  {item.icon}
                </div>
                <span className="flex-1 text-left font-black text-charcoal text-sm">{item.label}</span>
                <ChevronRight size={18} className="text-charcoal/10" />
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <button 
          onClick={() => logout()}
          className="w-full bg-red-50 text-red-500 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all mb-10"
        >
          <LogOut size={20} />
          Sign Out of Ritual
        </button>
      </div>
    </div>
  );
}
