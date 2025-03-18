import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private jwtHelper = inject(JwtHelperService);

  decode(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  isExpired() {
    return this.jwtHelper.isTokenExpired();
  }
}
