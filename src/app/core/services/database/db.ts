import Dexie, { Table } from 'dexie';
import { PET_SCHEMA, PetTable } from './tables/pet.table';
import { SPECIE_SCHEMA, SpecieTable } from './tables/specie.table';
import { USER_SCHEMA, UserTable } from './tables/user.table';

export class AppDB extends Dexie {
  pet!: Table<PetTable, number>;
  specie!: Table<SpecieTable, number>;
  user!: Table<UserTable, number>;

  constructor() {
    super('pethub_db');
    this.version(1).stores({
      pet: PET_SCHEMA,
      specie: SPECIE_SCHEMA,
      user: USER_SCHEMA,
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.specie.bulkAdd([
      { id: 1, name: 'Cachorro' },
      { id: 2, name: 'Gato' },
      { id: 3, name: 'Outro' },
    ]);
  }
}

export const db = new AppDB();
