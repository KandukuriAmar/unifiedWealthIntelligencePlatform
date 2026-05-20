import {
  Request,
  Response,
  NextFunction
} from "express";

export const auditLogger =
(
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log({
    method: req.method,
    route: req.originalUrl,
    time: new Date()
  });

  next();
};