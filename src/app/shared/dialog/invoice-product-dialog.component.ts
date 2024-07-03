import {Component, Inject, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-product-dialog',
  templateUrl: './invoice-product-dialog.component.html',
})
export class InvoiceProductDialogComponent implements OnInit {

  showLoading: boolean = false;
  action: string;
  invoice: any = {};
  product: any = {};
  productForm: UntypedFormGroup;

  productValidationMessages = {
    categoryId: [
      { type: "required", message: "Campo requerido." },
    ],
    id: [
      { type: "required", message: "Campo requerido." },
    ],
    count: [
      { type: "required", message: "Campo requerido." },
    ],
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
  products: any[];

  constructor(public dialogRef: MatDialogRef<InvoiceProductDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: UntypedFormBuilder) {

  }

  closeDialog() {

    this.dialogRef.close(false);
  }

  ngOnInit() {
    
    this.action = this.data.action;
    this.invoice = this.data.invoice;
    this.product = this.data.product;

    this.productForm = this.formBuilder.group({
      categoryId: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
        ])
      ),
      id: new UntypedFormControl(
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

    if (this.product) {
      this.products = this.allProducts.filter(product => product.categoryId == this.product.categoryId);
      this.productForm.patchValue({
        categoryId: this.product.categoryId,
        id: this.product.id,
        count: this.product.count
      });
    }
  }
  
  onSubmitInvoiceProductForm(product: any) {

    this.showLoading = true;

    if (this.action == 'create') {
      console.log("CREATE PRODUCT", product);
    }
    else if (this.action == 'edit') {
      console.log("EDIT PRODUCT", product);
    }
    else if (this.action == 'delete') {
      console.log("DELETE PRODUCT", product);
    }
    
    this.dialogRef.close(true);
  }

  cancelInvoice() {

    if (this.action == 'cancel') {
      console.log("CANCEL INVOICE", this.invoice, this.product);
    }

    this.dialogRef.close(true);
  }

  onSelectChangeProductCategories(categoryId: number) {

    this.products = this.allProducts.filter(product => product.categoryId == categoryId);
    
    this.productForm.patchValue({
      id: null
    });
  }

}
