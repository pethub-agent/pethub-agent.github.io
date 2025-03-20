import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonComponent),
      multi: true,
    },
  ],
})
export class ButtonComponent implements ControlValueAccessor {
  @Input() theme:
    | 'primary'
    | 'secondary'
    | 'neutral'
    | 'gradient'
    | 'gradient-primary' = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() outline = false;

  private onTouched = () => {};
  private onChange = (value: any) => {};

  get buttonClasses(): string {
    const baseClasses = `px-4 py-2 rounded-lg font-medium transition-colors border-2`;

    const themes = {
      primary: this.outline
        ? 'border-primary text-primary hover:bg-primary-light'
        : 'bg-primary text-white hover:bg-primary-dark',
      secondary: this.outline
        ? 'border-secondary text-secondary hover:bg-secondary-light'
        : 'bg-secondary text-black hover:bg-secondary-dark',
      neutral: this.outline
        ? 'border-neutral-500 text-neutral-800 hover:bg-neutral-200'
        : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-500',
      gradient: this.outline
        ? 'border-gradient text-gradient hover:bg-gradient-light'
        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:bg-gradient-dark',
      'gradient-primary': this.outline
        ? 'border-gradient text-gradient hover:bg-gradient-light'
        : 'bg-gradient-to-r from-primary to-secondary text-white hover:bg-gradient-dark',
    };

    return `${baseClasses} ${themes[this.theme]} ${
      this.disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`;
  }

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onClick(): void {
    if (!this.disabled) {
      this.onChange(true);
      this.onTouched();
    }
  }
}
