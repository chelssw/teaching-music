import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { SchedulingHomePageComponent } from './pages/scheduling-home/scheduling-home-page.component';
import { StudentDashboardPageComponent } from './pages/student-dashboard/student-dashboard-page.component';
import { TeacherDashboardPageComponent } from './pages/teacher-dashboard/teacher-dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SchedulingHomePageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] },
    component: TeacherDashboardPageComponent
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] },
    component: StudentDashboardPageComponent
  }
];
