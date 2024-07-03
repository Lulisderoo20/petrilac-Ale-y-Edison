import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-award-dialog',
  templateUrl: './award-dialog.component.html',
})
export class AwardDialogComponent implements OnInit {

  showLoading: boolean = false;
  action: string = 'redeem';
  award: any = {};
  
  constructor(public dialogRef: MatDialogRef<AwardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  closeDialog() {

    this.dialogRef.close(false);
  }

  ngOnInit() {
    
    this.award = this.data.award;
    if (this.data.action) {
      this.action = this.data.action;
    }
  }

  redeemPoints() {

    this.dialogRef.close(true);
  }

}
