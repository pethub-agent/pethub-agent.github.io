export const FEEDING_HISTORY_SCHEMA = [
  '++id',
  'petId',
  'date',
  'totalMeals',
  'mealsCompleted',
  'adherencePercentage',
].toString();

export interface FeedingHistoryTable {
  id?: number; // Identificador único do histórico
  petId: number; // ID do pet
  date: string; // Data do histórico (YYYY-MM-DD)
  totalMeals: number; // Total de refeições previstas no dia
  mealsCompleted: number; // Número de refeições registradas
  adherencePercentage: number; // Percentual de adesão
}
