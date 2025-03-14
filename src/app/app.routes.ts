import { Routes } from '@angular/router';
import { ConfirmationComponent } from './features/login/pages/confirmation/confirmation.component';
import { IntroductionComponent } from './features/login/pages/introduction/introduction.component';
import { LoginComponent } from './features/login/pages/login/login.component';
import { RegisterPetComponent } from './features/login/pages/register-pet/register-pet.component';
import { RegisterUserComponent } from './features/login/pages/register-user/register-user.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login/confirmacao',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login-layout.component').then(
        (m) => m.LoginLayoutComponent
      ),
    children: [
      {
        path: 'confirmacao',
        component: ConfirmationComponent,
      },
      {
        path: 'introducao',
        component: IntroductionComponent,
      },
      {
        path: 'meu-pet',
        component: RegisterPetComponent,
      },
      {
        path: 'perfil',
        component: RegisterUserComponent,
      },
      {
        path: 'sign',
        component: LoginComponent,
      },
    ],
  },
];
