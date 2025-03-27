import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Option } from '../../../../../core/ui/select/select.interface';

export function requiredOption(): ValidatorFn {
  return (control: AbstractControl<Option>): ValidationErrors | null => {
    const option: Option = control.value;

    if (!option) {
      return { required: true };
    }
    if (!option.value) {
      return { required: true };
    }

    return null;
  };
}
