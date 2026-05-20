import {
  getFundsByCustomer,
  getAllFunds,
  getSipsByCustomer,
  getAllSips,
  getTransactionsByCustomer,
  getFailedSips,
  getCustomerByEmail
} from "../models/mfModel";

export const fetchCompletePortfolio =
async (customerRef: string) => {

  const funds =
    await getFundsByCustomer(customerRef);

  const sips =
    await getSipsByCustomer(customerRef);

  const transactions =
    await getTransactionsByCustomer(customerRef);

  let totalInvestment = 0;

  let totalCurrentValue = 0;

  funds.forEach((fund: any) => {

    totalInvestment +=
      Number(fund.invested_amount);

    totalCurrentValue +=
      Number(fund.current_value);
  });

  return {
    funds,
    sips,
    transactions,
    summary: {
      totalInvestment,
      totalCurrentValue,
      profit:
        totalCurrentValue - totalInvestment
    }
  };
};

export const fetchAllFunds =
async () => {
  return await getAllFunds();
};

export const fetchSips =
async (customerRef: string) => {

  return await getSipsByCustomer(customerRef);
};

export const fetchAllSips =
async () => {

  return await getAllSips();
};

export const fetchTransactions =
async (customerRef: string) => {

  return await getTransactionsByCustomer(customerRef);
};

export const fetchFailedSips =
async () => {

  return await getFailedSips();
};

export const fetchCustomerByEmail =
async (email: string) => {

  return await getCustomerByEmail(email);
};