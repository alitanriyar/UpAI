import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Check, Loader2 } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import { TaskType, UserProfile } from '../../types';

export default function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateProfile } = useAlarms();
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [preferredTask, setPreferredTask] = useState<TaskType>(profile?.preferredTask || 'coffee');
  const [wakeGoal, setWakeGoal] = useState(profile?.wakeGoal || '07:00');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(profile?.difficulty || 'medium');
  const [sensitivity, setSensitivity] = useState(profile?.aiSensitivity || 0.8);
  const [saving, setSaving] = useState(false);

  const tasks: { type: TaskType; label: string }[] = [
    { type: 'coffee', label: 'Coffee' },
    { type: 'math', label: 'Math' },
    { type: 'movement', label: 'Movement' },
    { type: 'brush', label: 'Brush Teeth' },
    { type: 'affirmation', label: 'Affirmation' },
    { type: 'mindfulness', label: 'Mindfulness' },
  ];

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      name,
      email,
      preferredTask,
      wakeGoal,
      difficulty,
      aiSensitivity: sensitivity
    });
    setSaving(false);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-charcoal/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-charcoal">Edit Profile</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-charcoal text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
          Save
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-charcoal text-white flex items-center justify-center text-3xl font-black border-4 border-white shadow-xl overflow-hidden">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-charcoal text-white rounded-xl shadow-lg border-2 border-white active:scale-95 transition-transform">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 font-bold text-sm focus:ring-2 focus:ring-sunrise/10 focus:outline-none shadow-sm"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 font-bold text-sm focus:ring-2 focus:ring-sunrise/10 focus:outline-none shadow-sm"
              placeholder="Your email"
            />
          </div>

          {/* Preferred Task */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Preferred Wake Task</label>
            <div className="grid grid-cols-2 gap-2">
              {tasks.map((task) => (
                <button
                  key={task.type}
                  onClick={() => setPreferredTask(task.type)}
                  className={`p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center ${
                    preferredTask === task.type 
                      ? 'bg-charcoal text-white shadow-lg' 
                      : 'bg-white text-charcoal/40 border border-gray-100'
                  }`}
                >
                  {task.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wake Goal */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Daily Wake Goal</label>
            <input 
              type="time"
              value={wakeGoal}
              onChange={(e) => setWakeGoal(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 font-bold text-sm focus:ring-2 focus:ring-sunrise/10 focus:outline-none shadow-sm"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Alarm Difficulty</label>
            <div className="flex gap-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    difficulty === d 
                      ? 'bg-charcoal text-white shadow-md' 
                      : 'text-charcoal/30'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* AI Sensitivity */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest">AI Verification Sensitivity</label>
              <span className="text-[10px] font-black text-sunrise uppercase">{(sensitivity * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full accent-sunrise h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[10px] font-bold text-charcoal/30 leading-relaxed italic px-1">
              Higher sensitivity means stricter verification. Lower sensitivity is more forgiving but less ritualistic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
