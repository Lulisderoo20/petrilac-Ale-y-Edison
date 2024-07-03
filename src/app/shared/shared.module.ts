import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { ServiceModule } from './services/service.module';
import { SuccessMessageComponent } from './success-message';
import { WelcomeRoutingModule } from '../welcome/welcome.routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SharedDataService } from './services/shared-data.service.component';
import { ViewButtonComponent } from './view-button/view-button.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { NotificationWindowComponent } from './notification-window/notification-window.component'
import { VerificationRoutingModule } from '../verification-account/verification.routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { TermsDialogComponent } from './dialog/dialog.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { AdminRoutingModule } from '../admin/admin.routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorComponent } from './paginator/paginator.component';
import { RecoverAccountRoutingModule } from '../recover-account/recover-account.routing.module';
import { VerifyAccountDialogComponent } from './dialog/verify-account-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormUserComponent } from './formUser/form-user.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { AwardsRoutingModule } from '../awards/awards.routing.module';
import { DeviceDetectorService } from './device/device-detector.service';
import { InvoiceRoutingModule } from '../invoice/invoice.routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AwardDialogComponent } from './dialog/award-dialog.component';
import { ProductDialogComponent } from './dialog/product-dialog.component';
import { InvoiceProductDialogComponent } from './dialog/invoice-product-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langDefault = 'es';
      translate.setDefaultLang(langDefault);
      translate.use(langDefault).subscribe(() => {
      }, err => {
        console.error(err);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  imports: [
    RouterModule, 
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    ServiceModule,
    WelcomeRoutingModule, VerificationRoutingModule, AdminRoutingModule, RecoverAccountRoutingModule, AwardsRoutingModule,
    InvoiceRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [ HttpClient ]
      }
    }),
    MaterialModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatStepperModule,
    MatTooltipModule,
  ],
  exports: [
    MaterialModule,
    ActionBarComponent, LoadingSpinnerComponent, SuccessMessageComponent, NotificationWindowComponent, CountdownTimerComponent, ViewButtonComponent,
    TermsDialogComponent, SearchFilterComponent, VerifyAccountDialogComponent, AwardDialogComponent,
    PaginatorComponent, FormUserComponent, ProductDialogComponent, InvoiceProductDialogComponent,
  ],
  declarations: [
    ActionBarComponent, LoadingSpinnerComponent, SuccessMessageComponent, NotificationWindowComponent, CountdownTimerComponent, ViewButtonComponent,
    TermsDialogComponent, SearchFilterComponent, VerifyAccountDialogComponent, AwardDialogComponent,
    PaginatorComponent, FormUserComponent, ProductDialogComponent, InvoiceProductDialogComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    SharedDataService,
    DeviceDetectorService,
  ],
})
export class SharedModule { }
