import { Department } from "./Department";
import { Image } from "./Image";
import { Role } from "./Role";

export class User {
  id!: number;
  firstname!: string;
  lastname!: string;
  username!: string;
  email!: string;
  password!: string;
  role!: Role;
  department!: Department;
  image!:Image;

  constructor(id: number, firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  role: Role,
  department: Department,
  image: Image
) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.department = department;
    this.image=image;

  }
}
