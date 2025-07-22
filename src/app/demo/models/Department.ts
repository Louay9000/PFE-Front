import { Status } from "./Status";
import { User } from "./User";

export class Department {

id!: number;
departmentName!: string;
departmentDescription!: string;
departmentCapacity!: number;





constructor( id: number, departmentName: string, departmentDescription: string, departmentCapacity: number) {

    this.id = id;
    this.departmentName = departmentName;
    this.departmentDescription = departmentDescription;
    this.departmentCapacity = departmentCapacity;



  }}
