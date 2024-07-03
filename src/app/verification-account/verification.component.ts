import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from '../api/service/account.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})

export class VerificationComponent implements OnInit {

  showMessage: boolean = false;
  userId: any;
  accountId: any;
  

  constructor(private router: Router , protected route: ActivatedRoute, private accountService : AccountService) {

  }

  ngOnInit() {

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

        if(this.userId && this.accountId){
          this.accountService.verificationAccount(this.userId,this.accountId).subscribe(result=>{
           this.showMessage = true;
          },
          error=>{
            alert("Error verificando la cuenta. Reintente nuevamente.");
            this.goToWelcome();
          }
          )
        }
    });

  }
  
  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);

  }

}
