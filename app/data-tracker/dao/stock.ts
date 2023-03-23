import {RowDataPacket} from 'mysql2/promise';
import {getConnection, Stock} from './base';

export function insertStocks(stocks: Stock[]) {
  getConnection().then(connection => {
    connection.query(
        `INSERT INTO user_selected_stocks (symbol, time, high, low, open, close, volume) VALUES ?
        ON DUPLICATE KEY UPDATE high=VALUES(high), low=VALUES(low),
        open=VALUES(open), close=VALUES(close), volume=VALUES(volume)`,
        [stocks.map(stock =>
            [stock.symbol, stock.time, stock.high, stock.low, stock.open, stock.close, stock.volume])
        ]
    );
  });
}

export function getStocks(symbol: string): Promise<Stock[]> {
    return new Promise((resolve, reject) => {
      getConnection().then(connection => {
        connection.query(
          `SELECT * FROM user_selected_stocks WHERE symbol = ? ORDER BY time`,
          [symbol])
          .catch(err => {
            console.error(err);
            reject(err);
          })
          .then(
            results => {
              let rows = (results as RowDataPacket[][])[0];
              let stocks = rows.map(
                row => ({
                  symbol: row.symbol,
                  time: row.time,
                  high: row.high,
                  low: row.low,
                  open: row.open,
                  close: row.close,
                  volume: row.volume
                })
              );
              resolve(stocks);
            }
          );
      })
    });
}
