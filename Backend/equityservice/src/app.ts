import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import loggerMiddleware from './middleware/loggerMiddleware';
import routes from './routes';
import notFoundMiddleware from './middleware/notFoundMiddleware';
import errorMiddleware from './middleware/errorMiddleware';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // set CORS_ORIGIN in .env to your frontend URL
  credentials: true                         // required for cookies to be sent cross-origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(loggerMiddleware);

app.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Equity service is healthy',
    data: {
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;