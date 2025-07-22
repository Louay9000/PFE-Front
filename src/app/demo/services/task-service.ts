import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../models/Task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

constructor(private http:HttpClient , private router : Router) { }



private baseUrl = 'http://localhost:8085';


getAllTasks() {
  return this.http.get(`${this.baseUrl}/tasks` );
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



}


