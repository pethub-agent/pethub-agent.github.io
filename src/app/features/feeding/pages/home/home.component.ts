import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../../core/ui/avatar/avatar.component';
import { BadgeComponent } from '../../../../core/ui/badge/badge.component';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';
import { HomeFacade } from '../../facades/history/home.facade';
import { HistoryView } from '../../facades/history/view/history.view';
import { PetView } from '../../facades/pet/view/pet.view';
import { ModalMealRecordComponent } from '../../ui/modal-meal-record/modal-meal-record.component';
import { PetSelectComponent } from '../../ui/pet-select/pet-select.component';
import { WeeklyGoalCardComponent } from '../../ui/weekly-goal-card/weekly-goal-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    AvatarComponent,
    ModalMealRecordComponent,
    WeeklyGoalCardComponent,
    PetSelectComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);

  private historyFacade = inject(HomeFacade);

  @ViewChild('modalMeal') modalMeal!: ModalMealRecordComponent;
  @ViewChildren('badges') badges!: QueryList<BadgeComponent>;

  history = signal<HistoryView>([]);
  selectedPet = signal<PetView | null>(null);
  badgeList = signal(['Meta Semanal', 'Histórico']);
  selectedBadge = signal(0);

  ngAfterViewInit(): void {
    this.historyFacade.findHistory().subscribe((history) => {
      this.history.set(history);
    });
  }

  activeBadge(index: number) {
    this.badges.forEach((badge, i) => {
      this.selectedBadge.set(index);
      badge.active = i == index;
    });
  }

  goToPetManager() {
    this.router.navigate(['alimentacao/pets']);
  }

  goToFeedingPlan() {
    this.router.navigate(['alimentacao/plano', this.selectedPet()?.id]);
  }

  registerMeal() {
    const petId = Number(this.selectedPet()?.id);
    if (this.selectedPet()?.id) {
      this.modalMeal.open(petId);
    }
  }
}
