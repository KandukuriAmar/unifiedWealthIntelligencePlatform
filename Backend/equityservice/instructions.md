# equityservice - Complete Setup and Postman Testing Guide

## 1) Project Setup

1. Open terminal in `Backend/equityservice`.
2. Confirm Node.js 18+ is installed:

```bash
node -v
npm -v
```

## 2) Install Dependencies

Run:

```bash
npm install
```

Installed core packages:
- express
- sequelize
- pg
- pg-hstore
- jsonwebtoken
- dotenv
- cors
- morgan
- cookie-parser
- express-validator
- @supabase/supabase-js

## 3) .env Configuration

Create/update `.env` file in project root:

```env
PORT=3000

SUPABASE_URL=https://nrayfiqwxsndrtuymenj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_W4Q3YTqumNZpGuEZ_6GasA_CWwI9W5x

JWT_SECRET=

DATABASE_URL=
```

Notes:
- Preferred: Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Supabase client mode).
- Optional: You can directly set `DATABASE_URL` if using direct PostgreSQL mode.

## 4) How to Run Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Health check:

```http
GET http://localhost:3000/health
```

## 5) How to Connect Supabase

1. Open Supabase project dashboard.
2. Go to `Settings > Database`.
3. Keep `SUPABASE_URL` as your project URL.
4. Keep `SUPABASE_ANON_KEY` as your publishable key.
5. `DATABASE_URL` can stay empty when using Supabase client mode.
6. Ensure schema tables exist:
   - equity_users
   - equity_holdings
   - equity_transactions
   - equity_watchlist
   - equity_market_prices
   - equity_refresh_tokens

## 6) API Endpoint List

Base URL:

```text
http://localhost:3000
```

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/logout

Holdings (Protected):
- GET /holdings
- GET /holdings/:id

Transactions (Protected):
- GET /transactions
- POST /transactions/buy
- POST /transactions/sell

Watchlist (Protected):
- GET /watchlist
- POST /watchlist
- DELETE /watchlist/:id

Market (Public):
- GET /market/prices
- GET /market/prices/:symbol

## 7) Postman API Cheat Sheet

Use this base URL in Postman:

```text
http://localhost:3000
```

For protected APIs, add this header:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

### Auth APIs

#### POST /auth/register

Purpose: Register a new investor.

Headers:
- Content-Type: application/json

Body:

```json
{
  "full_name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "pan_number": "ABCDE1234F",
  "demat_account": "1201234512345678",
  "password": "rahul@123"
}
```

Note: `investor_id` is generated automatically by the backend. Do not send it in Postman.

Example response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "<ACCESS_TOKEN>",
    "user": {
      "investor_id": "INV1001",
      "full_name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "pan_number": "ABCDE1234F",
      "demat_account": "1201234512345678",
      "created_at": "2026-05-19T10:00:00.000Z"
    }
  }
}
```

#### POST /auth/login

Purpose: Login with email and password.

Headers:
- Content-Type: application/json

Body:

```json
{
  "email": "rahul.sharma@example.com",
  "password": "rahul@123"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "<ACCESS_TOKEN>",
    "refresh_token": "<REFRESH_TOKEN>",
    "investor": {
      "investor_id": "INV1001",
      "full_name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "pan_number": "ABCDE1234F",
      "demat_account": "1201234512345678",
      "created_at": "2026-05-19T10:00:00.000Z"
    }
  }
}
```

#### POST /auth/logout

Purpose: Invalidate refresh token.

Headers:
- Content-Type: application/json

Body:

```json
{
  "refresh_token": "<REFRESH_TOKEN_FROM_LOGIN>"
}
```

Example response:

```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "invalidated": true
  }
}
```

### Holdings APIs

#### GET /holdings

Purpose: Get all holdings for the logged-in investor.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>

Body: None

#### GET /holdings/:id

Purpose: Get all holdings for the given investor ID.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>

Path parameter:
- id: investor_id such as `INV1001`

Body: None

Example request:

```text
GET /holdings/INV1001
```

Example response:

```json
{
  "success": true,
  "message": "Holdings fetched successfully",
  "data": [
    {
      "id": 1,
      "investor_id": "INV1001",
      "stock_symbol": "RELIANCE",
      "quantity": "50.00",
      "avg_buy_price": "2700.00",
      "current_market_price": "2850.50",
      "exchange": "NSE",
      "updated_at": "2026-05-19T10:00:00.000Z"
    },
    {
      "id": 2,
      "investor_id": "INV1001",
      "stock_symbol": "TCS",
      "quantity": "30.00",
      "avg_buy_price": "3600.00",
      "current_market_price": "3850.00",
      "exchange": "NSE",
      "updated_at": "2026-05-19T10:00:00.000Z"
    }
  ]
}
```

Example request:

```text
GET /holdings/1
```

### Transactions APIs

#### GET /transactions

Purpose: Get all transactions for logged-in investor.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>

Body: None

#### POST /transactions/buy

Purpose: Buy a stock and create/update holdings.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>
- Content-Type: application/json

Body:

```json
{
  "stock_symbol": "TCS",
  "quantity": 5,
  "price": 3900,
  "exchange": "NSE"
}
```

Important behavior:
- Creates a BUY transaction
- Creates a new holding if it does not exist
- Updates quantity and average buy price if holding already exists

#### POST /transactions/sell

Purpose: Sell a stock and update holdings.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>
- Content-Type: application/json

Body:

```json
{
  "stock_symbol": "TCS",
  "quantity": 2,
  "price": 4100,
  "exchange": "NSE"
}
```

Important behavior:
- Validates enough quantity exists
- Calculates realized gain
- Updates or removes holding
- Creates a SELL transaction

### Watchlist APIs

#### GET /watchlist

Purpose: Get logged-in investor watchlist.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>

Body: None

#### POST /watchlist

Purpose: Add a stock to watchlist.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>
- Content-Type: application/json

Body:

```json
{
  "stock_symbol": "INFY"
}
```

#### DELETE /watchlist/:id

Purpose: Remove one watchlist item.

Headers:
- Authorization: Bearer <ACCESS_TOKEN>

Path parameter:
- id: watchlist numeric ID

Body: None

Example request:

```text
DELETE /watchlist/1
```

### Market APIs

#### GET /market/prices

Purpose: Get all market prices.

Headers:
- None

Body: None

#### GET /market/prices/:symbol

Purpose: Get one market price by stock symbol.

Headers:
- None

Path parameter:
- symbol: stock symbol like TCS, INFY, RELIANCE

Body: None

Example request:

```text
GET /market/prices/TCS
```

## 8) Example Request Bodies

Use these same request bodies in Postman when testing the APIs above.

Register:

```json
{
  "investor_id": "INV1001",
  "full_name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "pan_number": "ABCDE1234F",
  "demat_account": "1201234512345678",
  "password": "rahul@123"
}
```

Login:

```json
{
  "email": "rahul.sharma@example.com",
  "password": "rahul@123"
}
```

Logout:

```json
{
  "refresh_token": "<REFRESH_TOKEN_FROM_LOGIN>"
}
```

Buy:

```json
{
  "stock_symbol": "TCS",
  "quantity": 5,
  "price": 3900,
  "exchange": "NSE"
}
```

Sell:

```json
{
  "stock_symbol": "TCS",
  "quantity": 2,
  "price": 4100,
  "exchange": "NSE"
}
```

Add watchlist:

```json
{
  "stock_symbol": "INFY"
}
```

## 9) Example Tokens

Access token example:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.access.token
```

