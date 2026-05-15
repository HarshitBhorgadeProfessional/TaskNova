import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowLeft, Search, Command, CheckCircle2 } from 'lucide-react';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "How do I create a project?",
      answer: "Go to the Projects section and click on 'Create Project'. Admin users can create and manage projects."
    },
    {
      question: "How can I assign tasks?",
      answer: "Admins can assign tasks while creating or editing tasks from the task management panel."
    },
    {
      question: "Can members edit all tasks?",
      answer: "No. Members can only update tasks assigned to them based on role-based permissions."
    },
    {
      question: "How do notifications work?",
      answer: "Notifications appear in the top-right notification center and update in real-time."
    },
    {
      question: "How do I change my profile information?",
      answer: "You can update your profile name and preferences from the Settings panel."
    }
  ];

  const shortcuts = [
    { keys: ["Ctrl", "K"], label: "Search" },
    { keys: ["D"], label: "Dashboard (Overview & Analytics)" },
    { keys: ["P"], label: "Projects (Team Collaboration)" },
    { keys: ["T"], label: "Tasks (Task Management)" }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center px-6 py-6 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      <main className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 border border-indigo-500/20">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Help Center
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions and learn how to use TaskNova efficiently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Shortcuts */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Command className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Quick Shortcuts</h3>
              </div>
              <div className="space-y-4">
                {shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd key={i} className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs font-mono text-white shadow-sm">
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-sm text-slate-400">{shortcut.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <h3 className="font-semibold text-emerald-400">All systems operational</h3>
              </div>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> TaskNova
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-12 mt-12 text-center text-slate-500 text-sm border-t border-white/5 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <span>Designed & Developed by <span className="text-slate-300 font-medium">Harshit Bhorgade</span></span>
          <span className="hidden sm:block text-slate-700">•</span>
          <span>Software Developer</span>
          <span className="hidden sm:block text-slate-700">•</span>
          <span>+91 6265641092</span>
        </div>
      </footer>
    </div>
  );
};

export default Help;
