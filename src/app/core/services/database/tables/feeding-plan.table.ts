export const FEEDING_PLAN_SCHEMA = [
  '++id',
  'petId',
  'note',
  'startAt',
  'endAt',
  'createdAt',
  'updateAt',
].toString();

export interface FeedingPlanTable {
  id?: number; // Identificador único do plano alimentar
  petId: number; // ID do pet
  note?: string; // Observações adicionais
  startAt: Date;
  endAt?: Date | null;
  createdAt?: Date; // Data de criação do plano
  updateAt?: Date;
}
