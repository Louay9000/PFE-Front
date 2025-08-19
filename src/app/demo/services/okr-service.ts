import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Okr } from '../models/Okr';

@Injectable({
  providedIn: 'root'
})
export class OkrService {

    constructor(private http:HttpClient , private router : Router) { }



private baseUrl = 'http://localhost:8085';


getAllokrs() {
  return this.http.get(`${this.baseUrl}/okrs` );
}



AddOkr(okr: Okr,departmentId: number, objectiveId: number) {
  return this.http.post(`${this.baseUrl}/okrs/${departmentId}/${objectiveId}`, okr);
}


UpdateOkr(okr: Okr,departmentId: number,objectiveId: number) {
  return this.http.put(`${this.baseUrl}/okrs/${okr.id}/${departmentId}/${objectiveId}`, okr);
}

DeleteOkr(okr : Okr) {
  return this.http.delete(`${this.baseUrl}/okrs/${okr.id}`);  }

GetOkrIdByDepartmentId(departmentId: number) {
  return this.http.get<Okr[]>(`${this.baseUrl}/okrs/${departmentId}`);
}
getOkrsByDepartmentId(departmentId: number) {
  return this.http.get<Okr[]>(`${this.baseUrl}/okrs/by-department/${departmentId}`);
}

}
