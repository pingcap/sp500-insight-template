import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from 'next/server';
import { getDurationParams, Unit } from '@/app/api/duration-utils';

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});


const querySQLWithUnit = (n: number, unit: Unit) => `
WITH max_date as (SELECT max(record_date) date from index_price_history)
SELECT
    record_date, open, close, high, low, adj_close
FROM stock_price_history
WHERE
    stock_symbol = ?
  AND record_date > DATE_SUB((select date from max_date), INTERVAL ${n} ${unit})
`;

const querySQLWithCurrentYear = `
WITH max_date as (SELECT max(record_date) date from index_price_history)
SELECT record_date, open, close, high, low, adj_close
FROM stock_price_history
WHERE stock_symbol = ?
  AND YEAR(record_date) = YEAR((select date from max_date))
ORDER BY record_date DESC;
`;

const getStockPriceHistory = async (symbol: string, n: number | 'CURRENT', unit: Unit) => {
  const sql = n === 'CURRENT' ? querySQLWithCurrentYear : querySQLWithUnit(n, unit);
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(sql, [symbol]);
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  }
}

export async function GET(req: NextRequest, { params }: any) {
  const { n, unit } = getDurationParams(req)
  const { symbol } = params;
  const result = await getStockPriceHistory(symbol as string, n, unit);
  return NextResponse.json(result);
}
