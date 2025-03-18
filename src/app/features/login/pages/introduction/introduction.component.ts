import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Seed } from '../../../../core/services/database/seed';
import { ButtonComponent } from '../../../../core/ui/button/button.component';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.scss',
})
export class IntroductionComponent {
  private router = inject(Router);

  constructor() {
    const s = inject(Seed);
  }

  goToRegisterPet() {
    this.router.navigate(['/login/meu-pet']);
  }
}
