import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  constructor(private _router: Router) {

  }

  public logout(event: Event) {
    event.preventDefault();
    this._router.navigate(['/admin', 'login'])
  }
}
