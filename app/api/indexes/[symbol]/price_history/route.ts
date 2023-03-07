import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import {NextResponse} from "next/server";

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const querySQL = `
SELECT record_date, price
FROM index_price_history
WHERE
    index_symbol = ?
    -- TODO: remove
    AND record_date > DATE_SUB(NOW(), INTERVAL 3 MONTH)
ORDER BY record_date DESC
`;

const getPriceHistory = async (symbol: string) => {
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
  const result = await getPriceHistory(symbol as string);
  return NextResponse.json(result);
}
