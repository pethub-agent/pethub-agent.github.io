import { PetTable } from '../../../../../core/services/database/tables/pet.table';
import { Option } from '../../../../../core/ui/select/select.interface';

export type PetStore = PetTable & {
  specie: Option;
  gender: Option;
};
