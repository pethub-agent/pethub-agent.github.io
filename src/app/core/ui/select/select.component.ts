import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { LabelComponent } from '../label/label.component';
import { Option } from './select.interface';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LabelComponent],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() options: Option[] = [];
  @Input() disabled = false;
  @Input() label = '';
  @Input() placeholder = 'Selecione';

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  control: NgControl | null = null;
  group: FormGroupDirective | null = null;

  selectedOption: Option | null = null;

  get error(): string {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // Carrega o valor caso o input options seja carregado de forma assincrona
      this.selectedOption =
        this.options.find((opt) => opt.value === this.selectedOption?.value) ||
        null;
    }
  }

  writeValue(option: Option | null): void {
    if (option) {
      this.selectedOption =
        this.options.find((opt) => opt.value === option.value) || option;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }

  onSelectChange(value: Option | null) {
    this.selectedOption = value;
    this.onChange(value);
    this.onTouched();
  }
}
