import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    CommonModule, SharedModule,
  ],
  exports: [AdminComponent],
  declarations: [AdminComponent],
  providers: []
})
export class AdminModule { }
