import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { RecoverAccountComponent } from './recover-account.component';

const routes: Routes = [
    { path: 'recuperar-cuenta/:userId/:accountId',  component: RecoverAccountComponent, canActivate: [SecurityAuthGuard], data: {roles: []} }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class RecoverAccountRoutingModule { }
