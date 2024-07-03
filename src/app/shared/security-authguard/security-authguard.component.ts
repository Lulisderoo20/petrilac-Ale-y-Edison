import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service.component';

@Injectable()
export class SecurityAuthGuard  {

  storedUserKey: string = 'stored-user';

  authenticatedUrls: string[] = [
    // '/administrador',
    // '/premios',
    // '/premios-canjeados',
    // '/facturas',
    // '/cargar-factura'
  ];

  constructor(protected router: Router,
              private sharedDataService: SharedDataService) {
    
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    const url = state.url;

    return new Promise(async (resolve, reject) => {

      var canActivate = !this.authenticatedUrls.includes(url);

      if (canActivate) {
        return resolve(true);
      }

      var storedUser = this.sharedDataService.getUserLoggedIn();

      if (!storedUser || !storedUser.token) {
        
        return resolve(false);
      }

      resolve(this.isUserInRole(route.data.roles, storedUser));
    });
  }

  isUserInRole(roles: Array<string>, storedUser: any): boolean {

    if (!roles || roles.length === 0) {
        return true;
    }

    return (roles.find(role => role == storedUser.role) !== undefined);
  }

}
