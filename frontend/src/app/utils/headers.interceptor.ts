import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionUtil } from './sessionutil';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authorization = `Bearer ${SessionUtil.getJWT()}`

    let headers = request.headers.set('Authorization', authorization);
    request = request.clone({ headers })

    return next.handle(request);
  }
}
