import { UpstreamError } from '@/utils/data-api/error';

const SYMBOL_ENDPOINT = Symbol('data-api#endpoint');

export type DataApiParams = Record<string, string | number | boolean>

export type QueryResponse<DT extends Record<string, any>> = {
  result: {
    code: number
    message: string
    start_ms: number
    end_ms: number
    latency: number
    row_count: number
    row_affect: number
    limit: string
    query: string
  }
  columns: DataColumn<DT>[]
  rows: DT[]
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

export function transformResponse<DT extends Record<string, any>> (url: URL, response: QueryResponse<DT>) {
  if (response.result.code !== 200) {
    throw UpstreamError.ofResponse(url.toString(), response);
  }
  const { rows, columns, ...rest } = response
  rows.forEach(item => {
    return columns.forEach((column) => {
      item[column.col] = convertValue(item[column.col], column);
    }, {} as DT);
  });
  return {
    columns,
    rows,
    ...rest
  };
}

const metaKeys = [
  'X-RateLimit-Limit-Minute',
  'X-RateLimit-Reset',
  'X-RateLimit-Remaining-Minute',
  'X-Debug-Trace-Id',
  'X-Kong-Upstream-Latency',
  'X-Kong-Proxy-Latency',
];

export function transformResponseMeta (response: Response) {
  const meta = metaKeys.reduce((meta, key) => {
    meta[key] = response.headers.get(key);
    return meta;
  }, {} as Record<string, any>);

  if (response.dataApiTraceIds) {
    meta['X-App-Debug-Trace-Sequence'] = response.dataApiTraceIds.join(', ');
  }
  return meta;
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

export function traceDataApi (ids: string[], response: Response) {
  const id = response.headers.get('X-Debug-Trace-Id');
  if (id) {
    ids.push(id);
  }
}
