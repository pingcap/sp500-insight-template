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
  const opt: any = {}

  if (TIDB_HOST && TIDB_PORT && TIDB_USER && TIDB_PASSWORD) {
    opt.user = TIDB_USER;
    opt.host = TIDB_HOST;
    opt.password = TIDB_PASSWORD;
    opt.port = parseInt(TIDB_PORT);
    opt.database = 'sp500insight';
  } else {
    opt.uri = process.env.DATABASE_URL || 'mysql://root:@localhost:4000/sp500insight';
  }

  return createConnection({
    ...opt,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    },
    timezone: 'Z',
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