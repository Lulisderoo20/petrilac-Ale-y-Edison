import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorageService } from 'ngx-webstorage';
import { User } from 'src/app/api';
import { AccountService } from '../../api/service/account.service';
import { UsersService } from '../../api/service/users.service';
import { SharedDataService } from '../services/shared-data.service.component';

@Component({
  selector: 'app-notification-window',
  templateUrl: './notification-window.component.html',
  styleUrls: ['./notification-window.component.css']
})
export class NotificationWindowComponent implements OnInit {

  retry : boolean = false;
  storedUserKey: string = 'stored-user';
  storedUser: User = {};
  subject: string = "CONFIRMAR TU CUENTA";
  email: string = null;

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private accountService: AccountService,
              private usersService: UsersService,
              private sharedDataService: SharedDataService) {

  }

  ngOnInit() {

    this.storedUser = this.localStorageService.retrieve(this.storedUserKey);

    this.sharedDataService.sharedData$.subscribe(sharedData => {

      if (sharedData && sharedData.email) {

        this.email = sharedData.email;

        this.subject = "RECUPERAR TU CONTRASEÑA"
      }
    });
  }

  onClick() {

    if (!this.email) {

      this.accountService.sendEmailConfirmation(this.storedUser.userId, this.storedUser.accountSeller.id).subscribe(result => {

        this.retry = true;
      },
      error => {
        alert('Error enviando el link para confirmar la cuenta. Reintente nuevamente.');
      });
    }
    else {

      this.usersService.retrievePassword(this.email).subscribe(result => {

        this.retry = true;
      },
      error => {
        alert('Error enviando el link para recuperar contraseña. Reintente nuevamente.');
      });
    }
  }
  
  goToWelcome() {
    
    this.router.navigate(['/bienvenido']);
  }

}
