const AlphaVantageService = require('../utils/alphaVantage');

/* ---- Curated demo data as fallback when API is rate-limited ---- */
const DEMO_GAINERS = [
  { ticker: 'NVDA', price: '142.50', change_amount: '8.32', change_percentage: '6.20%', volume: '312450000' },
  { ticker: 'META', price: '595.20', change_amount: '15.80', change_percentage: '2.72%', volume: '18200000' },
  { ticker: 'TSLA', price: '265.30', change_amount: '6.40', change_percentage: '2.47%', volume: '95400000' },
  { ticker: 'AMD', price: '178.90', change_amount: '3.20', change_percentage: '1.82%', volume: '45600000' },
  { ticker: 'AMZN', price: '198.50', change_amount: '3.10', change_percentage: '1.59%', volume: '32100000' },
];

const DEMO_LOSERS = [
  { ticker: 'JNJ', price: '152.30', change_amount: '-3.40', change_percentage: '-2.18%', volume: '8900000' },
  { ticker: 'PFE', price: '26.80', change_amount: '-0.52', change_percentage: '-1.90%', volume: '24500000' },
  { ticker: 'KO', price: '61.20', change_amount: '-0.85', change_percentage: '-1.37%', volume: '12300000' },
  { ticker: 'VZ', price: '41.50', change_amount: '-0.48', change_percentage: '-1.14%', volume: '15800000' },
  { ticker: 'T', price: '17.90', change_amount: '-0.18', change_percentage: '-1.00%', volume: '28700000' },
];

const DEMO_ACTIVE = [
  { ticker: 'AAPL', price: '195.80', change_amount: '1.20', change_percentage: '0.62%', volume: '52300000' },
  { ticker: 'NVDA', price: '142.50', change_amount: '8.32', change_percentage: '6.20%', volume: '312450000' },
  { ticker: 'TSLA', price: '265.30', change_amount: '6.40', change_percentage: '2.47%', volume: '95400000' },
  { ticker: 'MSFT', price: '430.20', change_amount: '2.10', change_percentage: '0.49%', volume: '22100000' },
  { ticker: 'GOOGL', price: '176.40', change_amount: '1.80', change_percentage: '1.03%', volume: '19800000' },
];

/**
 * Helper — normalise the Alpha Vantage response into a clean array.
 */
const normalizeMovers = (list = []) =>
  list.map((item) => ({
    ticker: item.ticker,
    price: item.price,
    changeAmount: item.change_amount,
    changePercentage: item.change_percentage,
    volume: item.volume,
  }));

/**
 * @route   GET /api/market/overview
 * @desc    Market status summary
 */
const getMarketOverview = async (req, res, next) => {
  try {
    let data;
    try {
      data = await AlphaVantageService.getTopGainersLosers();
    } catch {
      data = null;
    }

    const gainers = data?.top_gainers
      ? normalizeMovers(data.top_gainers.slice(0, 10))
      : normalizeMovers(DEMO_GAINERS);

    const losers = data?.top_losers
      ? normalizeMovers(data.top_losers.slice(0, 10))
      : normalizeMovers(DEMO_LOSERS);

    const active = data?.most_actively_traded
      ? normalizeMovers(data.most_actively_traded.slice(0, 10))
      : normalizeMovers(DEMO_ACTIVE);

    res.status(200).json({
      success: true,
      data: {
        lastUpdated: data?.metadata || new Date().toISOString(),
        gainers,
        losers,
        active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/market/gainers
 */
const getGainers = async (req, res, next) => {
  try {
    let data;
    try {
      data = await AlphaVantageService.getTopGainersLosers();
    } catch {
      data = null;
    }
    const gainers = data?.top_gainers
      ? normalizeMovers(data.top_gainers.slice(0, 20))
      : normalizeMovers(DEMO_GAINERS);
    res.status(200).json({ success: true, data: gainers });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/market/losers
 */
const getLosers = async (req, res, next) => {
  try {
    let data;
    try {
      data = await AlphaVantageService.getTopGainersLosers();
    } catch {
      data = null;
    }
    const losers = data?.top_losers
      ? normalizeMovers(data.top_losers.slice(0, 20))
      : normalizeMovers(DEMO_LOSERS);
    res.status(200).json({ success: true, data: losers });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/market/active
 */
const getActive = async (req, res, next) => {
  try {
    let data;
    try {
      data = await AlphaVantageService.getTopGainersLosers();
    } catch {
      data = null;
    }
    const active = data?.most_actively_traded
      ? normalizeMovers(data.most_actively_traded.slice(0, 20))
      : normalizeMovers(DEMO_ACTIVE);
    res.status(200).json({ success: true, data: active });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarketOverview, getGainers, getLosers, getActive };
