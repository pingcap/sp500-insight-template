import { NextRequest, NextResponse } from 'next/server';
import { isEndpoint, QueryMethod } from '@/utils/data-api/endpoint';
import endpoints from '@/datasource/endpoints';
import { executeEndpoint, withUpstreamErrorHandled } from '@/utils/data-api/server';

export function GET (request: NextRequest, { params }: { params: { id: string[] } }) {
  const { searchParams } = new URL(request.url);
  const queryParams = searchParamsToUrlQuery(searchParams);
  return handle('GET', params.id, queryParams, request);
}

export async function POST (request: NextRequest, { params }: any) {
  return handle('GET', params.id, await request.json(), request);
}

async function handle (method: QueryMethod, path: string[], params: any, request: NextRequest): Promise<Response> {
  const endpoint = path.concat(method).reduce((module: any, p) => {
    if (!module) {
      return undefined;
    }
    if (p in module) {
      return module[p];
    } else {
      return undefined;
    }
  }, endpoints);
  if (isEndpoint(endpoint)) {
    return withUpstreamErrorHandled(async () => {
      const result = await executeEndpoint(endpoint, params);
      return NextResponse.json(result);
    })
  }

  return new Response(null, {
    status: 404,
  });
}

function searchParamsToUrlQuery (searchParams: URLSearchParams) {
  const query: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    const qv = query[key];
    if (typeof qv === 'undefined') {
      query[key] = value;
    } else if (qv instanceof Array) {
      qv.push(value);
    } else {
      query[key] = [
        qv,
        value,
      ];
    }
  });
  return query;
}
