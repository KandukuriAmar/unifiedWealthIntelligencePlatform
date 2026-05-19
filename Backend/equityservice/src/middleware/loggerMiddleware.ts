import { RequestHandler } from 'express';

const loggerMiddleware: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
  });

  next();
};

export default loggerMiddleware;