import { Person } from "./person.model";

export interface Task {
    id: number;
    name: string;
    deadLine: Date;
    completed: boolean;
    persons: Person[];
}
