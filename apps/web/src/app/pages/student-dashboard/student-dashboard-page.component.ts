import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../shared/ui/atoms/app-button/app-button.component';
import { BookLessonPanelComponent } from '../../shared/ui/organisms/book-lesson-panel/book-lesson-panel.component';
import { LessonListComponent } from '../../shared/ui/organisms/lesson-list/lesson-list.component';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStoreService } from '../../core/auth/auth-store.service';

@Component({
  selector: 'student-dashboard-page',
  standalone: true,
  imports: [AppButtonComponent, BookLessonPanelComponent, LessonListComponent],
  templateUrl: './student-dashboard-page.component.html',
  styleUrl: './student-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStoreService);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
