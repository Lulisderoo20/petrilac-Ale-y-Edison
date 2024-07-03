import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { WelcomeComponent } from './welcome.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, SharedModule, MatButtonToggleModule,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ThemeDirective,
    RouterLink
  ],
  exports: [WelcomeComponent],
  declarations: [WelcomeComponent],
  providers: []
})
export class WelcomeModule { }