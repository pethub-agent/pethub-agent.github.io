export const USER_SCHEMA = [
  '++id',
  'name',
  'email',
  'sub',
  'role',
  'iat',
  'exp',
].toString();

export interface UserTable {
  id?: number; // Unique identifier for the species
  name: string;
  email: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
