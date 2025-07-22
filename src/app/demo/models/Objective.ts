import { Status } from "./Status";

export class Objective {
id!: number;
objectiveTitle!: string;
objectiveDescription!: string;
objectiveStatus!: Status;
objectiveScore!: number;
objectiveProgress!: number;



constructor( id: number, objectiveTitle: string,  objectiveDescription: string,  objectiveStatus: Status,  objectiveScore: number,objectiveProgress: number) {

    this.id = id;
    this.objectiveTitle = objectiveTitle;
    this.objectiveDescription = objectiveDescription;
    this.objectiveStatus = objectiveStatus;
    this.objectiveScore = objectiveScore;
    this.objectiveProgress = objectiveProgress;


  }}
