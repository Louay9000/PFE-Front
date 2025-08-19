import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private readonly baseUrl = 'http://localhost:8085/api/export';
  constructor(private http: HttpClient) {}

downloadTasksCsv() {
return this.http.get(`${this.baseUrl}/tasks-lite`, { responseType: 'blob' });
  }

}
