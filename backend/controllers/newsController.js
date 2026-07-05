const AlphaVantageService = require('../utils/alphaVantage');

/**
 * @route   GET /api/news?tickers=AAPL&topics=technology
 * @desc    Fetch financial news and sentiment
 */
const getNews = async (req, res, next) => {
  try {
    const { tickers = '', topics = '' } = req.query;
    const data = await AlphaVantageService.getNewsSentiment(tickers, topics);

    const articles = (data.feed || []).map((article) => ({
      title: article.title || '',
      url: article.url || '',
      summary: article.summary || '',
      source: article.source || '',
      sourceDomain: article.source_domain || '',
      bannerImage: article.banner_image || '',
      publishedAt: article.time_published || '',
      category: article.category_within_source || '',
      overallSentiment: article.overall_sentiment_label || '',
      sentimentScore: parseFloat(article.overall_sentiment_score) || 0,
      tickers: (article.ticker_sentiment || []).map((t) => ({
        ticker: t.ticker,
        relevanceScore: t.relevance_score,
        sentimentLabel: t.ticker_sentiment_label,
        sentimentScore: t.ticker_sentiment_score,
      })),
    }));

    res.status(200).json({
      success: true,
      data: articles,
      totalResults: articles.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNews };
