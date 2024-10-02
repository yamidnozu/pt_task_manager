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
import { Task } from 'src/app/models/task.model';
import { Person } from '../../models/person.model';
import { Skill } from '../../models/skill.model';
import { PersonService } from '../../services/person.service';
import { SkillService } from '../../services/skill.service';
import { TaskService } from '../../services/task.service';

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
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly personService = inject(PersonService);
  private readonly skillService = inject(SkillService);

  taskForm!: FormGroup<TaskForm>;


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

  addPerson(): void {
    const existingNames = this.persons.controls.map((ctrl) => ctrl.get('fullName')?.value.trim());

    const personGroup = this.fb.group<PersonForm>({
      fullName: this.fb.control('', {
        validators: [
          this.personService.fullNameValidator(),
          this.personService.uniqueFullNameValidator(existingNames as string[]),
        ],
        nonNullable: true,
      }),
      age: this.fb.control<number | null>(null, [this.personService.ageValidator()]),
      skills: this.fb.array<FormGroup<SkillForm>>([], [
        Validators.required,
        Validators.minLength(1),
        this.personService.skillsValidator(),
      ]),
    });

    this.persons.push(personGroup);
  }

  removePerson(index: number): void {
    this.persons.removeAt(index);
    // Actualizar validación de nombres únicos
    this.persons.controls.forEach((ctrl, i) => {
      ctrl.get('fullName')?.updateValueAndValidity();
    });
  }

  getSkillsArray(personIndex: number): FormArray<FormGroup<SkillForm>> {
    return this.persons.at(personIndex).get('skills') as FormArray<FormGroup<SkillForm>>;
  }

  addSkill(personIndex: number): void {
    const skills = this.getSkillsArray(personIndex);
    const skillGroup = this.fb.group<SkillForm>({
      name: this.fb.control('', {
        validators: [this.skillService.skillNameValidator()],
        nonNullable: true,
      }),
    });
    skills.push(skillGroup);
  }

  removeSkill(personIndex: number, skillIndex: number): void {
    const skills = this.getSkillsArray(personIndex);
    skills.removeAt(skillIndex);
  }

  uniquePersonNamesValidator(formArray: FormArray<FormGroup<PersonForm>>): { [key: string]: any } | null {
    const names = formArray.controls.map((ctrl) => ctrl.get('fullName')?.value.trim());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    return duplicates.length > 0 ? { duplicateNames: true } : null;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskValue = this.taskForm.value;

      const task: Task = {
        id: 0,
        name: taskValue.name!,
        deadLine: new Date(taskValue.deadline as string),
        completed: false,
        persons: taskValue.persons!.map((personGroup) => ({
          fullName: personGroup.fullName!,
          age: personGroup.age!,
          skills: personGroup.skills!.map((skillGroup) => ({
            name: skillGroup.name,
          })) as Skill[],
        })),
      };

      this.taskService.addTask(task);

      // Reiniciar el formulario
      this.resetForm();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.taskForm.reset();
    this.persons.clear();
  }
}
