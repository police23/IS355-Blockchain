/**
 * In-memory cache helper (replacement for Redis) — simple Map with TTL.
 * This preserves the same async API used across the app so other modules
 * don't need changes when Redis is removed.
 */

class CacheHelper {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} Parsed value or null if not found
   */
  static async get(key) {
    try {
      const entry = CacheHelper._store.get(key);
      if (!entry) return null;
      const { value, expiresAt } = entry;
      if (expiresAt && Date.now() > expiresAt) {
        CacheHelper._store.delete(key);
        return null;
      }
      return value;
    } catch (err) {
      console.error(`Cache GET error for key ${key}:`, err);
      return null;
    }
  }

  /**
   * Set value to cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache (will be JSON stringified)
   * @param {number} ttl - Time to live in seconds (default: 3600 = 1 hour)
   * @returns {Promise<boolean>} True if set successfully
   */
  static async set(key, value, ttl = 3600) {
    try {
      const expiresAt = ttl ? Date.now() + ttl * 1000 : null;
      CacheHelper._store.set(key, { value, expiresAt });
      return true;
    } catch (err) {
      console.error(`Cache SET error for key ${key}:`, err);
      return false;
    }
  }

  /**
   * Delete a cache key
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} True if deleted
   */
  static async del(key) {
    try {
      CacheHelper._store.delete(key);
      return true;
    } catch (err) {
      console.error(`Cache DEL error for key ${key}:`, err);
      return false;
    }
  }

  /**
   * Delete multiple cache keys
   * @param {string[]} keys - Array of cache keys to delete
   * @returns {Promise<boolean>} True if all deleted
   */
  static async delMany(keys) {
    try {
      if (keys.length === 0) return true;
      for (const k of keys) CacheHelper._store.delete(k);
      return true;
    } catch (err) {
      console.error(`Cache DEL MANY error:`, err);
      return false;
    }
  }

  /**
   * Clear all cache by pattern (careful with this!)
   * @param {string} pattern - Key pattern (e.g., 'books:*')
   * @returns {Promise<number>} Number of keys deleted
   */
  static async clearPattern(pattern) {
    try {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      const keys = [];
      for (const k of CacheHelper._store.keys()) {
        if (regex.test(k)) keys.push(k);
      }
      for (const k of keys) CacheHelper._store.delete(k);
      return keys.length;
    } catch (err) {
      console.error(`Cache CLEAR PATTERN error:`, err);
      return 0;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>}
   */
  static async exists(key) {
    try {
      return CacheHelper._store.has(key);
    } catch (err) {
      console.error(`Cache EXISTS error for key ${key}:`, err);
      return false;
    }
  }

  /**
   * Get cache key with fallback to function if not cached
   * Useful pattern: const books = await cache.getOrSet('books', () => fetchBooks())
   * @param {string} key - Cache key
   * @param {Function} fn - Async function to call if cache miss
   * @param {number} ttl - TTL in seconds (default: 3600)
   * @returns {Promise<any>} Cached value or result from fn
   */
  static async getOrSet(key, fn, ttl = 3600) {
    try {
      // Try to get from cache
      const cached = await this.get(key);
      if (cached !== null) {
        console.log(`Cache HIT: ${key}`);
        return cached;
      }

      // Cache miss: call function
      console.log(`Cache MISS: ${key}`);
      const value = await fn();

      // Store in cache
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttl);
      }

      return value;
    } catch (err) {
      console.error(`Cache GET_OR_SET error for key ${key}:`, err);
      // Fallback: still call the function even if cache fails
      return await fn();
    }
  }

  /**
   * Increment a numeric cache value
   * @param {string} key - Cache key
   * @param {number} increment - Amount to increment (default: 1)
   * @returns {Promise<number>} New value
   */
  static async incr(key, increment = 1) {
    try {
      const entry = CacheHelper._store.get(key);
      let num = 0;
      if (entry && typeof entry.value === 'number') num = entry.value;
      num += increment;
      CacheHelper._store.set(key, { value: num, expiresAt: entry ? entry.expiresAt : null });
      return num;
    } catch (err) {
      console.error(`Cache INCR error for key ${key}:`, err);
      return null;
    }
  }

  /**
   * Get cache stats (for monitoring)
   * @returns {Promise<object>} Cache info
   */
  static async info() {
    try {
      return { keys: CacheHelper._store.size };
    } catch (err) {
      console.error(`Cache INFO error:`, err);
      return null;
    }
  }
}

// Internal Map store and simple TTL housekeeping
CacheHelper._store = new Map();

// Periodic cleanup of expired keys (runs every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of CacheHelper._store.entries()) {
    if (v.expiresAt && now > v.expiresAt) CacheHelper._store.delete(k);
  }
}, 60 * 1000).unref && setInterval(() => {}).unref();

module.exports = CacheHelper;
