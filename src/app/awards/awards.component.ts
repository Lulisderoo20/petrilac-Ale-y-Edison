import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SharedDataService } from '../shared/services/shared-data.service.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { AwardDialogComponent } from '../shared/dialog/award-dialog.component';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})

export class AwardsComponent implements OnInit {

  isMobile: boolean = false;
  showLoading: boolean = false;
  isEmpty: boolean = true;
  gridListCols: number = 6;
  gridListRowHeight: string = "280px";
  gridListGutterSize: string = "40px";
  gridListTileColspan: number = 1;
  gridListTileRowspan: number = 1;

  awards: any[] = new Array();

  exchanged: boolean = false;

  constructor(private router: Router,
              protected route: ActivatedRoute,
              private sharedDataService: SharedDataService,
              private dialog: MatDialog,
              private overlay: Overlay) {

  }

  ngOnInit() {
    
    this.isMobile = this.sharedDataService.isMobile();

    if (this.isMobile) {
      this.gridListCols = 2;
    }

    this.exchanged = this.route.snapshot.data['exchanged'];

    for (let i = 1; i <= 30; i++) {
      this.awards.push({src: '/assets/image/awards/'+i+'.png', score: 108, name: 'Auriculares inalambricos', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        allowRedeem: !this.exchanged});
    }

    this.isEmpty = this.awards.length == 0;
  }

  getGridTileColspan(award: any) : number {

    if (award && award.gridTileColspan) {
      return award.gridTileColspan;
    }

    return this.gridListTileColspan;
  }

  getGridTileRowspan(award: any) : number {

    if (award && award.gridTileRowspan) {
      return award.gridTileRowspan;
    }

    return this.gridListTileRowspan;
  }
  
  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);
  }

  showDetail(award: any) {

    this.dialog.open(AwardDialogComponent, {
      width: "500px",
      autoFocus: false,
      panelClass: 'trend-dialog',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data:{award}
     }).afterClosed().subscribe(action => {
      if (action) {
        this.redeemPoints(award);
      }
    });
  }

  redeemPoints(award: any) {

    if (!award.allowRedeem) {
      return;
    }

    this.showLoading = true;

    console.log("CANJEAR PUNTOS", award)
  }

}
