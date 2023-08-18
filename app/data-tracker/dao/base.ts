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
  const { TIDB_HOST, TIDB_PORT, TIDB_USER, TIDB_PASSWORD } = process.env;

  let databaseUrl: string | undefined;
  if (TIDB_HOST && TIDB_PORT && TIDB_USER && TIDB_PASSWORD) {
    databaseUrl = `mysql://${TIDB_USER}:${encodeURIComponent(TIDB_PASSWORD)}@${TIDB_HOST}:${TIDB_PORT}/sp500insight?timezone=Z`
  } else {
    databaseUrl = process.env.DATABASE_URL;
  }

  return createConnection({
    uri: databaseUrl || 'mysql://root:@localhost:4000/sp500insight',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
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