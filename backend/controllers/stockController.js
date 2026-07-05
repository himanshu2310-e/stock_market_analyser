const AlphaVantageService = require('../utils/alphaVantage');
const RecentSearch = require('../models/RecentSearch');

/**
 * @route   GET /api/stocks/search?q=AAPL
 * @desc    Search for stocks by keyword / symbol
 */
const searchStocks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Search query is required' });
    }

    const data = await AlphaVantageService.searchSymbol(q.trim());
    const results = (data.bestMatches || []).map((m) => ({
      symbol: m['1. symbol'],
      name: m['2. name'],
      type: m['3. type'],
      region: m['4. region'],
      marketOpen: m['5. marketOpen'],
      marketClose: m['6. marketClose'],
      timezone: m['7. timezone'],
      currency: m['8. currency'],
      matchScore: m['9. matchScore'],
    }));

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stocks/:symbol
 * @desc    Get full stock details (quote + overview)
 */
const getStock = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    const [quoteData, overviewData] = await Promise.all([
      AlphaVantageService.getQuote(symbol),
      AlphaVantageService.getOverview(symbol),
    ]);

    const gq = quoteData['Global Quote'] || {};

    const quote = {
      symbol: gq['01. symbol'] || symbol,
      open: parseFloat(gq['02. open']) || 0,
      high: parseFloat(gq['03. high']) || 0,
      low: parseFloat(gq['04. low']) || 0,
      price: parseFloat(gq['05. price']) || 0,
      volume: parseInt(gq['06. volume'], 10) || 0,
      latestTradingDay: gq['07. latest trading day'] || '',
      previousClose: parseFloat(gq['08. previous close']) || 0,
      change: parseFloat(gq['09. change']) || 0,
      changePercent: gq['10. change percent'] || '0%',
    };

    const overview = {
      name: overviewData.Name || '',
      description: overviewData.Description || '',
      exchange: overviewData.Exchange || '',
      currency: overviewData.Currency || '',
      country: overviewData.Country || '',
      sector: overviewData.Sector || '',
      industry: overviewData.Industry || '',
      marketCap: overviewData.MarketCapitalization || '',
      peRatio: overviewData.PERatio || '',
      pegRatio: overviewData.PEGRatio || '',
      bookValue: overviewData.BookValue || '',
      dividendPerShare: overviewData.DividendPerShare || '',
      dividendYield: overviewData.DividendYield || '',
      eps: overviewData.EPS || '',
      revenuePerShare: overviewData.RevenuePerShareTTM || '',
      profitMargin: overviewData.ProfitMargin || '',
      operatingMargin: overviewData.OperatingMarginTTM || '',
      returnOnAssets: overviewData.ReturnOnAssetsTTM || '',
      returnOnEquity: overviewData.ReturnOnEquityTTM || '',
      revenue: overviewData.RevenueTTM || '',
      grossProfit: overviewData.GrossProfitTTM || '',
      dilutedEPS: overviewData.DilutedEPSTTM || '',
      quarterlyEarningsGrowth: overviewData.QuarterlyEarningsGrowthYOY || '',
      quarterlyRevenueGrowth: overviewData.QuarterlyRevenueGrowthYOY || '',
      analystTargetPrice: overviewData.AnalystTargetPrice || '',
      analystRatingBuy: overviewData.AnalystRatingStrongBuy || '',
      analystRatingHold: overviewData.AnalystRatingHold || '',
      analystRatingSell: overviewData.AnalystRatingSell || '',
      week52High: overviewData['52WeekHigh'] || '',
      week52Low: overviewData['52WeekLow'] || '',
      day50MA: overviewData['50DayMovingAverage'] || '',
      day200MA: overviewData['200DayMovingAverage'] || '',
      sharesOutstanding: overviewData.SharesOutstanding || '',
      beta: overviewData.Beta || '',
      forwardPE: overviewData.ForwardPE || '',
      address: overviewData.Address || '',
    };

    /* Save recent search if user is authenticated */
    if (req.user) {
      RecentSearch.addSearch(req.user._id, symbol, overview.name).catch(
        () => {}
      );
    }

    res.status(200).json({
      success: true,
      data: { quote, overview },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stocks/historical/:symbol?range=1m&interval=daily
 * @desc    Get historical time-series data
 */
const getHistorical = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { range = '3m' } = req.query;

    let data;
    let seriesKey;

    if (range === '1d' || range === '5d') {
      data = await AlphaVantageService.getIntraday(symbol, '5min');
      seriesKey = 'Time Series (5min)';
    } else if (range === '1y' || range === '5y' || range === 'max') {
      data = await AlphaVantageService.getDaily(symbol, 'full');
      seriesKey = 'Time Series (Daily)';
    } else {
      data = await AlphaVantageService.getDaily(symbol, 'compact');
      seriesKey = 'Time Series (Daily)';
    }

    const timeSeries = data[seriesKey] || {};
    let entries = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'], 10),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    /* Filter by range */
    const now = new Date();
    let cutoff = new Date();
    switch (range) {
      case '1d':
        cutoff.setDate(now.getDate() - 1);
        break;
      case '5d':
        cutoff.setDate(now.getDate() - 5);
        break;
      case '1m':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      case '5y':
        cutoff.setFullYear(now.getFullYear() - 5);
        break;
      case 'max':
        cutoff = new Date(0);
        break;
      default:
        cutoff.setMonth(now.getMonth() - 3);
    }

    entries = entries.filter((e) => new Date(e.date) >= cutoff);

    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stocks/indicators/:symbol
 * @desc    Compute technical indicators from historical data
 */
const getIndicators = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    const rawData = await AlphaVantageService.getDaily(symbol, 'full');
    const timeSeries = rawData['Time Series (Daily)'] || {};

    const entries = Object.entries(timeSeries)
      .map(([date, v]) => ({
        date,
        close: parseFloat(v['4. close']),
        high: parseFloat(v['2. high']),
        low: parseFloat(v['3. low']),
        volume: parseInt(v['5. volume'], 10),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const closes = entries.map((e) => e.close);

    /* --- SMA --- */
    const computeSMA = (data, period) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          result.push(null);
        } else {
          const slice = data.slice(i - period + 1, i + 1);
          result.push(slice.reduce((a, b) => a + b, 0) / period);
        }
      }
      return result;
    };

    /* --- EMA --- */
    const computeEMA = (data, period) => {
      const k = 2 / (period + 1);
      const result = [data[0]];
      for (let i = 1; i < data.length; i++) {
        result.push(data[i] * k + result[i - 1] * (1 - k));
      }
      return result;
    };

    /* --- RSI --- */
    const computeRSI = (data, period = 14) => {
      const result = new Array(data.length).fill(null);
      let gains = 0;
      let losses = 0;

      for (let i = 1; i <= period; i++) {
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }

      let avgGain = gains / period;
      let avgLoss = losses / period;
      result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

      for (let i = period + 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
        result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
      }
      return result;
    };

    /* --- MACD --- */
    const ema12 = computeEMA(closes, 12);
    const ema26 = computeEMA(closes, 26);
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = computeEMA(macdLine, 9);
    const histogram = macdLine.map((v, i) => v - signalLine[i]);

    /* --- Bollinger Bands --- */
    const sma20 = computeSMA(closes, 20);
    const bollingerUpper = [];
    const bollingerLower = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 19) {
        bollingerUpper.push(null);
        bollingerLower.push(null);
      } else {
        const slice = closes.slice(i - 19, i + 1);
        const mean = sma20[i];
        const stdDev = Math.sqrt(
          slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / 20
        );
        bollingerUpper.push(mean + 2 * stdDev);
        bollingerLower.push(mean - 2 * stdDev);
      }
    }

    /* --- Golden / Death Cross --- */
    const sma50 = computeSMA(closes, 50);
    const sma200 = computeSMA(closes, 200);
    const crossovers = [];
    for (let i = 1; i < closes.length; i++) {
      if (sma50[i] && sma200[i] && sma50[i - 1] && sma200[i - 1]) {
        if (sma50[i] > sma200[i] && sma50[i - 1] <= sma200[i - 1]) {
          crossovers.push({ date: entries[i].date, type: 'golden_cross' });
        }
        if (sma50[i] < sma200[i] && sma50[i - 1] >= sma200[i - 1]) {
          crossovers.push({ date: entries[i].date, type: 'death_cross' });
        }
      }
    }

    /* Return last 365 entries for sanity */
    const sliceFrom = Math.max(0, entries.length - 365);

    const indicatorData = entries.slice(sliceFrom).map((e, idx) => {
      const i = idx + sliceFrom;
      return {
        date: e.date,
        close: e.close,
        volume: e.volume,
        sma20: sma20[i],
        sma50: sma50[i],
        sma200: sma200[i],
        ema12: ema12[i],
        ema26: ema26[i],
        rsi: computeRSI(closes, 14)[i],
        macd: macdLine[i],
        signal: signalLine[i],
        histogram: histogram[i],
        bollingerUpper: bollingerUpper[i],
        bollingerMiddle: sma20[i],
        bollingerLower: bollingerLower[i],
      };
    });

    res.status(200).json({
      success: true,
      data: { indicators: indicatorData, crossovers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchStocks, getStock, getHistorical, getIndicators };
