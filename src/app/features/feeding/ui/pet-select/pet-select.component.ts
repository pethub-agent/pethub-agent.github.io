import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';
import { PetFacade } from '../../facades/pet/pet.facade';
import { PetView } from '../../facades/pet/view/pet.view';

@Component({
  selector: 'app-pet-select',
  standalone: true,
  imports: [CommonModule, AvatarComponent, IconComponent],
  templateUrl: './pet-select.component.html',
  styleUrl: './pet-select.component.scss',
})
export class PetSelectComponent implements AfterViewInit {
  private petFacade = inject(PetFacade);
  private router = inject(Router);

  @Output() onSelect = new EventEmitter<PetView>();

  petList = signal<PetView[]>([]);
  selectedPet = signal<PetView | null>(null);

  ngAfterViewInit(): void {
    this.petFacade.listPets().then((pets) => {
      this.petList.set(pets);
      this.activePet(pets[0]);
    });
  }

  activePet(pet: PetView): void {
    this.selectedPet.set(pet);
    this.onSelect.emit(pet);
  }

  addPet() {
    this.router.navigate(['alimentacao/pet']);
  }
}
