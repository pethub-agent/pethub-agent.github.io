import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { db } from '../../../../core/services/database/db';
import { Option } from '../../../../core/ui/select/select.interface';
import { HistoryView } from './view/history.view';

@Injectable({
  providedIn: 'root',
})
export class HistoryFacade {
  findHistory() {
    return from(
      liveQuery(async () => {
        const result: HistoryView = [];

        const mealRecord = await db.mealRecord
          .orderBy('recordedAt')
          .reverse()
          .limit(20)
          .toArray();

        await Promise.all(
          mealRecord.map(async (mr) => {
            const [unitData, typeData, plan] = await Promise.all([
              db.measurementUnit.get(mr.measurementUnitId),
              db.feedingType.get(mr.feedingTypeId),
              db.feedingPlan.get(mr.feedingPlanId),
            ]);

            if (!plan) {
              throw new Error('Plano de alimentação não foi encontrado');
            }

            const unit: Option = {
              value: String(unitData?.id),
              label: unitData?.description || '',
            };
            const type: Option = {
              value: String(typeData?.id),
              label: typeData?.description || '',
            };

            const pet = await db.pet.get(plan.petId);
            if (!pet) {
              throw new Error('Pet não foi encontrado ');
            }
            result.push({ ...mr, type, unit, pet });
          })
        );

        return result;
      })
    );
  }
}
