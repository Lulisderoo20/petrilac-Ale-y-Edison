import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AccountService } from './service/account.service';
import { AddressService } from './service/address.service';
import { AdminService } from './service/admin.service';
import { ScheduledLotteryService } from './service/scheduledLottery.service';
import { UsersService } from './service/users.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    AccountService,
    AddressService,
    AdminService,
    ScheduledLotteryService,
    UsersService ]
})
export class ApiModule {

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
