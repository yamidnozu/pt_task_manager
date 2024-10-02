// src/app/pages/task-create/task-create.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Skill } from '../../models/skill.model';

interface SkillForm {
  name: FormControl<string>;
}

interface PersonForm {
  fullName: FormControl<string>;
  age: FormControl<number | null>;
  skills: FormArray<FormGroup<SkillForm>>;
}

interface TaskForm {
  name: FormControl<string>;
  deadline: FormControl<string>;
  persons: FormArray<FormGroup<PersonForm>>;
}

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup<TaskForm>;
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.taskForm = this.fb.group<TaskForm>({
      name: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      deadline: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      persons: this.fb.array<FormGroup<PersonForm>>([], [
        Validators.required,
        Validators.minLength(1),
        this.uniquePersonNamesValidator.bind(this),
      ]),
    });
  }

  get persons(): FormArray<FormGroup<PersonForm>> {
    return this.taskForm.get('persons') as FormArray<FormGroup<PersonForm>>;
  }
  uniquePersonNamesValidator(formArray: FormArray<FormGroup<PersonForm>>): { [key: string]: any } | null {
    const names = formArray.controls.map((ctrl) => ctrl.get('fullName')?.value.trim());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    return duplicates.length > 0 ? { duplicateNames: true } : null;
  }

  onSubmit(): void {
    // TODO: Validar formulario sea valido y guardar
  }

  resetForm(): void {
    this.taskForm.reset();
    this.persons.clear();
  }

}
