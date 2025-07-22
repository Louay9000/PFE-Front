import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Objective } from '../models/Objective';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

    constructor(private http:HttpClient , private router : Router) { }



private baseUrl = 'http://localhost:8085';


getAllObjectives() {
  return this.http.get(`${this.baseUrl}/objectives` );
}



AddObjective(objective: Objective) {
  return this.http.post(`${this.baseUrl}/objectives`, objective);
}


UpdateObjective(objective: Objective) {
  return this.http.put(`${this.baseUrl}/objectives/${objective.id}`, objective);
}

DeleteObjective(objective : Objective) {
  return this.http.delete(`${this.baseUrl}/objectives/${objective.id}`);  }


}
