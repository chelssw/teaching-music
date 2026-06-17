import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from '../auth-store.service';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  if (authStore.isAuthenticated()) {
    return true;
  }

  return inject(Router).parseUrl('/login');
};
