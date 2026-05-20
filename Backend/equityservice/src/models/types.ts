export interface EquityUserRow {
  investor_id: string;
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  password_hash: string;
  created_at: string;
}

export interface EquityHoldingRow {
  id: number;
  investor_id: string;
  stock_symbol: string;
  quantity: string;
  avg_buy_price: string;
  current_market_price: string;
  exchange: string;
  updated_at: string;
}

export interface EquityTransactionRow {
  id: number;
  investor_id: string;
  stock_symbol: string;
  transaction_type: 'BUY' | 'SELL';
  quantity: string;
  price: string;
  exchange: string;
  realized_gain?: string | null;
  executed_at: string;
}

export interface EquityWatchlistRow {
  id: number;
  investor_id: string;
  stock_symbol: string;
  added_at: string;
}

export interface EquityMarketPriceRow {
  stock_symbol: string;
  company_name: string;
  current_price: string;
  day_change_percent: string;
  exchange: string;
  updated_at: string;
}

export interface EquityRefreshTokenRow {
  id: number;
  investor_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}