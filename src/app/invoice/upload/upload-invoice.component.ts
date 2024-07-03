import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SharedDataService } from '../../shared/services/shared-data.service.component';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['../invoice.component.css']
})

export class UploadInvoiceComponent implements OnInit {

  isMobile: boolean = false;
  showLoading: boolean = false;

  invoice: any = {};
  invoiceForm: UntypedFormGroup;
  productsForm: UntypedFormGroup;

  invoiceValidationMessages = {
    type: [
      { type: "required", message: "Campo requerido." },
    ],
    number: [
      { type: "required", message: "Campo requerido." },
    ],
  };

  get products(): UntypedFormArray {
    return this.productsForm.get('products') as UntypedFormArray;
  };

  productCategories: any[] = [{id: 1, name: 'Aerosoles'}, {id: 2, name: 'Para Metales'}, {id: 3, name: 'Default'},
                              {id: 4, name: 'Preservadores'}, {id: 5, name: 'Removedores'}, {id: 6, name: 'Lacas y Barnices'},
                              {id: 7, name: 'Lasures'}, {id: 8, name: 'Diluyentes'}, {id: 9, name: 'Accesorios'},
                              {id: 10, name: 'Ladrillos'}, {id: 11, name: 'PU Mono Pisos'}, {id: 12, name: 'Tintas'},
                              {id: 13, name: 'Adhesivos'}, {id: 14, name: 'Ceras'}, {id: 15, name: 'NO - Maderas'},
                              {id: 16, name: 'Hogar y Obra'}, {id: 17, name: 'Techados'}, {id: 18, name: 'Nautica'},];

  allProducts: any[] = [{id: 1, name: 'Aerosol Barniz Bte x 0.420 Lt', categoryId: 1, price: 150.25, points: 7.5}, {id: 2, name: 'FB Tradicional Negro x 1/4 L', categoryId: 2, price: 150.25, points: 7.5}, {id: 3, name: 'Producto a Granel', categoryId: 3, price: 150.25, points: 7.5},
                        {id: 4, name: 'Pintura para Prueba', categoryId: 4, price: 150.25, points: 7.5}, {id: 5, name: 'Penta Renovador/Limp x 1 L', categoryId: 5, price: 150.25, points: 7.5}, {id: 6, name: 'Penta Revestimiento x 1 L', categoryId: 6, price: 150.25, points: 7.5},
                        {id: 7, name: 'Penta Stain Sat.Natural x 1 L', categoryId: 7, price: 150.25, points: 7.5}, {id: 8, name: 'Diluyente 200 x 1/2 L', categoryId: 8, price: 150.25, points: 7.5}, {id: 9, name: 'Restaurador Lustrelac Med. x 1/4', categoryId: 9, price: 150.25, points: 7.5},
                        {id: 10, name: 'Comp.Enton.Sellagres x 100 cc', categoryId: 10, price: 150.25, points: 7.5}, {id: 11, name: 'Rolac Brillante x 4 L', categoryId: 11, price: 150.25, points: 7.5}, {id: 12, name: 'T.C. AT Nogal x 240 cc', categoryId: 12, price: 150.25, points: 7.5},
                        {id: 13, name: 'Adhesivo Petrilac x 1.250 K', categoryId: 13, price: 150.25, points: 7.5}, {id: 14, name: 'Cera P/Pisos de Madera x 1.25 L', categoryId: 14, price: 150.25, points: 7.5}, {id: 15, name: 'Masilla Petrilac Natural x 125 G', categoryId: 15, price: 150.25, points: 7.5},
                        {id: 16, name: 'Techesco Frentes Imp Cemento x20', categoryId: 16, price: 150.25, points: 7.5}, {id: 17, name: 'Kit Sellatec Techo', categoryId: 17, price: 150.25, points: 7.5}, {id: 18, name: 'Pack Teak Cleaner-Brightener x10', categoryId: 18, price: 150.25, points: 7.5},
                        {id: 19, name: 'Pintura para Preservar', categoryId: 4, price: 150.25, points: 7.5}];

  selectProducts = new Map();
  selectedProducts = new Map();

  uploadInvoicePoints: number = 0;

  constructor(private router: Router,
              protected route: ActivatedRoute,
              private sharedDataService: SharedDataService,
              private formBuilder: UntypedFormBuilder) {

  }

  ngOnInit() {
    
    this.isMobile = this.sharedDataService.isMobile();

    this.invoiceForm = this.formBuilder.group({
      type: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      number: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
    });

    this.productsForm = this.formBuilder.group({
      products: this.formBuilder.array([])
    });
    
    this.addProductItem();
  }

  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);
  }

  onSubmitInvoiceForm(invoice: any) {

    console.log("UPLOAD INVOICE", invoice, this.products.value);

    this.showLoading = true;
  }

  createProductItem(): UntypedFormGroup {
    return this.formBuilder.group({
      categoryId: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      productId: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      count: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
    });
  }

  addProductItem(): void {
    this.products.push(this.createProductItem());
  }

  onSelectChangeProductCategories(itemIndex: any, categoryId: number) {

    this.selectedProducts.set(itemIndex, null);

    this.selectProducts.set(itemIndex, this.allProducts.filter(product => product.categoryId == categoryId 
                                                                && !this.findSelectedProduct(product.id)));
    
    var product = this.products.value[itemIndex];
    product.productId = null;
    product.count = null;
    this.products.setValue(this.products.value);

    this.calculateInvoicePoints();
  }
  
  findSelectedProduct(productId: number): boolean {

    for (const [key, value] of this.selectedProducts.entries()) {
      if (value == productId)
          return true;
    }

    return false;
  }
  
  onSelectChangeProducts(itemIndex: any, productId: number) {

    this.selectedProducts.set(itemIndex, productId);

    var product = this.products.value[itemIndex]; 
    product.count = 1;
    this.products.setValue(this.products.value);

    this.calculateInvoicePoints();
  }

  onChangeProductCount(itemIndex: any, count: number) {

    this.calculateInvoicePoints();
  }

  incrementProductCount(itemIndex: any, step: number = 1): void {

    var product = this.products.value[itemIndex];

    var count = Number(step);
    if (product.count) {
      count = Number(product.count) + Number(step);
    }
    
    if (count <= 0) {
      return;
    }

    product.count = count;

    this.products.setValue(this.products.value);
  }

  calculateInvoicePoints() {

    this.uploadInvoicePoints = 0;

    if (!this.products?.value) {
      return;
    }

    for (let i = 0; i < this.products.value.length; i++) {
      
      var product = this.products.value[i];

      if (product?.productId && product?.count) {

        var currentProduct = this.getProduct(product.productId);

        this.uploadInvoicePoints += (Number(currentProduct.points) * Number(product.count));
      }
    }
  }

  getProduct(productId: number) {
    return this.allProducts.find(product => product.id == productId);
  }

  checkingSelectedProduct(itemIndex: any) {
    var product = this.products.value[itemIndex];
    return product?.productId;
  }
  
}
