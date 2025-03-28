import { Injectable } from '@angular/core';
import moment from 'moment';
import { db } from '../../../../core/services/database/db';
import { MealPlanTable } from '../../../../core/services/database/tables/meal-plan.table';
import { FeedingPlanView, Meal } from './view/feeding-plan.view';

@Injectable({
  providedIn: 'root',
})
export class FeedingPlanFacade {
  async findFeedingType(feedingTypeId: number) {
    return await db.feedingType.get(feedingTypeId);
  }

  async saveFeedingPlan(plan: FeedingPlanView) {
    // Caso for edição
    if (!!plan.id) {
      await db.feedingPlan.update(plan.id, {
        startAt: plan.startAt,
        note: plan.note,
        updateAt: new Date(),
      });

      // Apaga todos planos de registro do plano
      await db.mealPlan.where('feedingPlanId').equals(plan.id).delete();
      // Adiciona o plano de registros
      await db.mealPlan.bulkAdd(
        plan.meals.map((meal) => {
          const data: MealPlanTable = {
            amount: meal.amount,
            feedingPlanId: Number(plan.id),
            feedingTypeId: Number(meal.type.id),
            measurementUnitId: Number(meal.unit.id),
            note: meal.note,
            time: meal.time,
            updateAt: new Date(),
          };
          return data;
        })
      );
    } else {
      // Caso for um novo plano de alimentação
      const feedingPlanId = await db.feedingPlan.add({
        createdAt: new Date(),
        petId: Number(plan.petId),
        note: plan.note,
        updateAt: new Date(),
        startAt: moment(plan.startAt).toDate(),
        endAt: null,
      });

      await db.mealPlan.bulkAdd(
        plan.meals.map((meal) => {
          const data: MealPlanTable = {
            amount: meal.amount,
            feedingPlanId: feedingPlanId,
            feedingTypeId: Number(meal.type.id),
            measurementUnitId: Number(meal.unit.id),
            note: meal.note,
            time: meal.time,
            updateAt: new Date(),
          };
          return data;
        })
      );
    }
  }

  async loadFeedingPlan(petId: number): Promise<FeedingPlanView | null> {
    const [pet, plan] = await Promise.all([
      db.pet.get(petId),
      db.feedingPlan
        .where({
          petId: petId,
        })
        .first(),
    ]);

    if (!pet) {
      console.error('Pet não encontrado: ' + petId);
      return null;
    }

    if (!plan) {
      console.log('Plano de alimentação do pet não encontrado: ' + petId);
      return null;
    }

    // Recupera configuração de registros de alimentação do plano de alimentação do Pet
    let mealRecords = await db.mealPlan
      .where({
        feedingPlanId: plan.id,
      })
      .toArray();

    // Inicia plano de alimentação
    const feedingPlan: FeedingPlanView = {
      id: plan.id,
      petId: Number(pet.id),
      startAt: plan.startAt,
      endAt: moment(plan.endAt).toDate(),
      status: '',
      updateAt: moment(plan.updateAt).toDate(),
      note: plan.note || '',
      meals: await Promise.all(
        mealRecords.map(async (m) => {
          // Recupera tipo de alimentacao
          const type = await db.feedingType.get(m.feedingTypeId);
          if (!type) {
            throw new Error(
              'Tipo de alimentação não encontrada: ' + m.feedingTypeId
            );
          }

          // Recupera unidade de medida
          const unit = await db.measurementUnit.get(m.measurementUnitId);
          if (!unit) {
            throw new Error(
              'Unidade de medida não encontrada: ' + m.measurementUnitId
            );
          }

          const meal: Meal = {
            id: m.id,
            feedingPlanId: m.feedingPlanId,
            time: m.time,
            amount: m.amount,
            note: m.note,
            unit: unit,
            type: {
              id: Number(type.id),
              description: type.description,
              type: type.type,
            },
          };
          return meal;
        })
      ),
    };

    return feedingPlan;
  }
}
