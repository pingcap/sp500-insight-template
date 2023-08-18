import {Command} from "commander";
import * as fs from "fs";
import {Connection, ConnectionOptions, createConnection, ResultSetHeader} from "mysql2/promise";
import pino, {Logger} from "pino";
import {parse} from "csv";

const defaultDBOptions: ConnectionOptions = {
  user: 'root',
  password: '',
  port: 4000,
  host: 'localhost',
  database: 'sp500insight',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  timezone: 'Z',
};
const schemaSQLPath = './data/schema.sql';
const SP500_INDEX_SYMBOL = 'SP500';

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

const program = new Command();

program
  .name('dev-util')
  .description('CLI to help developers with ETL tasks')
  .version('0.0.0');

program.command('create-schema')
  .description('Create schema in DB.')
  .action(async (str, options) => {
    const logger = pinoLogger.child({command: 'create-schema'});
    const [conn, database] = await createDBConnection(true);

    // Check if the database exists, if not, create it.
    const databases = await listDatabases(conn);
    const dbExists = databases.some((db) => db.name === database);
    if (dbExists) {
      logger.info(`Database ${database} exists.`);
    } else {
      const rs = await createDatabase(conn, database!);
      logger.info(rs, `Database ${database} created.`);
    }

    await conn.query(`USE ${database};`);
    const sql = fs.readFileSync(schemaSQLPath, 'utf8');
    await conn.query<ResultSetHeader>(sql);
    logger.info(`Schema created in database ${database}.`);
  });

program.command('csv-to-db')
  .description('ETL from csv to DB.')
  .action(async (str, options) => {
    const logger = pinoLogger.child({command: 'csv-to-db'});
    const [conn] = await createDBConnection();

    await importCompanies(conn, logger);
    await importIndex(conn, logger);
    await importIndexPriceHistory(conn, logger);
    await importStockPriceHistory(conn, logger);
  });

program.parse();

// Connect to the database.
async function createDBConnection (ignoreUseDB: boolean = false): Promise<[Connection, string]> {
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

  const dbOptions: ConnectionOptions = {
    ...defaultDBOptions,
    ...opt,
  }
  const database = dbOptions.database;
  const conn = await createConnection({
    ...dbOptions,
    database: ignoreUseDB ? undefined : database,
    multipleStatements: true
  });
  return [conn, database!];
}

function convertURLToOptions(dbURL?: string): ConnectionOptions {
  if (!dbURL) {
    return {};
  }

  const urlSchema = new URL(dbURL);
  return {
    user: urlSchema.username,
    password: urlSchema.password,
    host: urlSchema.hostname,
    port: parseInt(urlSchema.port),
    database: urlSchema.pathname.replace('/', ''),
    ...urlSchema.searchParams
  }
}

async function listDatabases(conn: Connection) {
  const [rows] = await conn.query<any[]>(`SHOW DATABASES;`);
  return rows.map((r) => {
    return {
      name: r.Database,
    }
  });
}

async function createDatabase(conn: Connection, dbName: string) {
  const [rs] = await conn.query<ResultSetHeader>(`CREATE DATABASE ${dbName};`);
  return rs;
}

async function importIndex(conn: Connection, logger: Logger) {
  const [rs] = await conn.query<ResultSetHeader>(`
      INSERT INTO indexes (index_symbol, short_name)
      VALUES ?
      ON DUPLICATE KEY UPDATE index_symbol = VALUES(index_symbol);
  `, [
    [
      [SP500_INDEX_SYMBOL, 'S&P 500']
    ]
  ]);
  logger.info(`%d indexes imported to DB.`, rs.affectedRows);
}

async function importCompanies(conn: Connection, logger: Logger) {
  const stream = fs.createReadStream('./data/sp500/sp500_companies.csv');
  const parser = parse({
    delimiter: ',',
    quote: '"',
    columns: true,
  });
  let companies: any[] = [];

  stream.pipe(parser)
    .on('data', async (row) => {
      companies.push(row);
      if (companies.length >= 100) {
        const values = companies.slice(0);
        companies = [];
        await insertCompanies(conn, logger, values);
        await insertIndexCompositions(conn, logger, SP500_INDEX_SYMBOL, values);
      }
    })
    .on('end', async () => {
      if (companies.length > 0) {
        const values = companies.slice(0);
        companies = [];
        await insertCompanies(conn, logger, values);
        await insertIndexCompositions(conn, logger, SP500_INDEX_SYMBOL, values);
      }
      logger.info(`All companies imported to DB.`);
    });
}

async function insertCompanies(conn: Connection, logger: Logger, companies: any[]) {
  try {
    const [rs] = await conn.query<ResultSetHeader>(`
    INSERT INTO companies (
      stock_symbol, exchange_symbol, short_name, long_name, sector, industry,
      current_price, market_cap, ebitda, revenue_growth,
      city, state, country, country_code, full_time_employees, long_business_summary
    ) VALUES ?
    ON DUPLICATE KEY UPDATE stock_symbol = VALUES(stock_symbol), exchange_symbol = VALUES(exchange_symbol);
  `, [
      companies.map((c) => [
        c.Symbol,
        c.Exchange,
        c.Shortname,
        c.Longname,
        c.Sector,
        c.Industry,
        nonEmptyString(c['Currentprice']) ? c['Currentprice'] : null,
        nonEmptyString(c['Marketcap']) ? c['Marketcap'] : null,
        nonEmptyString(c['Ebitda']) ? c['Ebitda'] : null,
        nonEmptyString(c['Revenuegrowth']) ? parseFloat(c['Revenuegrowth']) : null,
        c.City,
        c.State,
        c.Country,
        getCountryCode(c.Country),
        nonEmptyString(c['Fulltimeemployees']) ? parseInt(c['Fulltimeemployees']) : null,
        c.Longbusinesssummary
      ])
    ]);
    logger.info(`%d companies imported to DB.`, rs.affectedRows);
  } catch (err) {
    logger.error({
      companies,
      err,
    }, `Error inserting companies to DB.`);
    throw err;
  }
}

