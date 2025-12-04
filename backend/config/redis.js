// redis.js
require("dotenv").config();
const Redis = require("ioredis");
// In development we may not have Redis running locally; provide a noop client
// to avoid connection errors while preserving the API shape used by the app.
const isDev =
  process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development";

if (isDev || !process.env.REDIS_HOST) {
  console.log(
    "ℹ️ Redis disabled (dev mode or REDIS_HOST not set) — exporting noop client"
  );
  // --- GIẢ LẬP REDIS BẰNG RAM (Để chạy dev không cần cài Redis) ---
  const memoryQueue = []; // Mảng chứa hàng đợi tạm thời
  const noop = () => {};
  const noopClient = {
    on: noop,
    get: async () => null,
    set: async () => "OK",
    del: async () => 0,
    expire: async () => 0,
    // allow other method calls without throwing
    // e.g., client.pipeline(), client.multi()
    // Giả lập rPush (Đẩy vào cuối mảng)
    rPush: async (key, value) => {
      // console.log('[MockRedis] Pushed:', value);
      return memoryQueue.push(value);
    },
    // Giả lập lPop (Lấy từ đầu mảng)
    lPop: async (key) => {
      const val = memoryQueue.shift();
      // console.log('[MockRedis] Popped:', val);
      return val || null;
    },
    // Giả lập lLen (Lấy độ dài)
    lLen: async (key) => memoryQueue.length,
    // -----------------------------------
    pipeline: () => ({ exec: async () => [] }),
    multi: () => ({ exec: async () => [] }),
  };

  module.exports = noopClient;
} else {
  const redis = new Redis({
    host: process.env.REDIS_HOST, // mybookstore-redis.redis.cache.windows.net
    port: process.env.REDIS_PORT || 6380,
    username: "default",
    password: process.env.REDIS_PASSWORD,
    tls: {
      rejectUnauthorized: false,
    },
    connectTimeout: 10000,
  });

  redis.on("connect", () => console.log("✅ Connected to Azure Redis Cache"));
  redis.on("error", (err) => console.error("Redis connection error:", err));

  module.exports = redis;
}
