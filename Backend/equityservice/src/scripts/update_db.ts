import { supabase } from '../config/db';

async function run() {
  console.log('--- STARTING DATABASE UPDATE ---');
  try {
    // 1. Update INV1001 email & password
    const { data: user1, error: err1 } = await supabase
      .from('equity_users')
      .update({
        email: 'user@app.com',
        password_hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' // password123
      })
      .eq('investor_id', 'INV1001')
      .select('*');
    
    if (err1) {
      console.error('Error updating INV1001:', err1.message);
    } else {
      console.log('Updated INV1001 successfully:', user1);
    }

    // 2. Update CUST-1001 in mf_customers
    const { data: cust1, error: err2 } = await supabase
      .from('mf_customers')
      .update({
        email: 'user@app.com'
      })
      .eq('customer_ref', 'CUST-1001')
      .select('*');

    if (err2) {
      console.error('Error updating CUST-1001:', err2.message);
    } else {
      console.log('Updated CUST-1001 successfully:', cust1);
    }

    // 3. Update pending password hashes to password123 hashed
    const { data: pendUsers, error: err3 } = await supabase
      .from('equity_users')
      .update({
        password_hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' // password123
      })
      .eq('password_hash', 'pending')
      .select('*');

    if (err3) {
      console.error('Error updating pending users:', err3.message);
    } else {
      console.log('Activated pending users:', pendUsers?.map(u => u.investor_id));
    }

    // 4. Update INV2001's plaintext password hash to SHA-256 hashed
    const { data: user2001, error: err4 } = await supabase
      .from('equity_users')
      .update({
        password_hash: 'f0238f6dc401055f97761133158d1eca21d14fb453bf5b8d90efd7f39373743f' // rahul@123 hashed
      })
      .eq('investor_id', 'INV2001')
      .select('*');

    if (err4) {
      console.error('Error updating INV2001:', err4.message);
    } else {
      console.log('Updated INV2001 successfully:', user2001);
    }

    console.log('--- DATABASE UPDATE COMPLETED ---');
  } catch (err: any) {
    console.error('Error executing update:', err.message);
  }
}

run();
