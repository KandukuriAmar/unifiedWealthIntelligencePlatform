import axios from "axios";

import {
  calculateTotalWealth
} from "../utils/calculateTotalWealth";

import {
  calculateRisk
} from "../utils/calculateRisk";
import { redisClient }
from "../config/redis";


export const getPortfolioSummary =
async (email?: string, authHeader?: string) => {

  const cacheKey =
    `portfolio-summary-${email || 'default'}`;

  const cachedData =
    await redisClient.get(cacheKey);

  if (cachedData) {

    console.log(
      "Serving from Redis Cache"
    );

    return JSON.parse(cachedData);
  }

  let mfData: any = {
    summary: {
      totalCurrentValue: 0
    }
  };

  let equityData: any = {
    totalValue: 0
  };

  let customerRef = "CUST-1001";
  if (email) {
    try {
      const customerResponse =
        await axios.get(
          `${process.env.MF_SERVICE_URL}/api/mf/customer/by-email/${email}`,
          {
            headers: {
              "x-api-key": "myapikey"
            }
          }
        );
      if (customerResponse.data && customerResponse.data.data) {
        customerRef = customerResponse.data.data.customer_ref;
      }
    } catch (error) {
      console.log("Failed to resolve customer by email:", email);
    }
  }

  try {

    const mfResponse =
      await axios.get(
        `${process.env.MF_SERVICE_URL}/api/mf/portfolio/${customerRef}`,
        {
          headers: {
            "x-api-key": "myapikey"
          }
        }
      );

    mfData =
      mfResponse.data.data;

  } catch (error) {

    console.log(
      "MF Service Down"
    );

    mfData = {
      service: "DOWN",
      summary: {
        totalCurrentValue: 0
      }
    };
  }

  try {
    const headers: any = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const equityResponse =
      await axios.get(
        `${process.env.EQUITY_SERVICE_URL}/holdings`,
        { headers }
      );

    const holdings = equityResponse.data.data || [];
    const totalValue = holdings.reduce((sum: number, item: any) => {
      return sum + (Number(item.quantity) * Number(item.current_market_price || item.avg_buy_price || 0));
    }, 0);

    equityData = {
      holdings,
      totalValue
    };

  } catch (error) {

    console.log(
      "Equity Service Down"
    );

    equityData = {
      service: "DOWN",
      totalValue: 0
    };
  }

  const totalWealth =
    mfData.summary.totalCurrentValue +
    equityData.totalValue;

  const finalData = {

    mutualFunds: mfData,

    equity: equityData,

    totalWealth
  };

  await redisClient.set(
    cacheKey,
    JSON.stringify(finalData),
    {
      EX: 300
    }
  );
  console.log(
  "Stored in Redis Cache"
  );

  return finalData;
};

export const getDashboardData =
async () => {

  const equityPercentage = 65;

  const riskScore =
    calculateRisk(
      equityPercentage
    );

  return {
    totalProfit: 25000,
    monthlyReturns: "12%",
    diversification: "Good",
    riskScore
  };
};

export const getAllTransactions =
async (email?: string, authHeader?: string) => {

  let mfTransactions = [];

  let equityTransactions = [];

  let customerRef = "CUST-1001";
  if (email) {
    try {
      const customerResponse =
        await axios.get(
          `${process.env.MF_SERVICE_URL}/api/mf/customer/by-email/${email}`,
          {
            headers: {
              "x-api-key": "myapikey"
            }
          }
        );
      if (customerResponse.data && customerResponse.data.data) {
        customerRef = customerResponse.data.data.customer_ref;
      }
    } catch (error) {
      console.log("Failed to resolve customer by email:", email);
    }
  }

  try {

    const mfResponse =
      await axios.get(
        `${process.env.MF_SERVICE_URL}/api/mf/transactions/${customerRef}`,
        {
          headers: {
            "x-api-key": "myapikey"
          }
        }
      );

    mfTransactions =
      mfResponse.data.transactions;

  } catch (error) {

    console.log(
      "MF Transactions Down"
    );
  }

  try {
    const headers: any = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const equityResponse =
      await axios.get(
        `${process.env.EQUITY_SERVICE_URL}/transactions`,
        { headers }
      );

    equityTransactions =
      equityResponse.data.data || [];

  } catch (error) {

    console.log(
      "Equity Transactions Down"
    );
  }

  return {

    mutualFundTransactions:
      mfTransactions,

    equityTransactions
  };
};