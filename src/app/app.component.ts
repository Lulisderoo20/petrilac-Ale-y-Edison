import {  Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { SharedDataService } from './shared/services/shared-data.service.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isMobile: boolean = false;
  isUserLoggedIn: boolean = false;
  isAdminUser: boolean = false;
  showMenu: boolean = false;
  currentUrl: string;
  
  constructor(protected route: ActivatedRoute, private router: Router,
              public translate: TranslateService,
              protected sharedDataService: SharedDataService) {
	  // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('es');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('es');
  }

  ngOnInit() {

    this.isMobile = this.sharedDataService.isMobile();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {

        var path = Object.assign(event);

        this.currentUrl = path.url;

        if (this.currentUrl != '' && this.currentUrl != '/' && !this.currentUrl.includes('bienvenido')) {
          
          this.isUserLoggedIn = this.sharedDataService.isUserLoggedIn();

          if (this.isUserLoggedIn) {
            
            this.isAdminUser = this.sharedDataService.isAdminUser();
          }

          this.showMenu = this.isMobile || this.isUserLoggedIn;
        }
        else {

          this.showMenu = this.isMobile;
        }
      });
  }

  logout(sidenav: any) {

    sidenav.toggle();
    
    this.sharedDataService.logout();
  }

}
