import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Emailservice {

  constructor(private http:HttpClient , private router : Router) { }

  private baseUrl = 'http://localhost:8085';

  sendEmail(to: string, subject: string, text: string) {
  const params = { to, subject, text };
  return this.http.post(`${this.baseUrl}/send`, null, { params, responseType: 'text' });
}

}
