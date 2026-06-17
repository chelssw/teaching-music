import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../shared/ui/atoms/app-button/app-button.component';
import { AvailabilityManagerComponent } from '../../shared/ui/organisms/availability-manager/availability-manager.component';
import { LessonListComponent } from '../../shared/ui/organisms/lesson-list/lesson-list.component';
import { LessonTypesManagerComponent } from '../../shared/ui/organisms/lesson-types-manager/lesson-types-manager.component';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStoreService } from '../../core/auth/auth-store.service';

@Component({
  selector: 'teacher-dashboard-page',
  standalone: true,
  imports: [AppButtonComponent, AvailabilityManagerComponent, LessonListComponent, LessonTypesManagerComponent],
  templateUrl: './teacher-dashboard-page.component.html',
  styleUrl: './teacher-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStoreService);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
