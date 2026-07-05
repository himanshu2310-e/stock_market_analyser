import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineLightningBolt, HiOutlineNewspaper, HiOutlineSearch } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import useMarketData from '../hooks/useMarketData';
import useWatchlist from '../hooks/useWatchlist';
import usePortfolio from '../hooks/usePortfolio';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <motion.div variants={itemVariant} className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-dark-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

function MoversList({ title, items, type }) {
  const navigate = useNavigate();
  return (
    <motion.div variants={itemVariant} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          {type === 'gainer' ? (
            <HiOutlineTrendingUp className="w-4 h-4 text-success-400" />
          ) : (
            <HiOutlineTrendingDown className="w-4 h-4 text-danger-400" />
          )}
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {items.slice(0, 5).map((stock) => (
          <button
            key={stock.ticker}
            onClick={() => navigate(`/stock/${stock.ticker}`)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-semibold text-white">{stock.ticker}</p>
              <p className="text-xs text-dark-400">${stock.price}</p>
            </div>
            <span className={`text-xs font-semibold ${getChangeColor(stock.changePercentage)}`}>
              {formatPercentage(stock.changePercentage)}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { marketData, isLoading: marketLoading } = useMarketData();
  const { watchlist } = useWatchlist();
  const { portfolio } = usePortfolio();
  const navigate = useNavigate();

  const totalInvested = portfolio.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);

  if (marketLoading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <motion.div variants={containerVariant} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={itemVariant} className="glass-card p-6 bg-gradient-to-r from-primary-500/10 via-purple-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Trader'}! 👋
            </h1>
            <p className="text-dark-400 text-sm">Here&apos;s your market summary for today.</p>
          </div>
          <button onClick={() => navigate('/search')} className="btn-primary text-sm py-2 flex items-center gap-2">
            <HiOutlineSearch className="w-4 h-4" />
            Search Stocks
          </button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Watchlist" value={watchlist.length} subtitle="Stocks tracked" icon={HiOutlineTrendingUp} gradient="from-primary-500 to-blue-600" />
        <StatCard title="Portfolio" value={portfolio.length} subtitle="Active investments" icon={HiOutlineLightningBolt} gradient="from-purple-500 to-pink-500" />
        <StatCard title="Total Invested" value={formatCurrency(totalInvested)} subtitle="Across all stocks" icon={HiOutlineTrendingUp} gradient="from-success-500 to-emerald-400" />
        <StatCard title="Top Gainers" value={marketData.gainers?.length || 0} subtitle="Today's movers" icon={HiOutlineNewspaper} gradient="from-warning-500 to-orange-400" />
      </div>

      {/* Market movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoversList title="Top Gainers" items={marketData.gainers || []} type="gainer" />
        <MoversList title="Top Losers" items={marketData.losers || []} type="loser" />
      </div>

      {/* Most active + Watchlist preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoversList title="Most Active" items={marketData.active || []} type="gainer" />

        <motion.div variants={itemVariant} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Your Watchlist</h3>
            <Link to="/watchlist" className="text-xs text-primary-400 hover:text-primary-300">View all</Link>
          </div>
          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-dark-500 text-sm mb-3">No stocks in watchlist</p>
              <button onClick={() => navigate('/search')} className="btn-secondary text-sm py-2">
                Add Stocks
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {watchlist.slice(0, 5).map((item) => (
                <Link key={item._id} to={`/stock/${item.symbol}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.symbol}</p>
                    <p className="text-xs text-dark-400 truncate max-w-[150px]">{item.companyName}</p>
                  </div>
                  {item.pinned && <span className="text-xs text-warning-400">📌</span>}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div variants={itemVariant} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Search Stocks', path: '/search', icon: '🔍' },
          { label: 'My Portfolio', path: '/portfolio', icon: '💼' },
          { label: 'Market News', path: '/news', icon: '📰' },
          { label: 'My Profile', path: '/profile', icon: '👤' },
        ].map((link) => (
          <Link key={link.label} to={link.path} className="glass-card-hover p-4 text-center group">
            <div className="text-2xl mb-2">{link.icon}</div>
            <p className="text-sm text-dark-300 group-hover:text-white transition-colors">{link.label}</p>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
