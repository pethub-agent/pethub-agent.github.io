export interface AddMealRecordDto {
  feedingType: {
    value: string;
    label: string;
  };
  amount: number;
  unit: {
    value: string;
    label: string;
  };
  time: string;
  note: string;
  recordAt: Date;
}
