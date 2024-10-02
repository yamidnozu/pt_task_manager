import { Skill } from "./skill.model";

export interface Person {
    fullName: string;
    age: number;
    skills: Skill;
}
