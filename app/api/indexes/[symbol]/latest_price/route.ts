import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import {NextResponse} from "next/server";

const conn = mysql.createPool({
   uri: process.env.DATABASE_URL,
});

const querySQL = `
WITH last_1st_price AS (
    SELECT record_date, price
    FROM index_price_history
    WHERE
        index_symbol = ?
        -- TODO: remove
        AND record_date > DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ORDER BY record_date DESC
    LIMIT 1
), last_2nd_price AS (
    SELECT record_date, price
    FROM index_price_history
    WHERE
        index_symbol = ?
        -- TODO: remove
        AND record_date > DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ORDER BY record_date DESC
    LIMIT 1, 1
)
SELECT
    l1p.record_date AS last_updated_at,
    l1p.price AS last_1st_price,
    l2p.price AS last_2nd_price,
    ((l1p.price - l2p.price) / l2p.price) AS last_changes 
FROM
    last_1st_price l1p, last_2nd_price l2p
`;

const getIndexLatestPrice = async (symbol: string) => {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>(querySQL, [symbol, symbol]);
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
  const result = await getIndexLatestPrice(symbol as string);
  return NextResponse.json(result);
}