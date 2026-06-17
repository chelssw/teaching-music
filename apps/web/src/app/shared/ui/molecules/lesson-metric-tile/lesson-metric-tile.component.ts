import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppBadgeComponent } from '../../atoms/app-badge/app-badge.component';
import { AppCardComponent } from '../../atoms/app-card/app-card.component';

@Component({
  selector: 'lesson-metric-tile',
  standalone: true,
  imports: [AppBadgeComponent, AppCardComponent],
  templateUrl: './lesson-metric-tile.component.html',
  styleUrl: './lesson-metric-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonMetricTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly changeLabel = input<string>('Stable');
}
