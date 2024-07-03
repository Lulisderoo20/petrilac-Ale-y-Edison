import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountSeller } from 'src/app/api';
import { AccountService } from 'src/app/api/service/account.service';

@Component({
  selector: 'app-verify-account-dialog',
  templateUrl: './verify-account-dialog.component.html',
})
export class VerifyAccountDialogComponent implements OnInit {

  accountSeller: AccountSeller;
  showLoading: boolean = false;
  
  constructor(public dialogRef: MatDialogRef<VerifyAccountDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private accountService: AccountService) {

  }

  closeDialog() {

    this.dialogRef.close(false);
  }

  ngOnInit() {

    this.accountSeller = this.data.accountSeller;
  }

  verifyAccount() {

    if (this.showLoading) {
      return;
    }

    if (this.accountSeller.userId && this.accountSeller.id) {

      this.showLoading = true;
          
      this.accountService.verificationAccountByAdmin(this.accountSeller.userId, this.accountSeller.id).subscribe(result=>{

        this.dialogRef.close(true);

        this.showLoading = false;
      },
      error=>{

        this.showLoading = false;

        alert("Error verificando la cuenta. Reintente nuevamente.");
      }
      )
    }
  }
}
