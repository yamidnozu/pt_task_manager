import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
        // TODO: Agregar validacion para que este el nombre sea unico
      ]),
    });
  }

  onSubmit(): void {
    // TODO: Validar formulario sea valido y guardar
  }

}
