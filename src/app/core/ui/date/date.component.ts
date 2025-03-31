import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [CommonModule, LabelComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
})
export class DateComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = 'Data';
  @Input() disabled: boolean = false;

  value: string = ''; // Armazena a data no formato YYYY-MM-DD
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

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
    this.value = this.getCurrentDate();
    this.group = this.injector.get(FormGroupDirective, null);
    this.control = this.injector.get(NgControl, null);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]; // Retorna no formato YYYY-MM-DD
  }
}
