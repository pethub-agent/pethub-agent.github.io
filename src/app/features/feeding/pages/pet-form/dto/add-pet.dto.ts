import { PetGender } from '../../../../../core/services/database/tables/pet.table';

export interface AddPetDto {
  id: number;
  specieId: number;
  name: string;
  breed: string;
  birth: Date;
  gender: PetGender;
  photo: string;
}
