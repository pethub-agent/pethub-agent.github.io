import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DB_NAME } from './database';

@Injectable({ providedIn: 'root' })
export class Seed {
  private db: Dexie = new Dexie(DB_NAME);

  constructor() {
    // this.db.version(1).stores({
    //   [tableName]: schema, // Define o esquema da tabela
    // });
    // // Obtém a referência da tabela
    // this.table = this.db.table(tableName);
    // Inicializa o banco de dados Dexie
    // this.db.version(1).stores({
    //   ['pet']: PET_SCHEMA,
    //   ['specie']: SPECIE_SCHEMA,
    //   ['user-pet']: USER_PET_SCHEMA,
    // });
    // this.db
    //   .table('specie')
    //   .count()
    //   .then((count) => {
    //     if (count === 0) {
    //   this.db.table('specie').bulkAdd([
    //     { id: 1, name: 'Cachorro' },
    //     { id: 2, name: 'Gato' },
    //     { id: 3, name: 'Outro' },
    //   ]);
    //     }
    //   });
  }
}
