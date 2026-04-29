import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Mic, Brain, X, Check, Loader2, RefreshCw, Sparkles, SwitchCamera, Crown, ArrowRight, RotateCcw } from 'lucide-react';
import { useAlarms } from '../../context/AlarmContext';
import { verifyTask } from '../../lib/ai';
import { TaskType, AIResponse } from '../../types';
import confetti from 'canvas-confetti';
import PermissionExplanation, { PermissionType } from '../PermissionExplanation';
import PaywallModal from '../PaywallModal';

export default function VerificationScreen({ 
  tasks, 
  onSuccess,
  onUpgrade
}: { 
  tasks: TaskType[]; 
  onSuccess: () => void;
  onUpgrade: () => void;
}) {
  const { profile } = useAlarms();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [status, setStatus] = useState<'EXPLAINING' | 'IDLE' | 'RECORDING' | 'VERIFYING' | 'FAILED' | 'SUCCESS'>('EXPLAINING');
  const [errorMsg, setErrorMsg] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [showMathFallback, setShowMathFallback] = useState(false);
  const [mathTask, setMathTask] = useState<{ q: string; a: number } | null>(null);
  const [mathInput, setMathInput] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState('');
  const [recordingTimer, setRecordingTimer] = useState(0);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const framesRef = useRef<{ data: string; mimeType: string }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentTask = tasks[currentTaskIndex];
  const activeTaskType = showMathFallback ? 'math' : currentTask;
  const isVisual = ['coffee', 'brush', 'movement'].includes(activeTaskType);
  const isAudio = activeTaskType === 'affirmation';
  const isSequenceTask = ['movement', 'brush'].includes(activeTaskType);

  const checkLimits = () => {
    if (profile?.subscriptionStatus === 'pro') return true;

    const today = new Date().toISOString().split('T')[0];
    const usage = profile?.dailyUsage?.date === today ? profile.dailyUsage : { coffee: 0, affirmation: 0 };
    
    if (activeTaskType === 'coffee' && usage.coffee >= 3) {
      setPaywallReason('Daily limit for Coffee verification reached');
      setIsPaywallOpen(true);
      return false;
    }
    if (activeTaskType === 'affirmation' && usage.affirmation >= 2) {
      setPaywallReason('Daily limit for Mindset verification reached');
      setIsPaywallOpen(true);
      return false;
    }
    return true;
  };

  // Mindfulness Logic
  useEffect(() => {
    if (activeTaskType === 'mindfulness' && status === 'EXPLAINING') {
      setStatus('RECORDING');
    }
  }, [activeTaskType, status]);

  // Handle Math setup
  useEffect(() => {
    if (activeTaskType === 'math' && status === 'EXPLAINING') {
      const parts = [Math.floor(Math.random() * 9) + 2, Math.floor(Math.random() * 9) + 2];
      setMathTask({ q: `${parts[0]} x ${parts[1]}`, a: parts[0] * parts[1] });
      setStatus('IDLE');
    }
  }, [activeTaskType, status]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isVisual && (status === 'IDLE' || status === 'RECORDING' || status === 'VERIFYING' || status === 'FAILED')) {
      if (!checkLimits()) return;
      startCamera();
    }
    return () => stopCamera();
  }, [activeTaskType, facingMode, status, isVisual]);

  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: 1.7777777778 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setErrorMsg("Camera access needed.");
    }
  };

  const stopCamera = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const handleTaskSuccess = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setStatus('EXPLAINING');
      setErrorMsg('');
      setConfidence(0);
      setMathInput('');
      setFailCount(0);
      setShowMathFallback(false);
      setRecordingTimer(0);
    } else {
      setStatus('SUCCESS');
      confetti();
      setTimeout(onSuccess, 2000);
    }
  };

  const captureFrame = () => {
    if (!canvasRef.current || !videoRef.current) return null;
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    // Use higher quality for better AI recognition
    return canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
  };

  const handleCapture = async () => {
    if (isSequenceTask) {
      startRecording();
    } else {
      performSingleCapture();
    }
  };

  const startRecording = () => {
    setStatus('RECORDING');
    setRecordingTimer(7);
    framesRef.current = [];
    
    const interval = setInterval(() => {
      setRecordingTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishRecording();
          return 0;
        }
        
        // Capture a frame every second
        const frame = captureFrame();
        if (frame) {
          framesRef.current.push({ data: frame, mimeType: 'image/jpeg' });
        }
        
        return prev - 1;
      });
    }, 1000);
    
    captureIntervalRef.current = interval;
  };

  const finishRecording = async () => {
    setStatus('VERIFYING');
    const result = await verifyTask(activeTaskType as any, framesRef.current);
    handleAIResult(result);
  };

  const performSingleCapture = async () => {
    const frame = captureFrame();
    if (!frame) return;
    
    setStatus('VERIFYING');
    const result = await verifyTask(activeTaskType as any, { data: frame, mimeType: 'image/jpeg' });
    handleAIResult(result);
  };

  const handleAIResult = (result: AIResponse) => {
    if (result.approved) {
      handleTaskSuccess();
    } else {
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      setStatus('FAILED');
      
      if (newFailCount >= 5) {
        setErrorMsg("Too many attempts. Switching to Math Mode.");
        setTimeout(() => {
          setShowMathFallback(true);
          setStatus('EXPLAINING');
        }, 2000);
      } else {
        setErrorMsg(result.retry_instruction || "Try again — make the action more clear.");
      }
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setStatus('VERIFYING');
          const result = await verifyTask('affirmation', { data: base64Audio, mimeType: 'audio/webm' });
          handleAIResult(result);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setStatus('RECORDING');
      setRecordingTimer(5);

      const interval = setInterval(() => {
        setRecordingTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            mediaRecorder.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMsg("Microphone access denied.");
      setStatus('FAILED');
    }
  };

  const handleMathSubmit = () => {
    if (mathTask && parseInt(mathInput) === mathTask.a) {
      handleTaskSuccess();
    } else {
      setStatus('FAILED');
      setErrorMsg("Incorrect. Focus!");
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  const renderContent = () => {
    if (isPaywallOpen) return null;

    if (status === 'EXPLAINING' && (isVisual || isAudio)) {
      return (
        <PermissionExplanation 
          type={isVisual ? 'camera' : 'microphone'} 
          onConfirm={() => {
            if (checkLimits()) setStatus('IDLE');
          }}
          onSkip={() => setStatus('IDLE')}
        />
      );
    }

    if (activeTaskType === 'math') {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-morning-cream">
          <div className="w-20 h-20 bg-sky/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-minimal">
            <Brain size={40} className="text-sky" />
          </div>
          <h2 className="text-2xl font-heading font-black text-charcoal mb-2">Morning Puzzle</h2>
          <p className="text-sm text-charcoal-light font-medium mb-8">Wake up your brain synapses!</p>
          
          {showMathFallback && (
            <div className="px-4 py-1.5 bg-sunrise/10 rounded-full mb-6">
              <p className="text-sunrise text-[10px] font-black uppercase tracking-widest leading-none">Safety Fallback Active</p>
            </div>
          )}
          
          <div className="premium-card p-12 w-full mb-8 sunrise-gradient shadow-premium border-0">
            <p className="text-6xl font-black text-white drop-shadow-sm">{mathTask?.q}</p>
          </div>
          
          <input 
            type="number"
            autoFocus
            value={mathInput}
            onChange={(e) => setMathInput(e.target.value)}
            className="w-full bg-white rounded-3xl p-6 text-4xl font-black text-center shadow-premium border-2 border-minimal-gray focus:outline-none focus:ring-4 focus:ring-sunrise/10 focus:border-sunrise transition-all text-charcoal"
            placeholder="?"
          />
          
          <button 
            onClick={handleMathSubmit} 
            className="w-full mt-10 sunrise-gradient text-white py-5 rounded-[2rem] font-black text-xl shadow-premium active:scale-95 transition-transform"
          >
            Solve to Wake
          </button>
        </div>
      );
    }    if (activeTaskType === 'affirmation') {
      const affirmationText = "I am grateful, I am happy, I am healthy, I am lucky.";
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-morning-cream">
           <div className="w-20 h-20 bg-soft-purple/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-minimal relative">
             <Mic size={40} className={`${status === 'RECORDING' ? 'text-sunrise animate-pulse' : 'text-soft-purple'}`} />
             {status === 'RECORDING' && (
               <div className="absolute -top-1 -right-1 w-6 h-6 bg-sunrise rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-morning-cream">
                 {recordingTimer}
               </div>
             )}
           </div>
           <h2 className="text-2xl font-heading font-black text-charcoal mb-2">Morning Affirmation</h2>
           <p className="text-sm text-charcoal-light font-medium mb-8">Speak your intentions into existence.</p>
           
           <div className="premium-card p-10 italic text-xl font-bold text-charcoal/80 mb-10 leading-relaxed border-l-4 border-l-soft-purple bg-white shadow-premium rounded-[2rem] relative overflow-hidden">
             <AnimatePresence>
               {status === 'RECORDING' && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-sunrise/5 flex items-center justify-center pointer-events-none"
                 >
                   <div className="flex gap-1">
                     {[1, 2, 3, 4, 5].map(i => (
                       <motion.div 
                         key={i}
                         animate={{ height: [10, 30, 10] }}
                         transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                         className="w-1 bg-sunrise/40 rounded-full"
                       />
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
             "{affirmationText}"
           </div>
           
           <div className="flex flex-col items-center gap-6 w-full">
             <AnimatePresence>
               {status === 'FAILED' && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="text-sunrise font-black text-xs uppercase tracking-widest mb-2"
                 >
                   {errorMsg}
                 </motion.div>
               )}
             </AnimatePresence>

             <motion.button 
               whileTap={{ scale: 0.95 }} 
               disabled={status === 'RECORDING' || status === 'VERIFYING'}
               onClick={() => {
                 if (checkLimits()) {
                   startAudioRecording();
                 }
               }} 
               className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black text-xl shadow-premium active:scale-95 transition-transform flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {status === 'RECORDING' ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Listening...
                  </>
                ) : status === 'VERIFYING' ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Start Speaking
                    <Mic size={24} />
                  </>
                )}
             </motion.button>
             
             {failCount > 2 && (
               <button 
                onClick={() => { setShowMathFallback(true); setStatus('EXPLAINING'); }}
                className="mt-2 text-[10px] font-black uppercase tracking-widest text-charcoal-light underline"
               >
                 Switch to Math Proof
               </button>
             )}
           </div>
        </div>
      );
    }

    const getInstructionHtml = () => {
      switch (activeTaskType) {
        case 'coffee': return "Show your coffee in the camera.";
        case 'movement': return "Stand where your full body is visible and do 5 squats.";
        case 'brush': return "Show yourself brushing your teeth.";
        default: return `${activeTaskType} Proof Mode`;
      }
    };

    return (
      <div className="relative h-full w-full overflow-hidden flex flex-col bg-charcoal">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className={`flex-1 object-cover transition-opacity duration-300 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Countdown Overlay - No blur to keep preview clear */}
        <AnimatePresence>
          {status === 'RECORDING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/10 z-50 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-6">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/10 backdrop-blur-3xl rounded-full w-40 h-40 flex items-center justify-center border border-white/30 shadow-premium"
                >
                  <span className="text-7xl font-black text-white">{recordingTimer}</span>
                </motion.div>
                <div className="bg-sunrise/90 px-6 py-2 rounded-full shadow-premium">
                  <p className="text-white font-black text-sm uppercase tracking-widest animate-pulse">Action Recording...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-between p-8">
          <div className="flex flex-col items-center">
            <div className="w-full px-6 py-5 bg-charcoal/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-premium text-center">
              <p className="text-[10px] font-black uppercase text-sunrise mb-2 tracking-widest leading-none">Step {currentTaskIndex + 1} of {tasks.length}</p>
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-1">{getInstructionHtml()}</h2>
              <p className="text-white/60 text-[10px] font-medium italic">Make sure you are visible in the frame</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <AnimatePresence>
              {status === 'FAILED' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-sunrise backdrop-blur-xl text-white px-8 py-5 rounded-[2.5rem] font-black shadow-premium border border-white/20 max-w-full text-center"
                >
                  <span className="text-base">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-5 mb-4 w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCapture}
                disabled={status === 'VERIFYING' || status === 'RECORDING'}
                className="w-full sunrise-gradient text-white py-6 rounded-[2.5rem] font-black text-xl shadow-premium active:scale-95 transition-transform flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === 'VERIFYING' ? (
                  <>
                    <Loader2 className="animate-spin" size={32} />
                    Analyzing Ritual...
                  </>
                ) : status === 'RECORDING' ? (
                  <>
                    <RotateCcw className="animate-spin" size={32} />
                    Recording...
                  </>
                ) : (
                  <>
                    <Camera size={32} />
                    {isSequenceTask ? 'Start Verification' : 'Verify Coffee'}
                  </>
                )}
              </motion.button>
              
              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                  className="flex-1 flex items-center justify-center gap-2 text-white/60 font-black text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/10 transition-colors hover:bg-white/20"
                >
                  <SwitchCamera size={16} />
                  Switch Camera
                </button>
                {failCount > 1 && (
                  <button 
                    onClick={() => { setShowMathFallback(true); setStatus('EXPLAINING'); }}
                    className="flex-1 px-5 py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase text-white tracking-widest border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Skip to Math
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-morning-cream overflow-hidden">
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onUpgrade={() => {
          setIsPaywallOpen(false);
          onUpgrade();
        }}
        reason={paywallReason}
      />
      <AnimatePresence mode="wait">
        {status === 'SUCCESS' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center sunrise-gradient text-white text-center p-12">
            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-premium flex items-center justify-center mb-10">
              <Check size={64} className="text-sunrise" />
            </div>
            <h1 className="text-4xl font-heading font-black">Morning Proved!</h1>
            <p className="mt-4 font-bold text-lg opacity-90">Enjoy your productive day ahead.</p>
            <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm">
               <Sparkles size={20} />
               <span className="font-black text-sm uppercase tracking-widest">Streak Extended!</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key={currentTaskIndex} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="h-full">
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
