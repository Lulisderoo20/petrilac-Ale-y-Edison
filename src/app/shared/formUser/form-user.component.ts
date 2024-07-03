import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";

import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { AccountService } from "../../api/service/account.service";
import { AddressService } from "../../api/service/address.service";
import { UsersService } from "../../api/service/users.service";
import { SharedDataService } from "../services/shared-data.service.component";
import { AccountBuyer, AccountSeller, Address, AuthRequest, BusinessName, User, ZipCode } from "../../api";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import {MatStepperModule} from '@angular/material/stepper';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = !!(form && form.submitted);
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      (control.parent.dirty || control.parent.touched)
    );

    return isSubmitted || (controlTouched && (controlInvalid || parentInvalid));
  }
}

export class PasswordValidator {
  static areEqual(formGroup: UntypedFormGroup) {
    let val;
    let valid = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: UntypedFormControl = <UntypedFormControl>formGroup.controls[key];

        if (val === undefined) {
          val = control.value;
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true,
    };
  }
}
@Component({
  selector: "app-form-user",
  templateUrl: "./form-user.component.html",
  styleUrls: ["./form-user.component.css"],
})
export class FormUserComponent implements OnInit {

  @Input() signup = false;
  @Input() register = false;

  @Output() registerEventEmitter = new EventEmitter();
  @Output() signUpEventEmitter = new EventEmitter();


  matchingPasswordsGroup: UntypedFormGroup;
  sellerLoginForm: UntypedFormGroup;
  sellerRegisterForm: UntypedFormGroup;
  sellerRecoveryPasswordForm: UntypedFormGroup;

  parentErrorStateMatcher = new ParentErrorStateMatcher();

  documentTypes = [
    {type:'DNI', name:'DNI'},
    {type:'CUIT', name:'CUIT'},
    {type:'CUIL', name:'CUIL'},
  ];

  account_validation_messages = {
    name: [
      { type: "required", message: "Nombre es requerido." },
      { type: "pattern", message: "Nombre es requerido." },
    ],
    lastName: [
      { type: "required", message: "Apellido es requerido." },
      { type: "pattern", message: "Apellido es requerido." },
    ],
    email: [
      { type: "required", message: "Correo electrónico es requerido." },
      { type: "pattern", message: "Ingrese un correo electrónico válido." },
    ],
    dni: [
      { type: "required", message: "Documento es requerido." },
    ],
    documentType: [
      { type: "required", message: "Tipo documento es requerido." },
    ],
    docuemntNumber: [
      { type: "required", message: "Número documento es requerido." },
      { type: "pattern", message: "Ingrese sólo números sin puntos." },
    ],
    password: [
      { type: "required", message: "Contraseña es requerida." },
      {
        type: "minlength",
        message: "Contraseña deberia tener al menos 5 caracteres.",
      },
      {
        type: "pattern",
        message:
          "Contraseña deberia tener una mayúscula, una minúscula y un número.",
      },
    ],
    confirmPassword: [
      { type: "required", message: "Confirmar la contraseña es requerido." },
      { type: "areEqual", message: "Las contraseñas no coinciden." },
    ],
    phoneNumber: [
      { type: "required", message: "Número de celular es requerido." },
      { type: "pattern", message: "Ingrese un número válido sin 0 y 15." },
    ],
    areaNumber: [
      { type: "required", message: "Número de área es requerido." },
      { type: "pattern", message: "Ingrese un número válido." },
    ],
    postalCode: [
      { type: "required", message: "Código postal es requerido." },
      { type: "pattern", message: "Código postal es requerido." },
    ],
    province: [
      { type: "required", message: "Pronvicia es requerido." },
    ],
    city: [
      { type: "required", message: "Localidad es requerido." },
    ],
    businessName: [
      { type: "required", message: "Nombre del comercio / razón social es requerido." },
    ],
    businessNameOther: [
      { type: "required", message: "Otro nombre del comercio / razón social es requerido." },
      { type: "pattern", message: "Otro nombre del comercio / razón social es requerido." },
    ],
    businessAddress: [
      { type: "required", message: "Dirección de la sucursal es requerido." },
    ],
    businessAddressOther: [
      { type: "required", message: "Otra dirección de la sucursal es requerido." },
      { type: "pattern", message: "Otra dirección de la sucursal es requerido." },
    ],
  };

