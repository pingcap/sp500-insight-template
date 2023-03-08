import mysql from 'mysql2/promise';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';

const querySQL = `
    SELECT stock_symbol,
           DATE(last_day)                                                   AS last_change_day,
           last_close_price,
           last_2nd_close_price,
           (last_close_price - last_2nd_close_price) / last_2nd_close_price AS last_change_percentage,
           short_name,
           exchange_symbol
    FROM (SELECT LAST_VALUE(sph.stock_symbol) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date) AS stock_symbol,
                 LAST_VALUE(record_date) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date)      AS last_day,
                 NTH_VALUE(close, 1) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)     AS last_close_price,
                 NTH_VALUE(close, 2) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)     AS last_2nd_close_price,
                 ROW_NUMBER() OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)            AS row_num,
                 c.short_name                                                                           as short_name,
                 c.exchange_symbol                                                                      as exchange_symbol
          FROM stock_price_history sph
                   left join companies c on sph.stock_symbol = c.stock_symbol
          WHERE record_date > DATE_SUB((SELECT MAX(record_date) FROM stock_price_history), INTERVAL 2 DAY)
            AND sph.stock_symbol = 'AAPL') sub
    WHERE row_num = 2
`;

const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export async function getStockSummary (symbol: string) {
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
  const result = await getStockSummary(symbol as string);
  return NextResponse.json(result);
}
