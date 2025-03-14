import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export abstract class Database<T extends { id?: number }> {
  private dbName = 'pethub_database';
  private db: Dexie;
  private table: Table<T, number>;

  constructor(tableName: string, schema: string) {
    // Inicializa o banco de dados Dexie
    this.db = new Dexie(this.dbName);
    this.db.version(1).stores({
      [tableName]: schema, // Define o esquema da tabela
    });

    // Obtém a referência da tabela
    this.table = this.db.table(tableName);
  }

  // Métodos genéricos CRUD
  async add(item: T): Promise<number> {
    return this.table.add(item);
  }

  async getById(id: number): Promise<T | undefined> {
    return this.table.get(id);
  }

  async getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async update(item: T): Promise<number> {
    if (!item.id) {
      throw new Error('Item ID is required for update.');
    }

    return this.table.update(item.id, item as any);
  }

  async delete(id: number): Promise<void> {
    return this.table.delete(id);
  }

  async clear(): Promise<void> {
    return this.table.clear();
  }
}
