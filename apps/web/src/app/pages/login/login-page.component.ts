import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '../../shared/ui/atoms/app-button/app-button.component';
import { AppCardComponent } from '../../shared/ui/atoms/app-card/app-card.component';
import { AppInputComponent } from '../../shared/ui/atoms/app-input/app-input.component';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStoreService } from '../../core/auth/auth-store.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [AppCardComponent, AppButtonComponent, AppInputComponent, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  login() {
    if (!this.email() || !this.password()) return;
    this.loading.set(true);
    this.error.set(null);
    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.authStore.user()?.role;
        this.router.navigateByUrl(role === 'teacher' ? '/teacher' : '/student');
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Invalid email or password.');
      }
    });
  }
}
