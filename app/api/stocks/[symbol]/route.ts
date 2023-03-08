import { DateTime } from 'luxon';
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const querySQL = `
    SELECT stock_symbol,
           short_name,
           long_name,
           long_business_summary,
           sector,
           industry,
           city,
           state,
           country,
           full_time_employees,
           market_cap,
           revenue_growth,
           ebitda
    FROM companies
    WHERE stock_symbol = ?
    ;
`;

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export async function getStockInfo (symbol: string) {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(querySQL, [symbol]);
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  };
}

export async function GET (req: Request, { params }: any) {
  const { symbol } = params;
  const result = await getStockInfo(symbol as string);
  return NextResponse.json(result);
}
