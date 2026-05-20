import express from "express";
import cors from "cors";

import authRoutes
from "./routes/authRoute";

import wealthRoutes
from "./routes/wealthRoute";

import { limiter }
from "./middleware/rateLimiter";

import { auditLogger }
from "./middleware/auditMiddleware";

import systemRoutes
from "./routes/systemRoute";
const app = express();

app.use(cors());

app.use(express.json());

app.use(limiter);

app.use(auditLogger);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/wealth",
  wealthRoutes
);

app.use(
  "/api/system",
  systemRoutes
);

export default app;