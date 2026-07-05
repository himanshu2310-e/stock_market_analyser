import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrendingUp } from 'react-icons/hi';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <HiOutlineTrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">StockAnalyzer</span>
        </Link>

        {/* Auth form card */}
        <div className="glass-card p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
