import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
	{ path: 'bienvenido',  component: WelcomeComponent, canActivate: [SecurityAuthGuard], data: {roles: []} }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class WelcomeRoutingModule { }
