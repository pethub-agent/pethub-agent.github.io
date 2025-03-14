import { Injectable } from '@angular/core';
import { Database } from '../../database';
import { Pet, PET_SCHEMA } from './pet.interface';

@Injectable()
export class PetEntity extends Database<Pet> {
  constructor() {
    super('pet', PET_SCHEMA);
  }
}
