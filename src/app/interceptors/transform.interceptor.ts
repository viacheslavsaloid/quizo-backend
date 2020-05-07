import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppResponse } from '../models/response.model';
import { DebugLogger } from '../utils/debug/debug.helper';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, AppResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<AppResponse<T>> {
    DebugLogger(this);

    return next.handle().pipe(map(data => ({ data })));
  }
}
