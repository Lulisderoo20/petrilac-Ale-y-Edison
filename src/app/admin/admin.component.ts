import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountSeller, AccountSellerFilter, User } from '../api';
import { AddressService } from '../api/service/address.service';
import { AdminService } from '../api/service/admin.service';
import { VerifyAccountDialogComponent } from '../shared/dialog/verify-account-dialog.component';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { SharedDataService } from '../shared/services/shared-data.service.component';
import { saveAs } from 'file-saver';
import { ProductDialogComponent } from '../shared/dialog/product-dialog.component';
import { AwardDialogComponent } from '../shared/dialog/award-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isMobile: boolean = false;
  storedUser: User = {};
  loggedUser: string;
  productColumns: string[] = ['createDate', 'productCategoryName', 'productName', 'points', 'action'];
  sellerColumns: string[] = ['createDate', 'name', 'lastname', 'email', 'phoneNumber', 'documentName', 'documentNumber', 'businessName', 'addressName', 'action'];
  orderByFilters: any[] = [{name: 'ORDERNAR POR NOMBRE ASCENDENTE', value: 'ORDER BY acs.name ASC, acs.id ASC'},
                           {name: 'ORDERNAR POR NOMBRE DESCENDENTE', value: 'ORDER BY acs.name DESC, acs.id ASC'},
                           {name: 'ORDERNAR POR APELLIDO ASCENDENTE', value: 'ORDER BY acs.lastname ASC, acs.id ASC'},
                           {name: 'ORDERNAR POR APELLIDO DESCENDENTE', value: 'ORDER BY acs.lastname DESC, acs.id ASC'}];
  invoiceFilter: any = {};
  adwardFilter: any = {};
  exchangedAdwardFilter: any = {};
  productFilter: any = {};
  sellerFilter: AccountSellerFilter = {};
  invoiceResults: any[] = [];
  exchangedAdwardResults: any[] = [];
  sellerResults: AccountSeller[] = [];
  productResults: any[] = [];
  tabIndex: number = 0;
  provinces = [];
  cities = [];
  businessNames = [];
  showLoading: boolean = false;

  gridListCols: number = 6;
  gridListRowHeight: string = "280px";
  gridListGutterSize: string = "40px";
  gridListTileColspan: number = 1;
  gridListTileRowspan: number = 1;
  exchangedGridListCols: number = 4;
  exchangedGridListRowHeight: string = "400px";
  exchangedGridListGutterSize: string = "50px";

  invoices: any[] = new Array();
  awards: any[] = new Array();
  exchangedAwards: any[] = new Array();

  @ViewChild('invoicePaginatorComponent') invoicePaginatorComponent: PaginatorComponent;
  @ViewChild('productPaginatorComponent') productPaginatorComponent: PaginatorComponent;
  @ViewChild('adwardPaginatorComponent') adwardPaginatorComponent: PaginatorComponent;
  @ViewChild('exchangedAdwardPaginatorComponent') exchangedAdwardPaginatorComponent: PaginatorComponent;
  @ViewChild('sellerPaginatorComponent') sellerPaginatorComponent: PaginatorComponent;

  constructor( private router: Router,
               private adminService: AdminService,
               private dialog: MatDialog,
               private addressService: AddressService,
               private overlay: Overlay,
               private sharedDataService: SharedDataService) {

    this.invoiceFilter = <any> {};
    this.invoiceFilter.to = null;
    this.invoiceFilter.from = null;

    this.productFilter = <any> {};
    this.productFilter.to = null;
    this.productFilter.from = null;

    this.adwardFilter = <any> {};
    this.adwardFilter.to = null;
    this.adwardFilter.from = null;

    this.exchangedAdwardFilter = <any> {};
    this.exchangedAdwardFilter.to = null;
    this.exchangedAdwardFilter.from = null;
  }

  ngOnInit() {

    this.storedUser = this.sharedDataService.getUserLoggedIn();

    this.loggedUser = 'administrador';

    if (this.storedUser && this.storedUser.token) {

      if (this.storedUser.accountSeller && this.storedUser.accountSeller.name) {

        this.loggedUser = this.storedUser.accountSeller.name;
      }
      else {
        this.loggedUser = this.storedUser.email;
      }
    }

    this.isMobile = this.sharedDataService.isMobile();

    if (this.isMobile) {
      this.gridListCols = 2;
      this.exchangedGridListCols = 2;
    }

    for (let i = 1; i <= 30; i++) {
      this.awards.push({src: '/assets/image/awards/'+i+'.png', score: 108, name: 'Auriculares inalambricos', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'});
    }

    for (let i = 1; i <= 30; i++) {
      this.exchangedAwards.push({createDate: new Date(), src: '/assets/image/awards/'+i+'.png', score: 108, name: 'Auriculares inalambricos', 
        clientId: '1', username: 'Ariel'});
    }

    this.productResults = [{createDate: new Date(), categoryId: 1, productId: 1, productCategoryName: 'Aerosoles', productName: 'Aerosol Barniz Bte x 0.420 Lt', points: 7.5}];

    this.sellerResults = [{createDate: new Date(), name: 'Ariel', lastname: 'Apellido', email: 'ariel@g.com', phoneNumber: '1112345678', documentName: 'DNI', documentNumber: '34777554', provinceName: 'CABA', locationName: 'Palermo', businessName: 'Pintureria', addressName: 'siempre viva 1234'}];

    var products1 = [{id: 1, name: 'Aerosol Barniz Bte x 0.420 Lt', categoryName: 'Aerosoles', price: 150.25, points: 7.5, count: 1},
    {id: 2, name: 'FB Tradicional Negro x 1/4 L', categoryName: 'Para Metales', price: 150.25, points: 7.5, count: 1},
    {id: 3, name: 'Producto a Granel', categoryName: 'Default', price: 150.25, points: 7.5, count: 2}];

    var products12 = [{id: 4, name: 'Pintura para Prueba', categoryName: 'Preservadores', price: 150.25, points: 7.5, count: 2},
    {id: 5, name: 'Penta Renovador/Limp x 1 L', categoryName: 'Removedores', price: 150.25, points: 7.5, count: 3},
    {id: 6, name: 'Penta Revestimiento x 1 L', categoryName: 'Lacas y Barnices', price: 150.25, points: 7.5, count: 3}];

    var products2 = [{id: 7, name: 'Penta Stain Sat.Natural x 1 L', categoryName: 'Lasures', price: 150.25, points: 7.5, count: 1},
    {id: 8, name: 'Diluyente 200 x 1/2 L', categoryName: 'Diluyentes', price: 150.25, points: 7.5, count: 1},
    {id: 9, name: 'Restaurador Lustrelac Med. x 1/4', categoryName: 'Accesorios', price: 150.25, points: 7.5, count: 2}];

    var products22 = [ {id: 10, name: 'Comp.Enton.Sellagres x 100 cc', categoryName: 'Ladrillos', price: 150.25, points: 7.5, count: 2},
    {id: 11, name: 'Rolac Brillante x 4 L', categoryName: 'PU Mono Pisos', price: 150.25, points: 7.5, count: 3},
    {id: 12, name: 'T.C. AT Nogal x 240 cc', categoryName: 'Tintas', price: 150.25, points: 7.5, count: 3}];

    var products3 = [{id: 13, name: 'Adhesivo Petrilac x 1.250 K', categoryName: 'Adhesivos', price: 150.25, points: 7.5, count: 1},
    {id: 14, name: 'Cera P/Pisos de Madera x 1.25 L', categoryName: 'Ceras', price: 150.25, points: 7.5, count: 1},
    {id: 15, name: 'Masilla Petrilac Natural x 125 G', categoryName: 'NO - Maderas', price: 150.25, points: 7.5, count: 2},
    {id: 16, name: 'Techesco Frentes Imp Cemento x20', categoryName: 'Hogar y Obra', price: 150.25, points: 7.5, count: 2},
    {id: 17, name: 'Kit Sellatec Techo', categoryName: 'Techados', price: 150.25, points: 7.5, count: 3},
    {id: 18, name: 'Pack Teak Cleaner-Brightener x10', categoryName: 'Nautica', price: 150.25, points: 7.5, count: 3}];
    

    this.invoices = [{createDate: '2024-06-10', clientId: 1, username: 'Ariel', type: 'Factura A', number: '0004-00001234', products: products1, points: 122.5},
                     {createDate: '2024-06-10', clientId: 1, username: 'Ariel', type: 'Factura B', number: '0004-00005678', products: products2, points: 150},
                     {createDate: '2024-06-10', clientId: 1, username: 'Ariel', type: 'Factura A', number: '0004-00005678', products: products12, points: 80.25},
                     {createDate: '2024-06-10', clientId: 1, username: 'Ariel', type: 'Factura B', number: '0004-00091011', products: products22, points: 250.2},
                     {createDate: '2024-06-10', clientId: 1, username: 'Ariel', type: 'Factura C', number: '0004-00091011', products: products3, points: 1547.8}];
  }

  cleanEventByFilter($event: any) {

    this.invoiceFilter = <any> {
      from: null,
      to: null
    };

    this.productFilter = <any> {
      from: null,
      to: null
    };

    this.adwardFilter = <any> {
      from: null,
      to: null
    };

    this.exchangedAdwardFilter = <any> {
      from: null,
      to: null
    };
  }

  searchEventByFilter($event: any) {

    if (this.tabIndex === 0) {

      this.invoicePaginatorComponent.resetPaginator(10);

      if ($event) this.invoiceFilter = $event;
      
      this.searchInvoices();
    }
    else if (this.tabIndex === 1) {

      this.productPaginatorComponent.resetPaginator(10);

      if ($event) this.productFilter = $event;

      this.searchProducts();
    }
    else if (this.tabIndex === 2) {

      this.adwardPaginatorComponent.resetPaginator(10);

      if ($event) this.adwardFilter = $event;

      this.searchAdwards();
    }
    else if (this.tabIndex === 3) {

      this.exchangedAdwardPaginatorComponent.resetPaginator(10);

      if ($event) this.exchangedAdwardFilter = $event;

      this.searchExchangedAdwards();
    }
    else if (this.tabIndex === 4) {

      if (this.provinces.length == 0) {
        this.addressService.findProvince().subscribe(result => {
          this.provinces = result;
        });
      }
      
      if (this.cities.length == 0) {
        this.addressService.findLocation().subscribe(result => {
          this.cities = result;
        });
      }

      if (this.businessNames.length == 0) {
        this.addressService.findAllReason().subscribe(result => {
          this.businessNames = result;
        });
      }

      this.sellerPaginatorComponent.resetPaginator(10);

      if ($event) this.sellerFilter = $event;

      this.searchSellers();
    }
  }

  searchInvoices() {

    this.invoiceFilter.firstResult = this.invoicePaginatorComponent.getFirstResult();
    this.invoiceFilter.maxResults = this.invoicePaginatorComponent.getMaxResults();

    // this.adminService.searchCouponByAccount(this.storedUser.token, this.invoiceFilter).subscribe(result => {

    //   this.invoicePaginatorComponent.setTotalElements(result.total);
    //   this.invoiceResults = result.list;
    // },
    // error => {
    //   alert("Error buscando facturas. Reintente nuevamente.");
    // });
  }

  searchProducts() {

    this.productFilter.firstResult = this.productPaginatorComponent.getFirstResult();
    this.productFilter.maxResults = this.productPaginatorComponent.getMaxResults();

    // this.adminService.searchCouponByAccount(this.storedUser.token, this.productFilter).subscribe(result => {

    //   this.productPaginatorComponent.setTotalElements(result.total);
    //   this.productResults = result.list;
    // },
    // error => {
    //   alert("Error buscando productos. Reintente nuevamente.");
    // });
  }

  searchAdwards() {

    this.adwardFilter.firstResult = this.adwardPaginatorComponent.getFirstResult();
    this.adwardFilter.maxResults = this.adwardPaginatorComponent.getMaxResults();

    // this.adminService.searchCouponByAccount(this.storedUser.token, this.adwardFilter).subscribe(result => {

    //   this.adwardPaginatorComponent.setTotalElements(result.total);
    //   this.adwardResults = result.list;
    // },
    // error => {
    //   alert("Error buscando premios. Reintente nuevamente.");
    // });
  }

  searchExchangedAdwards() {

    this.exchangedAdwardFilter.firstResult = this.exchangedAdwardPaginatorComponent.getFirstResult();
    this.exchangedAdwardFilter.maxResults = this.exchangedAdwardPaginatorComponent.getMaxResults();

    // this.adminService.searchCouponByAccount(this.storedUser.token, this.exchangedAdwardFilter).subscribe(result => {

    //   this.exchangedAdwardPaginatorComponent.setTotalElements(result.total);
    //   this.exchangedAdwardResults = result.list;
    // },
    // error => {
    //   alert("Error buscando premios. Reintente nuevamente.");
    // });
  }

  searchSellers() {

    this.sellerFilter.firstResult = this.sellerPaginatorComponent.getFirstResult();
    this.sellerFilter.maxResults = this.sellerPaginatorComponent.getMaxResults();

    this.adminService.searchAccountSeller(this.storedUser.token, this.sellerFilter).subscribe(result => {

      this.sellerPaginatorComponent.setTotalElements(result.total);
      this.sellerResults = result.list;
    },
    error => {
      alert("Error buscando vendedores. Reintente nuevamente.");
    });
  }

  onChangeTab($event) {

    this.tabIndex = $event.index;

    this.searchEventByFilter(null);
  }

  changeBusinessNameLike() {

    this.sellerFilter.likeNameBusinessName = (<HTMLInputElement>document.getElementById('businessNameLike')).value;
  }

  changeSellerLike() {

    this.sellerFilter.likeSeller = (<HTMLInputElement>document.getElementById('sellerLike')).value;
  }

  changeInvoiceLike() {

    this.invoiceFilter.invoiceLike = (<HTMLInputElement>document.getElementById('invoiceLike')).value;
  }

  changeProductLike() {

    this.productFilter.productLike = (<HTMLInputElement>document.getElementById('productLike')).value;
  }

  changeAdwardLike() {

    this.adwardFilter.adwardLike = (<HTMLInputElement>document.getElementById('adwardLike')).value;
  }

  changeProvince($event: any) {

    this.sellerFilter.provinceId = $event.value;
  }

  changeCity($event: any) {

    this.sellerFilter.locationId = $event.value;
  }

  changeBusinessName($event: any) {

    this.sellerFilter.businessNameId = $event.value;
  }

  changeOrderByFilter($event: any) {

    this.sellerFilter.orderBy = $event.value;
  }

  verifyAccount(accountSeller: AccountSeller) {

    if (accountSeller.isVerified) {
      return;
    }

    this.dialog.open(VerifyAccountDialogComponent, {
      width: "600px",
      autoFocus: false,
      panelClass: 'trend-dialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data:{accountSeller}
     }).afterClosed().subscribe(action => {
      if (action) {
        this.searchSellers();
      }
     });
  }

  exportSellers() {

    this.downloadXls('admin/search/export', this.sellerFilter, 'REPORTE_VENDEDORES');
  }

  public downloadXls(url:string, requestObject:any, filename:string = "Report", methodType:string="POST") {

    this.showLoading = true;

    try {
      let xhr = new XMLHttpRequest();
      let requestUrl =  '/private/api/' + url;

      xhr.open(methodType, requestUrl, true);
      xhr.setRequestHeader("Accept", "application/vnd.ms-excel");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.responseType = 'blob';

      var component = this;

      xhr.onreadystatechange = function() {

        if (xhr.readyState === 4 && xhr.status === 200) {

          var blob = new Blob([this.response], {type: 'application/vnd.ms-excel'});

          saveAs(blob, (filename + '-' + (new Date().toLocaleString()) + '.xls'));
        }

        component.showLoading = false;
      };

      xhr.send(JSON.stringify(requestObject));
    }
    catch (e) {
      this.showLoading = false;
      alert("Error exportando vendedores. Reintente nuevamente.");
    }
  }

  createAdward() {
    this.openAdwardPopup('create');
  }

  editAdward(adward: any) {
    this.openAdwardPopup('edit', adward);
  }

  deleteAdward(adward: any) {
    this.openAdwardPopup('delete', adward);
  }

  confirmAdward(adward: any) {
    this.openAdwardPopup('confirm', adward);
  }

  cancelAdward(adward: any) {
    this.openAdwardPopup('cancel', adward);
  }

  openAdwardPopup(action: string, adward?: any) {
    this.dialog.open(AwardDialogComponent, {
      width: "500px",
      autoFocus: false,
      panelClass: 'trend-dialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data:{action: action, adward: adward}
     }).afterClosed().subscribe(action => {
      if (action) {
      }
    });
  }

  createProduct() {
    this.openProductPopup('create');
  }
  
  editProduct(product: any){ 
    this.openProductPopup('edit', product);
  }

  deleteProduct(product: any){ 
    this.openProductPopup('delete', product);
  }

  openProductPopup(action: string, product?: any) {
    this.dialog.open(ProductDialogComponent, {
      width: "600px",
      autoFocus: false,
      panelClass: 'trend-dialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data:{action: action, product: product}
    }).afterClosed().subscribe(action => {
      if (action) {
      }
    });
  }

}
