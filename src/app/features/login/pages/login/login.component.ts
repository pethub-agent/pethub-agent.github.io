import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { StorageKeys } from '../../../../core/services/storage/storage.enum';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { RegistrationFacade } from '../../facades/registration/registration.facade';
import { LoginButtonComponent } from '../../ui/login-button/login-button.component';
import { LoginInputComponent } from '../../ui/login-input/login-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LoginInputComponent, LoginButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private registration = inject(RegistrationFacade);
  private jwt = inject(JwtService);
  private storage = inject(StorageService);
  private router = inject(Router);

  formLogin = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  d() {
    return this.jwt.decode(this.storage.get(StorageKeys.token) || '');
  }

  submitLogin() {
    if (!this.formLogin.valid) {
      return;
    }

    this.registration
      .login(
        this.formLogin.value.email || '',
        this.formLogin.value.password || ''
      )
      .subscribe({
        next: (result: any) => {
          return this.registration
            .saveStore()
            .then(() => this.router.navigate(['alimentacao/home']));
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
