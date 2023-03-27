import { Connection, RowDataPacket } from 'mysql2/promise';
import { Symbol, withAutoreleaseConnection } from './base';

export function getSymbols (): Promise<Symbol[]> {
  return withAutoreleaseConnection(async connection => {
    const results = await connection.query(
      `SELECT stock_symbol, created_date, updated_date
       FROM user_selected_symbol
       ORDER BY created_date`,
    );
    let rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
    return rows.map(row => ({
        symbol: row.stock_symbol,
        createdDate: new Date(Date.parse(row.created_date)),
        updatedDate: new Date(Date.parse(row.updated_date)),
      }),
    );
  });

}

export async function addSymbol (symbol: string) {
  await withAutoreleaseConnection(async connection => {
    await connection.query(
      `INSERT INTO user_selected_symbol (stock_symbol, created_date, updated_date)
       VALUES (?, NOW(), NOW())`, [symbol],
    );
  });
}

export async function deleteSymbol (symbol: string) {
  await withAutoreleaseConnection(async connection => {
    await connection.query(`DELETE
                            FROM user_selected_symbol
                            WHERE stock_symbol = ?`, [symbol]);
    await connection.query(`DELETE
                            FROM user_selected_stocks
                            WHERE symbol = ?`, [symbol]);
  });
}

async function getOldestSymbol (connection: Connection): Promise<Symbol> {
  const results = await connection.query(
    `SELECT *
     FROM user_selected_symbol
     ORDER BY updated_date
     LIMIT 1`,
  );
  const rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
  if (!rows || rows.length == 0) {
    throw new Error('can not get oldest symbol');
  }
  const symbol = rows.map(row => ({
      symbol: row.stock_symbol,
      createdDate: new Date(Date.parse(row.created_date)),
      updatedDate: new Date(Date.parse(row.updated_date)),
    }),
  );
  return symbol[0];
}

async function getNearestUpdateTimeDiff (connection: Connection): Promise<Number> {
  const results = await connection.query(
    `SELECT NOW() AS now, updated_date AS nearest
     FROM user_selected_symbol
     ORDER BY updated_date DESC
     LIMIT 1`,
  );
  const rows: RowDataPacket[] = (results as RowDataPacket[][])[0];
  const timediff = rows.map(row =>
    Date.parse(row.now) - Date.parse(row.nearest),
  );
  if (!timediff || timediff.length == 0) {
    throw new Error('can not get newest symbol');
  }
  return timediff[0];
}

export function updateOldestSymbol (): Promise<Symbol> {
  return withAutoreleaseConnection(async connection => {
    const timediff = await getNearestUpdateTimeDiff(connection);
    console.log(timediff);
    if (timediff < 1000 * 20) {
      throw new Error('nearest updated timediff less than 20s');
    }

    const oldestSymbol = await getOldestSymbol(connection);
    await connection.query(
      `UPDATE user_selected_symbol
       SET updated_date = NOW()
       WHERE stock_symbol = ?`, [oldestSymbol.symbol],
    );
    return oldestSymbol;
  });
}