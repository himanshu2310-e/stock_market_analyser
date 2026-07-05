import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlinePlay,
} from 'react-icons/hi';
import { useState } from 'react';
import { POPULAR_STOCKS } from '../utils/constants';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

/* ============================== HERO ============================== */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm text-primary-400 font-medium">
              Real-time Market Data
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Analyze Stocks{' '}
            <span className="text-gradient">Like a Pro</span>
          </h1>

          <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Advanced charts, technical indicators, portfolio tracking, and
            real-time market data — all in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
            >
              <HiOutlinePlay className="w-5 h-5" />
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
            >
              Sign In
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Floating stock ticker */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {POPULAR_STOCKS.slice(0, 6).map((stock, i) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-card px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => navigate('/signup')}
            >
              <span className="text-sm font-bold text-white">
                {stock.symbol}
              </span>
              <span className="text-xs text-success-400">
                +{(Math.random() * 5).toFixed(2)}%
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-16"
        >
          <HiOutlineChevronDown className="w-6 h-6 text-dark-500 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== FEATURES ============================== */
function FeaturesSection() {
  const features = [
    {
      icon: HiOutlineChartBar,
      title: 'Interactive Charts',
      desc: 'Advanced charting with line, area, and candlestick views. Zoom, pan, and analyze with ease.',
      color: 'from-primary-500 to-blue-600',
    },
    {
      icon: HiOutlineTrendingUp,
      title: 'Technical Indicators',
      desc: 'SMA, EMA, RSI, MACD, Bollinger Bands — all the tools professional traders use.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Portfolio Tracking',
      desc: 'Track your investments, view P/L, and analyze allocation with beautiful charts.',
      color: 'from-success-500 to-emerald-400',
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Real-time Data',
      desc: 'Live stock quotes, market movers, and breaking financial news at your fingertips.',
      color: 'from-warning-500 to-orange-400',
    },
    {
      icon: HiOutlineGlobe,
      title: 'Market Overview',
      desc: 'Top gainers, losers, most active stocks, and sector performance at a glance.',
      color: 'from-cyan-500 to-teal-400',
    },
    {
      icon: HiOutlineClock,
      title: 'Watchlist',
      desc: 'Save and monitor your favorite stocks. Pin important ones to the top.',
      color: 'from-rose-500 to-pink-400',
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="badge-primary mb-4">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Powerful tools for smart investing, all in one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-hover p-8 group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== HOW IT WORKS ============================== */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Create Account',
      desc: 'Sign up in seconds with your email. No credit card required.',
      icon: HiOutlineStar,
    },
    {
      num: '02',
      title: 'Search Stocks',
      desc: 'Search any stock by symbol or company name. Get instant results.',
      icon: HiOutlineSearch,
    },
    {
      num: '03',
      title: 'Analyze & Invest',
      desc: 'Use charts, indicators, and news to make informed decisions.',
      icon: HiOutlineChartBar,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-dark-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="badge-primary mb-4">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Start in 3 Simple Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass-card flex items-center justify-center relative">
                <step.icon className="w-8 h-8 text-primary-400" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-dark-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== MARKET HIGHLIGHTS ============================== */
function MarketSection() {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '195.80', change: '+1.42%' },
    { symbol: 'MSFT', name: 'Microsoft', price: '430.20', change: '+0.89%' },
    { symbol: 'GOOGL', name: 'Alphabet', price: '176.40', change: '+1.03%' },
    { symbol: 'TSLA', name: 'Tesla', price: '265.30', change: '+2.47%' },
    { symbol: 'NVDA', name: 'NVIDIA', price: '142.50', change: '+6.20%' },
    { symbol: 'AMZN', name: 'Amazon', price: '198.50', change: '+1.59%' },
  ];

  return (
    <section id="market" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="badge-primary mb-4">Market</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Trending Stocks
          </h2>
          <p className="text-dark-400 text-lg">
            Track the most popular stocks on the market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock, i) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card-hover p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-400">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {stock.symbol}
                  </p>
                  <p className="text-xs text-dark-400">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  ${stock.price}
                </p>
                <p className="text-xs text-positive font-medium">
                  {stock.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== FAQ ============================== */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Is Stock Analyzer free to use?',
      a: 'Yes! You can sign up for free and access all core features including stock search, charts, watchlist, and portfolio tracking.',
    },
    {
      q: 'Where does the data come from?',
      a: 'We use the Alpha Vantage API for real-time and historical stock data, ensuring accurate and reliable market information.',
    },
    {
      q: 'Can I track my real investments?',
      a: 'Absolutely! Add your investments to the portfolio tracker with purchase price and date. We calculate your P/L automatically.',
    },
    {
      q: 'What technical indicators are available?',
      a: 'We support SMA, EMA, RSI, MACD, Bollinger Bands, volume analysis, and Golden/Death Cross detection.',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. We use JWT authentication, bcrypt password hashing, Helmet security headers, and rate limiting to protect your data.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-dark-900/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="badge-primary mb-4">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-semibold text-white">
                  {faq.q}
                </span>
                <HiOutlineChevronDown
                  className={`w-5 h-5 text-dark-400 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-dark-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== TESTIMONIALS ============================== */
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Day Trader',
      text: 'The best stock analysis tool I have used. The charts and indicators are incredibly intuitive.',
      avatar: 'AC',
    },
    {
      name: 'Sarah Johnson',
      role: 'Portfolio Manager',
      text: 'Finally a platform that combines beautiful design with powerful analytics. Highly recommended!',
      avatar: 'SJ',
    },
    {
      name: 'Michael Park',
      role: 'Retail Investor',
      text: 'The portfolio tracker saves me hours every week. Love the P/L calculations and allocation charts.',
      avatar: 'MP',
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="badge-primary mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Loved by Traders
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-dark-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-dark-300 leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== CTA ============================== */
function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-dark-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Analyzing?
          </h2>
          <p className="text-lg text-dark-400 mb-8 max-w-2xl mx-auto">
            Join thousands of traders using Stock Analyzer to make smarter
            investment decisions.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary text-lg px-10 py-4"
          >
            Create Free Account
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== LANDING PAGE ============================== */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MarketSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
