import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function youtubeUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !value.startsWith('https://')) {
      return { 'isNotYoutubeUrl': true };
    }
    return null;
  };
}
