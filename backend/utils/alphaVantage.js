const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const cache = require('../config/cache');

const API_KEY = () => process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';
const STOCKS_FILE = path.join(__dirname, '..', 'data', 'stocks.json');

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

    const apiKey = API_KEY();
    const isDemoKey = !apiKey || apiKey === 'demo';
    let errorToThrow = null;

    if (!isDemoKey) {
      try {
        const response = await axios.get(BASE_URL, {
          params: { ...params, apikey: apiKey },
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
      } catch (err) {
        console.error(`❌ API request failed for ${params.function}:`, err.message);
        errorToThrow = err;
      }
    } else {
      errorToThrow = new Error('API key is missing or set to demo');
      errorToThrow.statusCode = 401;
    }

    // --- FALLBACK TO LOCAL MOCK DB (stocks.json) ---
    try {
      const data = await fs.readFile(STOCKS_FILE, 'utf-8');
      const mockDb = JSON.parse(data);

      const symbol = (params.symbol || '').toUpperCase();
      const fn = params.function;

      if (fn === 'NEWS_SENTIMENT') {
        if (mockDb.NEWS_SENTIMENT) {
          console.log(`ℹ️ Serving mock NEWS_SENTIMENT from stocks.json`);
          cache.set(cacheKey, mockDb.NEWS_SENTIMENT, ttl);
          return mockDb.NEWS_SENTIMENT;
        }
      }

      if (fn === 'TOP_GAINERS_LOSERS') {
        const movers = {
          metadata: new Date().toISOString(),
          top_gainers: [
            { ticker: 'NVDA', price: '142.50', change_amount: '8.32', change_percentage: '6.20%', volume: '312450000' },
            { ticker: 'META', price: '595.20', change_amount: '15.80', change_percentage: '2.72%', volume: '18200000' },
            { ticker: 'TSLA', price: '265.30', change_amount: '6.40', change_percentage: '2.47%', volume: '95400000' }
          ],
          top_losers: [
            { ticker: 'JNJ', price: '152.30', change_amount: '-3.40', change_percentage: '-2.18%', volume: '8900000' },
            { ticker: 'PFE', price: '26.80', change_amount: '-0.52', change_percentage: '-1.90%', volume: '24500000' }
          ],
          most_actively_traded: [
            { ticker: 'AAPL', price: '195.80', change_amount: '1.20', change_percentage: '0.62%', volume: '52300000' },
            { ticker: 'NVDA', price: '142.50', change_amount: '8.32', change_percentage: '6.20%', volume: '312450000' }
          ]
        };
        console.log(`ℹ️ Serving mock TOP_GAINERS_LOSERS from stocks.json`);
        cache.set(cacheKey, movers, ttl);
        return movers;
      }

      if (fn === 'MARKET_STATUS') {
        const status = {
          markets: [
            { market_type: 'Equity', region: 'US', primary_exchanges: 'NASDAQ, NYSE', local_open: '09:30', local_close: '16:00', current_status: 'open', notes: '' }
          ]
        };
        console.log(`ℹ️ Serving mock MARKET_STATUS from stocks.json`);
        cache.set(cacheKey, status, ttl);
        return status;
      }

      if (fn === 'SYMBOL_SEARCH') {
        const query = (params.keywords || '').toLowerCase();
        const bestMatches = [];
        for (const sym of Object.keys(mockDb.symbols || {})) {
          const sData = mockDb.symbols[sym].OVERVIEW;
          if (sym.toLowerCase().includes(query) || sData.Name.toLowerCase().includes(query)) {
            bestMatches.push({
              '1. symbol': sym,
              '2. name': sData.Name,
              '3. type': sData.AssetType || 'Common Stock',
              '4. region': 'United States',
              '5. marketOpen': '09:30',
              '6. marketClose': '16:00',
              '7. timezone': 'UTC-04',
              '8. currency': sData.Currency || 'USD',
              '9. matchScore': '1.0000',
            });
          }
        }
        console.log(`ℹ️ Serving mock SYMBOL_SEARCH for "${query}" from stocks.json`);
        const searchResult = { bestMatches };
        cache.set(cacheKey, searchResult, ttl);
        return searchResult;
      }

      if (symbol && mockDb.symbols && mockDb.symbols[symbol]) {
        const mockStock = mockDb.symbols[symbol];
        let mockResponse = null;

        if (fn === 'OVERVIEW' && mockStock.OVERVIEW) {
          mockResponse = mockStock.OVERVIEW;
        } else if (fn === 'GLOBAL_QUOTE' && mockStock.GLOBAL_QUOTE) {
          mockResponse = mockStock.GLOBAL_QUOTE;
        } else if (fn === 'TIME_SERIES_DAILY') {
          mockResponse = mockStock.TIME_SERIES_DAILY;
        } else if (fn === 'TIME_SERIES_INTRADAY') {
          mockResponse = mockStock.TIME_SERIES_INTRADAY;
        }

        if (mockResponse) {
          console.log(`ℹ️ Serving mock ${fn} for ${symbol} from stocks.json`);
          cache.set(cacheKey, mockResponse, ttl);
          return mockResponse;
        }
      }
    } catch (fallbackErr) {
      console.error('❌ Fallback mock data error:', fallbackErr.message);
    }

    // Map error to custom errors
    if (errorToThrow) {
      if (errorToThrow.statusCode === 429) {
        errorToThrow.message = 'External API rate limit exceeded';
      } else if (errorToThrow.statusCode === 401) {
        errorToThrow.message = 'API key missing';
      } else if (errorToThrow.statusCode === 400) {
        errorToThrow.message = 'Stock not found or invalid symbol';
      }
      throw errorToThrow;
    }

    throw new Error('Backend unavailable or symbol not supported offline');
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

