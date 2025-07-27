import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });
    
    client.on('error', (err) => console.error('Error connecting to Redis', err));
    await client.connect();
  }
  return client;
}

export async function cacheGet(key: string) {
  try {
    const redis = await getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds: number = 900) {
  try {
    const redis = await getRedisClient();
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting Redis cache:', error);
  }
}

export async function cacheDelete(key: string) {
  try {
    const redis = await getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error('Error deleting from Redis Cache:', error);
  }
}
