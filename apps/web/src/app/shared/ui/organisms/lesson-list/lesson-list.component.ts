import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AppSpinnerComponent } from '../../atoms/app-spinner/app-spinner.component';
import { LessonCardComponent } from '../../molecules/lesson-card/lesson-card.component';
import { SchedulingService } from '../../../../core/scheduling/scheduling.service';
import { AuthStoreService } from '../../../../core/auth/auth-store.service';
import { Lesson } from '../../../../core/scheduling/scheduling.models';

@Component({
  selector: 'lesson-list',
  standalone: true,
  imports: [AppSpinnerComponent, LessonCardComponent],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonListComponent implements OnInit {
  private readonly schedulingService = inject(SchedulingService);
  private readonly authStore = inject(AuthStoreService);

  readonly lessons = signal<Lesson[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  get userRole(): 'teacher' | 'student' {
    return this.authStore.user()?.role ?? 'student';
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.loading.set(true);
    this.schedulingService.listMyLessons().subscribe({
      next: lessons => {
        this.lessons.set(lessons);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load lessons.');
        this.loading.set(false);
      }
    });
  }

  onConfirm(lessonId: string) {
    this.schedulingService.updateLessonStatus(lessonId, 'confirmed').subscribe({
      next: updated => this.patchLesson(updated),
      error: () => this.error.set('Failed to confirm lesson.')
    });
  }

  onComplete(lessonId: string) {
    this.schedulingService.updateLessonStatus(lessonId, 'completed').subscribe({
      next: updated => this.patchLesson(updated),
      error: () => this.error.set('Failed to complete lesson.')
    });
  }

  onCancel(lessonId: string) {
    const reason = prompt('Please provide a cancellation reason:');
    if (!reason?.trim()) return;
    this.schedulingService.updateLessonStatus(lessonId, 'cancelled', reason.trim()).subscribe({
      next: updated => this.patchLesson(updated),
      error: () => this.error.set('Failed to cancel lesson.')
    });
  }

  private patchLesson(updated: Lesson) {
    this.lessons.update(list => list.map(l => (l.id === updated.id ? { ...l, ...updated } : l)));
  }
}
