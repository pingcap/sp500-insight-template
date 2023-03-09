import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import {NextRequest, NextResponse} from "next/server";

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const querySQL = `
WITH index_companies AS (
    SELECT
        c.stock_symbol,
        c.short_name,
        c.exchange_symbol
    FROM companies c
    WHERE c.stock_symbol IN (
        SELECT stock_symbol FROM user_selected_stocks WHERE user_id = ?
    )
), companies_latest_price AS (
    SELECT
        stock_symbol, DATE(last_day) AS last_change_day, last_close_price, last_2nd_close_price, (last_close_price - last_2nd_close_price) / last_2nd_close_price AS last_change_percentage
    FROM (
    SELECT
      LAST_VALUE(stock_symbol) OVER (PARTITION BY stock_symbol ORDER BY record_date) AS stock_symbol,
      LAST_VALUE(record_date) OVER (PARTITION BY stock_symbol ORDER BY record_date) AS last_day,
      NTH_VALUE(close, 1) OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS last_close_price,
      NTH_VALUE(close, 2) OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS last_2nd_close_price,
      ROW_NUMBER() OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS row_num
      FROM stock_price_history sph
    WHERE
       record_date > DATE_SUB((SELECT MAX(record_date) FROM stock_price_history), INTERVAL 2 DAY)
        AND sph.stock_symbol IN (SELECT stock_symbol FROM index_companies ic)
    ) sub
    WHERE
        row_num = 2
)
SELECT
    ic.stock_symbol,
    ic.exchange_symbol,
    ic.short_name,
    clp.last_change_day,
    clp.last_close_price,
    clp.last_2nd_close_price,
    clp.last_change_percentage
FROM index_companies ic
LEFT JOIN companies_latest_price clp ON ic.stock_symbol = clp.stock_symbol
`;

export const getUserSelectedStocks = async (userId: number) => {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(querySQL, [userId]);
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  }
}

export async function GET(req: Request, { params }: any) {
  const userId = 1;
  const result = await getUserSelectedStocks(userId);
  return NextResponse.json(result);
}

const insertSQL = `
INSERT INTO user_selected_stocks (user_id, stock_symbol, created_date)
VALUES (?, ?, ?)
`;

const insertUserSelectedStocks = async (userId: number, stockSymbol: string) => {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(insertSQL, [userId, stockSymbol, DateTime.now().toSQL()]);
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { stockSymbol } = body;
  const result = await insertUserSelectedStocks(1, stockSymbol);
  return NextResponse.json(result);
}

const deleteSQL = `
DELETE FROM user_selected_stocks WHERE user_id = ? AND stock_symbol = ?
`;

const deleteUserSelectedStocks = async (userId: number, stockSymbol: string) => {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(deleteSQL, [userId, stockSymbol]);
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  }
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { stockSymbol } = body;
  const result = await deleteUserSelectedStocks(1, stockSymbol);
  return NextResponse.json(result);
}