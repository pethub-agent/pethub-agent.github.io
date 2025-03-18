export interface RegisterPetDto {
  name: string;
  specieId: number; // Pode ser um ID (string) ou um enum futuramente
  breed: string;
  birth: string; // Pode ser transformado em Date se necessário
  gender: 'M' | 'F' | string; // Definição de gênero com valores específicos
}
