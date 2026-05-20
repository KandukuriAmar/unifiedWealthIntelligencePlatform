import axios from 'axios';

async function run() {
  console.log('=== STARTING API VERIFICATION TEST ===');
  try {
    // 1. Login as user@app.com
    console.log('Logging in as user@app.com...');
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      email: 'user@app.com',
      password: 'password123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed: ' + JSON.stringify(loginResponse.data));
    }

    const { access_token, investor } = loginResponse.data.data;
    console.log('Login successful! Token acquired.');
    console.log('Investor details:', investor);

    const authHeader = `Bearer ${access_token}`;

    // 2. Fetch Equity Holdings
    console.log('\nFetching Equity Holdings...');
    const holdingsResponse = await axios.get('http://localhost:3001/holdings', {
      headers: { Authorization: authHeader }
    });
    console.log('Holdings count:', holdingsResponse.data.data?.length);
    console.log('Holdings sample:', holdingsResponse.data.data);

    // 3. Fetch Equity Transactions
    console.log('\nFetching Equity Transactions...');
    const transactionsResponse = await axios.get('http://localhost:3001/transactions', {
      headers: { Authorization: authHeader }
    });
    console.log('Transactions count:', transactionsResponse.data.data?.length);
    console.log('Transactions sample:', transactionsResponse.data.data);

    // 4. Fetch Wealth Portfolio Summary (Breakdown)
    console.log('\nFetching Wealth Portfolio Summary...');
    const wealthResponse = await axios.get('http://localhost:5000/api/wealth/portfolio/summary', {
      headers: { Authorization: authHeader }
    });
    console.log('Wealth response success:', wealthResponse.data.success);
    console.log('Total Wealth calculated:', wealthResponse.data.data?.totalWealth);
    console.log('Wealth details:', JSON.stringify(wealthResponse.data.data, null, 2));

    // 5. Fetch Wealth All Transactions
    console.log('\nFetching Wealth All Transactions...');
    const wealthTxResponse = await axios.get('http://localhost:5000/api/wealth/all-transactions', {
      headers: { Authorization: authHeader }
    });
    console.log('Wealth transactions success:', wealthTxResponse.data.success);
    console.log('MF Transactions count:', wealthTxResponse.data.data?.mutualFundTransactions?.length);
    console.log('Equity Transactions count:', wealthTxResponse.data.data?.equityTransactions?.length);

    console.log('\n=== ALL API TESTS PASSED SUCCESSFULLY! ===');
  } catch (error: any) {
    console.error('\n=== API VERIFICATION TEST FAILED ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

run();
