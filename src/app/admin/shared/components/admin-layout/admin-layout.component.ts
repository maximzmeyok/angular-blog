import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(
    private _router: Router,
    public authService: AuthService,
  ) { }

  public logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this._router.navigate(['/admin', 'login']);
  }
}