  sellerLoggedIn: boolean = false;
  sellerLoggedUser: string;
  showLogin: boolean = true;
  showRegister: boolean = false;
  showRecoveryPassword: boolean = false;
  showLoading: boolean = false;
  showLoadingSuccessMessage: boolean = false;
  showEmailNotification: boolean = false;
  storedUserKey: string = 'stored-user';
  storedUser: User = {};
  accountSellerDTO: AccountSeller = {};
  searchTerm$ = new Subject<string>();
  zipCodeOptions = [];
  provinces = [];
  cities = [];
  businessNames = [];
  businessNamesOptions = [];
  businessAddresses = [];
  allProvinces = [];
  allBusinessNames = [];

  businessNameOther: BusinessName = {
    id: 0,
    name: 'OTRO'
  }

  businessAddressOther: Address = {
    id: 0,
    address: 'OTRO'
  }


  constructor(private fb: UntypedFormBuilder,
              private sharedDataService: SharedDataService,
              private router: Router,
              private accountService: AccountService,
              private usersService: UsersService,
              private addressService: AddressService) {

  }

  ngOnInit() {
   // this.sellerLoggedIn = this.sharedDataService.isUserLoggedIn();
    this.zipCodeOptions = new Array();
    this.provinces = new Array();
    this.cities = new Array();
    this.businessNames = new Array();
    this.businessNames.push(this.businessNameOther);
    this.businessNamesOptions = new Array();
    this.businessAddresses = new Array();
    this.businessAddresses.push(this.businessAddressOther);


    this.createForms();

    this.watcherSearchTerm();
  }

  encodedPassword(password: string) {
    return password;
  }


