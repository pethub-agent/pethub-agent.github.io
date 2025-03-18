import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredOption(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value.value) {
      return { required: true };
    }

    return null;
  };
}
