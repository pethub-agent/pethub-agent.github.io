import { Injectable } from '@angular/core';
import moment from 'moment';
import { db } from '../../../../core/services/database/db';
import { MealPlanTable } from '../../../../core/services/database/tables/meal-plan.table';
import { MealRecordTable } from '../../../../core/services/database/tables/meal-record.table';
import { Option } from '../../../../core/ui/select/select.interface';
import { AddMealRecordDto } from './dto/add-meal-record.dto';
import { MealRecordView } from './view/meal.view';

@Injectable({
  providedIn: 'root',
})
export class MealRecordFacade {
  async listUnits() {
    const units = await db.measurementUnit.toArray();
    return units;
  }

  async listFeedingType() {
    const types = await db.feedingType.toArray();
    return types;
  }

  async addMealRecord(petId: number, data: AddMealRecordDto) {
    const feedingPlan = await db.feedingPlan.get({
      petId: petId,
    });

    if (!feedingPlan) {
      throw new Error(
        'Plano de alimentação não encontrado para o pet: ' + feedingPlan
      );
    }

    await db.mealRecord.add({
      feedingPlanId: Number(feedingPlan.id),
      feedingTypeId: Number(data.feedingType.value),
      measurementUnitId: Number(data.unit.value),
      time: data.time,
      amount: data.amount,
      note: data.note,
      recordedAt: new Date(),
    });
    return;
  }

  async findMealTemplate(
    petId: number,
    currentTime: Date
  ): Promise<MealRecordView | null> {
    try {
      // 1. Encontrar o plano de alimentação ativo para o pet
      const activePlan = await db.feedingPlan
        .where('petId')
        .equals(petId)
        .and(
          (plan) =>
            plan.startAt <= currentTime &&
            (plan.endAt === null || (plan.endAt || moment()) >= currentTime)
        )
        .first();

      if (!activePlan) {
        console.log(
          'Nenhum plano de alimentação ativo encontrado para este pet'
        );
        return null;
      }

      // 2. Converter hora atual para formato HH:MM
      const currentHours = currentTime.getHours().toString().padStart(2, '0');
      const currentMinutes = currentTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      // 3. Buscar todos os templates de refeição para este plano
      const allMealTemplates = await db.mealPlan
        .where('feedingPlanId')
        .equals(Number(activePlan.id))
        .toArray();

      if (allMealTemplates.length === 0) {
        console.log('Nenhum template de refeição encontrado para este plano');
        return null;
      }

      // 4. Encontrar o template mais próximo do horário atual
      let closestTemplate: MealPlanTable | null = null;
      let smallestDiff = Infinity;

      for (const template of allMealTemplates) {
        const [templateHours, templateMinutes] = template.time
          .split(':')
          .map(Number);
        const templateTimeInMinutes = templateHours * 60 + templateMinutes;
        const currentTimeInMinutes =
          currentTime.getHours() * 60 + currentTime.getMinutes();

        // Calcular diferença de tempo (considerando que o dia tem 1440 minutos)
        let diff = Math.abs(templateTimeInMinutes - currentTimeInMinutes);
        diff = Math.min(diff, 1440 - diff); // Para lidar com virada de dia

        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestTemplate = template;
        }
      }

      let [unitData, typeData] = await Promise.all([
        db.measurementUnit.get(Number(closestTemplate?.measurementUnitId)),
        db.feedingType.get(Number(closestTemplate?.feedingTypeId)),
      ]);

      if (!typeData) {
        throw new Error('Tipo de alimentação não encontrada: ');
      }

      if (!unitData) {
        throw new Error('Unidade de medida não encontrada: ');
      }

      let type: Option = {
        value: String(typeData.id),
        label: typeData.description,
      } as Option;
      let unit: Option = {
        value: String(unitData.id),
        label: unitData.description,
      } as Option;

      const result: MealRecordTable = closestTemplate as any;
      return { ...result, type, unit };
    } catch (error) {
      console.error('Erro ao buscar template de refeição:', error);
      return null;
    }
  }
}
