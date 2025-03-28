import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Test2Component } from './components/test2.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule, Test2Component],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  @ViewChild('weeklyConsumptionChart', { static: true }) chartRef!: ElementRef;

  pets = [
    {
      id: 1,
      name: 'Rex',
      type: 'Cachorro',
      breed: 'Golden Retriever',
      age: 3,
      weight: 28,
      image: 'assets/dog1.jpg',
    },
    {
      id: 2,
      name: 'Mimi',
      type: 'Gato',
      breed: 'Siamês',
      age: 2,
      weight: 4.5,
      image: 'assets/cat1.jpg',
    },
    {
      id: 3,
      name: 'Pipoca',
      type: 'Coelho',
      breed: 'Mini Lop',
      age: 1,
      weight: 1.8,
      image: 'assets/rabbit1.jpg',
    },
  ];

  selectedPet = 1;
  dailyGoal = 420;
  consumedToday = 280;

  recentFeedings = [
    {
      id: 1,
      foodType: 'Ração Premium',
      amount: 120,
      time: new Date(),
      mealType: 'Almoço',
    },
    {
      id: 2,
      foodType: 'Petisco',
      amount: 30,
      time: new Date(Date.now() - 3600000),
      mealType: 'Lanche',
    },
    {
      id: 3,
      foodType: 'Ração Premium',
      amount: 130,
      time: new Date(Date.now() - 28800000),
      mealType: 'Café da manhã',
    },
  ];

  chart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Consumo (g)',
            data: [320, 400, 280, 420, 390, 250, 380],
            backgroundColor: '#6366F1',
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              // drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  getSelectedPet() {
    return this.pets.find((pet) => pet.id === this.selectedPet);
  }

  getPetImage() {
    const pet = this.getSelectedPet();
    return pet?.image || 'assets/default-pet.jpg';
  }

  onPetChange() {
    // Atualizar dados quando o pet é alterado
    // Simulação - na prática você buscaria esses dados de um serviço
    this.dailyGoal =
      this.getSelectedPet()?.type === 'Cachorro'
        ? 420
        : this.getSelectedPet()?.type === 'Gato'
        ? 80
        : 50;
    this.consumedToday = Math.floor(this.dailyGoal * 0.6);
    this.updateChartData();
  }

  updateChartData() {
    // Simulação de dados diferentes para cada pet
    if (this.chart) {
      const newData =
        this.getSelectedPet()?.id === 1
          ? [320, 400, 280, 420, 390, 250, 380]
          : this.getSelectedPet()?.id === 2
          ? [70, 80, 65, 90, 75, 50, 85]
          : [40, 50, 45, 55, 50, 30, 60];

      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
  }

  openAddFeedingModal() {
    // Implementar abertura de modal para registrar nova alimentação
    console.log('Abrir modal de registro de alimentação');
  }
}
