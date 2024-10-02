import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  // Validador para el nombre de la habilidad
  skillNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value?.trim();
      if (!name) {
        return { required: true };
      }
      return null;
    };
  }
}
