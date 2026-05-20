import { supabase } from '../config/db';

const run = async () => {
  if (!supabase) {
    console.error('Supabase is not initialized');
    return;
  }
  console.log('Querying equity_refresh_tokens table...');
  const { data, error } = await supabase.from('equity_refresh_tokens').select('*').limit(1);
  if (error) {
    console.error('Error fetching refresh tokens:', error);
  } else {
    console.log('Refresh tokens found:', data);
  }
};

run();
