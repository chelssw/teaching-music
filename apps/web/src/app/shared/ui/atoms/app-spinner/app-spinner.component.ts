import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './app-spinner.component.html',
  styleUrl: './app-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSpinnerComponent {}
