import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL!
});

redisClient.connect().catch((err) => {
  console.log("Failed to connect to Redis, continuing without cache.");
});

redisClient.on("error", (err) => {
  console.log("Redis Error", err);
});