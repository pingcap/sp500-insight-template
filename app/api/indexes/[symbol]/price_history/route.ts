import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import { NextRequest, NextResponse, URLPattern } from 'next/server';
import URL from 'node:url';

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

type N = number | 'current';
type Unit = 'DAY' | 'MONTH' | 'YEAR'

const querySQLWithUnit = (n: number, unit: Unit) => `
    WITH max_date as (SELECT max(record_date) date from index_price_history)
    SELECT record_date, price
    FROM index_price_history
    WHERE index_symbol = ?
      AND record_date > DATE_SUB((select date from max_date), INTERVAL ${n} ${unit})
    ORDER BY record_date DESC
`;

const querySQLWithCurrentYear = `
WITH max_date as (SELECT max(record_date) date from index_price_history)
SELECT record_date, price
FROM index_price_history
WHERE index_symbol = ?
  AND YEAR(record_date) = YEAR((select date from max_date))
ORDER BY record_date DESC;
`;


const getPriceHistory = async (symbol: string, n: number | 'CURRENT' ,unit: Unit) => {
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
  const url = new URL.URL(req.url)
  const { symbol } = params;
  const duration = url.searchParams.get('duration') ?? '6M'
  let n: number | 'CURRENT';
  let unit: Unit;
  const matched = duration.match(/^(\d)([YM])$/)
  if (!matched) {
    unit = 'YEAR';
    if (duration === 'YTD') {
      n = 'CURRENT';
    } else if (duration === 'MAX') {
      n = 150;
    } else {
      n = 1;
    }
  } else {
    const [, nValue, unitValue] = matched
    n = parseInt(nValue);
    unit = unitValue === 'Y' ? 'YEAR' : 'MONTH';
  }
  const result = await getPriceHistory(symbol as string, n, unit);
  return NextResponse.json(result);
}
