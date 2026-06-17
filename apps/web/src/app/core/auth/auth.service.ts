import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthStoreService } from './auth-store.service';
import { AuthenticatedUser, UserRole } from './auth.models';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

const API = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStoreService);

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API}/auth/login`, { email, password })
      .pipe(tap(res => this.authStore.setSession(res.accessToken, res.user)));
  }

  register(email: string, fullName: string, password: string, role: UserRole) {
    return this.http
      .post<AuthResponse>(`${API}/auth/register`, { email, fullName, password, role })
      .pipe(tap(res => this.authStore.setSession(res.accessToken, res.user)));
  }

  logout(): void {
    this.authStore.clearSession();
  }
}
