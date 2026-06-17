import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppInputComponent } from '../../atoms/app-input/app-input.component';
import { AppSelectComponent, SelectOption } from '../../atoms/app-select/app-select.component';
import { AppSpinnerComponent } from '../../atoms/app-spinner/app-spinner.component';
import { AvailabilitySlotRowComponent } from '../../molecules/availability-slot-row/availability-slot-row.component';
import { SchedulingService } from '../../../../core/scheduling/scheduling.service';
import { AvailabilitySlot } from '../../../../core/scheduling/scheduling.models';

const WEEKDAY_OPTIONS: SelectOption[] = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' }
];

@Component({
  selector: 'availability-manager',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppInputComponent,
    AppSelectComponent,
    AppSpinnerComponent,
    AvailabilitySlotRowComponent
  ],
  templateUrl: './availability-manager.component.html',
  styleUrl: './availability-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityManagerComponent implements OnInit {
  private readonly schedulingService = inject(SchedulingService);

  readonly slots = signal<AvailabilitySlot[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly weekdayOptions = WEEKDAY_OPTIONS;
  readonly newWeekday = signal('1');
  readonly newStartTime = signal('09:00');
  readonly newEndTime = signal('17:00');

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.loading.set(true);
    this.schedulingService.listMyAvailabilitySlots().subscribe({
      next: slots => {
        this.slots.set(slots);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load availability slots.');
        this.loading.set(false);
      }
    });
  }

  addSlot() {
    if (!this.newStartTime() || !this.newEndTime()) return;
    this.saving.set(true);
    this.schedulingService
      .createAvailabilitySlot({
        weekday: parseInt(this.newWeekday(), 10),
        startTime: this.newStartTime(),
        endTime: this.newEndTime()
      })
      .subscribe({
        next: slot => {
          this.slots.update(s => [...s, slot]);
          this.saving.set(false);
        },
        error: () => {
          this.error.set('Failed to add slot.');
          this.saving.set(false);
        }
      });
  }

  removeSlot(slotId: string) {
    this.schedulingService.deleteAvailabilitySlot(slotId).subscribe({
      next: () => this.slots.update(s => s.filter(slot => slot.id !== slotId)),
      error: () => this.error.set('Failed to remove slot.')
    });
  }
}
