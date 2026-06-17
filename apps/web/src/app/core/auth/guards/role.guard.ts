import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from '../auth-store.service';
import { UserRole } from '../auth.models';

export const roleGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStoreService);
  const requiredRoles = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  if (!requiredRoles.length) {
    return true;
  }

  const role = authStore.user()?.role;
  if (role && requiredRoles.includes(role)) {
    return true;
  }

  return inject(Router).parseUrl('/');
};
