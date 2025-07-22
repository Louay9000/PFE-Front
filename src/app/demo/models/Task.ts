import { Okr } from "./Okr";
import { Status } from "./Status";
import { User } from "./User";


export class Task {

  id!: number;
  taskTitle!: string;
  taskDescription!: string;
  taskState!:Status;
  taskStartValue!: number;
  taskDoneValue!: number;
  taskWeight!: number;
  okr!:Okr;
  user!:User;


  constructor(id: number, taskTitle: string,
    taskDescription: string, taskState: Status,
    taskStartValue: number, taskDoneValue: number,
    taskWeight: number, okr: Okr, user: User) {
    this.id = id;
    this.taskTitle = taskTitle;
    this.taskDescription = taskDescription;
    this.taskState = taskState;
    this.taskStartValue = taskStartValue;
    this.taskDoneValue = taskDoneValue;
    this.taskWeight = taskWeight;
    this.okr = okr;
    this.user = user;
  }


}
