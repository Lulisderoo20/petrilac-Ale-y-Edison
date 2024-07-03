import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { VerificationComponent } from './verification.component';

const routes: Routes = [
    { path: 'verificacion/:userId/:accountId',  component: VerificationComponent, canActivate: [SecurityAuthGuard], data: {roles: []} }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class VerificationRoutingModule { }
