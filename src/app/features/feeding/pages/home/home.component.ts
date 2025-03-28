import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';
import { HistoryFacade } from '../../facades/history/history.facade';
import { HistoryView } from '../../facades/history/view/history.view';
import { PetFacade } from '../../facades/pet/pet.facade';
import { PetView } from '../../facades/pet/view/pet.view';
import { ModalMealRecordComponent } from '../../ui/modal-meal-record/modal-meal-record.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    AvatarComponent,
    ButtonComponent,

    ModalMealRecordComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);
  private pet = inject(PetFacade);
  private historyFacade = inject(HistoryFacade);

  @ViewChild('modalMeal') modalMeal!: ModalMealRecordComponent;

  petList = signal<PetView[]>([]);
  history = signal<HistoryView>([]);
  selectedPet: PetView | null = null;

  meal = {
    time: 'time',
    recordedAt: 'recordedAt',
    amount: 'amount',
    measurementUnitId: 'measurementUnitId',

    note: 'note',
  };

  ngAfterViewInit(): void {
    this.historyFacade.findHistory().subscribe((history) => {
      this.history.set(history);
    });

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

  activePet(pet: any): void {
    this.selectedPet = pet;
  }

  registerMeal() {
    if (this.selectedPet?.id) {
      this.modalMeal.open(this.selectedPet?.id);
    }
  }
}
