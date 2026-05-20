import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let isRedisConnected = false;

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err.message || err);
  isRedisConnected = false;
});

redisClient.on("connect", () => {
  isRedisConnected = true;
});

const originalGet = redisClient.get.bind(redisClient);
const originalSet = redisClient.set.bind(redisClient);

(redisClient as any).get = async (key: string): Promise<any> => {
  if (!isRedisConnected) {
    console.log("Redis not connected, skipping get");
    return null;
  }
  try {
    return await originalGet(key);
  } catch (e) {
    return null;
  }
};

(redisClient as any).set = async (key: string, value: string, options?: any): Promise<any> => {
  if (!isRedisConnected) {
    console.log("Redis not connected, skipping set");
    return null;
  }
  try {
    return await originalSet(key, value, options);
  } catch (e) {
    return null;
  }
};

redisClient.connect().catch((err) => {
  console.log("Failed to connect to Redis on startup, continuing without cache.");
  isRedisConnected = false;
});