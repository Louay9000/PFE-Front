// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Role } from 'src/app/demo/models/Role';
import { User } from 'src/app/demo/models/User';
import { Auth } from 'src/app/demo/services/auth';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [HttpClientModule,RouterModule,FormsModule,CommonModule,CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
user: User ={
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    role: Role.ADMIN || Role.MANAGER || Role.EMPLOYEE,
    department: null 
  }


  ngOnInit(): void {
  }
  @ViewChild('errorModal') errorModal: any;
  constructor(private auth: Auth, private router: Router, private modalService: NgbModal) { }// Inject your authentication service and router


  loginError: boolean = false;
  login(){

  if (this.user.username && this.user.password) {
      this.auth.login(this.user).subscribe(
        (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.auth.loadProfile();
          this.router.navigate(['/default']);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        (error) => {
          console.error("Erreur d'authentification :", error);
          this.modalService.open(this.errorModal, { centered: true });
        }
      );
    }
  }

}




