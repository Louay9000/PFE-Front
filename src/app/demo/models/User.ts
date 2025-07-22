import { Department } from "./Department";
import { Role } from "./Role";

export class User {
  id!: number;
  firstname!: string;
  lastname!: string;
  username!: string;
  password!: string;
  role!: Role;
  department!: Department;

  constructor(id: number, firstname: string, lastname: string, username: string, password: string, role: Role ,department: Department) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    this.role = role;
    this.department = department;

  }
}
