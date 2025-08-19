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

  // 🟢 Nouveau champ
  predictedDuration?: number;

   // ⚡ Probabilités ML
  proba_REACHED?: number;
  proba_INPROGRESS?: number;
  proba_UNREACHED?: number;


  constructor(id: number, taskTitle: string,
    taskDescription: string, taskState: Status,
    taskStartValue: number, taskDoneValue: number,
    taskWeight: number, okr: Okr, user: User,
    predictedDuration?: number,
    proba_REACHED?: number, proba_INPROGRESS?: number, proba_UNREACHED?: number
  ) {
    this.id = id;
    this.taskTitle = taskTitle;
    this.taskDescription = taskDescription;
    this.taskState = taskState;
    this.taskStartValue = taskStartValue;
    this.taskDoneValue = taskDoneValue;
    this.taskWeight = taskWeight;
    this.okr = okr;
    this.user = user;

    this.predictedDuration = predictedDuration ?? 0;

  this.proba_REACHED = proba_REACHED ?? 0;
  this.proba_INPROGRESS = proba_INPROGRESS ?? 0;
  this.proba_UNREACHED = proba_UNREACHED ?? 0;

  }


}
