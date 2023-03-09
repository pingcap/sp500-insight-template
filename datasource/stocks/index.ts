import { DateTime } from 'luxon';
import { QueryResult } from '@/datasource/query';
import { conn } from '@/datasource/conn';

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
    sql: querySQL,
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
