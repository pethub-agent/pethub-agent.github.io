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
  selector: 'app-time',
  standalone: true,
  imports: [LabelComponent, CommonModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true,
    },
  ],
})
export class TimeComponent implements ControlValueAccessor, OnInit {
  @Input()
  placeholder = '';

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
    }
    return '';
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.group = this.injector.get(FormGroupDirective, null);
    this.control = this.injector.get(NgControl, null);
  }

  writeValue(value: any): void {
    this.value = value;
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
