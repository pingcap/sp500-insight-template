import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import {NextResponse} from "next/server";

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const querySQL = `
WITH index_companies AS (
    SELECT
        c.stock_symbol,
        c.short_name,
        c.exchange_symbol,
        ic.weight
    FROM companies c
    JOIN index_compositions ic ON c.stock_symbol = ic.stock_symbol
    WHERE index_symbol = ?
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
    ic.weight,
    clp.last_change_day,
    clp.last_close_price,
    clp.last_2nd_close_price,
    clp.last_change_percentage
FROM index_companies ic
LEFT JOIN companies_latest_price clp ON ic.stock_symbol = clp.stock_symbol
ORDER BY ic.weight DESC
`;

const getCompositionList = async (symbol: string) => {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(querySQL, [symbol]);
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
  const { symbol } = params;
  const result = await getCompositionList(symbol as string);
  return NextResponse.json(result);
}
