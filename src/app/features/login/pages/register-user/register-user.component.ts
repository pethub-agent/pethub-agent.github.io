import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { RegistrationFacade } from '../../facades/registration/registration.facade';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private registration = inject(RegistrationFacade);

  formUser = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmation: ['', Validators.required],
    },
    { validators: passwordMatchValidator('password', 'confirmation') }
  );

  passwordMismatch = signal('');

  onSubmit() {
    if (!this.formUser.valid) {
      if (this.formUser.errors?.['passwordMismatch']) {
        this.passwordMismatch.set('As senhas não conferem.');
      }
      return;
    }

    this.registration
      .registerUser({
        email: this.formUser.get('email')?.value || '',
        name: this.formUser.get('name')?.value || '',
        password: this.formUser.get('password')?.value || '',
      })
      .subscribe(() => {
        this.router.navigate(['login/confirmacao']);
      });
  }

  goToPet() {
    this.router.navigate(['login/meu-pet']);
  }
}
