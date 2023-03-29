import { Connection, createConnection } from 'mysql2/promise';

export interface Stock {
  symbol: string;
  time: string;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}

export interface Symbol {
  symbol: string;
  createdDate: Date;
  updatedDate: Date;
}

function getConnection (): Promise<Connection> {
  return createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:4000/sp500insight'
  });
}

export async function withAutoreleaseConnection<T> (run: (conn: Connection) => Promise<T>, hasTransaction = false): Promise<T> {
  const conn = await getConnection();
  try {
    return await run(conn);
  } catch (e) {
    if (hasTransaction) {
      await conn.rollback();
    }
    throw e;
  } finally {
    if (hasTransaction) {
      await conn.commit();
    }
    conn.destroy();
  }
}