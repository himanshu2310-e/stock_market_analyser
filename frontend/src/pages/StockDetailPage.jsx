import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiOutlineStar,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from 'react-icons/hi';
import stockService from '../services/stockService';
import useWatchlist from '../hooks/useWatchlist';
import StockChart from '../components/charts/StockChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatCurrency, formatLargeNumber, formatPercentage, getChangeColor, getChangeBgColor } from '../utils/formatters';
import { CHART_RANGES, INDICATOR_OPTIONS } from '../utils/constants';

export default function StockDetailPage() {
  const { symbol } = useParams();
  const [chartRange, setChartRange] = useState('3m');
  const [activeIndicators, setActiveIndicators] = useState([]);
  const { addToWatchlist, watchlist } = useWatchlist();
  const isInWatchlist = watchlist.some((w) => w.symbol === symbol?.toUpperCase());

  /* Fetch stock data */
  const { data: stockData, isLoading, isError, refetch } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const { data } = await stockService.getStock(symbol);
      return data.data;
    },
    enabled: !!symbol,
  });

  /* Fetch historical data */
  const { data: historicalData, isLoading: histLoading } = useQuery({
    queryKey: ['historical', symbol, chartRange],
    queryFn: async () => {
      const { data } = await stockService.getHistorical(symbol, chartRange);
      return data.data;
    },
    enabled: !!symbol,
  });

  /* Fetch indicators */
  const { data: indicatorData } = useQuery({
    queryKey: ['indicators', symbol],
    queryFn: async () => {
      const { data } = await stockService.getIndicators(symbol);
      return data.data;
    },
    enabled: !!symbol && activeIndicators.length > 0,
  });

  const toggleIndicator = (key) => {
    setActiveIndicators((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  /* Build indicator overlay datasets */
  const indicatorDatasets = activeIndicators
    .map((key) => {
      const cfg = INDICATOR_OPTIONS.find((o) => o.key === key);
      if (!cfg || !indicatorData?.indicators) return null;

      if (key === 'bollinger') {
        return [
          { key: 'bbUpper', label: 'BB Upper', data: indicatorData.indicators.map((d) => d.bollingerUpper), color: cfg.color, dashed: true },
          { key: 'bbLower', label: 'BB Lower', data: indicatorData.indicators.map((d) => d.bollingerLower), color: cfg.color, dashed: true },
        ];
      }

      return {
        key,
        label: cfg.label,
        data: indicatorData.indicators.map((d) => d[key]),
        color: cfg.color,
      };
    })
    .flat()
    .filter(Boolean);

  if (isLoading) return <LoadingSkeleton type="card" count={3} />;

  if (isError) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-danger-400 text-lg mb-4">Failed to load stock data</p>
        <button onClick={refetch} className="btn-primary inline-flex items-center gap-2">
          <HiOutlineRefresh className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const { quote, overview } = stockData || {};
  const isPositive = parseFloat(quote?.change) >= 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{symbol?.toUpperCase()}</h1>
              <span className="badge-primary">{overview?.exchange || 'NYSE'}</span>
            </div>
            <p className="text-dark-400">{overview?.name || symbol}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isInWatchlist) {
                  addToWatchlist({ symbol: symbol.toUpperCase(), companyName: overview?.name || symbol });
                }
              }}
              className={`btn-secondary text-sm py-2 flex items-center gap-2 ${isInWatchlist ? 'text-warning-400 border-warning-500/30' : ''}`}
            >
              <HiOutlineStar className="w-4 h-4" />
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Price section */}
        <div className="mt-6 flex items-end gap-4 flex-wrap">
          <span className="text-4xl font-bold text-white">{formatCurrency(quote?.price)}</span>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${getChangeBgColor(quote?.change)}`}>
            {isPositive ? <HiOutlineArrowUp className="w-4 h-4" /> : <HiOutlineArrowDown className="w-4 h-4" />}
            <span className={`text-sm font-semibold ${getChangeColor(quote?.change)}`}>
              {formatCurrency(Math.abs(quote?.change || 0))} ({formatPercentage(quote?.changePercent)})
            </span>
          </div>
          <span className="text-xs text-dark-500">Last updated: {quote?.latestTradingDay}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-white">Price Chart</h2>
          <div className="flex flex-wrap gap-1">
            {CHART_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setChartRange(r.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartRange === r.value
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {histLoading ? (
          <div className="h-96 skeleton rounded-xl" />
        ) : (
          <StockChart data={historicalData || []} indicators={indicatorDatasets} height={400} />
        )}

        {/* Indicator toggles */}
        <div className="mt-4 flex flex-wrap gap-2">
          {INDICATOR_OPTIONS.map((ind) => (
            <button
              key={ind.key}
              onClick={() => toggleIndicator(ind.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeIndicators.includes(ind.key)
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-dark-700 text-dark-400 hover:border-dark-500'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open', value: formatCurrency(quote?.open) },
          { label: 'High', value: formatCurrency(quote?.high) },
          { label: 'Low', value: formatCurrency(quote?.low) },
          { label: 'Prev Close', value: formatCurrency(quote?.previousClose) },
          { label: 'Volume', value: formatLargeNumber(quote?.volume) },
          { label: 'Market Cap', value: formatLargeNumber(overview?.marketCap) },
          { label: '52W High', value: formatCurrency(overview?.week52High) },
          { label: '52W Low', value: formatCurrency(overview?.week52Low) },
          { label: 'P/E Ratio', value: overview?.peRatio || 'N/A' },
          { label: 'EPS', value: overview?.eps || 'N/A' },
          { label: 'Dividend Yield', value: overview?.dividendYield ? (parseFloat(overview.dividendYield) * 100).toFixed(2) + '%' : 'N/A' },
          { label: 'Beta', value: overview?.beta || 'N/A' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-xs text-dark-400 mb-1">{stat.label}</p>
            <p className="text-sm font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Company info */}
      {overview?.description && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3">About {overview?.name}</h2>
          <p className="text-sm text-dark-300 leading-relaxed mb-4">{overview.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sector', value: overview.sector },
              { label: 'Industry', value: overview.industry },
              { label: 'Country', value: overview.country },
              { label: 'Currency', value: overview.currency },
            ]
              .filter((i) => i.value)
              .map((info) => (
                <div key={info.label}>
                  <p className="text-xs text-dark-500">{info.label}</p>
                  <p className="text-sm text-dark-200">{info.value}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Analyst Ratings */}
      {overview?.analystTargetPrice && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Analyst Consensus</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-dark-500">Target Price</p>
              <p className="text-lg font-bold text-primary-400">{formatCurrency(overview.analystTargetPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-dark-500">Strong Buy</p>
              <p className="text-lg font-bold text-success-400">{overview.analystRatingBuy || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-dark-500">Hold</p>
              <p className="text-lg font-bold text-warning-400">{overview.analystRatingHold || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-dark-500">Sell</p>
              <p className="text-lg font-bold text-danger-400">{overview.analystRatingSell || '0'}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
