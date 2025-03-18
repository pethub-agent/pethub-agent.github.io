import { IRegisterPet } from './register-pet.interface';

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  confirmation: string;
  pet: IRegisterPet | null;
}
