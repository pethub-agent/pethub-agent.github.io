import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey: string,
  confirmationKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmation = group.get(confirmationKey)?.value;
    if (password !== confirmation) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
