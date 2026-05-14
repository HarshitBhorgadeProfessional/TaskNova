import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signup(name, email, password, role);
      setSuccessMsg(res.message || 'OTP sent successfully!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Side: Illustration/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-[#09090b] relative overflow-hidden items-center justify-center order-2 lg:order-1 border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 via-[#09090b] to-indigo-900/30 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        {/* Floating Abstract Elements */}
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl absolute top-1/4 right-1/4"
        />
        <motion.div 
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }} 
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.5 }}
          className="w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl absolute bottom-1/4 left-1/4"
        />

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
           <img src="/logo.png" alt="TaskNova Logo" className="w-32 h-32 mx-auto mb-8 rounded-3xl shadow-2xl border border-white/10" />
           <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">Join TaskNova today</h2>
           <p className="text-slate-300 text-lg leading-relaxed">Create projects, assign tasks, and achieve your goals with our premium suite of tools.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10 order-1 lg:order-2">
        <div className="w-full max-w-md overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
                    <img src="/logo.png" alt="TaskNova Logo" className="w-10 h-10 rounded-xl shadow-md border border-slate-200 dark:border-slate-800" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-wide">Task<span className="font-light text-primary-600 dark:text-primary-400">Nova</span></span>
                  </div>
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an account</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Start managing your tasks effectively with TaskNova.</p>
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-800/50 text-sm">
                    {error}
                  </motion.div>
                )}
                
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <Input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
                    <Input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <Input 
                      type="password" 
                      required
                      minLength="6"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-[#111113] dark:text-slate-100"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>
                    Continue
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                  Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center lg:text-left">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-6 text-sm flex items-center">
                    &larr; Back
                  </button>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Check your email</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 text-md">
                    We've sent a 6-digit verification code to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
                  </p>
                </div>
                
                {successMsg && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg mb-6 border border-emerald-100 dark:border-emerald-800/50 text-sm">
                    {successMsg}
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-800/50 text-sm">
                    {error}
                  </motion.div>
                )}
                
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Verification Code</label>
                    <Input 
                      type="text" 
                      required
                      maxLength="6"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                    Verify and Create Account
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
