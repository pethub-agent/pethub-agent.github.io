export const PET_SCHEMA = [
  '++id',
  'name',
  'species',
  'breed',
  'age',
  'gender',
  'photoUrl',
  'ownerId',
].toString();

export type PetGender = 'M' | 'F';

export interface PetTable {
  id?: number; // Unique identifier for the pet
  name: string; // Name of the pet
  breed?: string; // raça
  specieId: number; // ID of the species (e.g., dog, cat, etc.)
  owneriId?: number; // ID of the user who owns the pet
  birthDate: Date; // Date of birth of the pet
  gender: PetGender; // Gender of the pet ('m' for male, 'f' for female)
  photoUrl?: string; // URL of the pet's photo
}
