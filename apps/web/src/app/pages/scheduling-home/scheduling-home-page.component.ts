import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppButtonComponent } from '../../shared/ui/atoms/app-button/app-button.component';
import { AuthStoreService } from '../../core/auth/auth-store.service';

@Component({
  selector: 'scheduling-home-page',
  standalone: true,
  imports: [AppButtonComponent, RouterLink],
  templateUrl: './scheduling-home-page.component.html',
  styleUrl: './scheduling-home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingHomePageComponent implements OnInit {
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);

  ngOnInit() {
    const user = this.authStore.user();
    if (user) {
      this.router.navigateByUrl(user.role === 'teacher' ? '/teacher' : '/student');
    }
  }
}
