import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from '../models/Department';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http:HttpClient ) { }

  private baseUrl = 'http://localhost:8085';

  getAllDepartments() {
    return this.http.get(`${this.baseUrl}/departments`);
  }

getDepartmentsWithoutManager(): Observable<Department[]> {
  return this.http.get<Department[]>(`${this.baseUrl}/departments/without-manager`);
}

  AddDepartment(department: Department) {
    return this.http.post(`${this.baseUrl}/departments`, department);
  }
  UpdateDepartment(department: Department) {
    return this.http.put(`${this.baseUrl}/departments/${department.id}`, department);
  }
DeleteDepartment(department : Department) {
  return this.http.delete(`${this.baseUrl}/departments/${department.id}`);
}

GetEmployeesByDepartment(department:Department):Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/departments/${department.id}/employees`);
}

GetDepartmentsWithoutOkr(): Observable<Department[]> {
  return this.http.get<Department[]>(`${this.baseUrl}/departments/without-okr`);
}

GetDepartmentNameByUserId(userId: number): Observable<string> {
  return this.http.get(`${this.baseUrl}/users/${userId}/department-name`, { responseType: 'text' });
}

GetDepartmentIdByUserId(userId: number): Observable<number> {
  return this.http.get<number>(`${this.baseUrl}/users/${userId}/department-id`);
}


}

