export const PET_SCHEMA = [
  '++id',
  'ownerId',
  'specieId',
  'name',
  'breed',
  'birthDate',
  'gender',
  'photoUrl',
].toString();

export type PetGender = 'M' | 'F';

export interface PetTable {
  id?: number; // Unique identifier for the pet
  ownerId?: string; // ID of the user who owns the pet
  specieId: number; // ID of the species (e.g., dog, cat, etc.)
  name: string; // Name of the pet
  breed?: string; // raça
  birthDate: Date; // Date of birth of the pet
  gender: PetGender; // Gender of the pet ('m' for male, 'f' for female)
  photoUrl?: string; // URL of the pet's photo
}
