import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppBadgeComponent, BadgeVariant } from '../../atoms/app-badge/app-badge.component';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppCardComponent } from '../../atoms/app-card/app-card.component';
import { Lesson } from '../../../../core/scheduling/scheduling.models';

@Component({
  selector: 'lesson-card',
  standalone: true,
  imports: [AppCardComponent, AppBadgeComponent, AppButtonComponent],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonCardComponent {
  readonly lesson = input.required<Lesson>();
  readonly userRole = input.required<'teacher' | 'student'>();
  readonly confirmLesson = output<string>();
  readonly completeLesson = output<string>();
  readonly cancelLesson = output<string>();

  get badgeVariant(): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      pending: 'pending',
      confirmed: 'confirmed',
      completed: 'completed',
      cancelled: 'cancelled'
    };
    return map[this.lesson().status] ?? 'default';
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
}
