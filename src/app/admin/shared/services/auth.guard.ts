import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  
  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthentificated()) {
      return true
    } else {
      this.auth.logout()
      this.router.navigate(['/admin', 'login'], {
        queryParams: {
          loginAgain: true
        }
      })
      
      return false
    }
  }
}