import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AccountSeller, User } from '../api';
import { AccountService } from '../api/service/account.service';
import { UsersService } from '../api/service/users.service';
import { ParentErrorStateMatcher, PasswordValidator } from '../shared/formUser/form-user.component';
import { SharedDataService } from '../shared/services/shared-data.service.component';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})

export class RecoverAccountComponent implements OnInit {

  showLoading: boolean = false;
  showMessage: boolean = false;
  verifiedAccount: boolean = false;
  userId: any;
  accountId: any;
  matchingPasswordsGroup: UntypedFormGroup;
  sellerRecoveryPasswordGroup: UntypedFormGroup;

  parentErrorStateMatcher = new ParentErrorStateMatcher();

  account_validation_messages = {
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
    ]
  };
  
  constructor(private router: Router,
              protected route: ActivatedRoute,
              private accountService: AccountService,
              private usersService: UsersService,
              private formBuilder: UntypedFormBuilder,
              private sharedDataService: SharedDataService) {

  }

  ngOnInit() {

    this.createForms();

    this.route.url.subscribe(params => {

        try {
          this.userId = params[2].path;
        }
        catch (e) {
          this.userId = null;
        }
        try {
          this.accountId = params[3].path;
        }
        catch (e) {
          this.accountId = null;
        }

        if (this.userId && this.accountId) {
          
          this.accountService.verificationAccountByAdmin(this.userId,this.accountId).subscribe(result=>{

           this.verifiedAccount = true;
          },
          error=>{
            alert("Error recuperando la cuenta. Reintente nuevamente.");
            this.goToWelcome();
          }
          )
        }
    });
  }
  
  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);
  }

  goToLogin() {
    
    var shareData = {formType: null};
    shareData.formType = 'seller';

    this.sharedDataService.setSharedData(shareData);

    this.router.navigate(['/formulario']);
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

    this.sellerRecoveryPasswordGroup = this.formBuilder.group({
      matchingPasswords: this.matchingPasswordsGroup
    });
  }

  encodedPassword(password: string) {
    return password;
  }

  onSubmit(formValue: any) {

    const accountSellerDTO: AccountSeller = {
      id: this.accountId
    }

    const userDTO: User = {
      userId: this.userId,
      accountSeller: accountSellerDTO,
      password: this.encodedPassword(formValue.matchingPasswords.password),
      repeatPassword: this.encodedPassword(formValue.matchingPasswords.confirmPassword)
    };

    this.showLoading = true;

    this.verifiedAccount = false;

    this.usersService.recoverPassword(userDTO).subscribe(result => {
      
      this.showMessage = true;

      this.showLoading = false;
    },
    error => {

      this.verifiedAccount = true;

     this.showLoading = false;

     alert('Error recuperando la cuenta. Reintente nuevamente.');
    });
  }

}
