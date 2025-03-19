import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtPayload } from './jwt.interface';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private jwtHelper = inject(JwtHelperService);

  decode(token: string) {
    return this.jwtHelper.decodeToken<JwtPayload>(token);
  }

  isExpired() {
    return this.jwtHelper.isTokenExpired();
  }
}
