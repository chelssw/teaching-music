import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './app-badge.component.html',
  styleUrl: './app-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBadgeComponent {
  readonly text = input.required<string>();
  readonly variant = input<BadgeVariant>('default');
}
