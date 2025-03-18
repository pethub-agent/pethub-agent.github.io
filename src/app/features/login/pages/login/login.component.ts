import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  formLogin = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

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
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
