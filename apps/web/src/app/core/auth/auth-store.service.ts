import { Injectable, computed, signal } from '@angular/core';
import { AuthenticatedUser } from './auth.models';

const TOKEN_STORAGE_KEY = 'music-app.access-token';
const USER_STORAGE_KEY = 'music-app.user';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly accessTokenSignal = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  private readonly userSignal = signal<AuthenticatedUser | null>(
    (() => {
      try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AuthenticatedUser) : null;
      } catch {
        return null;
      }
    })()
  );

  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal() && !!this.userSignal());

  setSession(accessToken: string, user: AuthenticatedUser): void {
    this.accessTokenSignal.set(accessToken);
    this.userSignal.set(user);
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
