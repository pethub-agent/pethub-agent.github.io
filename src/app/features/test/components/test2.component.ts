import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-test2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center space-x-4">
        <img
          [src]="selectedPet.image"
          class="w-16 h-16 rounded-full"
          alt="Pet Image"
        />
        <h2 class="text-xl font-bold">{{ selectedPet.name }}</h2>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <canvas id="feedingChart"></canvas>
      </div>

      <div class="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 class="text-lg font-semibold">Histórico de Alimentação</h3>
        <ul>
          <li *ngFor="let meal of meals" class="p-2 border-b">
            <div class="flex justify-between">
              <span class="font-semibold">{{ meal.time }}</span>
              <span>{{ meal.type }} - {{ meal.amount }}{{ meal.unit }}</span>
            </div>
          </li>
        </ul>
      </div>

      <button
        class="w-full bg-blue-500 text-white p-3 rounded-xl"
        (click)="addMeal()"
      >
        Registrar Refeição
      </button>
    </div>
  `,
  styles: [``],
})
export class Test2Component {
  selectedPet = {
    name: 'Rex',
    image: 'https://via.placeholder.com/64',
  };

  meals = [
    { time: '08:00', type: 'Ração', amount: 100, unit: 'g' },
    { time: '12:00', type: 'Frango Cozido', amount: 200, unit: 'g' },
  ];

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {
    const ctx = document.getElementById('feedingChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ração', 'Frango Cozido'],
        datasets: [
          {
            data: [60, 40],
            backgroundColor: ['#4F46E5', '#F59E0B'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  addMeal() {
    alert('Adicionar refeição');
  }
}