  createForms() {

    this.matchingPasswordsGroup = new UntypedFormGroup(
      {
        password: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.minLength(5),
            Validators.required,
            Validators.pattern(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$"
            ),
          ])
        ),
        confirmPassword: new UntypedFormControl("", Validators.required),
      },
      (formGroup: UntypedFormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      }
    );

    this.sellerLoginForm = this.fb.group({
      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new UntypedFormControl(
        "",
          Validators.required,
      ),
    });

    this.sellerRegisterForm = this.fb.group({
      name: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?!\\s*$).+"),
        ])
      ),
      lastName: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?!\\s*$).+"),
        ])
      ),
      documentType: new UntypedFormControl(
        "",
          Validators.required,
      ),
      documentNumber: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[1-9][0-9]{6,9}$"),
        ])
      ),
      phoneNumber: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^([0-9])*$"),
        ])
      ),
      areaNumber: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^([0-9])*$"),
        ])
      ),

      postalCode: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?!\\s*$).+"),
        ])
      ),
      province: new UntypedFormControl(
        "",
          Validators.required,
      ),
      city: new UntypedFormControl(
        "",
          Validators.required,
      ),
      businessName: new UntypedFormControl(
        "",
          Validators.required,
      ),
      businessNameOther: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?!\\s*$).+"),
        ])
      ),
      businessAddress: new UntypedFormControl(
        "",
          Validators.required,
      ),
      businessAddressOther: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?!\\s*$).+"),
        ])
      ),

      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      matchingPasswords: this.matchingPasswordsGroup,
      acceptTerms: new UntypedFormControl(
        "",
          Validators.required,
      )
    });

    this.sellerRecoveryPasswordForm = this.fb.group({
      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      )
    });

  }

  showSellerLogin() {

    this.showRecoveryPassword = false;
    this.showRegister = false;
    this.showLogin = true;
    this.signUpEventEmitter.emit();
  }

  goToRegister() {

    this.registerEventEmitter.emit();
  }

  showSellerRecoveryPassword() {

    this.showLogin = false;
    this.showRegister = false;
    this.showRecoveryPassword = true;
  }

  onSubmitSellerLoginForm(value: any) {

    const authRequest: AuthRequest = {
      username: value.email,
      password: this.encodedPassword(value.password)
    };

    this.showLoading = true;

    this.usersService.login(authRequest).subscribe(result => {

      this.sharedDataService.login(result);

      this.storedUser = result;

      this.sellerLoggedIn = true;

      if (this.storedUser.accountSeller && this.storedUser.accountSeller.name) {

        this.sellerLoggedUser = this.storedUser.accountSeller.name;
      }
      else {
        this.sellerLoggedUser = this.storedUser.email;
      }

      if (this.sellerLoggedUser && this.sellerLoggedUser.toUpperCase() == 'PROMOMUNDIAL@PETRILAC.COM.AR') {
        this.sellerLoggedUser = 'ADMIN';
      }

      this.showLoading = false;
    },
    error => {

     this.showLoading = false;

     alert('Error iniciando sesión. Verificá que tu cuenta esté activada (Verificá tu correo). Reintente nuevamente.');
    });
  }

  onSubmitSellerRegisterForm(value: any) {


      this.sellerLoggedUser = value.name.trim();

      this.accountSellerDTO.name = value.name.trim();
      this.accountSellerDTO.lastname = value.lastName.trim();
      this.accountSellerDTO.documentName = value.documentType;
      this.accountSellerDTO.documentNumber = value.documentNumber;
      this.accountSellerDTO.phoneNumber = value.areaNumber + value.phoneNumber;


      this.accountSellerDTO.zipCodeId = value.postalCode;
      this.accountSellerDTO.provinceId = value.province;
      this.accountSellerDTO.locationId = value.city;
      this.accountSellerDTO.businessNameId = value.businessName;
      this.accountSellerDTO.addressId = value.businessAddress;
      this.accountSellerDTO.otherBusinessName = value.businessNameOther ? value.businessNameOther.trim() : null;
      this.accountSellerDTO.otherAddress = value.businessAddressOther ? value.businessAddressOther.trim() : null;

      console.log('SellerRegisterForm', this.accountSellerDTO);


      this.accountSellerDTO.email = value.email;

      const userDTO: User = {
        accountSeller: this.accountSellerDTO,
        password: this.encodedPassword(value.matchingPasswords.password),
        repeatPassword: this.encodedPassword(value.matchingPasswords.confirmPassword)
      };

      this.showLoading = true;

      this.usersService.register(userDTO).subscribe(result => {

        this.sharedDataService.login(result);

        this.storedUser = result;

        this.showEmailNotification = true;

        this.showLoading = false;
      },
      error => {

       this.showLoading = false;

       alert('Error en la registración. Reintente nuevamente.');
      });
  }

  onSubmitSellerRecoveryPasswordForm(value: any) {

    this.showLoading = true;

    this.usersService.retrievePassword(value.email).subscribe(result => {

      var shareData = {email: null};
      shareData.email = value.email;

      this.sharedDataService.setSharedData(shareData);

      this.showEmailNotification = true;

      this.showLoading = false;
    },
    error => {

     this.showLoading = false;

     alert('Error para recuperar contraseña (Verificá que el correo sea el correcto). Reintente nuevamente.');
    });
  }

  goToWelcome() {

    this.router.navigate(['/bienvenido']);
  }

  goToAdmin() {

    this.router.navigate(['/administrador']);
  }

  logout() {

    this.sharedDataService.logout();

    this.goToWelcome();
  }

  searchZipcodes(zipCode: string) {

    this.cleanRelationshipZipCode();

    this.addressService.searchZipcode(zipCode).subscribe(result => {

      var zipCode = null;
      var zipCodeId = null;

      if (result.zipcode && result.zipcode.id) {

        zipCodeId = result.zipcode.id;

        zipCode = result.zipcode.code;

        this.zipCodeOptions.push(result.zipcode);

        this.selectedZipCode(zipCodeId);
      }

      this.provinces = result.provinces;

      if (this.provinces.length == 0) {

        this.provinces = this.allProvinces;
      }

      var provinceId = this.provinces[0].id;

      this.sellerRegisterForm.patchValue({
        province: provinceId
      });


      this.searchCities(provinceId, zipCodeId, zipCode);
    });
  }

  searchCities(provinceId: number, zipCodeId: number, zipCode: string) {

    this.cleanRelationshipCity();

    if (zipCodeId) {

      this.addressService.findLocationByProvinceIdAndCode(provinceId, zipCode).subscribe(result => {


        this.cities = result;

        if (this.cities.length > 0) {

          var cityId = this.cities[0].id;

          this.sellerRegisterForm.patchValue({
            city: cityId
          });

          this.searchBusinessNames(provinceId, cityId, zipCodeId);
        }
      });
    }
    else {

      this.addressService.findLocationById(provinceId).subscribe(result => {


        this.cities = result;

        if (this.cities.length > 0) {

          var cityId = this.cities[0].id;

          this.sellerRegisterForm.patchValue({
            city: cityId
          });

          this.searchZipcodesByProvinceAndCity(provinceId, cityId);
        }
      });
    }
  }

  searchBusinessNames(provinceId: number, cityId: number, zipCodeId: number) {

    this.cleanRelationshipBusinessAddress();

    this.addressService.findBusinessNameForProvinceLocationZipcode(provinceId, cityId, zipCodeId).subscribe(result => {


      this.businessNames = result;

      if (this.businessNames.length == 0) {

        this.businessNames = this.allBusinessNames;
      }
      var businessNamesOtherOption = this.businessNames.find(bn => bn.name == 'OTRO');
      if (!businessNamesOtherOption) {
        this.businessNames.push(this.businessNameOther);
      }

      this.businessNamesOptions = this.businessNames;
    });
  }

  searchZipcodesByProvinceAndCity(provinceId: number, cityId: number) {

    this.cleanRelationshipZipCodeOnly();

    this.addressService.findZipCodeByProvinceAndLocation(provinceId, cityId).subscribe(result => {

      this.zipCodeOptions = result;

      if (this.zipCodeOptions.length > 0) {

        var zipCodeId = this.zipCodeOptions[0].id;

        this.sellerRegisterForm.patchValue({
          postalCode: zipCodeId
        });

        this.selectedZipCode(zipCodeId);

        this.searchBusinessNames(provinceId, cityId, zipCodeId);
      }
    });
  }

  watcherSearchTerm() {

    this.searchTerm$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term && term.length == 4))
      .subscribe((result: any) => {
        this.searchZipcodes(result);
      });
  }

  cleanRelationshipZipCodeOnly() {
    this.zipCodeOptions = new Array();
    this.sellerRegisterForm.patchValue({
      postalCode: null
    });
    (<HTMLInputElement>document.getElementById('autocompleteZipCode')).value = '';
  }

  cleanRelationshipZipCode() {
    this.zipCodeOptions = new Array();
    this.sellerRegisterForm.patchValue({
      postalCode: null
    });
    this.cleanRelationshipProvince();
  }

  cleanRelationshipProvince() {
    this.provinces = new Array();
    this.sellerRegisterForm.patchValue({
      province: null
    });
    this.provinces = this.allProvinces;
    this.cleanRelationshipCity();
  }

  cleanRelationshipCity() {
    this.cities = new Array();
    this.sellerRegisterForm.patchValue({
      city: null
    });
    this.cleanRelationshipBusinessName();
  }

  cleanRelationshipBusinessName() {
    this.businessNames = new Array();
    this.businessNamesOptions = new Array();
    (<HTMLInputElement>document.getElementById('autocompleteBusinessName')).value = '';
    this.sellerRegisterForm.patchValue({
      businessName: null
    });
    this.cleanRelationshipBusinessAddress();
  }

  cleanRelationshipBusinessAddress() {
    this.businessAddresses = new Array();
    this.sellerRegisterForm.patchValue({
      businessAddress: null
    });
  }

  isNumber(value: string | number): boolean {
    return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
  }

  onInputZipCodeChange() {

    var inputValue = (<HTMLInputElement>document.getElementById('autocompleteZipCode')).value;

    this.cleanRelationshipZipCode();

    if (!inputValue || !this.isNumber(inputValue)) {
      return;
    }

    this.searchTerm$.next(inputValue);
  }

  selectedZipCode(zipCodeId) {


    this.sellerRegisterForm.patchValue({
      postalCode: zipCodeId
    });

    var itemFound = this.zipCodeOptions.find(item => item.id == zipCodeId);

    const inputElemment = (<HTMLInputElement>document.getElementById('autocompleteZipCode'));
    if (inputElemment && itemFound && itemFound.code) {
      inputElemment.value = itemFound.code;
    }

    this.cleanRelationshipBusinessName();

    if (this.sellerRegisterForm.value.province && this.sellerRegisterForm.value.city) {

      this.searchBusinessNames(this.sellerRegisterForm.value.province, this.sellerRegisterForm.value.city, zipCodeId);
    }
  }

  displayFnZipCode(zipCodeId): string {


    if (!zipCodeId || !this.zipCodeOptions || this.zipCodeOptions.length == 0) {
      return "";
    }

    var zipCode = this.zipCodeOptions.find(z => z.id == zipCodeId);


    if (!zipCode) {
      return "";
    }

    return zipCode.code;
  }

  onSelectChangeProvinces(provinceId: number) {
    var inputValue = (<HTMLInputElement>document.getElementById('autocompleteZipCode')).value;

    this.cleanRelationshipCity();

    this.searchCities(provinceId, this.sellerRegisterForm.value.postalCode, inputValue);
  }

  onSelectChangeCities(cityId: number) {
    this.cleanRelationshipBusinessName();

    this.searchZipcodesByProvinceAndCity(this.sellerRegisterForm.value.province, cityId);

    // if (!this.sellerRegisterStep2Form.value.postalCode) {
    //   this.searchZipcodesByProvinceAndCity(this.sellerRegisterStep2Form.value.province, cityId);
    // }
    // else {
    //   this.searchBusinessNames(this.sellerRegisterStep2Form.value.province, cityId, this.sellerRegisterStep2Form.value.postalCode);
    // }
  }

  onSelectChangeBusinessNames(businessNameId: number) {

    if (businessNameId > 0) {
      this.sellerRegisterForm.controls.businessNameOther.disable();
    }
    else {
      this.sellerRegisterForm.controls.businessNameOther.enable();
    }

    this.cleanRelationshipBusinessAddress();

    if (this.businessNames.length > 0) {

      var businessName = this.businessNames.find(bn => bn.id == businessNameId);

      if (businessName && businessName.address) {

        this.businessAddresses = businessName.address;
      }
    }

    var businessAddressOtherOption = this.businessAddresses.find(ba => ba.address == 'OTRO');
    if (!businessAddressOtherOption) {
      this.businessAddresses.push(this.businessAddressOther);
    }
  }

  onSelectChangeBusinessAddresses(businessAddressId: number) {

    if (businessAddressId > 0) {
      this.sellerRegisterForm.controls.businessAddressOther.disable();
    }
    else {
      this.sellerRegisterForm.controls.businessAddressOther.enable();
    }
  }

  onInputBusinessNameChange() {

    var inputValue = (<HTMLInputElement>document.getElementById('autocompleteBusinessName')).value;

    this.businessNamesOptions = this.businessNames;

    if (!inputValue || inputValue.trim() == '') {
        return;
    }

    this.businessNamesOptions = this.filterBusinessNameOptions(inputValue);
  }

  filterBusinessNameOptions(name: string) {

    if (!this.businessNamesOptions) {
      return;
    }

    const filterValue = name.toLowerCase();

    return this.businessNamesOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  selectedBusinessName(businessNameId) {


    this.sellerRegisterForm.patchValue({
      businessName: businessNameId
    });

    this.onSelectChangeBusinessNames(businessNameId);
  }

  displayFnBusinessName(businessNameId): string {


    var businessName = this.businessNamesOptions.find(b => b.id == businessNameId);


    if (!businessName) {
      return "";
    }

    return businessName.name;
  }


}
