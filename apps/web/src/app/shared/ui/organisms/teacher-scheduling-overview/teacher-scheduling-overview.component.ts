import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { LessonMetricTileComponent } from '../../molecules/lesson-metric-tile/lesson-metric-tile.component';

@Component({
  selector: 'teacher-scheduling-overview',
  standalone: true,
  imports: [LessonMetricTileComponent, AppButtonComponent],
  templateUrl: './teacher-scheduling-overview.component.html',
  styleUrl: './teacher-scheduling-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherSchedulingOverviewComponent {}
