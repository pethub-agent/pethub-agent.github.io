import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { liveQuery } from 'dexie';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { HomeFacade } from '../../facades/history/home.facade';
import { WeeklyProgressView } from '../../facades/history/view/weekly-progress.view';

@Component({
  selector: 'app-weekly-goal-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './weekly-goal-card.component.html',
  styleUrl: './weekly-goal-card.component.scss',
})
export class WeeklyGoalCardComponent implements OnChanges, OnDestroy {
  private homeFacade = inject(HomeFacade);
  private router = inject(Router);

  @Input() petId!: number;

  data = signal<WeeklyProgressView | null>(null);
  sub = new Subscription();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['petId']) {
      this.sub.add(
        liveQuery(() =>
          this.homeFacade.getWeeklyProgress(this.petId)
        ).subscribe((data) => {
          console.log('livequery', data);
          this.data.set(data);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goToFeedingPlan() {
    this.router.navigate(['alimentacao/plano', this.petId]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'exceeded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✓';
      case 'partial':
        return '~';
      case 'failed':
        return '✕';
      case 'exceeded':
        return '+';
      default:
        return '?';
    }
  }

  getCompletedMeals(): number {
    if (!this.data()?.dailyProgress) return 0;
    return (
      this.data()?.dailyProgress.reduce(
        (total, day) => total + day.completed,
        0
      ) || 0
    );
  }
}
