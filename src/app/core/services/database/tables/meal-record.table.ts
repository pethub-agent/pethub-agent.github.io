export const MEAL_RECORD_SCHEMA = [
  '++id',
  'feedingPlanId',
  'petId',
  'feedingTypeId',
  'measurementUnitId',
  'time',
  'amount',
  'note',
  'recordAt',
].toString();

export interface MealRecordTable {
  id?: number; // Identificador único do registro de refeição
  feedingPlanId?: number; // ID do plano alimentar
  petId: number;
  feedingTypeId: number; // Tipo de refeição
  measurementUnitId: number; // Unidade de medida
  time: string; // Horário previsto da refeição
  amount: number; // Quantidade oferecida
  note: string;
  recordAt: Date; // Data e hora em que o registro foi feito
}
