import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject } from 'rxjs';
import { DeviceDetectorService } from '../device/device-detector.service';

@Injectable()
export class SharedDataService {

  private storedUserKey: string = 'stored-user';
  private _sharedData = new BehaviorSubject<any>(null);
  sharedData$ = this._sharedData.asObservable();


  constructor(protected route: ActivatedRoute, private router: Router,
              private localStorageService: LocalStorageService,
              protected deviceService: DeviceDetectorService) {

  }

  public setSharedData(value: any) {
    this._sharedData.next(value);
  }

  isUserLoggedIn() {
    
    var storedUser = this.localStorageService.retrieve(this.storedUserKey);

    //return storedUser && storedUser.token;

    return true;
  }

  getUserLoggedIn() {

    if (!this.isUserLoggedIn()) {
      return null;        
    }

    return this.localStorageService.retrieve(this.storedUserKey);
  }

  isAdminUser() {

    var storedUser = this.getUserLoggedIn();

    //return storedUser?.role == 'admin';

    return true;
  }

  login(user: any) {

    this.localStorageService.store(this.storedUserKey, user);
  }

  logout() {

    this.localStorageService.clear(this.storedUserKey);

    this.router.navigate(['/bienvenido']);
  }

  isMobile() {

    return this.deviceService.isMobile();
  }

}
