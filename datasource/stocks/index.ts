import { DateTime } from 'luxon';
import { QueryResult } from '@/datasource/query';
import { conn } from '@/datasource/conn';

const infoSQL = `
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

export type CompanyInfo = {
  stock_symbol: string
  short_name: string
  long_name: string
  long_business_summary: string
  sector: string
  industry: string
  city: string
  state: string
  country: string
  full_time_employees: number
  market_cap: number
  revenue_growth: number
  ebitda: number
}

export const getStockInfo = async function getStockInfo (symbol: string): Promise<QueryResult<CompanyInfo>> {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>({
    sql: infoSQL,
    values: [symbol],
  });
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  };
}

export type StockSummary = {
  stock_symbol: string
  last_change_day: Date
  last_close_price: number
  last_2nd_close_price: number
  last_change_percentage: number
  short_name: string
  exchange_symbol: string
}


const summarySQL = `
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
            AND sph.stock_symbol = ?) sub
    WHERE row_num = 2
`;


export const getStockSummary = async function getStockSummary (symbol: string): Promise<QueryResult<StockSummary>> {
  const queryStart = DateTime.now();
  const [rows] = await conn.query<any[]>({
    sql: summarySQL,
    values: [symbol],
  });
  const queryEnd = DateTime.now();
  const queryCost = queryEnd.diff(queryStart).as('seconds');

  return {
    rows,
    queryStart,
    queryEnd,
    queryCost,
  };
}
