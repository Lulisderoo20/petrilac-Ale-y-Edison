import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VerificationComponent } from './verification.component';

@NgModule({
  imports: [
    CommonModule, SharedModule,
  ],
  exports: [VerificationComponent],
  declarations: [VerificationComponent],
  providers: []
})
export class VerificationModule { }
