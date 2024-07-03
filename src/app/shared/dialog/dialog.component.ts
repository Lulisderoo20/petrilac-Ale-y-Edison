import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class TermsDialogComponent {

  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>) {}

  closeDialog() {

    this.dialogRef.close(false);
  }
}

