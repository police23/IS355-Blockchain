// redis.js
require("dotenv").config();
const Redis = require("ioredis");
// In development we may not have Redis running locally; provide a noop client
// to avoid connection errors while preserving the API shape used by the app.
const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';

if (isDev || !process.env.REDIS_HOST) {
  console.log('ℹ️ Redis disabled (dev mode or REDIS_HOST not set) — exporting noop client');

  const noop = () => {};
  const noopClient = {
    on: noop,
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    expire: async () => 0,
    // allow other method calls without throwing
    // e.g., client.pipeline(), client.multi()
    pipeline: () => ({ exec: async () => [] }),
    multi: () => ({ exec: async () => [] }),
  };

  module.exports = noopClient;
} else {
  const redis = new Redis({
    host: process.env.REDIS_HOST, // mybookstore-redis.redis.cache.windows.net
    port: process.env.REDIS_PORT || 6380,
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    tls: {
      rejectUnauthorized: false,
    },
    connectTimeout: 10000,
  });

  redis.on('connect', () => console.log('✅ Connected to Azure Redis Cache'));
  redis.on('error', (err) => console.error('Redis connection error:', err));

  module.exports = redis;
}
