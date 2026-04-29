import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alarm, UserStats, TaskType, UserProfile } from '../types';
import { format } from 'date-fns';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  query,
  serverTimestamp,
  addDoc,
  Timestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';

interface AlarmContextType {
  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  profileLoading: boolean;
  alarms: Alarm[];
  stats: UserStats;
  onboardingComplete: boolean;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'enabled'>) => Promise<void>;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => Promise<void>;
  toggleAlarm: (id: string) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  completeOnboarding: (profileData?: Partial<UserProfile>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  recordSuccess: (taskType: TaskType) => Promise<void>;
  activeAlarm: Alarm | null;
  setActiveAlarm: (alarm: Alarm | null) => void;
  deleteAccount: () => Promise<void>;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    bestStreak: 0,
    totalWakes: 0,
    history: []
  });
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        // Reset state on logout
        setAlarms([]);
        setStats({ streak: 0, bestStreak: 0, totalWakes: 0, history: [] });
        setOnboardingComplete(false);
        setProfile(null);
        setProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Profile
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile(data as UserProfile);
          setOnboardingComplete(data.onboardingComplete || false);
          setProfileLoading(false);
        } else {
          // Create initial user doc
          const initialProfile: UserProfile = {
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || undefined,
            providerId: user.providerData[0]?.providerId || 'password',
            preferredTask: 'coffee',
            wakeGoal: '07:00',
            difficulty: 'medium',
            aiSensitivity: 0.8,
            subscriptionStatus: 'free',
            onboardingComplete: false,
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, sanitize({
            ...initialProfile,
            createdAt: serverTimestamp()
          }));
          setProfileLoading(false);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
        setProfileLoading(false);
      }
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
      setProfileLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Complete Profile if needed
  useEffect(() => {
    if (user && profile && (!profile.name || !profile.email)) {
      // In a real app we'd redirect to a Complete Profile screen. 
      // For this applet, let's just make sure we try to fill it from user object if it was empty.
      if (!profile.name && user.displayName) updateProfile({ name: user.displayName });
      if (!profile.email && user.email) updateProfile({ email: user.email });
    }
  }, [user, profile]);

  // Sync Alarms
  useEffect(() => {
    if (!user) return;

    const alarmsRef = collection(db, 'users', user.uid, 'alarms');
    const unsubscribe = onSnapshot(alarmsRef, (snapshot) => {
      const alarmList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          tasks: data.tasks || (data.taskType ? [data.taskType] : [])
        };
      }) as Alarm[];
      setAlarms(alarmList);
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/alarms`));

    return () => unsubscribe();
  }, [user]);

  // Sync Stats
  useEffect(() => {
    if (!user) return;

    const statsRef = doc(db, 'users', user.uid, 'stats', 'current');
    const unsubscribe = onSnapshot(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Since history is in a separate collection, we'll fetch it differently or combine
        setStats(prev => ({
          ...prev,
          streak: data.streak || 0,
          bestStreak: data.bestStreak || 0,
          totalWakes: data.totalWakes || 0,
        }));
      } else {
        // Initialize stats doc
        setDoc(statsRef, {
          userId: user.uid,
          streak: 0,
          bestStreak: 0,
          totalWakes: 0,
          updatedAt: serverTimestamp()
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/stats/current`));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/stats/current`));

    return () => unsubscribe();
  }, [user]);

  // Sync History (last few records for local stats object)
  useEffect(() => {
    if (!user) return;
    const historyRef = collection(db, 'users', user.uid, 'history');
    // For simplicity, we just sync history here
    const unsubscribe = onSnapshot(historyRef, (snapshot) => {
      const historyList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          date: data.date instanceof Timestamp ? format(data.date.toDate(), 'yyyy-MM-dd') : data.date,
          taskType: data.taskType,
          time: data.time
        };
      });
      setStats(prev => ({ ...prev, history: historyList }));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/history`));

    return () => unsubscribe();
  }, [user]);

  const sanitize = (data: any) => {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    if ('id' in sanitized) delete sanitized['id'];
    return sanitized;
  };

  const addAlarm = async (newAlarm: Omit<Alarm, 'id' | 'enabled'>) => {
    if (!user) return;
    const alarmsRef = collection(db, 'users', user.uid, 'alarms');
    try {
      // Ensure all required fields by security rules are present
      const alarmData = {
        label: 'Alarm',
        snooze: true,
        vibration: true,
        sound: 'Default',
        gradualVolume: true,
        pitchShift: false,
        tasks: [],
        ...newAlarm,
        userId: user.uid,
        enabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(alarmsRef, sanitize(alarmData));
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${user.uid}/alarms`);
    }
  };

  const updateAlarm = async (id: string, updatedFields: Partial<Alarm>) => {
    if (!user) return;
    const alarmRef = doc(db, 'users', user.uid, 'alarms', id);
    try {
      await updateDoc(alarmRef, sanitize({
        ...updatedFields,
        updatedAt: serverTimestamp()
      }));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}/alarms/${id}`);
    }
  };

  const toggleAlarm = async (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (!alarm) return;
    await updateAlarm(id, { enabled: !alarm.enabled });
  };

  const deleteAlarm = async (id: string) => {
    if (!user) return;
    const alarmRef = doc(db, 'users', user.uid, 'alarms', id);
    try {
      await deleteDoc(alarmRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${user.uid}/alarms/${id}`);
    }
  };

  const completeOnboarding = async (profileData?: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      const dataToUpdate = sanitize({ 
        ...profileData,
        onboardingComplete: true 
      });
      await updateDoc(userRef, dataToUpdate);
      // Optimistically update local state to ensure immediate screen transition
      setOnboardingComplete(true);
      if (profileData) {
        setProfile(prev => prev ? { ...prev, ...profileData, onboardingComplete: true } : null);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, sanitize(data));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const recordSuccess = async (taskType: TaskType) => {
    if (!user || !profile) return;
    const statsRef = doc(db, 'users', user.uid, 'stats', 'current');
    const historyRef = collection(db, 'users', user.uid, 'history');
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastEntry = stats.history[stats.history.length - 1];
      let newStreak = stats.streak;

      if (!lastEntry || lastEntry.date !== today) {
        newStreak += 1;
      }

      // Update basic stats
      await setDoc(statsRef, {
        userId: user.uid,
        streak: newStreak,
        bestStreak: Math.max(stats.bestStreak, newStreak),
        totalWakes: stats.totalWakes + 1,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update usage for cost control (only for Free users)
      if (profile.subscriptionStatus === 'free') {
        const usage = profile.dailyUsage?.date === today 
          ? { ...profile.dailyUsage } 
          : { date: today, coffee: 0, affirmation: 0 };
        
        if (taskType === 'coffee') usage.coffee += 1;
        if (taskType === 'affirmation') usage.affirmation += 1;

        await updateDoc(userRef, { dailyUsage: usage });
      }

      await addDoc(historyRef, {
        userId: user.uid,
        date: serverTimestamp(),
        taskType,
        time: format(new Date(), 'HH:mm')
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/recordSuccess`);
    }
  };

  // Alarm Monitor
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeAlarm) return;

      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDay = now.getDay();

      const triggered = alarms.find(a => 
        a.enabled && 
        a.time === currentTime && 
        a.days.includes(currentDay)
      );

      if (triggered) {
        const lastTrigger = localStorage.getItem('upai_last_trigger');
        if (lastTrigger !== `${triggered.id}_${currentTime}`) {
          setActiveAlarm(triggered);
          localStorage.setItem('upai_last_trigger', `${triggered.id}_${currentTime}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, activeAlarm]);

  const deleteAccount = async () => {
    if (!user) return;
    const userId = user.uid;
    const batch = writeBatch(db);
    
    // Delete main docs
    batch.delete(doc(db, 'users', userId));
    batch.delete(doc(db, 'users', userId, 'stats', 'current'));
    
    try {
      // Alarms
      const alarmsSnap = await getDocs(collection(db, 'users', userId, 'alarms'));
      alarmsSnap.forEach(d => batch.delete(d.ref));
      
      // History
      const historySnap = await getDocs(collection(db, 'users', userId, 'history'));
      historySnap.forEach(d => batch.delete(d.ref));
      
      await batch.commit();
      
      try {
        await auth.currentUser?.delete();
      } catch (authError: any) {
        console.error("Auth deletion failed:", authError);
        if (authError.code === 'auth/requires-recent-login') {
          // If we can't delete the auth user, at least sign them out
          // They will need to log back in to fully delete their auth account
          await auth.signOut();
          throw new Error('REAUTH_REQUIRED');
        }
        await auth.signOut();
      }
    } catch (e: any) {
      if (e.message === 'REAUTH_REQUIRED') throw e;
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/cleanup`);
    }
  };

  return (
    <AlarmContext.Provider value={{ 
      user, profile, authLoading, profileLoading, alarms, stats, onboardingComplete, addAlarm, updateAlarm, toggleAlarm, deleteAlarm, 
      completeOnboarding, updateProfile, recordSuccess, activeAlarm, setActiveAlarm, deleteAccount
    }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarms = () => {
  const context = useContext(AlarmContext);
  if (!context) throw new Error('useAlarms must be used within an AlarmProvider');
  return context;
};

