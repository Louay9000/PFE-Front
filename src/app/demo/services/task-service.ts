import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../models/Task';
import { Status } from '../models/Status';
import { Role } from '../models/Role';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

constructor(private http:HttpClient , private router : Router) { }



private baseUrl = 'http://localhost:8085';


getAllTasks(role:Role, userId: number) {
  return this.http.get(`${this.baseUrl}/tasks/${role}/${userId}`);
}



AddTask(task: Task, okrId: number, userId: number) {
  return this.http.post(`${this.baseUrl}/tasks/${okrId}/${userId}`, task);
}


UpdateTask(task: Task, okrId: number, userId: number) {
  return this.http.put(`${this.baseUrl}/tasks/${task.id}/${okrId}/${userId}`, task);
}

DeleteTask(task : Task) {
  return this.http.delete(`${this.baseUrl}/tasks/${task.id}`);
}

createTaskAndAssign(task: Task, departmentId: number, userId: number) {
  return this.http.post(`${this.baseUrl}/tasks/assign/${departmentId}/${userId}`, task);
}

getTasksCountByStatus() {
  return this.http.get(`${this.baseUrl}/tasks/stats/status`);
}

getTopUserWithReachedTasks() {
  return this.http.get(`${this.baseUrl}/tasks/top-user-reached`);
}

getTasksByDepartment(departmentId: number) {
  return this.http.get(`${this.baseUrl}/tasks/by-department/${departmentId}`);
}

getTaskStatusCountByUserId(userId: number) {
  return this.http.get(`${this.baseUrl}/tasks/stats-by-user/${userId}`);
}

}


