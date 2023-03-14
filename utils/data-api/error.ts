import type { QueryResponse, GeneralResponse } from './endpoint'

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

