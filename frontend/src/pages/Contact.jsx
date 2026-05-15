import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Globe, Users, ArrowLeft } from 'lucide-react';

const Contact = () => {
  const contactCards = [
    {
      icon: <Mail className="w-6 h-6 text-indigo-400" />,
      title: "Email Support",
      value: "support@tasknova.com",
      description: "We usually respond within 24 hours.",
      link: "mailto:support@tasknova.com"
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-400" />,
      title: "GitHub Repository",
      value: "github.com/HarshitBhorgadeProfessional",
      description: "Explore the project source code and development updates.",
      link: "https://github.com/HarshitBhorgadeProfessional"
    },
    {
      icon: <Users className="w-6 h-6 text-pink-400" />,
      title: "Collaboration",
      value: "Open for teamwork and project discussions",
      description: "Let's build something amazing together.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center px-6 py-6 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Have questions, feedback, or collaboration ideas? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {contactCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <a 
                href={card.link}
                target={card.link.startsWith('http') ? "_blank" : "_self"}
                rel="noreferrer"
                className="block p-8 h-full rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-indigo-400 font-medium mb-4 break-all">{card.value}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
              </a>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-12 text-center text-slate-500 text-sm relative z-10">
        <p className="max-w-md mx-auto px-6">
          TaskNova is designed to simplify modern team collaboration and project management.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
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

export default Contact;
