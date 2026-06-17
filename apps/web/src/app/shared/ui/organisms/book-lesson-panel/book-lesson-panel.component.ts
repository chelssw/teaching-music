import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppInputComponent } from '../../atoms/app-input/app-input.component';
import { AppSelectComponent, SelectOption } from '../../atoms/app-select/app-select.component';
import { AppSpinnerComponent } from '../../atoms/app-spinner/app-spinner.component';
import { SchedulingService } from '../../../../core/scheduling/scheduling.service';
import { AvailabilitySlot, LessonType } from '../../../../core/scheduling/scheduling.models';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'book-lesson-panel',
  standalone: true,
  imports: [AppButtonComponent, AppInputComponent, AppSelectComponent, AppSpinnerComponent],
  templateUrl: './book-lesson-panel.component.html',
  styleUrl: './book-lesson-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookLessonPanelComponent {
  private readonly schedulingService = inject(SchedulingService);
  readonly booked = output<void>();

  readonly teacherId = signal('');
  readonly lessonTypes = signal<LessonType[]>([]);
  readonly availabilitySlots = signal<AvailabilitySlot[]>([]);
  readonly selectedLessonTypeId = signal('');
  readonly selectedDatetime = signal('');
  readonly loading = signal(false);
  readonly booking = signal(false);
  readonly error = signal<string | null>(null);
  readonly teacherLoaded = signal(false);

  get lessonTypeOptions(): SelectOption[] {
    return this.lessonTypes().map(lt => ({
      value: lt.id,
      label: `${lt.title} (${lt.durationMinutes} min – $${(lt.priceCents / 100).toFixed(2)})`
    }));
  }

  get availabilityDescription(): string {
    if (this.availabilitySlots().length === 0) return 'Not specified.';
    return this.availabilitySlots()
      .map(s => `${WEEKDAYS[s.weekday]}: ${s.startTime}–${s.endTime}`)
      .join(' · ');
  }

  searchTeacher() {
    if (!this.teacherId().trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.teacherLoaded.set(false);

    let ltResult: LessonType[] = [];
    let avResult: AvailabilitySlot[] = [];
    let ltDone = false;
    let avDone = false;

    const checkDone = () => {
      if (!ltDone || !avDone) return;
      this.lessonTypes.set(ltResult);
      this.availabilitySlots.set(avResult);
      this.teacherLoaded.set(true);
      this.loading.set(false);
      if (ltResult.length > 0) this.selectedLessonTypeId.set(ltResult[0].id);
    };

    this.schedulingService.listTeacherLessonTypes(this.teacherId().trim()).subscribe({
      next: lt => {
        ltResult = lt;
        ltDone = true;
        checkDone();
      },
      error: () => {
        this.error.set('Teacher not found or has no lesson types.');
        this.loading.set(false);
      }
    });

    this.schedulingService.listTeacherAvailabilitySlots(this.teacherId().trim()).subscribe({
      next: av => {
        avResult = av;
        avDone = true;
        checkDone();
      },
      error: () => {
        avDone = true;
        checkDone();
      }
    });
  }

  bookLesson() {
    if (!this.selectedLessonTypeId() || !this.selectedDatetime()) return;
    const lt = this.lessonTypes().find(t => t.id === this.selectedLessonTypeId());
    if (!lt) return;

    const startsAt = new Date(this.selectedDatetime());
    const endsAt = new Date(startsAt.getTime() + lt.durationMinutes * 60_000);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.booking.set(true);
    this.error.set(null);
    this.schedulingService
      .bookLesson({
        teacherId: this.teacherId().trim(),
        lessonTypeId: this.selectedLessonTypeId(),
        startsAtIso: startsAt.toISOString(),
        endsAtIso: endsAt.toISOString(),
        timezone
      })
      .subscribe({
        next: () => {
          this.booking.set(false);
          this.booked.emit();
          this.resetForm();
        },
        error: err => {
          const msg =
            err?.error?.message ?? 'Booking failed. Check for conflicts and try again.';
          this.error.set(Array.isArray(msg) ? msg.join(', ') : msg);
          this.booking.set(false);
        }
      });
  }

  private resetForm() {
    this.teacherId.set('');
    this.lessonTypes.set([]);
    this.availabilitySlots.set([]);
    this.selectedLessonTypeId.set('');
    this.selectedDatetime.set('');
    this.teacherLoaded.set(false);
  }
}
