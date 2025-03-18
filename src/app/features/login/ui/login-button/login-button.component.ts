import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss',
})
export class LoginButtonComponent {
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