Refresh token example:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.refresh.token
```

Use access token in protected APIs:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

## 10) Example Responses

Login success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "investor": {
      "investor_id": "INV1001",
      "full_name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "pan_number": "ABCDE1234F",
      "demat_account": "1201234512345678",
      "created_at": "2026-05-19T10:00:00.000Z"
    }
  }
}
```

Invalid credentials:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "msg": "Valid email is required",
        "path": "email"
      }
    ]
  }
}
```

## 11) Authentication Testing Flow (Postman)

1. Call `POST /auth/register`.
2. Call `POST /auth/login`.
3. Copy `access_token` and `refresh_token`.
4. Set bearer token in Postman Authorization tab.
5. Call protected routes (`/holdings`, `/transactions`, `/watchlist`).
6. Call `POST /auth/logout` with refresh token.
7. Confirm logout success response.

## 12) Buy/Sell Testing Flow (Postman)

1. Login and keep access token.
2. Call `POST /transactions/buy` for a symbol.
3. Call `GET /holdings` to verify holding created/updated.
4. Call another `POST /transactions/buy` with same symbol to verify average price recalculation.
5. Call `POST /transactions/sell` with lower quantity than holdings.
6. Call `GET /transactions` to verify SELL transaction and realized gain.
7. Call `GET /holdings` to verify reduced quantity.

## 13) Watchlist Testing Flow (Postman)

1. Login with valid user.
2. Call `POST /watchlist` with `stock_symbol`.
3. Call `GET /watchlist` to verify item is present.
4. Copy watchlist item `id`.
5. Call `DELETE /watchlist/:id`.
6. Call `GET /watchlist` again to confirm removal.

## 14) Full Postman Testing Steps (Suggested Order)

1. `GET /health`
2. `POST /auth/register`
3. `POST /auth/login`
4. `GET /market/prices`
5. `GET /market/prices/TCS`
6. `POST /transactions/buy`
7. `GET /holdings`
8. `GET /holdings/:id`
9. `GET /transactions`
10. `POST /transactions/sell`
11. `POST /watchlist`
12. `GET /watchlist`
13. `DELETE /watchlist/:id`
14. `POST /auth/logout`

## 14) Common Errors and Fixes

1. Error: `JWT_SECRET is not configured`
   - Fix: Add `JWT_SECRET` in `.env` and restart server.

2. Error: `Database configuration missing`
  - Fix: Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env` (or set `DATABASE_URL` directly).

3. Error: `Invalid credentials`
   - Fix: Verify email and password exactly match registered values.

4. Error: `Insufficient quantity to sell`
   - Fix: Sell quantity should not exceed holding quantity.

5. Error: `Stock already exists in watchlist`
   - Fix: Add each stock symbol only once per investor.

6. Error: `Validation failed`
   - Fix: Check request body fields and formats.

7. Error: `Route not found`
   - Fix: Verify HTTP method and endpoint path.

---

This backend is built with strict MVC, modular routes, service layer business logic, request validation, centralized error handling, JWT auth, refresh token storage, and Supabase PostgreSQL via Sequelize.