import { supabase } from '../config/db';

async function run() {
  const { data: users } = await supabase.from('equity_users').select('*');
  console.log('All users:', JSON.stringify(users, null, 2));
}

run();
