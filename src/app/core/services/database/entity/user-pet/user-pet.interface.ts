export const USER_PET_SCHEMA = [
  '++id',
  'userId',
  'petId',
  'createdAt',
  'updatedAt',
].toString();

export interface UserPet {
  id: number;
  userid: number; // ID of the user
  petid: number; // ID of the pet
  createdAt: Date; // Timestamp when the relationship was created
  updatedAt: Date; // Timestamp when the relationship was last updated
}
