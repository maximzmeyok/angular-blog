import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces';
import { AlertService } from '../shared/services/alert.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;
  public message: string;

  constructor(
    public authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _alertService: AlertService,
  ) { }

  public ngOnInit(): void {
    this._route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Войдите заново.';
      } else if (params['authFailed']) {
        this.message = 'Сессия истекла. Войдите заново.';
      }
    });

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(user).subscribe(() => {
      this.form.reset();
      this._router.navigate(['/admin', 'dashboard']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
      this._alertService.success('Пост обновлён');
    });
  }
}
