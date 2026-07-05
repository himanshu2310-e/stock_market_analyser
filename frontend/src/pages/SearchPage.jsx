import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineStar, HiOutlineRefresh } from 'react-icons/hi';
import useStockSearch from '../hooks/useStockSearch';
import useWatchlist from '../hooks/useWatchlist';
import { POPULAR_STOCKS } from '../utils/constants';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, isLoading, isError, refetch } = useStockSearch(query);
  const { addToWatchlist, watchlist } = useWatchlist();
  const navigate = useNavigate();

  const isInWatchlist = (symbol) => watchlist.some((w) => w.symbol === symbol);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Stock Search</h1>
        <p className="text-dark-400 text-sm">Search by stock symbol or company name</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          type="text"
          placeholder="Search AAPL, Tesla, Microsoft, NVDA..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-dark-700 rounded-2xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-lg transition-all"
          autoFocus
        />
      </div>

      {/* Popular stocks */}
      {query.length === 0 && (
        <div>
          <h3 className="text-sm font-semibold text-dark-300 mb-3">Popular Stocks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {POPULAR_STOCKS.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="glass-card-hover p-4 text-center group"
              >
                <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">
                  {stock.symbol}
                </p>
                <p className="text-xs text-dark-500 truncate">{stock.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="table" count={5} />}

      {/* Error */}
      {isError && (
        <div className="glass-card p-8 text-center">
          <p className="text-danger-400 mb-4">Failed to fetch results</p>
          <button onClick={refetch} className="btn-secondary text-sm inline-flex items-center gap-2">
            <HiOutlineRefresh className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {!isLoading && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <h3 className="text-sm font-semibold text-dark-300">
              {results.length} result{results.length > 1 ? 's' : ''} found
            </h3>
            {results.map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-4 flex items-center justify-between"
              >
                <button
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  className="flex-1 text-left flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-400">
                      {stock.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{stock.symbol}</p>
                    <p className="text-xs text-dark-400 truncate">{stock.name}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 ml-auto">
                    <span className="text-xs text-dark-500">{stock.type}</span>
                    <span className="text-xs text-dark-500">{stock.region}</span>
                    <span className="text-xs text-dark-500">{stock.currency}</span>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isInWatchlist(stock.symbol)) {
                      addToWatchlist({ symbol: stock.symbol, companyName: stock.name });
                    }
                  }}
                  className={`ml-3 p-2 rounded-lg transition-colors ${
                    isInWatchlist(stock.symbol)
                      ? 'text-warning-400 bg-warning-500/10'
                      : 'text-dark-500 hover:text-warning-400 hover:bg-warning-500/10'
                  }`}
                  title={isInWatchlist(stock.symbol) ? 'In watchlist' : 'Add to watchlist'}
                >
                  <HiOutlineStar className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      {!isLoading && !isError && query.length >= 1 && results.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-dark-400 mb-2">No stocks found for &ldquo;{query}&rdquo;</p>
          <p className="text-dark-500 text-sm">Try a different symbol or company name</p>
        </div>
      )}
    </motion.div>
  );
}
