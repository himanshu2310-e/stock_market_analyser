const axios = require('axios');
const cache = require('../config/cache');

const API_KEY = () => process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Centralized Alpha Vantage API wrapper with caching.
 * Every public method caches its response in node-cache.
 */
class AlphaVantageService {
  /**
   * Generic fetcher with cache-aside strategy.
   * @param {Object} params - Query parameters (function, symbol, etc.)
   * @param {string} cacheKey - Unique cache key
   * @param {number} ttl - Cache TTL in seconds
   */
  static async fetchData(params, cacheKey, ttl = 300) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(BASE_URL, {
      params: { ...params, apikey: API_KEY() },
      timeout: 15000,
    });

    /* Alpha Vantage returns a "Note" or "Information" field on rate-limit */
    if (response.data['Note'] || response.data['Information']) {
      const err = new Error(
        response.data['Note'] ||
          response.data['Information'] ||
          'Alpha Vantage API rate limit reached'
      );
      err.statusCode = 429;
      throw err;
    }

    if (response.data['Error Message']) {
      const err = new Error(response.data['Error Message']);
      err.statusCode = 400;
      throw err;
    }

    cache.set(cacheKey, response.data, ttl);
    return response.data;
  }

  /* ---------- Symbol Search ---------- */
  static async searchSymbol(keywords) {
    return this.fetchData(
      { function: 'SYMBOL_SEARCH', keywords },
      `search_${keywords.toLowerCase()}`,
      3600
    );
  }

  /* ---------- Quote ---------- */
  static async getQuote(symbol) {
    return this.fetchData(
      { function: 'GLOBAL_QUOTE', symbol },
      `quote_${symbol.toUpperCase()}`,
      300
    );
  }

  /* ---------- Company Overview ---------- */
  static async getOverview(symbol) {
    return this.fetchData(
      { function: 'OVERVIEW', symbol },
      `overview_${symbol.toUpperCase()}`,
      3600
    );
  }

  /* ---------- Time Series ---------- */
  static async getDaily(symbol, outputsize = 'compact') {
    return this.fetchData(
      { function: 'TIME_SERIES_DAILY', symbol, outputsize },
      `daily_${symbol.toUpperCase()}_${outputsize}`,
      300
    );
  }

  static async getWeekly(symbol) {
    return this.fetchData(
      { function: 'TIME_SERIES_WEEKLY', symbol },
      `weekly_${symbol.toUpperCase()}`,
      3600
    );
  }

  static async getMonthly(symbol) {
    return this.fetchData(
      { function: 'TIME_SERIES_MONTHLY', symbol },
      `monthly_${symbol.toUpperCase()}`,
      3600
    );
  }

  static async getIntraday(symbol, interval = '5min') {
    return this.fetchData(
      { function: 'TIME_SERIES_INTRADAY', symbol, interval },
      `intraday_${symbol.toUpperCase()}_${interval}`,
      300
    );
  }

  /* ---------- News Sentiment ---------- */
  static async getNewsSentiment(tickers = '', topics = '') {
    const params = { function: 'NEWS_SENTIMENT' };
    if (tickers) params.tickers = tickers;
    if (topics) params.topics = topics;
    return this.fetchData(
      params,
      `news_${tickers}_${topics}`,
      900
    );
  }

  /* ---------- Market Movers ---------- */
  static async getTopGainersLosers() {
    return this.fetchData(
      { function: 'TOP_GAINERS_LOSERS' },
      'top_gainers_losers',
      300
    );
  }

  /* ---------- Market Status ---------- */
  static async getMarketStatus() {
    return this.fetchData(
      { function: 'MARKET_STATUS' },
      'market_status',
      300
    );
  }
}

module.exports = AlphaVantageService;
