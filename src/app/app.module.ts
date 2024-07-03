import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing.module';
import { WelcomeModule } from './welcome/welcome.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SecurityAuthGuard } from './shared/security-authguard/security-authguard.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ApiModule } from './api';
import { AdminModule } from './admin/admin.module';
import { VerificationModule } from './verification-account/verification.module';
import { RouterModule } from '@angular/router';
import { RecoverAccountModule } from './recover-account/recover-account.module';
import { AwardsModule } from './awards/awards.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LOCALE_ID } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExra from '@angular/common/locales/extra/es';

registerLocaleData(localeEs, 'es-ES', localeEsExra);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule, BrowserModule, BrowserAnimationsModule, SharedModule, AppRoutingModule,
    ReactiveFormsModule, HttpClientModule,
    WelcomeModule, AdminModule, VerificationModule, RecoverAccountModule, AwardsModule, InvoiceModule,
    NgxWebstorageModule.forRoot(),
    ApiModule
  ],
  providers: [
    SecurityAuthGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
