const redisClient = require('../config/redis');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'cache-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'cache-combined.log' })
  ]
});

/**
 * Cache middleware for API responses
 * @param {number} ttl - Time to live in seconds
 * @param {string} keyPrefix - Prefix for cache keys
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 60, keyPrefix = 'api:') => {
  return async (req, res, next) => {
    try {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key from request
      const cacheKey = `${keyPrefix}${req.originalUrl || req.url}`;

      // Try to get cached response
      const cachedResponse = await redisClient.get(cacheKey);

      if (cachedResponse) {
        logger.info(`Cache hit for: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedResponse));
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = (body) => {
        if (res.statusCode === 200) {
          redisClient.setEx(cacheKey, ttl, JSON.stringify(body))
            .catch(err => logger.error('Cache set error:', err));
        }
        originalJson.call(res, body);
      };

      next();
    } catch (err) {
      logger.error('Cache middleware error:', err);
      next();
    }
  };
};

/**
 * Clear cache for specific keys
 * @param {string|string[]} keys - Cache keys to clear
 */
const clearCache = async (keys) => {
  try {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      await redisClient.del(key);
      logger.info(`Cache cleared for: ${key}`);
    }
  } catch (err) {
    logger.error('Cache clear error:', err);
  }
};

/**
 * Clear all cache
 */
const clearAllCache = async () => {
  try {
    // Note: In production, you might want to use a more targeted approach
    // This is a simple implementation that might not work with all Redis setups
    const keys = await redisClient.keys('api:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared ${keys.length} cache entries`);
    }
  } catch (err) {
    logger.error('Cache clear all error:', err);
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache
};
