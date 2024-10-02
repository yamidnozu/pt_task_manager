import { Routes } from '@angular/router';
import { TaskCreateComponent } from './pages/task-create/task-create.component';
import { TaskListComponent } from './pages/task-list/task-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'create-task', component: TaskCreateComponent },
];
