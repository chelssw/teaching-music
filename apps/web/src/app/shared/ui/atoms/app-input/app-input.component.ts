import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppInputComponent {
  readonly id = input<string>('app-input');
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly valueChange = output<string>();

  onInput(event: Event) {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
