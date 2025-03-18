import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { Option } from './select.interface';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input()
  options: Option[] = []; // Opções do select

  @Input()
  disabled = false;

  @Input()
  label = '';

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};
  control: NgControl | null = null;
  group: FormGroupDirective | null = null;

  get error() {
    if (this.control?.errors && this.group?.submitted) {
      if (this.control.errors['required']) {
        return 'Este campo é obrigatório.';
      }
    }
    return '';
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.group = this.injector.get(FormGroupDirective, null);
    this.control = this.injector.get(NgControl, null);
  }

  writeValue(option: Option): void {
    this.value = option.value;
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

  onChangeEvent(value: string | number): void {
    const data = this.options.find((d) => d.value == value);
    console.log(data);
    this.onChange(data);
  }
}
