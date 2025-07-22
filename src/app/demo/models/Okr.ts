import { Department } from "./Department";
import { Objective } from "./Objective";

export class Okr {
  id!: number;
  keyindicatorTitle!: string;
  keyindicatorDescription!: string;
  targetValue!: number;
  reachedValue!: number;
  okrWeight!: number;
  okrProgression!: number;
  department!:Department;
  objective!:Objective;

  constructor(id: number, keyindicatorTitle: string,
    keyindicatorDescription: string, targetValue: number,
    reachedValue: number, okrWeight: number, okrProgression: number,
    department: Department, objective: Objective) {
    this.id = id;
    this.keyindicatorTitle = keyindicatorTitle;
    this.keyindicatorDescription = keyindicatorDescription;
    this.targetValue = targetValue;
    this.reachedValue = reachedValue;
    this.okrWeight = okrWeight;
    this.okrProgression = okrProgression;
    this.department=department;
    this.objective=objective;
  }
}
