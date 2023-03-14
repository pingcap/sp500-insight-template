import { createHash, randomBytes } from 'node:crypto';

type DigestConfig = {
  username: string
  password: string
}

type DigestRequest = {
  realm: string
  domain: string
  nonce: string
  algorithm: string
  qop: string
  stale: string
}

type DigestResponse = {
  username: string
  realm: string
  nonce: string
  uri: string
  qop: string
  nc: string
  cnonce: string
  response: string
}

function parseDigestRequest (response: Response): DigestRequest | null {
  const auth = response.headers.get('www-authenticate');

  if (!auth || !/^Digest\s/i.test(auth)) {
    return null;
  }

  return auth.replace(/^Digest\s/i, '')
    .split(',')
    .map(item => item.split('='))
    .reduce((obj, [k, v]) => {
      obj[k.trim()] = v.trim().replace(/^"|"$/g, '');
      return obj;
    }, {} as any);
}

function generateDigestResponse (method: string, url: URL, req: DigestRequest, config: DigestConfig, hash: (content: string) => string, getNonceCount: () => number): DigestResponse {
  const uri = url.pathname + url.search;

  const ha1 = hash(`${config.username}:${req.realm}:${config.password}`);
  const ha2 = hash(`${method}:${uri}`);

  const nc = String(getNonceCount()).padStart(8, '0');
  const cnonce = randomBytes(4).toString('hex');

  const response = hash(`${ha1}:${req.nonce}:${nc}:${cnonce}:${req.qop}:${ha2}`);

  return {
    username: config.username,
    realm: req.realm,
    nonce: req.nonce,
    uri,
    qop: req.qop,
    nc,
    cnonce,
    response,
  };
}

export function wrapFetchWithDigestFlow (nativeFetch: typeof fetch, config: DigestConfig): typeof fetch {
  let nc = 0;

  async function digestFetch (input: Request | URL | string, init?: RequestInit) {
    const response = await nativeFetch(input, init);
    const digestRequest = parseDigestRequest(response);

    // if (response.status === 401) {
    if (digestRequest) {
      if (response.status !== 401) {
        console.warn('digest headers returned but status code is', response.status);
      }

      let method: string;
      let url: URL;

      if (typeof input === 'string') {
        method = init?.method ?? 'GET';
        url = new URL(input);
      } else if ('url' in input) {
        method = input.method ?? 'GET';
        url = new URL(input.url);
      } else {
        method = init?.method ?? 'GET';
        url = input;
      }

      let hash: (content: string) => string;

      switch (digestRequest.algorithm) {
        case 'MD5':
          hash = md5;
          break;
        default:
          throw new Error(`Unsupported algorithm '${digestRequest.algorithm}'`);
      }

      const digestResponse = generateDigestResponse(method, url, digestRequest, config, md5, () => ++nc);
      const credential = stringify(digestResponse);

      return nativeFetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: credential,
        },
      });
      // }
    }
    return response;
  }

  return digestFetch;
}

function md5 (content: string) {
  return createHash('md5').update(content).digest('hex');
}

function stringify (res: DigestResponse) {
  return `Digest username="${res.username}", realm="${res.realm}", nonce="${res.nonce}", uri="${res.uri}", qop=${res.qop}, nc=${res.nc}, cnonce=${res.cnonce}, response=${res.response}`;
}