import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Person } from '../../models/person.model';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.filter === 'all') {
      this.filteredTasks = this.tasks;
    } else if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter((task) => task.completed);
    } else {
      this.filteredTasks = this.tasks.filter((task) => !task.completed);
    }
  }

  onFilterChange(filter: 'all' | 'completed' | 'pending'): void {
    this.filter = filter;
    this.applyFilter();
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
  }

  getSkills(person: Person): string {
    return person.skills.map((skill) => skill.name).join(', ');
  }
}
