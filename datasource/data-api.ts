import { wrapFetchWithDigestFlow } from '@/utils/digest-auth';
import { Response } from 'next/dist/compiled/@edge-runtime/primitives/fetch';

export type DataApiParams = Record<string, string | number | boolean>

type GeneralResponse<DT extends Record<string, any>> = {
  code: number
  message: string
  data: QueryResponse<DT>[]
}

type QueryResponse<DT extends Record<string, any>> = {
  // 0 is OK
  err_code: number
  err_message: string
  columns: DataColumn<DT>[]
  rows: DataRow[]
  start_ms: number
  end_ms: number
  latency: number
  row_count: number
  row_affect: number
  limit: string
  query: string
}

export type DataColumn<DT extends Record<string, any>> = {
  col: keyof DT
  data_type: string
  nullable: unknown
}

export type DataRow = (string | number)[]

export type QueryMethod = 'GET' | 'POST'

export type Endpoint<Params extends DataApiParams, Data extends Record<string, any>, Single extends boolean = boolean> = {
  method: QueryMethod
  path: string
  single: Single
}

export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single?: false): Endpoint<Params, Data, false>
export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single: true): Endpoint<Params, Data, true>
export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single?: boolean): Endpoint<Params, Data> {
  return {
    method,
    path,
    single: single ?? false,
  };
}

function transformResponse<DT extends Record<string, any>> (response: GeneralResponse<DT>) {
  if (response.code !== 200) {
    throw UpstreamError.ofResponse(response);
  }
  const [data] = response.data;
  if (!data) {
    throw new Error('Invalid data api response');
  }
  if (data.err_code !== 0) {
    throw UpstreamError.ofSql(data);
  }
  return data.rows.map(columns => {
    return columns.reduce((dt: DT, columnData, index) => {
      const column = data.columns[index];
      dt[column.col] = convertValue(columnData, column);
      return dt;
    }, {} as DT);
  });
}

const digestFetch = wrapFetchWithDigestFlow(fetch, {
  username: process.env.DATA_SERVICE_USERNAME || '',
  password: process.env.DATA_SERVICE_PASSWORD || '',
});

export async function executeEndpoint<Params extends DataApiParams, Data extends Record<string, any>, Single extends boolean> (endpoint: Endpoint<Params, Data, Single>, params: Params): Promise<TransformedResponse<Data, Single>> {
  const { DATA_SERVICE_USERNAME, DATA_SERVICE_PASSWORD, DATA_SERVICE_ENDPOINT } = process.env;
  if (!DATA_SERVICE_USERNAME || !DATA_SERVICE_PASSWORD || !DATA_SERVICE_ENDPOINT) {
    throw new Error('Data service not configured.');
  }
  const url = new URL(`${DATA_SERVICE_ENDPOINT}${endpoint.path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await digestFetch(url, {
    method: endpoint.method,
  });

  if (!response.ok) {
    throw UpstreamError.ofHttp(response);
  }

  let json: any;
  try {
    json = await response.json();
  } catch (e) {
    throw new UpstreamError('Invalid JSON', undefined, e);
  }

  const rows = transformResponse<Data>(json);
  const { start_ms, end_ms, latency, row_count, row_affect } = json;

  if (endpoint.single) {
    return {
      row: rows[0],
      start_ms, end_ms, latency, row_count, row_affect,
    } as TransformedResponse<Data, Single>;
  } else {
    return {
      rows,
      start_ms, end_ms, latency, row_count, row_affect,
    } as TransformedResponse<Data, Single>;
  }
}

type TransformedResponse<DT extends Record<string, any>, Single extends boolean> = {
  rows: Single extends true ? never : DT[]
  row: Single extends true ? DT : never;
  start_ms: number
  end_ms: number
  latency: number
  row_count: number
  row_affect: number
}

function convertValue (value: any, column: DataColumn<any>): any {
  switch (column.data_type) {
    case 'STRING':
    case 'VARCHAR':
      return String(value);
    case 'DECIMAL':
    case 'FLOAT':
    case 'DOUBLE':
      return parseFloat(value);
    case 'BIGINT':
    case 'INTEGER':
      return parseInt(value);
    default:
      return value;
  }
}

export class UpstreamError extends Error {
  constructor (message: string, public response?: Response, public body?: any) {
    super(message);
  }

  static ofHttp (response: Response) {
    const message = `${response.status} ${response.statusText}`;

    return new UpstreamError(message, response);
  }

  static ofSql (response: QueryResponse<any>) {
    return new UpstreamError(`${response.err_code} ${response.err_message}: ${response.query}`, undefined, response);
  }

  static ofResponse (response: GeneralResponse<any>) {
    return new UpstreamError(`${response.code} ${response.message}`, undefined, response);
  }

  async getUpstreamResponseText () {
    if (this.body) {
      return this.body;
    }
    if (this.response) {
      let body: any;
      if (!this.response.bodyUsed) {
        try {
          return await this.response.json();
        } catch {
          try {
            return await this.response.text();
          } catch {
          }
        }
      }
    }
    return undefined;
  }
}

// TODO: use middleware
export async function withUpstreamErrorHandled (cb: () => Promise<Response>): Promise<Response> {
  try {
    return cb();
  } catch (e) {
    if (e instanceof UpstreamError) {
      return new Response(JSON.stringify(await e.getUpstreamResponseText()), {
        status: 500,
      });
    } else {
      throw e;
    }
  }
}
