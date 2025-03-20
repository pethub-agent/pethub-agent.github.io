import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageKeys } from '../storage/storage.enum';
import { StorageService } from '../storage/storage.service';
import { JwtPayload } from './jwt-payload';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private jwtHelper = inject(JwtHelperService);
  private storage = inject(StorageService);
  decode(token?: string) {
    if (!token) {
      token = this.storage.get(StorageKeys.token) || '';
    }
    return this.jwtHelper.decodeToken<JwtPayload>(token);
  }

  isExpired() {
    return this.jwtHelper.isTokenExpired();
  }
}
