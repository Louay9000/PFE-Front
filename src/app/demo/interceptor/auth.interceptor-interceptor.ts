import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationResponse } from '../models/AuthenticationResponse';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: Auth) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne pas ajouter de token pour /login, /register ou /refresh_token
    if (
      request.url.includes("/login") ||
      request.url.includes("/register")

    ) {
      return next.handle(request);
    }
    // Ajouter accessToken dans Authorization
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + this.authService.accessToken)
    });
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Remplacer accessToken par refreshToken pour appeler /refresh_token
          this.authService.accessToken = this.authService.refreshToken;
          const retryReq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + this.authService.accessToken)
              });
          return this.authService.RefreshToken().pipe(
            switchMap((res: AuthenticationResponse) => {
              // Mettre à jour les tokens
              this.authService.accessToken = res.accessToken;
              this.authService.refreshToken = res.refreshToken;
              localStorage.setItem("accessToken", res.accessToken);
              localStorage.setItem("refreshToken", res.refreshToken);
              console.log("Nouveau accessToken : ", res.accessToken);
              console.log("Nouveau refreshToken : ", res.refreshToken);
              // Refaire la requête initiale avec le nouveau accessToken


              // Cloner la requête originale avec le nouveau accessToken

              return next.handle(retryReq);
            }),
            catchError(err => {
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }
};
