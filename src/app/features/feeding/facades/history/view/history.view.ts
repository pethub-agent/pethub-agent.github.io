import { MealRecordTable } from '../../../../../core/services/database/tables/meal-record.table';
import { PetTable } from '../../../../../core/services/database/tables/pet.table';
import { Option } from '../../../../../core/ui/select/select.interface';

export type HistoryView = Array<
  MealRecordTable & {
    type: Option;
    unit: Option;
    pet: PetTable;
  }
>;
