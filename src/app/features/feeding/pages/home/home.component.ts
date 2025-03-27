import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';
import { PetStore } from '../../facades/pet/interfaces/pet.interface';
import { PetFacade } from '../../facades/pet/pet.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent, AvatarComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);
  private pet = inject(PetFacade);

  petList = signal<PetStore[]>([]);
  selectedPet: PetStore | null = null;

  ngAfterViewInit(): void {
    this.pet.listPets().then((pets) => {
      this.petList.set(pets);
      this.activePet(this.petList()[0]);
    });
  }

  goToPetManager() {
    this.router.navigate(['alimentacao/pets']);
  }

  goToFeedingPlan() {
    this.router.navigate(['alimentacao/plano', this.selectedPet?.id]);
  }

  // Método para selecionar um pet
  activePet(pet: any): void {
    this.selectedPet = pet;
  }
}
