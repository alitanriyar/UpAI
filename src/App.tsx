import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAlarms } from './context/AlarmContext';
import WelcomeScreen from './components/screens/WelcomeScreen';
import OnboardingFlow from './components/screens/OnboardingFlow';
import Dashboard from './components/screens/Dashboard';
import CreateAlarm from './components/screens/CreateAlarm';
import AlarmRinging from './components/screens/AlarmRinging';
import VerificationScreen from './components/screens/VerificationScreen';
import SuccessScreen from './components/screens/SuccessScreen';
import StreakScreen from './components/screens/StreakScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import { AlarmProvider } from './context/AlarmContext';

// New Screens
import ProfileScreen from './components/screens/ProfileScreen';
import EditProfileScreen from './components/screens/EditProfileScreen';
import SubscriptionScreen from './components/screens/SubscriptionScreen';
import PrivacyCenter from './components/legal/PrivacyCenter';
import TermsAndConditions from './components/legal/TermsAndConditions';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import DataDeletion from './components/legal/DataDeletion';
import AboutPage from './components/legal/AboutPage';
import SupportPage from './components/SupportPage';
import PermissionExplanation from './components/PermissionExplanation';
import TabNavigation, { TabId } from './components/TabNavigation';

type ScreenId = 
  | 'welcome' 
  | 'main' | 'create' | 'verify' | 'success' 
  | 'edit_profile' | 'subscription' | 'privacy_center' 
  | 'terms' | 'privacy_policy' | 'data_deletion' | 'about' | 'support'
  | 'permission_notifications' | 'permission_camera' | 'permission_microphone';

