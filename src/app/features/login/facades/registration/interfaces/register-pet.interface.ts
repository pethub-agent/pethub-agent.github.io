import { PetGender } from '../../../../../core/services/database/tables/pet.table';
import { SpecieTable } from '../../../../../core/services/database/tables/specie.table';

export interface IRegisterPet {
  name: string;
  breed: string;
  gender: PetGender;
  birth: Date;
  photo: string;
  specie?: SpecieTable;
}
