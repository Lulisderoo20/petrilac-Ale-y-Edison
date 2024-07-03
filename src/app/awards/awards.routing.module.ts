import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { AwardsComponent } from './awards.component';

const routes: Routes = [
    { path: 'premios',  component: AwardsComponent, canActivate: [SecurityAuthGuard], data: {roles: [], exchanged: false} },
    { path: 'premios-canjeados',  component: AwardsComponent, canActivate: [SecurityAuthGuard], data: {roles: [], exchanged: true} }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AwardsRoutingModule { }
