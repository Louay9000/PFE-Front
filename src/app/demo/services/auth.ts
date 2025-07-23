import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../models/Role';
@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http:HttpClient , private router : Router) {

  }

private baseUrl = 'http://localhost:8085';


  isAuthenticated : boolean=false;
  username:any;
  accessToken!:any;
  refreshToken!:any;
  UserRole! : any ;
  userId!:any;
  lastname:any;
  firstname:any;
  





  isAdmin(): boolean {
    // Vérifiez si l'utilisateur est authentifié et s'il a le rôle ADMIN
    return this.isAuthenticated=true && this.UserRole === 'ADMIN';
  }

  isAuthenticatedUser(): boolean {
    // Vérifiez si l'utilisateur est authentifié
    return this.isAuthenticated;
  }

  isManager(): boolean {
    // Vérifiez si l'utilisateur est authentifié et s'il a le rôle MANAGER
    return this.isAuthenticated=true && this.UserRole === 'MANAGER';
  }


  isEmployee(): boolean {
    // Vérifiez si l'utilisateur est authentifié et s'il a le rôle EMPLOYEE
    return this.isAuthenticated=true && this.UserRole === 'EMPLOYEE';
  }

  login(user: User): Observable<AuthenticationResponse> {
  return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, user);
}

  logout() {
    this.isAuthenticated=false;
    this.accessToken=undefined;
    this.refreshToken=undefined;
    this.username=undefined;
    this.UserRole=undefined;
    this.userId=undefined;
    this.lastname=undefined;
    this.firstname=undefined;
    window.localStorage.removeItem("accessToken")
    window.localStorage.removeItem("refreshToken")
    window.localStorage.removeItem("id")
  }

  loadProfile(){
    this.isAuthenticated=true;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    let decodedJwt:any =  jwtDecode(this.accessToken);
    this.username=decodedJwt.sub;
    this.UserRole=decodedJwt.role;
    this.userId=decodedJwt.id;
    this.lastname=decodedJwt.lastname;
    this.firstname=decodedJwt.firstname;


  }

RefreshToken(): Observable<AuthenticationResponse> {
  const refreshToken = this.refreshToken || localStorage.getItem("refreshToken");
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + refreshToken
  });
  return this.http.post<AuthenticationResponse>(
    `${this.baseUrl}/refresh_token`, {}, { headers }
  );
}


getAllUsers() {
  return this.http.get(`${this.baseUrl}`);
}



AddUser(user: User, departmentId: number) {
  return this.http.post<User>(`${this.baseUrl}/register/${departmentId}`, user);
}

UpdateUser(user: User) {
    return this.http.put(`${this.baseUrl}/${user.id}`, user);
  }
DeleteUser(user : User) {
  return this.http.delete(`${this.baseUrl}/${user.id}`);  }

UpdateUserRole(user: User): Observable<User> {
  user.role = Role.MANAGER;
  return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
}
updateUserDTO(user: User): Observable<User> {
return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
}
GetTaskByUserId(id: number) {
  return this.http.get(`${this.baseUrl}/tasks/${id}`);
}

}
