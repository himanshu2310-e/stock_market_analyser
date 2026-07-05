import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineExternalLink, HiOutlineRefresh } from 'react-icons/hi';
import newsService from '../services/newsService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatRelativeTime } from '../utils/formatters';

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: articles, isLoading, isError, refetch } = useQuery({
    queryKey: ['news', category],
    queryFn: async () => {
      const params = {};
      if (category) params.topics = category;
      const { data } = await newsService.getNews(params);
      return data.data;
    },
  });

  const categories = ['', 'technology', 'finance', 'earnings', 'ipo', 'mergers_and_acquisitions', 'economy_macro'];

  const filtered = (articles || []).filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Market News</h1>
        <p className="text-dark-400 text-sm">Latest financial news and sentiment analysis</p>
      </div>

      {/* Search + Category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2.5 text-sm" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field py-2.5 text-sm w-full sm:w-48">
          <option value="">All Topics</option>
          {categories.slice(1).map((cat) => (
            <option key={cat} value={cat}>{cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingSkeleton type="card" count={5} />}

      {isError && (
        <div className="glass-card p-8 text-center">
          <p className="text-danger-400 mb-4">Failed to load news</p>
          <button onClick={refetch} className="btn-secondary text-sm inline-flex items-center gap-2">
            <HiOutlineRefresh className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-dark-400">No news articles found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article, i) => (
          <motion.a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover overflow-hidden group"
          >
            {article.bannerImage && (
              <div className="h-40 overflow-hidden">
                <img src={article.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {article.overallSentiment && (
                  <span className={`badge text-xs ${
                    article.overallSentiment.includes('Bullish') ? 'badge-success' :
                    article.overallSentiment.includes('Bearish') ? 'badge-danger' : 'badge-primary'
                  }`}>
                    {article.overallSentiment}
                  </span>
                )}
                <span className="text-xs text-dark-500">{article.source}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-dark-400 line-clamp-3 mb-3">{article.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-500">{formatRelativeTime(article.publishedAt)}</span>
                <HiOutlineExternalLink className="w-4 h-4 text-dark-500 group-hover:text-primary-400" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