async function insertIndexCompositions(conn: Connection, logger: Logger, indexSymbol: string, companies: any[]) {
  try {
    const [rs] = await conn.query<ResultSetHeader>(`
      INSERT INTO index_compositions (
        index_symbol, stock_symbol, weight
      ) VALUES ?
      ON DUPLICATE KEY UPDATE index_symbol = VALUES(index_symbol), stock_symbol = VALUES(stock_symbol);
    `, [
        companies.map((c) => [
          indexSymbol,
          c.Symbol,
          nonEmptyString(c['Weight']) ? Number(c['Weight']) : null,
        ])
      ]);
      logger.info(`%d index compositions imported to DB.`, rs.affectedRows);
    } catch (err) {
      logger.error({
        companies,
        err,
      }, `Error inserting index compositions to DB.`);
      throw err;
    }
}

async function importIndexPriceHistory(conn: Connection, logger: Logger) {
  const stream = fs.createReadStream('./data/sp500/sp500_index.csv');
  const parser = parse({
    delimiter: ',',
    quote: '"',
    columns: true,
  });
  let indexPrices: any[] = [];

  stream.pipe(parser)
    .on('data', async (row) => {
      indexPrices.push(row);
      if (indexPrices.length >= 1000) {
        const values = indexPrices.slice(0);
        indexPrices = [];
        await insertIndexPrices(conn, logger, values);
      }
    })
    .on('end', async () => {
      if (indexPrices.length > 0) {
        const values = indexPrices.slice(0);
        indexPrices = [];
        await insertIndexPrices(conn, logger, values);
      }
      logger.info(`All index prices imported to DB.`);
    });
}

async function insertIndexPrices(conn: Connection, logger: Logger, indexPrices: any[]) {
  try {
    const [rs] = await conn.query<ResultSetHeader>(`
      INSERT INTO index_price_history (
        record_date, index_symbol, price
      ) VALUES ?
      ON DUPLICATE KEY UPDATE record_date = VALUES(record_date);
    `, [
        indexPrices.map((p) => [
          p['Date'],
          SP500_INDEX_SYMBOL,
          nonEmptyString(p['S&P500']) ? p['S&P500'] : null,
        ])
      ]);
      logger.info(`%d index prices imported to DB.`, rs.affectedRows);
    } catch (err) {
      logger.error(err, `Error inserting index prices to DB.`);
      throw err;
    }
}

async function importStockPriceHistory(conn: Connection, logger: Logger) {
  const stream = fs.createReadStream('./data/sp500/sp500_stocks.csv');
  const parser = parse({
    delimiter: ',',
    quote: '"',
    columns: true,
  });
  let indexPrices: any[] = [];

  stream.pipe(parser)
    .on('data', async (row) => {
      indexPrices.push(row);
      if (indexPrices.length >= 1000) {
        const values = indexPrices.slice(0);
        indexPrices = [];
        await insertStockPrices(conn, logger, values);
      }
    })
    .on('end', async () => {
      if (indexPrices.length > 0) {
        const values = indexPrices.slice(0);
        indexPrices = [];
        await insertStockPrices(conn, logger, values);
      }
      logger.info(`All stock prices imported to DB.`);
    });
}

function nonEmptyString(str: any) {
  return typeof str === 'string' && str.length > 0;
}

async function insertStockPrices(conn: Connection, logger: Logger, stockPrices: any[]) {
  try {
    const [rs] = await conn.query<ResultSetHeader>(`
    INSERT INTO stock_price_history (
      record_date, stock_symbol, open, high, low, close, adj_close, volume
    ) VALUES ?
    ON DUPLICATE KEY UPDATE record_date = VALUES(record_date);
  `, [
      stockPrices.map((p) => [
        p['Date'],
        p['Symbol'],
        nonEmptyString(p['Open']) ? p['Open'] : null,
        nonEmptyString(p['High']) ? p['High'] : null,
        nonEmptyString(p['Low']) ? p['Low'] : null,
        nonEmptyString(p['Close']) ? p['Close'] : null,
        nonEmptyString(p['Adj Close']) ? p['Adj Close'] : null,
        nonEmptyString(p['Volume']) ? p['Volume'] : null,
      ])
    ]);
    logger.info(`%d stock prices imported to DB.`, rs.affectedRows);
  } catch (err) {
    logger.error(err, `Error inserting stock prices to DB.`);
    throw err;
  }
}

// TODO: convert all countries to 2-letter code.
function getCountryCode(country: string) {
  switch (country) {
    case 'United States':
      return 'US';
    case 'Bermuda':
      return 'BM';
    case 'United Kingdom':
      return 'GB';
    case 'Ireland':
      return 'IE';
    case 'Netherlands':
      return 'NL';
    case 'Switzerland':
      return 'CH';
    default:
      return country.substring(0, 2);
  }
}

