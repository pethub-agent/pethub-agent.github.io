import { Injectable } from '@angular/core';
import { Database } from '../../database';
import { Specie, SPECIE_SCHEMA } from './specie.interface';

@Injectable({
  providedIn: 'root',
})
export class SpecieEntity extends Database<Specie> {
  constructor() {
    super('specie', SPECIE_SCHEMA, [
      { id: 1, name: 'Cachorro' },
      { id: 2, name: 'Gato' },
      { id: 3, name: 'Outro' },
    ]);
  }
}
