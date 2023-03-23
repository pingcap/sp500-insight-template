import {createConnection, Connection, RowDataPacket} from 'mysql2/promise';

export interface Stock {
    symbol: string;
    time: string;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
}

function getConnection(): Promise<Connection> {
    return createConnection(process.env.DATABASE_URL || "mysql://root:@localhost:4000/sp500insight");
}

function createTableIfNotExists(callback: Function) {
    getConnection().then(connection => {
      connection.execute(`
        CREATE TABLE IF NOT EXISTS stocks (
            symbol varchar(20) NOT NULL COMMENT 'Stock Symbol',
            time datetime NOT NULL COMMENT 'Stock Time',
            high decimal(10,4) NOT NULL DEFAULT 0 COMMENT 'Stock High',
            low  decimal(10,4) NOT NULL DEFAULT 0 COMMENT 'Stock Low',
            open decimal(10,4) NOT NULL DEFAULT 0 COMMENT 'Stock Open',
            close decimal(10,4) NOT NULL DEFAULT 0 COMMENT 'Stock Close',
            volume int(11) NOT NULL DEFAULT 0 COMMENT 'Stock Volume',
            PRIMARY KEY (symbol, time) /*T![clustered_index] CLUSTERED */
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='The information of stocks';
        `)
        .catch(err => console.error(err))
        .then(() => callback());
    });
}

export function insertStocks(stocks: Stock[]) {
    createTableIfNotExists(() => {
        getConnection().then(connection => {
          connection.query(
              `INSERT INTO stocks (symbol, time, high, low, open, close, volume) VALUES ?
              ON DUPLICATE KEY UPDATE high=VALUES(high), low=VALUES(low),
              open=VALUES(open), close=VALUES(close), volume=VALUES(volume)`,
              [stocks.map(stock =>
                  [stock.symbol, stock.time, stock.high, stock.low, stock.open, stock.close, stock.volume])
              ]
          );
        })
    });
}

export function getStocks(symbol: string): Promise<Stock[]> {
    return new Promise((resolve, reject) => {
      getConnection().then(connection => {
        connection.query(
          `SELECT * FROM stocks WHERE symbol = ? ORDER BY time`,
          [symbol])
          .catch(err => {
            console.error(err);
            reject(err);
          })
          .then(
            results => {
              let stocks = (results as RowDataPacket[]).map(
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

export function getSymbols(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    getConnection().then(connection => {
      connection.query(
        `SELECT DISTINCT symbol FROM stocks`
      ).catch(err => {
        console.error(err);
        reject(err);
      }).then((results) => {
        let symbols = (results as RowDataPacket[]).map(row => row.symbol);
        resolve(symbols);
      });
    })
  });
}