import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() public delay: number = 5000;

  public text: string;
  public type: string = 'success';

  private _aSub: Subscription;

  constructor(private _alertService: AlertService) {}

  public ngOnInit(): void {
    this._aSub = this._alertService.alert$.subscribe((alert: Alert) => {
      this.text = alert.text;
      this.type = alert.type;

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        this.text = '';
      }, this.delay);
    });
  }

  public ngOnDestroy(): void {
    if (!this._aSub) {
      return;
    }

    this._aSub.unsubscribe();
  }
}
