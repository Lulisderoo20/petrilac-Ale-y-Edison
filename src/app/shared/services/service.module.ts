import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule]
})
export class ServiceModule {

  constructor( @Optional() @SkipSelf() parentModule: ServiceModule) {
    if (parentModule) {
      throw new Error('ServiceModuleModule is already loaded. ');
    }
  }

}
