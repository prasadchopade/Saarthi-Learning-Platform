const Redis = require('ioredis');

// Redis is only a cache here: it stores chat sessions and transcript lookups.
// When REDIS_URL is absent the app still works, it just recomputes instead of
// reading from cache, so a missing URL must not take the whole server down.
const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('REDIS_URL is not set - running without cache. Chat sessions will not persist across restarts.');
    return null;
  }

  const redis = new Redis(redisUrl, {
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    maxRetriesPerRequest: 5,
    connectTimeout: 10000,
    keepAlive: 10000
  });

  redis.on('connect', () => {
    console.log('Connected to Redis Cloud');
  });

  redis.on('error', (err) => {
    console.error('Redis Cloud connection error:', err);
  });

  redis.on('reconnecting', () => {
    console.log('Reconnecting to Redis Cloud');
  });

  return redis;
};

const redisClient = createRedisClient();
const getAsync = async (key) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting key ${key} from Redis:`, error);
    return null;
  }
};

const setAsync = async (key, value, expiry = 86400) => {
  if (!redisClient) return false;
  try {
    await redisClient.setex(key, expiry, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting key ${key} in Redis:`, error);
    return false;
  }
};

const deleteAsync = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting key ${key} from Redis:`, error);
    return false;
  }
};

module.exports = {
  redisClient,
  getAsync,
  setAsync,
  deleteAsync
}; 