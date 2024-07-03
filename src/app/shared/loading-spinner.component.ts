import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="center-info">
      <h4>{{'labels.loading' | translate}}</h4>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </div>
  `
})
export class LoadingSpinnerComponent{}
