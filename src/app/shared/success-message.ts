import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-message',
  styles: [
    'h3 { text-align: center; }'
  ],
  template: `
    <div class="container-fluid">
      <div class="row card-component">
        <mat-card class="success-message-card">
          <div class="flex-center-start">
            <div>
              <mat-checkbox id="checkSuccess" color="primary" class="check_success"
                [checked]="true" [disableRipple]="true" (click)="$event.preventDefault()"></mat-checkbox>
            </div>
            <div style="margin-left: 40px;">
              <h3>{{text | translate}}</h3>
            </div>
          </div>
          <footer>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-right">
                <button id="successMessageOk" mat-raised-button class="primary-button" (click)="ok()">{{'common.button.confirm' | translate}}</button>
              </div>
            </div>
          </footer>
        </mat-card>
      </div>
    </div>
  `
})
export class SuccessMessageComponent implements OnInit {

  @Input() text: string;
  @Output() onConfirm = new EventEmitter();

  ngOnInit() { }

  ok() {
    this.onConfirm.emit();
  }

}
