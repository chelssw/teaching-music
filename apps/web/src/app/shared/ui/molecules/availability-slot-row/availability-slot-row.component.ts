import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AvailabilitySlot } from '../../../../core/scheduling/scheduling.models';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'availability-slot-row',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './availability-slot-row.component.html',
  styleUrl: './availability-slot-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilitySlotRowComponent {
  readonly slot = input.required<AvailabilitySlot>();
  readonly removeSlot = output<string>();

  get dayName(): string {
    return WEEKDAYS[this.slot().weekday] ?? 'Unknown';
  }
}
