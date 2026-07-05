import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useStockSearch from '../../hooks/useStockSearch';
import ThemeToggle from './ThemeToggle';

export default function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { results, isLoading } = useStockSearch(searchQuery);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleStockClick = (symbol) => {
    navigate(`/stock/${symbol}`);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <HiOutlineMenu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search stocks (AAPL, TSLA, MSFT...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Search dropdown */}
            <AnimatePresence>
              {showSearch && searchQuery.length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card max-h-80 overflow-auto shadow-2xl"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-dark-400 text-sm">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    results.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => handleStockClick(stock.symbol)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {stock.symbol}
                          </p>
                          <p className="text-xs text-dark-400 truncate max-w-[200px]">
                            {stock.name}
                          </p>
                        </div>
                        <span className="text-xs text-dark-500">
                          {stock.region}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-dark-400 text-sm">
                      No results found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-white/5 relative">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-dark-200">
                {user?.name || 'User'}
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-card shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-dark-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <HiOutlineUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-400 hover:bg-danger-500/10 rounded-lg transition-colors"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
