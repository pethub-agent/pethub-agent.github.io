export type DailyStatus = 'completed' | 'partial' | 'failed' | 'exceeded';

export interface WeeklyProgressView {
  weeklyGoal: number;
  dailyProgress: Array<{
    day: string;
    date: string;
    completed: number;
    goal: number;
    status: DailyStatus;
  }>;
  weeklyCompletion: number;
}
