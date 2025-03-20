import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { db } from '../../../../core/services/database/db';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';

@Component({
  selector: 'app-manage-pets',
  standalone: true,
  imports: [CommonModule, IconComponent, AvatarComponent],
  templateUrl: './manage-pets.component.html',
  styleUrl: './manage-pets.component.scss',
})
export class ManagePetsComponent {
  private router = inject(Router);

  pets = from(liveQuery(() => db.pet.toArray()));

  openAddPet() {
    this.router.navigate(['alimentacao/pet']);
  }

  editPet(pet: any) {
    this.router.navigate(['alimentacao/pet', pet.id]);
  }

  deletePet(id: number) {}

  back() {
    history.back();
  }
}
