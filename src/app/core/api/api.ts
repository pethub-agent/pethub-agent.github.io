import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG_CONTEXT, ApiConfig } from './api.config';

export class ApiBase {
  constructor(
    private readonly http: HttpClient,
    private readonly config: ApiConfig
  ) {}

  protected fetch<T = any>(url: string, options?: Object): Observable<T> {
    const opt = Object.assign(
      {
        context: new HttpContext().set(API_CONFIG_CONTEXT, this.config),
      },
      options || {}
    );

    return this.http.get<T>(this.bindUrlHost(url), opt);
  }

  protected post<T = any>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.bindUrlHost(url), body, {
      // TODO: fazer Object.assign para não sobreescrever configuração inicial caso nao tenha config
      context: new HttpContext().set(API_CONFIG_CONTEXT, this.config),
    });
  }

  protected delete<T = any>(url: string): Observable<T> {
    return this.http.delete<T>(this.bindUrlHost(url), {
      context: new HttpContext().set(API_CONFIG_CONTEXT, this.config),
    });
  }

  protected update<T = any>(url: string, body?: any): Observable<T> {
    return this.http.put<T>(this.bindUrlHost(url), body || {}, {
      context: new HttpContext().set(API_CONFIG_CONTEXT, this.config),
    });
  }

  protected partialUpdate<T = any>(url: string, body?: any): Observable<T> {
    return this.http.patch<T>(this.bindUrlHost(url), body || {}, {
      context: new HttpContext().set(API_CONFIG_CONTEXT, this.config),
    });
  }

  private bindUrlHost(url: string): string {
    return this.config.host + '/' + url;
  }
}
