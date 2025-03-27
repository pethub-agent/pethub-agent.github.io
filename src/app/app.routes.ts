import { Routes } from '@angular/router';
import { FeedingPlanComponent } from './features/feeding/pages/feeding-plan/feeding-plan.component';
import { HomeComponent } from './features/feeding/pages/home/home.component';
import { ManagePetsComponent } from './features/feeding/pages/manage-pets/manage-pets.component';
import { PetFormComponent } from './features/feeding/pages/pet-form/pet-form.component';
import { ConfirmationComponent } from './features/login/pages/confirmation/confirmation.component';
import { IntroductionComponent } from './features/login/pages/introduction/introduction.component';
import { LoginComponent } from './features/login/pages/login/login.component';
import { RegisterPetComponent } from './features/login/pages/register-pet/register-pet.component';
import { RegisterUserComponent } from './features/login/pages/register-user/register-user.component';
import { TestComponent } from './features/test/test.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    // redirectTo: 'test',
    redirectTo: 'login/introducao',
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: 'alimentacao',
    loadComponent: () =>
      import('./features/feeding/feeding-layout.component').then(
        (m) => m.FeedingLayoutComponent
      ),
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'pets',
        component: ManagePetsComponent,
      },
      {
        path: 'pet/:id',
        component: PetFormComponent,
      },
      {
        path: 'pet',
        component: PetFormComponent,
      },
      {
        path: 'plano/:petId',
        component: FeedingPlanComponent,
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login-layout.component').then(
        (m) => m.LoginLayoutComponent
      ),
    children: [
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
        path: 'confirmacao',
        component: ConfirmationComponent,
      },
      {
        path: 'sign',
        component: LoginComponent,
      },
    ],
  },
];
