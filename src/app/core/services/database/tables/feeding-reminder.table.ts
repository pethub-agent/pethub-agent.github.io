export const FEEDING_REMINDER_SCHEMA = [
  '++id',
  'feedingPlanId',
  'reminderTime',
  'isActive',
  'lastSentAt',
].toString();

export interface FeedingReminderTable {
  id?: number; // Identificador único do lembrete
  feedingPlanId: number; // ID do plano alimentar relacionado
  reminderTime: string; // Horário do lembrete (HH:mm)
  isActive: boolean; // Indica se o lembrete está ativo
  lastSentAt?: Date; // Data e hora da última notificação enviada
}
