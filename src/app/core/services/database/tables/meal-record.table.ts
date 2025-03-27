export const MEAL_RECORD_SCHEMA = [
  '++id',
  'measurementUnitId',
  'feedingPlanId',
  'petId',
  'time',
  'type',
  'amount',
  'note',
  'recordedAt',
].toString();

export interface MealRecordTable {
  id?: number; // Identificador único do registro de refeição
  feedingPlanId: number; // ID do plano alimentar
  feedingTypeId: number; // Tipo de refeição
  measurementUnitId: number; // Unidade de medida
  time: string; // Horário previsto da refeição

  amount: number; // Quantidade oferecida
  note: string;
  recordedAt: Date; // Data e hora em que o registro foi feito
}
