import { wrapFetchWithDigestFlow } from '@/utils/digest-auth';
import { DataApiParams, Endpoint, TransformedResponse, transformResponse } from './endpoint';
import { UpstreamError } from './error';
import { NextResponse } from 'next/server';

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
    throw UpstreamError.ofHttp(url.toString(), response);
  }

  let json: any;
  try {
    json = await response.json();
  } catch (e) {
    throw new UpstreamError(`Invalid JSON: ${e}`, url.toString(), response, e);
  }

  const rows = transformResponse<Data>(url, json);
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

// TODO: use middleware
export async function withUpstreamErrorHandled (cb: () => Promise<Response>): Promise<Response> {
  try {
    return await cb();
  } catch (e) {
    if (e instanceof UpstreamError) {
      const errorBody = {
        error: 'UPSTREAM_ERROR',
        error_details: await e.getUpstreamResponseText(),
      };
      console.error('Error from', e.url, e)
      return NextResponse.json(errorBody, { status: e.response?.status ?? 500 });
    } else {
      throw e;
    }
  }
}

export function dataOf<Data extends Record<string, any>, Single extends boolean> (response: TransformedResponse<Data, Single>): Single extends true ? Data : Data[] {
  if (response.row) {
    return response.row;
  } else {
    return response.rows;
  }
}