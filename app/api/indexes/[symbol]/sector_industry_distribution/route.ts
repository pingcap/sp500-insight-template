import mysql from 'mysql2/promise';
import { DateTime } from "luxon";
import {NextResponse} from "next/server";

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const querySQL = `
    with today_prices as (select *
                          from stock_price_history
                          where record_date = (select max(record_date) from stock_price_history))
    select industry, sector, ic.stock_symbol, weight, SIGN(tp.close - tp.open) as trend
    from index_compositions ic
             left join companies c on ic.stock_symbol = c.stock_symbol
             left join today_prices tp on c.stock_symbol = tp.stock_symbol
    where ic.index_symbol = ?;
`;

const getSectorIndustryList = async (symbol: string) => {
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
  const result = await getSectorIndustryList(symbol as string);
  return NextResponse.json(result);
}
