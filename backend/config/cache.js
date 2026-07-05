const NodeCache = require('node-cache');

/**
 * In-memory cache for Alpha Vantage API responses.
 *
 * Default TTL = 300 s (5 minutes).
 * Check period = 120 s — how often expired keys are purged.
 */
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 120,
  useClones: false,
  deleteOnExpire: true,
});

cache.on('expired', (key) => {
  console.log(`🗑️  Cache expired: ${key}`);
});

module.exports = cache;
