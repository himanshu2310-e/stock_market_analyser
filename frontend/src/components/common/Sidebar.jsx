import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineViewGrid,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
  HiOutlineUser,
  HiOutlineTrendingUp,
  HiOutlineX,
} from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/search', label: 'Search', icon: HiOutlineSearch },
  { to: '/watchlist', label: 'Watchlist', icon: HiOutlineStar },
  { to: '/portfolio', label: 'Portfolio', icon: HiOutlineBriefcase },
  { to: '/news', label: 'News', icon: HiOutlineNewspaper },
  { to: '/profile', label: 'Profile', icon: HiOutlineUser },
];

export default function Sidebar({ isOpen, onClose }) {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-500/10 text-primary-400 shadow-lg shadow-primary-500/5'
        : 'text-dark-400 hover:bg-white/5 hover:text-white'
    }`;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <HiOutlineTrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">StockAnalyzer</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-dark-400 hover:text-white"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClasses}
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-dark-400 mb-2">Stock Market Analyzer</p>
          <p className="text-xs text-dark-500">v1.0.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-dark-900/50 border-r border-white/5 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-white/5 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
