import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiBase } from '../api';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ILogin } from './interfaces/login.interfae';
import { IRegister } from './interfaces/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends ApiBase {
  constructor(http: HttpClient) {
    super(http, { host: environment.apiUrl + 'auth' });
  }

  register(data: RegisterDto): Observable<IRegister> {
    return this.post('register', data);
  }

  login(data: LoginDto): Observable<ILogin> {
    return this.post('login', data);
  }
}
