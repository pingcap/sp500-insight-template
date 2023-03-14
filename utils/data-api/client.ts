import { DataApiParams, Endpoint, EndpointData, EndpointParams, TransformedResponse } from '@/utils/data-api/endpoint';
import useSWR, { SWRConfiguration, unstable_serialize } from 'swr';
import { useTransform } from '@/utils/hook';

type Config<Data> = Pick<SWRConfiguration<Data>,
  'refreshInterval'
  | 'refreshWhenHidden'
  | 'refreshWhenOffline'
  | 'revalidateOnFocus'
  | 'revalidateOnMount'
  | 'revalidateIfStale'
  | 'revalidateOnReconnect'
  | 'fallbackData'
  | 'keepPreviousData'
>

export function useEndpoint<Params extends DataApiParams, Data extends Record<string, any>, Single extends boolean> (endpoint: Endpoint<Params, Data, Single>, params: Params | undefined, config?: Config<Single extends true ? Data : Data[]>) {
  return useSWR<EndpointData<Endpoint<Params, Data, Single>>>(params && [endpoint, params], {
    ...config,
    fetcher: clientEndpointFetcher,
  });
}

export type EndpointArgs<E extends Endpoint<any, any>> = [E, EndpointParams<E>]

export function useComposedEndpoint<Data extends Record<string, any>, Single extends boolean, ConditionParams> (condition: (params: ConditionParams) => EndpointArgs<Endpoint<any, Data, Single>> | undefined, params: ConditionParams, config?: Config<Single extends true ? Data : Data[]>) {
  const key = useTransform(params, condition, [unstable_serialize([params])]);
  return useSWR<EndpointData<Endpoint<any, Data, Single>>>(key, {
    ...config,
    fetcher: clientEndpointFetcher,
  });
}

export async function clientEndpointFetcher<Params extends DataApiParams, Data extends Record<string, any>, Single extends boolean> ([endpoint, params]: EndpointArgs<Endpoint<Params, Data, Single>>): Promise<Single extends true ? Data : Data[]> {
  let url = `/data-api${endpoint.path}`;
  let body = undefined;
  let headers = undefined;

  if (endpoint.method === 'GET') {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => usp.set(k, String(v)));
    url += '?' + usp.toString();
  } else {
    body = JSON.stringify(params);
    headers = {
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(url, {
    method: endpoint.method,
    body,
    headers,
  });

  if (!response.ok) {
    const details = response.json()
      .then(content => content)
      .catch(() => response.text())
      .catch(() => undefined);

    throw new EndpointError(`${response.status} ${response.statusText}`, details);
  } else {
    const data: TransformedResponse<Data, Single> = await response.json();
    if (endpoint.single) {
      return data.row;
    } else {
      return data.rows;
    }
  }
}

class EndpointError extends Error {
  constructor (message: string, public details: any) {super(message);}
}
