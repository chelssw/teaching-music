import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppBadgeComponent, BadgeVariant } from '../../atoms/app-badge/app-badge.component';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppCardComponent } from '../../atoms/app-card/app-card.component';
import { LessonNote } from '../../../../core/scheduling/scheduling.models';

@Component({
  selector: 'note-card',
  standalone: true,
  imports: [AppCardComponent, AppBadgeComponent, AppButtonComponent],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteCardComponent {
  readonly note = input.required<LessonNote>();
  readonly userRole = input.required<'teacher' | 'student'>();
  readonly editNote = output<LessonNote>();
  readonly deleteNote = output<string>();

  get visibilityVariant(): BadgeVariant {
    return this.note().visibility === 'shared_with_student' ? 'confirmed' : 'default';
  }

  get visibilityLabel(): string {
    return this.note().visibility === 'shared_with_student' ? 'Shared with student' : 'Private';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
