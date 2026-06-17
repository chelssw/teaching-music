import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './app-select.component.html',
  styleUrl: './app-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSelectComponent {
  readonly id = input<string>('app-select');
  readonly label = input<string>('');
  readonly options = input<SelectOption[]>([]);
  readonly value = input<string>('');
  readonly placeholder = input<string>('Select…');
  readonly valueChange = output<string>();

  onChange(event: Event) {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
