import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SharedDataService } from '../shared/services/shared-data.service.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceProductDialogComponent } from '../shared/dialog/invoice-product-dialog.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {

  isMobile: boolean = false;
  isEmpty: boolean = true;

  invoices: any[] = new Array();

  constructor(private router: Router,
              protected route: ActivatedRoute,
              private sharedDataService: SharedDataService,
              private dialog: MatDialog,
              private overlay: Overlay) {

  }

  ngOnInit() {
    
    this.isMobile = this.sharedDataService.isMobile();

    var products1 = [{id: 1, name: 'Aerosol Barniz Bte x 0.420 Lt', categoryId: 1, categoryName: 'Aerosoles', price: 150.25, points: 7.5, count: 1},
    {id: 2, name: 'FB Tradicional Negro x 1/4 L', categoryId: 2, categoryName: 'Para Metales', price: 150.25, points: 7.5, count: 1},
    {id: 3, name: 'Producto a Granel', categoryId: 3, categoryName: 'Default', price: 150.25, points: 7.5, count: 2}];

    var products12 = [{id: 4, name: 'Pintura para Prueba', categoryId: 4, categoryName: 'Preservadores', price: 150.25, points: 7.5, count: 2},
    {id: 5, name: 'Penta Renovador/Limp x 1 L', categoryId: 5, categoryName: 'Removedores', price: 150.25, points: 7.5, count: 3},
    {id: 6, name: 'Penta Revestimiento x 1 L', categoryId: 6, categoryName: 'Lacas y Barnices', price: 150.25, points: 7.5, count: 3}];

    var products2 = [{id: 7, name: 'Penta Stain Sat.Natural x 1 L', categoryId: 7, categoryName: 'Lasures', price: 150.25, points: 7.5, count: 1},
    {id: 8, name: 'Diluyente 200 x 1/2 L', categoryId: 8, categoryName: 'Diluyentes', price: 150.25, points: 7.5, count: 1},
    {id: 9, name: 'Restaurador Lustrelac Med. x 1/4', categoryId: 9, categoryName: 'Accesorios', price: 150.25, points: 7.5, count: 2}];

    var products22 = [ {id: 10, name: 'Comp.Enton.Sellagres x 100 cc', categoryId: 10, categoryName: 'Ladrillos', price: 150.25, points: 7.5, count: 2},
    {id: 11, name: 'Rolac Brillante x 4 L', categoryId: 11, categoryName: 'PU Mono Pisos', price: 150.25, points: 7.5, count: 3},
    {id: 12, name: 'T.C. AT Nogal x 240 cc', categoryId: 12, categoryName: 'Tintas', price: 150.25, points: 7.5, count: 3}];

    var products3 = [{id: 13, name: 'Adhesivo Petrilac x 1.250 K', categoryId: 13, categoryName: 'Adhesivos', price: 150.25, points: 7.5, count: 1},
    {id: 14, name: 'Cera P/Pisos de Madera x 1.25 L', categoryId: 14, categoryName: 'Ceras', price: 150.25, points: 7.5, count: 1},
    {id: 15, name: 'Masilla Petrilac Natural x 125 G', categoryId: 15, categoryName: 'NO - Maderas', price: 150.25, points: 7.5, count: 2},
    {id: 16, name: 'Techesco Frentes Imp Cemento x20', categoryId: 16, categoryName: 'Hogar y Obra', price: 150.25, points: 7.5, count: 2},
    {id: 17, name: 'Kit Sellatec Techo', categoryId: 17, categoryName: 'Techados', price: 150.25, points: 7.5, count: 3},
    {id: 18, name: 'Pack Teak Cleaner-Brightener x10', categoryId: 18, categoryName: 'Nautica', price: 150.25, points: 7.5, count: 3}];
    

    this.invoices = [{type: 'Factura A', number: '0004-00001234', products: products1, points: 122.5},
                     {type: 'Factura B', number: '0004-00005678', products: products2, points: 150},
                     {type: 'Factura A', number: '0004-00005678', products: products12, points: 80.25},
                     {type: 'Factura B', number: '0004-00091011', products: products22, points: 250.2},
                     {type: 'Factura C', number: '0004-00091011', products: products3, points: 1547.8}];
    
    this.isEmpty = this.invoices.length == 0;
  }

  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);
  }

  addProduct(invoice: any) {
    this.openInvoiceProductPopup("create", invoice);
  }

  editProduct(invoice: any, product: any) {
    this.openInvoiceProductPopup("edit", invoice, product);
  }

  deleteProduct(invoice: any, product: any) {
    this.openInvoiceProductPopup("delete", invoice, product);
  }
  
  cancelInvoice(invoice: any) {
    this.openInvoiceProductPopup("cancel", invoice);
  }

  openInvoiceProductPopup(action: string, invoice: any, product?: any) {
    this.dialog.open(InvoiceProductDialogComponent, {
      width: "600px",
      autoFocus: false,
      panelClass: 'trend-dialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data:{action: action, invoice: invoice, product: product}
    }).afterClosed().subscribe(action => {
      if (action) {
      }
    });
  }

}
