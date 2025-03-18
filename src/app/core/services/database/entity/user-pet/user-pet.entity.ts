import { Injectable } from '@angular/core';
import { Database } from '../../database';
import { USER_PET_SCHEMA, UserPet } from './user-pet.interface';

@Injectable({
  providedIn: 'root',
})
export class UserPetEntity extends Database<UserPet> {
  constructor() {
    super('user-pet', USER_PET_SCHEMA);
  }
}
