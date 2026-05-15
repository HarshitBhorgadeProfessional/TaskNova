import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Users, 
  BarChart3, 
  BellRing, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  Info,
  HelpCircle
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-400" />,
      title: "Smart Task Management",
      description: "Organize, prioritize, and track tasks with intelligent categorization and custom workflows."
    },
    {
      icon: <Users className="w-6 h-6 text-pink-400" />,
      title: "Real-Time Collaboration",
      description: "Work together seamlessly with instant updates, live comments, and team presence indicators."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: "Analytics & Insights",
      description: "Track productivity with detailed analytics, performance metrics, and progress reports."
    },
    {
      icon: <BellRing className="w-6 h-6 text-amber-400" />,
      title: "Smart Notifications",
      description: "Get notified instantly about important updates, mentions, and approaching deadlines."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with optimized workflows and keyboard shortcuts."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: "Enterprise Security",
      description: "Bank-level security to keep your data safe, protected, and fully compliant."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechFlow",
      initials: "SJ",
      color: "bg-indigo-500",
      text: "TaskNova transformed how we manage projects. Our productivity increased by 40% in just one month! The real-time collaboration is unmatched."
    },
    {
      name: "Alex Chen",
      role: "Tech Lead at Innovate.io",
      initials: "AC",
      color: "bg-pink-500",
      text: "The best task management tool I've used. Simple, powerful, and exactly what our team needed. The analytics dashboard is a game-changer."
    },
    {
      name: "Maya Patel",
      role: "Product Designer at Creativ",
      initials: "MP",
      color: "bg-emerald-500",
      text: "Excellent collaboration features. Our remote team feels more connected than ever. The UI is gorgeous and incredibly intuitive."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="TaskNova Logo" className="w-8 h-8 rounded-md shadow-lg border border-slate-800" />
          <span className="text-xl font-bold text-white tracking-wide">
            Task<span className="font-light text-indigo-400">Nova</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <a href="#about" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Info className="w-4 h-4" /> About Us
          </a>
          <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Contact
          </Link>
          <Link to="/help" className="hover:text-white transition-colors flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Help
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Manage Your Tasks, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Master Your Projects</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Streamline your team's workflow with intelligent task management and real-time collaboration. Keep everyone aligned, deadlines met, and projects on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 group">
              Get Started Free 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/10">
              View Features
            </a>
          </div>
          
          <p className="text-sm text-slate-500 pt-4">Join teams of developers, designers, and managers building remarkable products.</p>
        </motion.div>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />
          <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl p-2 relative">
            <div className="absolute top-4 left-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="bg-[#0f1115] rounded-lg mt-6 h-[400px] md:h-[600px] w-full border border-white/5 overflow-hidden flex flex-col">
              {/* Mock Dashboard UI */}
              <div className="h-14 border-b border-white/5 flex items-center px-6">
                 <div className="h-4 w-32 bg-white/5 rounded"></div>
                 <div className="ml-auto h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
              </div>
              <div className="flex-1 flex p-6 gap-6">
                <div className="w-64 hidden lg:flex flex-col gap-3">
                  <div className="h-8 w-full bg-white/5 rounded"></div>
                  <div className="h-8 w-3/4 bg-white/5 rounded"></div>
                  <div className="h-8 w-4/5 bg-white/5 rounded"></div>
                  <div className="h-8 w-2/3 bg-white/5 rounded mt-4"></div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="flex-1 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-xl p-5">
                      <div className="h-4 w-24 bg-indigo-500/40 rounded mb-4"></div>
                      <div className="h-8 w-16 bg-white/10 rounded"></div>
                    </div>
                    <div className="flex-1 h-32 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-5">
                      <div className="h-4 w-24 bg-purple-500/40 rounded mb-4"></div>
                      <div className="h-8 w-16 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
                    <div className="h-6 w-48 bg-white/10 rounded mb-2"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage projects like a pro, packed into a beautiful, intuitive interface.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10 border-y border-white/5" />
        <div className="relative px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What is TaskNova?</h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg mb-16">
            TaskNova is a modern, intuitive task management platform designed for teams of all sizes. Whether you're a startup, agency, or enterprise, our platform helps you organize work, collaborate seamlessly, and deliver projects on time. We believe that great teamwork comes from clarity, communication, and the right tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">10K+</h4>
              <p className="text-slate-400 font-medium">Active Users</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">500+</h4>
              <p className="text-slate-400 font-medium">Teams Worldwide</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <h4 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">99.9%</h4>
              <p className="text-slate-400 font-medium">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Teams Say</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Trusted by teams and organizations worldwide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col h-full"
            >
              <p className="text-slate-300 italic mb-8 flex-1">"{t.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{t.name}</h4>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20" />
        <div className="relative px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Team?</h2>
          <p className="text-xl text-slate-400 mb-10">Join hundreds of teams already managing tasks smarter with TaskNova.</p>
          <Link to="/signup" className="inline-flex px-10 py-5 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/20 hover:border-white/40 shadow-2xl hover:-translate-y-1">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
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

export default LandingPage;