const AppContent = () => {
  const { 
    user, 
    authLoading, 
    profileLoading,
    onboardingComplete, 
    activeAlarm, 
    setActiveAlarm, 
    recordSuccess, 
    addAlarm, 
    updateAlarm,
    deleteAccount
  } = useAlarms();
  
  const [currentScreen, setCurrentScreen] = React.useState<ScreenId>('welcome');
  const [activeTab, setActiveTab] = React.useState<TabId>('home');
  const [pendingAlarm, setPendingAlarm] = React.useState<any>(null);
  const [editingAlarm, setEditingAlarm] = React.useState<any>(null);
  const [lastTask, setLastTask] = React.useState<string>('');
  const { profile } = useAlarms();

  React.useEffect(() => {
    if (user && !authLoading && currentScreen === 'welcome') {
      setCurrentScreen('main');
    } else if (!user && !authLoading && currentScreen !== 'welcome') {
      setCurrentScreen('welcome');
    }
  }, [user, currentScreen, authLoading]);

  const handleOnboardingFinish = (profileData: any) => {
    setPendingAlarm({
      time: profileData?.wakeGoal || '07:00',
      days: [0, 1, 2, 3, 4, 5, 6],
      tasks: profileData?.preferredTask ? [profileData.preferredTask] : ['coffee']
    });
    setCurrentScreen('create');
  };

  const handleCreateAlarm = (taskType?: string) => {
    setEditingAlarm(null);
    if (taskType) {
      setPendingAlarm({ tasks: [taskType] });
    } else {
      setPendingAlarm({ tasks: [] });
    }
    setCurrentScreen('create');
  };

  const handleEditAlarm = (alarm: any) => {
    setEditingAlarm(alarm);
    setCurrentScreen('create');
  };

  const handleCreateFinish = (alarmSettings: any) => {
    if (alarmSettings.id) {
      updateAlarm(alarmSettings.id, alarmSettings);
    } else {
      addAlarm({ ...alarmSettings, sound: 'Default', gradualVolume: true, pitchShift: false });
    }
    setPendingAlarm(null);
    setEditingAlarm(null);
    setCurrentScreen('main');
    setActiveTab('alarms');
  };

  const handleStartTask = () => {
    if (activeAlarm) {
      setLastTask(activeAlarm.tasks[0]);
      setCurrentScreen('verify');
    }
  };

  const handleVerificationSuccess = () => {
    if (activeAlarm) {
      // Record success for all tasks in the sequence (or just once)
      activeAlarm.tasks.forEach(task => recordSuccess(task));
      setActiveAlarm(null);
      setCurrentScreen('success');
    }
  };

  const renderMainTab = () => {
    switch (activeTab) {
      case 'home':
      case 'alarms':
        return (
          <Dashboard 
            onCreateAlarm={handleCreateAlarm} 
            onEditAlarm={handleEditAlarm}
            onViewStreaks={() => setActiveTab('streaks')}
            onViewSettings={() => setCurrentScreen('profile')}
            onUpgrade={() => setCurrentScreen('subscription')}
          />
        );
      case 'streaks':
        return <StreakScreen onBack={() => setActiveTab('home')} onUpgrade={() => setCurrentScreen('subscription')} />;
      case 'profile':
        return (
          <ProfileScreen 
            onEdit={() => setCurrentScreen('edit_profile')}
            onSubscription={() => setCurrentScreen('subscription')}
            onPrivacyCenter={() => setCurrentScreen('privacy_center')}
            onTerms={() => setCurrentScreen('terms')}
            onPrivacyPolicy={() => setCurrentScreen('privacy_policy')}
            onSupport={() => setCurrentScreen('support')}
            onDeleteAccount={() => setCurrentScreen('data_deletion')}
            onAlarmSettings={() => setCurrentScreen('privacy_center')}
          />
        );
    }
  };

  const renderScreen = () => {
    if (authLoading || (user && profileLoading)) {
      return (
        <div className="flex flex-col h-full items-center justify-center bg-morning-cream">
           <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-sunrise border-t-transparent rounded-full"
           />
           <p className="mt-4 font-bold text-charcoal/40 uppercase tracking-widest text-[10px]">Waking up systems...</p>
        </div>
      );
    }

    if (activeAlarm && currentScreen !== 'verify') {
      return <AlarmRinging alarm={activeAlarm} onStartTask={handleStartTask} />;
    }

    if (user && !onboardingComplete && currentScreen !== 'welcome') {
      return <OnboardingFlow onComplete={handleOnboardingFinish} />;
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      
      case 'main':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">{renderMainTab()}</div>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        );

      case 'create':
        return <CreateAlarm editingAlarm={editingAlarm || pendingAlarm} onBack={() => setCurrentScreen('main')} onChooseTask={handleCreateFinish} />;
      case 'verify':
        return <VerificationScreen tasks={activeAlarm?.tasks || [lastTask as any] || ['coffee']} onSuccess={handleVerificationSuccess} onUpgrade={() => setCurrentScreen('subscription')} />;
      case 'success':
        return <SuccessScreen task={lastTask} onDone={() => setCurrentScreen('main')} />;
      
      case 'edit_profile':
        return <EditProfileScreen onBack={() => setCurrentScreen('main')} />;
      case 'subscription':
        return <SubscriptionScreen onBack={() => setCurrentScreen('main')} onRestore={() => {}} />;
      case 'privacy_center':
        return <PrivacyCenter onBack={() => setCurrentScreen('main')} onDeleteData={() => setCurrentScreen('data_deletion')} onRequestData={() => {}} />;
      case 'terms':
        return <TermsAndConditions onBack={() => (user ? setCurrentScreen('main') : setCurrentScreen('welcome'))} />;
      case 'privacy_policy':
        return <PrivacyPolicy onBack={() => (user ? setCurrentScreen('main') : setCurrentScreen('welcome'))} />;
      case 'data_deletion':
        return <DataDeletion onBack={() => setCurrentScreen('privacy_center')} onConfirm={deleteAccount} />;
      case 'about':
        return <AboutPage onBack={() => setCurrentScreen('main')} onViewPrivacy={() => setCurrentScreen('privacy_policy')} onViewTerms={() => setCurrentScreen('terms')} />;
      case 'support':
        return <SupportPage onBack={() => setCurrentScreen('main')} onRestore={() => {}} />;

      case 'permission_notifications':
        return <PermissionExplanation type="notifications" onConfirm={() => setCurrentScreen('main')} onSkip={() => setCurrentScreen('main')} />;
      
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="device-container bg-morning-cream">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen + onboardingComplete + (currentScreen === 'main' ? activeTab : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AlarmProvider>
      <AppContent />
    </AlarmProvider>
  );
}
