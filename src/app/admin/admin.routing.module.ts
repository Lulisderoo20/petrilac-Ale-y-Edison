import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
	{ path: 'administrador',  component: AdminComponent, canActivate: [SecurityAuthGuard], data: {roles: ['admin']} },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AdminRoutingModule { }
