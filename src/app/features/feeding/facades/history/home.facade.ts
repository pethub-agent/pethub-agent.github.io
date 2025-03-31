import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { from, Observable } from 'rxjs';
import { db } from '../../../../core/services/database/db';
import { MealRecordTable } from '../../../../core/services/database/tables/meal-record.table';
import { Option } from '../../../../core/ui/select/select.interface';
import { HistoryView } from './view/history.view';
import { DailyStatus, WeeklyProgressView } from './view/weekly-progress.view';

@Injectable({
  providedIn: 'root',
})
export class HomeFacade {
  findHistory(): Observable<HistoryView> {
    return from(
      liveQuery(async () => {
        const result: HistoryView = [];

        const mealRecord = await db.mealRecord
          .orderBy('id')
          .reverse()
          .toArray();

        await Promise.all(
          mealRecord.map(async (mr) => {
            const [unitData, typeData] = await Promise.all([
              db.measurementUnit.get(mr.measurementUnitId),
              db.feedingType.get(mr.feedingTypeId),
            ]);

            const unit: Option = {
              value: String(unitData?.id),
              label: unitData?.description || '',
            };
            const type: Option = {
              value: String(typeData?.id),
              label: typeData?.description || '',
            };

            const pet = await db.pet.get(mr.petId);
            if (!pet) {
              throw new Error('Pet não foi encontrado ');
            }
            result.push({ ...mr, type, unit, pet });
          })
        );

        return result.sort((a, b) => Number(b.id) - Number(a.id));
      })
    );
  }

  async getWeeklyProgress(petId: number): Promise<WeeklyProgressView | null> {
    // Obter data atual
    const today = new Date();

    // Obter domingo da semana atual (primeiro dia da semana)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay()); // today.getDay() retorna 0 para domingo

    // Obter sábado da semana atual (último dia da semana)
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    // Obter refeições do período da semana atual
    const feedingPlan = await db.feedingPlan
      .where({
        petId: petId,
      })
      .first();

    if (!feedingPlan) {
      console.log('Não foi encontrado plano de alimentação');
      return null;
    }

    const totalMealPlan = await db.mealPlan
      .where({
        feedingPlanId: feedingPlan.id,
      })
      .count();

    const meals: MealRecordTable[] = await db.mealRecord
      .where('recordAt')
      .between(
        new Date(sunday.setHours(0, 0, 0, 0)),
        new Date(saturday.setHours(23, 59, 59, 999))
      )
      .and((d) => d.feedingPlanId == feedingPlan.id || d.petId == petId)
      .toArray();

    // Criar array com todos os dias da semana atual
    const weekDays = Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date(sunday);
        date.setDate(date.getDate() + i);
        return date;
      });

    // Agrupar por dia e contar refeições
    const dailyCounts = this.groupByDay(meals);

    // Calcular progresso diário
    const dailyProgress = weekDays.map((date) => {
      const dayKey = date.toISOString().split('T')[0];

      return {
        day: this.getDayName(date.getDay()),
        date: dayKey,
        completed: dailyCounts[dayKey] || 0,
        goal: totalMealPlan, // Meta diária fixa - ajuste conforme necessário
        status: this.getStatus(dailyCounts[dayKey] || 0, totalMealPlan),
      };
    });

    const totalCompleted = dailyProgress.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const weeklyGoal = totalMealPlan * 7; // 5 refeições/dia * 7 dias

    return {
      weeklyGoal,
      dailyProgress,
      weeklyCompletion: Math.round((totalCompleted / weeklyGoal) * 100),
    };
  }

  private groupByDay(meals: MealRecordTable[]): { [key: string]: number } {
    return meals.reduce((acc, meal) => {
      const date = new Date(meal.recordAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1; // Conta cada refeição como 1 (simplificado)
      return acc;
    }, {} as { [key: string]: number });
  }

  private getDayName(dayIndex: number): string {
    const days = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    return days[dayIndex];
  }

  private getStatus(completed: number, goal: number): DailyStatus {
    if (completed >= goal) return 'completed';
    if (completed === 0) return 'failed';
    if (completed > goal) return 'exceeded';
    return 'partial';
  }
}
