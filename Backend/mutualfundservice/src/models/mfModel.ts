import { supabase } from "../config/supabase";

export const getFundsByCustomer =
async (customerRef: string) => {

  const { data, error } = await supabase
    .from("mf_customer_funds")
    .select(`
      *,
      mf_schemes(*)
    `)
    .eq("customer_ref", customerRef);

  if (error) throw error;

  return data;
};

export const getSipsByCustomer =
async (customerRef: string) => {

  const { data, error } = await supabase
    .from("mf_sips")
    .select(`
      *,
      mf_schemes(*)
    `)
    .eq("customer_ref", customerRef);

  if (error) throw error;

  return data;
};

export const getTransactionsByCustomer =
async (customerRef: string) => {

  const { data, error } = await supabase
    .from("mf_transactions")
    .select(`
      *,
      mf_schemes(*)
    `)
    .eq("customer_ref", customerRef);

  if (error) throw error;

  return data;
};

export const getFailedSips =
async () => {

  const { data, error } = await supabase
    .from("mf_sips")
    .select(`
      *,
      mf_schemes(*)
    `)
    .in("sip_status", ["PAUSED", "CANCELLED"]);

  if (error) throw error;

  return data;
};