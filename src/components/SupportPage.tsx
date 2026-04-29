import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronDown, ChevronUp, Mail, MessageSquare, AlertCircle, HelpCircle, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SupportPage({ onBack, onRestore }: { onBack: () => void; onRestore: () => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: 'Why didn’t my alarm ring?',
      a: 'Check your device volume, notifications permissions, and Focus Mode. Ensure UpAI is not being battery-restricted by your OS.'
    },
    {
      q: 'How does AI verification work?',
      a: 'Our AI analyzes camera or microphone input in real-time to match the task requirement. It looks for specific patterns related to your chosen ritual.'
    },
    {
      q: 'How do I delete my account?',
      a: 'Go to Profile > Privacy Center > Delete Account & Data to permanently remove your ritual history.'
    },
    {
      q: 'How do I cancel subscription?',
      a: 'Subscriptions are managed through your Apple App Store or Google Play account. Go to your store profile and look for Subscriptions.'
    },
    {
      q: 'How do I enable camera or microphone?',
      a: 'Grant permissions during task selection or go to your system settings for UpAI and enable them manually.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'support'), {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'anonymous',
        subject,
        message,
        createdAt: serverTimestamp()
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col h-full bg-white p-10 items-center justify-center text-center">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h1 className="text-2xl font-black text-charcoal mb-4">Request Sent</h1>
        <p className="text-charcoal/50 font-bold mb-8">Our support team will get back to you ritualistically soon.</p>
        <button
          onClick={() => setSent(false)}
          className="w-full bg-charcoal text-white py-5 rounded-[2rem] font-black shadow-xl"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-morning-cream">
      <header className="p-6 flex items-center gap-4 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-charcoal/5">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-charcoal">Support & Help</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-20">
        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2 overflow-hidden">
            <HelpCircle size={18} className="text-sunrise" />
            <h2 className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Common Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm font-black text-charcoal leading-snug">{faq.q}</span>
                  {activeFaq === i ? <ChevronUp size={20} className="text-charcoal/20" /> : <ChevronDown size={20} className="text-charcoal/20" />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs font-bold text-charcoal/40 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <MessageSquare size={18} className="text-sunrise" />
            <h2 className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">Contact Support</h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What can we help with?"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm focus:ring-2 focus:ring-sunrise/10 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest ml-1">Message</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm focus:ring-2 focus:ring-sunrise/10 focus:outline-none resize-none"
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-charcoal text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              Send Ritual Request
            </button>
          </form>
        </section>

        {/* Support Actions */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={onRestore}
            className="w-full bg-sunrise/5 text-sunrise py-5 rounded-[2rem] font-black border border-sunrise/10 active:scale-95 transition-all"
          >
            Restore Purchases
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-charcoal/20 uppercase tracking-widest">
              Email: support@upaiapp.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
