import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LabelComponent],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input()
  placeholder = '';

  @Input()
  type = 'text';

  @Input()
  disabled = false;

  @Input()
  label = '';

  value: string = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  control: NgControl | null = null;
  group: FormGroupDirective | null = null;

  get error() {
    if (this.control?.errors && this.group?.submitted) {
      if (this.control.errors['required']) {
        return 'Obrigatório.';
      }
      if (this.control.errors['email']) {
        return `Este campo deve ser um email.`;
      }
    }
    return '';
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.group = this.injector.get(FormGroupDirective, null);
    this.control = this.injector.get(NgControl, null);
  }

  writeValue(value: any): void {
    if ([undefined, null].indexOf(value) == -1) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
