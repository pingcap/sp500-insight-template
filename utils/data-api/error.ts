import type { QueryResponse } from './endpoint'

export class UpstreamError extends Error {
  constructor (message: string, public url: string, public response?: Response, public body?: any) {
    super(message);
  }

  static ofHttp (url: string, response: Response, message?: string) {
    message = message ?? `${response.status} ${response.statusText}`;

    return new UpstreamError(message, url, response);
  }

  static ofResponse (url: string, response: QueryResponse<any>) {
    return new UpstreamError(`${response.result.code} ${response.result.message}`,  url,undefined, response);
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

