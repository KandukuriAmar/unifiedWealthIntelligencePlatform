import {
  Request,
  Response
} from "express";

import {
  checkServiceHealth
} from "../utils/serviceHealthChecker";

export const healthCheck =
async (
  req: Request,
  res: Response
) => {

  const mfService =
    await checkServiceHealth(
      process.env.MF_SERVICE_URL!
    );

  const equityService =
    await checkServiceHealth(
      process.env.EQUITY_SERVICE_URL!
    );

  res.status(200).json({

    wealthService: "UP",

    mutualFundService:
      mfService,

    equityService
  });
};