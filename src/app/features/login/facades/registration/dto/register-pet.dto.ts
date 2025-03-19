import { PetGender } from '../../../../../core/services/database/tables/pet.table';

export interface RegisterPetDto {
  name: string;
  specieId: number; // Pode ser um ID (string) ou um enum futuramente
  breed: string;
  birth: string; // Pode ser transformado em Date se necessário
  gender: PetGender; // Definição de gênero com valores específicos
  photo: string;
}
