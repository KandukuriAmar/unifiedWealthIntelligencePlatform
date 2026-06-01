<<<<<<< HEAD
import dotenv from 'dotenv';
dotenv.config();

import { createClient, SupabaseClient } from '@supabase/supabase-js';
=======
import {
  createClient,
  SupabaseClient
} from "@supabase/supabase-js";
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f

import dotenv from "dotenv";

dotenv.config();


const supabaseUrl =
  process.env.SUPABASE_URL!;

const supabaseKey =
  process.env.SUPABASE_KEY!;


export const supabase:
SupabaseClient = createClient(

  supabaseUrl,

  supabaseKey
);


export const connectDatabase =
async (): Promise<void> => {

  try {

    const {
      error
    } = await supabase

      .from("equity_holdings")

      .select("*")

      .limit(1);

    if (error) {

      console.log(
        " Supabase Connection Error"
      );

      console.log(error.message);

      return;
    }

    console.log(
      " Supabase Connected"
    );

  } catch (error) {

    console.log(
      " Database Connection Failed"
    );

    console.log(error);
  }
};