export const PET_SCHEMA = '++id, name, species, breed, age, gender, photoUrl';

export interface Pet {
  id: number;
  name: string;
  species: string; //'Dog' | 'Cat' | 'Other';
  breed?: string; // raça
  age: number;
  gender: 'Male' | 'Female';
  photoUrl?: string;
}
