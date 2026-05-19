import express from "express";
import cors from "cors";

import mfRoutes from "./routes/mfRoute";
import { limiter }
from "./middleware/rateLimiter";
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/mf", mfRoutes);
app.use(limiter);
export default app;