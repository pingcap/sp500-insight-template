
import {RowDataPacket} from 'mysql2/promise';
import {getConnection, Symbol} from './base';

export function getSymbols(): Promise<Symbol[]> {
    return new Promise((resolve, reject) => {
      getConnection().then(connection => {
        connection.query(
            `SELECT stock_symbol, created_date, updated_date
            FROM user_selected_symbol
            ORDER BY created_date`
        ).catch(err => {
          console.error(err);
          reject(err);
        }).then((results) => {
          let rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
          let symbols = rows.map(row => ({
              symbol: row.stock_symbol,
              createdDate: new Date(Date.parse(row.created_date)),
              updatedDate: new Date(Date.parse(row.updated_date))
            })
          );
          resolve(symbols);
        });
      })
    });
}

export function addSymbol(symbol: string) {
    getConnection().then(connection => {
        connection.query(
            `INSERT INTO user_selected_symbol (stock_symbol, created_date, updated_date) 
            VALUES (?, NOW(), NOW())`, [symbol]
        );
    });
}

export function deleteSymbol(symbol: string) {
    getConnection().then(connection => {
        connection.query(`DELETE FROM user_selected_symbol WHERE stock_symbol = ?`, [symbol])
        .then(() => {
            connection.query(`DELETE FROM user_selected_stocks WHERE symbol = ?`, [symbol]);
        })
    });
}

function getOldestSymbol(): Promise<Symbol> {
    return new Promise((resolve, reject) => {
      getConnection().then(connection => {
        connection.query(
            `SELECT * FROM user_selected_symbol ORDER BY updated_date LIMIT 1`
        ).catch(err => {
          console.error(err);
          reject(err);
        }).then((results) => {
          let rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
          let symbol = rows.map(row => ({
                symbol: row.stock_symbol,
                createdDate: new Date(Date.parse(row.created_date)),
                updatedDate: new Date(Date.parse(row.updated_date))
            })
          );
          if (!symbol || symbol.length == 0) {
            reject("can not get oldest symbol");
          }
          resolve(symbol[0]);
        });
      })
    });
}

function getNearestUpdateTimeDiff(): Promise<Number> {
    return new Promise((resolve, reject) => {
      getConnection().then(connection => {
        connection.query(
            `SELECT NOW() as now, updated_date as nearest
             FROM user_selected_symbol
             ORDER BY updated_date DESC
             LIMIT 1`
        ).catch(err => {
          console.error(err);
          reject(err);
        }).then((results) => {
          let rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
          let timediff = rows.map(row =>
            Date.parse(row.now) - Date.parse(row.nearest)
          );
          if (!timediff || timediff.length == 0) {
            reject("can not get newest symbol");
          }
          resolve(timediff[0]);
        });
      })
    });
}

export function updateOldestSymbol(): Promise<Symbol> {
    return new Promise((resolve, reject) => {
        // if nearest updated timediff (ms) less than 20s, do not update
        getNearestUpdateTimeDiff().then(timediff => {
            console.log(timediff);

            if (timediff < 1000 * 20) {
                reject("nearest updated timediff less than 20s");
                return;
            }
        });

        getOldestSymbol().then(oldestSymbol => {
            getConnection().then(connection => {
                connection.query(
                    `UPDATE user_selected_symbol SET updated_date = NOW() WHERE stock_symbol = ?`, [oldestSymbol.symbol]
                ).then(() => {
                    resolve(oldestSymbol);
                }).catch(err => {
                    console.error(err);
                    reject(err);
                });
            });
        });
    });
}