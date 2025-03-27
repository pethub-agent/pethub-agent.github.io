import Dexie, { Table } from 'dexie';
import {
  FEEDING_PLAN_SCHEMA,
  FeedingPlanTable,
} from './tables/feeding-plan.table';
import {
  FEEDING_TYPE_SCHEMA,
  FeedingTypeTable,
} from './tables/feeding-type.table';
import { MEAL_PLAN_SCHEMA, MealPlanTable } from './tables/meal-plan.table';
import {
  MEAL_RECORD_SCHEMA,
  MealRecordTable,
} from './tables/meal-record.table';
import {
  MEASUREMENT_UNIT_SCHEMA,
  MeasurementUnitTable,
} from './tables/measurement-unit.table';
import { PET_SCHEMA, PetTable } from './tables/pet.table';
import { SPECIE_SCHEMA, SpecieTable } from './tables/specie.table';
import { USER_SCHEMA, UserTable } from './tables/user.table';

export class AppDB extends Dexie {
  pet!: Table<PetTable, number>;
  specie!: Table<SpecieTable, number>;
  user!: Table<UserTable, number>;
  feedingPlan!: Table<FeedingPlanTable, number>;
  feedingType!: Table<FeedingTypeTable, number>;
  measurementUnit!: Table<MeasurementUnitTable, number>;
  mealRecord!: Table<MealRecordTable, number>;
  mealPlan!: Table<MealPlanTable, number>;

  constructor() {
    super('pethub_db');

    this.version(1).stores({
      pet: PET_SCHEMA,
      specie: SPECIE_SCHEMA,
      user: USER_SCHEMA,
      feedingPlan: FEEDING_PLAN_SCHEMA,
      feedingType: FEEDING_TYPE_SCHEMA,
      measurementUnit: MEASUREMENT_UNIT_SCHEMA,
      mealRecord: MEAL_RECORD_SCHEMA,
      mealPlan: MEAL_PLAN_SCHEMA,
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await Promise.all([
      // Especie de animal padrão
      db.specie.bulkAdd([
        { id: 1, name: 'Cachorro' },
        { id: 2, name: 'Gato' },
        { id: 3, name: 'Outro' },
      ]),
      // Tipos de ração padrão
      db.feedingType.bulkAdd([
        { id: 1, type: 'Ração', description: 'Ração seca' },
        { id: 2, type: 'Petisco', description: 'Petisco' },
        { id: 3, type: 'Suplemento', description: 'Suplemento' },
      ]),

      // Unidades de medida padrao
      db.measurementUnit.bulkAdd([
        {
          id: 1,
          unit: 'g',
          description: 'g',
        },
        {
          id: 2,
          unit: 'ml',
          description: 'ml',
        },
        {
          id: 3,
          unit: 'unidade',
          description: 'unidade',
        },
      ]),
    ]);
  }
}

export const db = new AppDB();
