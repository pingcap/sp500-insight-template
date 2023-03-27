import { RowDataPacket } from 'mysql2/promise';
import { Stock, withAutoreleaseConnection } from './base';

export async function insertStocks (stocks: Stock[]) {
  await withAutoreleaseConnection(async connection => {
    await connection.query(
      `INSERT INTO user_selected_stocks (symbol, time, high, low, open, close, volume)
       VALUES ?
       ON DUPLICATE KEY UPDATE high=VALUES(high),
                               low=VALUES(low),
                               open=VALUES(open),
                               close=VALUES(close),
                               volume=VALUES(volume)`,
      [stocks.map(stock =>
        [stock.symbol, stock.time, stock.high, stock.low, stock.open, stock.close, stock.volume]),
      ],
    );
  });
}

export async function getStocks (symbol: string): Promise<Stock[]> {
  return withAutoreleaseConnection(async connection => {
    const results = await connection.query(
      `SELECT *
       FROM user_selected_stocks
       WHERE symbol = ?
       ORDER BY time`,
      [symbol]);
    const rows = (results as RowDataPacket[][])[0];
    return rows.map(
      row => ({
        symbol: row.symbol,
        time: row.time,
        high: row.high,
        low: row.low,
        open: row.open,
        close: row.close,
        volume: row.volume,
      }));
  });
}
