import { Injectable } from '@angular/core';
import { StorageKeys } from './storage.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly prefix = 'pethub_';

  get(key: StorageKeys): string | null {
    return localStorage.getItem(this.prefix + key);
  }

  set(key: StorageKeys, value: string) {
    localStorage.setItem(this.prefix + key, value);
  }

  remove(key: StorageKeys) {
    localStorage.removeItem(this.prefix + key);
  }
}
