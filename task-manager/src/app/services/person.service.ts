import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const MIN_NAME_LENGTH = 5;
const MIN_AGE = 19;

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  // Validador para el nombre completo
  fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value?.trim();
      if (!name) {
        return { required: true };
      }
      if (name.length < MIN_NAME_LENGTH) {
        return { minlength: { requiredLength: MIN_NAME_LENGTH, actualLength: name.length } };
      }
      return null;
    };
  }

  // Validador para la edad
  ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = control.value;
      if (age === null || age === undefined) {
        return { required: true };
      }
      if (age < MIN_AGE) {
        return { min: { min: MIN_AGE, actual: age } };
      }
      return null;
    };
  }

  // Validador para verificar que el nombre no se repita
  uniqueFullNameValidator(existingNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value?.trim();
      if (existingNames.includes(name)) {
        return { duplicate: true };
      }
      return null;
    };
  }

  // Validador para verificar que haya al menos una habilidad
  skillsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const skills = control.value;
      if (!skills || skills.length < 1) {
        return { minSkills: true };
      }
      return null;
    };
  }
}
