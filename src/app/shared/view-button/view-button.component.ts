import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsDialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-view-button',
  templateUrl: './view-button.component.html',
  styleUrls: ['./view-button.component.css']
})
export class ViewButtonComponent implements OnInit {

  @Input() viewType: string;
 
  constructor(private dialog: MatDialog, private overlay: Overlay) {

  }

  ngOnInit(): void {

  }

  onClickTerms() {

   this.dialog.open(TermsDialogComponent, {
    width: "600px",
    autoFocus: false,
    panelClass: 'trend-dialog',
    scrollStrategy: this.overlay.scrollStrategies.noop()
   });
  }
 
}
