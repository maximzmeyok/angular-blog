import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthService } from "../admin/shared/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._authService.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this._authService.token,
        },
      });
    }

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<never> => {
          if (error.status === 401) {
            this._authService.logout();
            this._router.navigate(['/admin', 'login'], {
              queryParams: {
                authFailed: true,
              },
            });
          }
          return throwError(error);
        }),
      );
  }
}