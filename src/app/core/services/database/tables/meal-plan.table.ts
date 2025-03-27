export const MEAL_PLAN_SCHEMA = [
  '++id',
  'feedingPlanId',
  'feedingTypeId',
  'measurementUnitId',
  'time',
  'amount',
  'note',
  'updateAt',
].toString();

export interface MealPlanTable {
  id?: number; // Identificador único do registro de refeição
  feedingPlanId: number; // ID do plano alimentar
  feedingTypeId: number; // Tipo de refeição
  measurementUnitId: number;
  time: string; // Horário previsto da refeição
  amount: number; // Quantidade oferecida
  note: string;
  updateAt: Date; // Data e hora em que o registro foi feito
}
