import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '../../shared/ui/atoms/app-button/app-button.component';
import { AppCardComponent } from '../../shared/ui/atoms/app-card/app-card.component';
import { AppInputComponent } from '../../shared/ui/atoms/app-input/app-input.component';
import { AppSelectComponent, SelectOption } from '../../shared/ui/atoms/app-select/app-select.component';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStoreService } from '../../core/auth/auth-store.service';
import { UserRole } from '../../core/auth/auth.models';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [AppCardComponent, AppButtonComponent, AppInputComponent, AppSelectComponent, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);

  readonly fullName = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly role = signal<UserRole>('student');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly roleOptions: SelectOption[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' }
  ];

  setRole(value: string) {
    this.role.set(value as UserRole);
  }

  register() {
    if (!this.fullName() || !this.email() || !this.password()) return;
    this.loading.set(true);
    this.error.set(null);
    this.authService.register(this.email(), this.fullName(), this.password(), this.role()).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.authStore.user()?.role;
        this.router.navigateByUrl(role === 'teacher' ? '/teacher' : '/student');
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message;
        this.error.set(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Registration failed.'));
      }
    });
  }
}
