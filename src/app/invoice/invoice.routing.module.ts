import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from '../shared/security-authguard/security-authguard.component';
import { InvoiceComponent } from './invoice.component';
import { UploadInvoiceComponent } from './upload/upload-invoice.component';

const routes: Routes = [
    { path: 'cargar-factura',  component: UploadInvoiceComponent, canActivate: [SecurityAuthGuard], data: {roles: []} },
    { path: 'facturas',  component: InvoiceComponent, canActivate: [SecurityAuthGuard], data: {roles: []} }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class InvoiceRoutingModule { }
