import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../admin/shared/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  public intercept(
    req: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isAuthentificated()) {
      req = req.clone({
        setParams: {
          auth: this.auth.token
        }
      })
    }
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        if (error.status === 401) {
          this.auth.logout()
          this.router.navigate(['/admin', 'login'], {
            queryParams: {
              authFailed: true
            }
          })
        }
        return throwError(error)
      })
    )
  }
}