import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineStar, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import useWatchlist from '../hooks/useWatchlist';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function WatchlistPage() {
  const { watchlist, isLoading, togglePin, removeFromWatchlist } = useWatchlist();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  let filtered = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'name') filtered.sort((a, b) => a.symbol.localeCompare(b.symbol));
  if (sortBy === 'date') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  /* Pinned always first */
  filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (isLoading) return <LoadingSkeleton type="card" count={5} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Watchlist</h1>
          <p className="text-dark-400 text-sm">{watchlist.length} stocks tracked</p>
        </div>
        <Link to="/search" className="btn-primary text-sm py-2 flex items-center gap-2">
          <HiOutlineStar className="w-4 h-4" />
          Add Stocks
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Filter watchlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field py-2.5 text-sm w-full sm:w-40"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineStar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-2">No stocks in your watchlist</p>
          <p className="text-dark-500 text-sm mb-4">Search and add stocks to track them here.</p>
          <Link to="/search" className="btn-primary text-sm inline-block">Search Stocks</Link>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card-hover p-4 flex items-center justify-between"
              >
                <Link to={`/stock/${item.symbol}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-400">{item.symbol.slice(0, 2)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{item.symbol}</p>
                      {item.pinned && <span className="text-xs">📌</span>}
                    </div>
                    <p className="text-xs text-dark-400 truncate">{item.companyName}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => togglePin(item._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.pinned ? 'text-warning-400 bg-warning-500/10' : 'text-dark-500 hover:text-warning-400'
                    }`}
                    title={item.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item._id)}
                    className="p-2 text-dark-500 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
