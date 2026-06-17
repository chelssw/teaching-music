import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from './auth-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStoreService).accessToken();
  if (token) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
