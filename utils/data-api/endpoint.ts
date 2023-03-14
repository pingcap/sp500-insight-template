import { UpstreamError } from '@/utils/data-api/error';

const SYMBOL_ENDPOINT = Symbol('data-api#endpoint');

export type DataApiParams = Record<string, string | number | boolean>

export type GeneralResponse<DT extends Record<string, any>> = {
  code: number
  message: string
  data: QueryResponse<DT>[]
}

export type QueryResponse<DT extends Record<string, any>> = {
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
  [SYMBOL_ENDPOINT]: true
}

export type EndpointParams<T> = T extends Endpoint<infer Params, any, any> ? Params : never;
export type EndpointData<T> = T extends Endpoint<any, infer Data, infer Single> ? Single extends true ? Data : Data[] : never;

export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single?: false): Endpoint<Params, Data, false>
export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single: true): Endpoint<Params, Data, true>
export function defineEndpoint<Params extends DataApiParams, Data extends Record<string, any>> (method: QueryMethod, path: string, single?: boolean): Endpoint<Params, Data> {
  return {
    method,
    path,
    single: single ?? false,
    [SYMBOL_ENDPOINT]: true,
  };
}

export type TransformedResponse<DT extends Record<string, any>, Single extends boolean> = {
  rows: Single extends true ? never : DT[]
  row: Single extends true ? DT : never;
  start_ms: number
  end_ms: number
  latency: number
  row_count: number
  row_affect: number
  meta: any
}

export function transformResponse<DT extends Record<string, any>> (url: URL, response: GeneralResponse<DT>) {
  if (response.code !== 200) {
    throw UpstreamError.ofResponse(url.toString(), response);
  }
  const [data] = response.data;
  if (!data) {
    throw new Error('Invalid data api response');
  }
  if (data.err_code !== 0) {
    throw UpstreamError.ofSql(url.toString(), data);
  }
  const rows = data.rows.map(columns => {
    return columns.reduce((dt: DT, columnData, index) => {
      const column = data.columns[index];
      dt[column.col] = convertValue(columnData, column);
      return dt;
    }, {} as DT);
  });
  return {
    ...data,
    rows
  }
}

const metaKeys = [
  'X-RateLimit-Limit-Minute',
  'X-RateLimit-Reset',
  'X-RateLimit-Remaining-Minute',
  'X-Debug-Trace-Id',
  'X-Kong-Upstream-Latency',
  'X-Kong-Proxy-Latency',
]

export function transformResponseMeta(response: Response) {
  return metaKeys.reduce((meta, key) => {
    meta[key] = response.headers.get(key)
    return meta
  }, {} as Record<string, any>)
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

export function isEndpoint (v: unknown): v is Endpoint<any, any> {
  if (!v || typeof v !== 'object') {
    return false;
  }
  return !!(v as any)[SYMBOL_ENDPOINT];
}
