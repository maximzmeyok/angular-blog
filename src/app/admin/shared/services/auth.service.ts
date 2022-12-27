import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { catchError, Observable, Subject, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  
  constructor(private _http: HttpClient) { }

  public get token(): string {
    const expDate: Date = new Date(localStorage.getItem('fb-token-exp'));

    if (new Date > expDate) {
      this.logout();
      return null;
    }
    
    return localStorage.getItem('fb-token');
  }

  public login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this._http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this._setToken),
        catchError(this._handleError.bind(this)),
      );
  }
  
  public logout(): void {
    this._setToken(null);
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  private _setToken(response: FbAuthResponse | null): void {

    if (!response) {
      localStorage.clear();
      return;
    }

    const expDate: Date = new Date(new Date().getTime() + +response.expiresIn * 1000);
    localStorage.setItem('fb-token', response.idToken);
    localStorage.setItem('fb-token-exp', expDate.toString());
  }

  private _handleError(error: HttpErrorResponse): Observable<Error> {
    const { message } = error.error.error;

    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Этот email не зарегистрирован.');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email.');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль.');
        break;
    }

    return throwError(error);
  }
}