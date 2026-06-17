import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppCardComponent } from '../../atoms/app-card/app-card.component';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { LessonType } from '../../../../core/scheduling/scheduling.models';

@Component({
  selector: 'lesson-type-card',
  standalone: true,
  imports: [AppCardComponent, AppButtonComponent],
  templateUrl: './lesson-type-card.component.html',
  styleUrl: './lesson-type-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonTypeCardComponent {
  readonly lessonType = input.required<LessonType>();
  readonly showDelete = input<boolean>(false);
  readonly deleteType = output<string>();

  get formattedPrice(): string {
    return `$${(this.lessonType().priceCents / 100).toFixed(2)}`;
  }
}
