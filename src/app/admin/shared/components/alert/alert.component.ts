import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay: number = 5000

  public text: string
  public type: string = 'success'

  private aSub: Subscription

  public constructor(
    private alertService: AlertService
  ) { }

  public ngOnInit(): void {
    this.alertService.alert$.subscribe((alert): void => {
      this.text = alert.text
      this.type = alert.type

      const  timeout = setTimeout((): void => {
        clearTimeout(timeout)
        this.text = ''
      }, this.delay)
    })
  }

  public ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}
