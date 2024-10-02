import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  private idCounter = 2;

  getTasks(): Task[] {
    return [...this.tasksSubject.getValue()];
  }

  addTask(task: Task): void {
    task.id = this.idCounter++;
    const updatedTasks = [...this.tasksSubject.getValue(), task];
    this.tasksSubject.next(updatedTasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.getValue();
    const index = tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...updatedTask };
      this.tasksSubject.next([...tasks]);
    }
  }
}
