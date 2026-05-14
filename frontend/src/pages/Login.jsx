import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e, demoEmail, demoPass) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(demoEmail || email, demoPass || password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <img src="/logo.png" alt="TaskNova Logo" className="w-10 h-10 rounded-xl shadow-md border border-slate-200 dark:border-slate-800" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-wide">Task<span className="font-light text-primary-600 dark:text-primary-400">Nova</span></span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Log in to your TaskNova workspace.</p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-800/50 text-sm">
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link to="/forgotpassword" className="text-primary-600 hover:text-primary-500 font-medium">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-4 text-center">Or try a demo account</p>
            <div className="grid grid-cols-2 gap-4">
               <Button variant="outline" onClick={() => handleSubmit(null, 'admin@demo.com', '123456')}>
                 Admin Demo
               </Button>
               <Button variant="outline" onClick={() => handleSubmit(null, 'member@demo.com', '123456')}>
                 Member Demo
               </Button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Illustration/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-[#09090b] relative overflow-hidden items-center justify-center border-l border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#09090b] to-pink-900/20 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        {/* Floating Abstract Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl absolute top-1/4 left-1/4"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="w-80 h-80 bg-pink-500/10 rounded-full blur-3xl absolute bottom-1/4 right-1/4"
        />

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
           <img src="/logo.png" alt="TaskNova Logo" className="w-32 h-32 mx-auto mb-8 rounded-3xl shadow-2xl border border-white/10" />
           <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">Ignite your productivity</h2>
           <p className="text-slate-300 text-lg leading-relaxed">Experience TaskNova. A premium platform designed for high-performing teams to track progress with cosmic elegance.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
