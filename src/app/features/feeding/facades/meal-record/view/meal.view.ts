import { MealRecordTable } from '../../../../../core/services/database/tables/meal-record.table';
import { Option } from '../../../../../core/ui/select/select.interface';

export type MealRecordView = MealRecordTable & {
  type: Option;
  unit: Option;
};
