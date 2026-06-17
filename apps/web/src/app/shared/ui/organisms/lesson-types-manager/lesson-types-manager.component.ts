import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppInputComponent } from '../../atoms/app-input/app-input.component';
import { AppSpinnerComponent } from '../../atoms/app-spinner/app-spinner.component';
import { LessonTypeCardComponent } from '../../molecules/lesson-type-card/lesson-type-card.component';
import { SchedulingService } from '../../../../core/scheduling/scheduling.service';
import { LessonType } from '../../../../core/scheduling/scheduling.models';

@Component({
  selector: 'lesson-types-manager',
  standalone: true,
  imports: [AppButtonComponent, AppInputComponent, AppSpinnerComponent, LessonTypeCardComponent],
  templateUrl: './lesson-types-manager.component.html',
  styleUrl: './lesson-types-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonTypesManagerComponent implements OnInit {
  private readonly schedulingService = inject(SchedulingService);

  readonly lessonTypes = signal<LessonType[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly newTitle = signal('');
  readonly newDescription = signal('');
  readonly newDuration = signal('45');
  readonly newPriceDollars = signal('50');

  ngOnInit() {
    this.loadLessonTypes();
  }

  loadLessonTypes() {
    this.loading.set(true);
    this.schedulingService.listMyLessonTypes().subscribe({
      next: types => {
        this.lessonTypes.set(types);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load lesson types.');
        this.loading.set(false);
      }
    });
  }

  saveType() {
    if (!this.newTitle().trim()) return;
    const priceCents = Math.round(parseFloat(this.newPriceDollars()) * 100);
    const durationMinutes = parseInt(this.newDuration(), 10);
    this.saving.set(true);
    this.schedulingService
      .createLessonType({
        title: this.newTitle().trim(),
        description: this.newDescription().trim() || undefined,
        durationMinutes,
        priceCents
      })
      .subscribe({
        next: lt => {
          this.lessonTypes.update(t => [lt, ...t]);
          this.newTitle.set('');
          this.newDescription.set('');
          this.showForm.set(false);
          this.saving.set(false);
        },
        error: () => {
          this.error.set('Failed to create lesson type.');
          this.saving.set(false);
        }
      });
  }

  deleteType(id: string) {
    this.schedulingService.deleteLessonType(id).subscribe({
      next: () => this.lessonTypes.update(t => t.filter(lt => lt.id !== id)),
      error: () => this.error.set('Failed to delete lesson type.')
    });
  }
}
