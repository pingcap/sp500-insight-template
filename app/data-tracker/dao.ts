import {createConnection, Connection, RowDataPacket} from 'mysql2';

export interface Stock {
    symbol: string;
    time: string;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
}

function getConnection(): Connection {
    return createConnection({
        host: process.env.TIDB_SERVER_HOST,
        port: parseInt(process.env.TIDB_SERVER_PORT || '4000'),
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true
        }
    });
}

function createTableIfNotExists(callback: Function) {
    getConnection().execute(`
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
        `
    , (err) => {
        if (err) {
            console.error(err);
            return;
        }
        callback();
    })
}

export function insertStocks(stocks: Stock[]) {
    createTableIfNotExists(() => {
        getConnection().query(
            `INSERT INTO stocks (symbol, time, high, low, open, close, volume) VALUES ?
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
      getConnection().query<RowDataPacket[]>(
        `SELECT * FROM stocks WHERE symbol = ? ORDER BY time`,
        [symbol],
        (err, results) => {
          let stocks: Stock[] = [];
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          results.forEach((row: any) => {
            stocks.push({
              symbol: row.symbol,
              time: row.time,
              high: row.high,
              low: row.low,
              open: row.open,
              close: row.close,
              volume: row.volume
            });
          });
          resolve(stocks);
        }
      );
    });
}

export function getSymbols(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    getConnection().query<RowDataPacket[]>(
      `SELECT DISTINCT symbol FROM stocks`,
      (err, results) => {
        let symbols: string[] = [];
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        results.forEach((row: any) => {
          symbols.push(row.symbol);
        });
        resolve(symbols);
      }
    );
  });
}