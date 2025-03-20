import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { db } from '../../../../core/services/database/db';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent, AvatarComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);

  petList = from(liveQuery(() => db.pet.toArray()));

  // Test Remover
  userName = 'Toan';
  nextFeeding = { time: '13:00', pet: 'Thor 🐶' };
  stockStatus = 'OK ✅';
  nextEvent = { description: 'Vacina amanhã 💉' };

  ngAfterViewInit(): void {
    this.petList.subscribe((pets) => {
      // this.selectPet(pets[0]);
    });
  }

  goToPetManager() {
    this.router.navigate(['alimentacao/pets']);
  }

  // Pet selecionado
  selectedPet: any | null = null;

  // Método para selecionar um pet
  selectPet(pet: any): void {
    this.selectedPet = pet;
  }
}
