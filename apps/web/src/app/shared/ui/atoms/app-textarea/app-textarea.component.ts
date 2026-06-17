import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './app-textarea.component.html',
  styleUrl: './app-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTextareaComponent {
  readonly id = input<string>('app-textarea');
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly rows = input<number>(4);
  readonly valueChange = output<string>();

  onInput(event: Event) {
    this.valueChange.emit((event.target as HTMLTextAreaElement).value);
  }
}
