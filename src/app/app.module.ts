import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatRadioModule,
  MatDialogModule,
  MatExpansionModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatTableModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatChipsModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatStepperModule,
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageService } from './services/language.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { ParentComponent } from './components/parent/parent.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PinsComponent } from './components/pins/pins.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddAccountComponent } from './pages/account/add-account/add-account.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { PinSetupDialogComponent } from './components/pin-setup-dialog/pin-setup-dialog.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { PinConfirmationComponent } from './components/pin-confirmation/pin-confirmation.component';
import { RevealPassphraseComponent } from './components/reveal-passphrase/reveal-passphrase.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';
import { AddressModule } from './components/address/address.module';
import { DateAgoModule } from './pipes/date-ago.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AccountSelectorModule } from './components/account-selector/account-selector.module';
import { InputAddressModule } from './components/input-address/input-address.module';
import { InputAmountModule } from './components/input-amount/input-amount.module';
import { AccountComponent } from './pages/account/account.component';
import { MultisigInfoComponent } from './pages/account/multisig-info/multisig-info.component';
import { SeatsComponent } from './pages/seats/seats.component';
import { SeatDetailComponent } from './pages/seats/seat-detail/seat-detail.component';
import { ConfirmUpdateComponent } from './pages/seats/confirm-update/confirm-update.component';
import { DownloadCertificateComponent } from './pages/seats/download-certificate/download-certificate.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

export function getLanguage(languageServ: LanguageService) {
  return languageServ.selected;
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ParentComponent,
    SignupComponent,
    SidebarComponent,
    PinsComponent,
    AddAccountComponent,
    RestoreWalletComponent,
    PinSetupDialogComponent,
    ConfirmPassphraseComponent,
    PinConfirmationComponent,
    RevealPassphraseComponent,
    EditAccountComponent,
    AccountComponent,
    MultisigInfoComponent,
    SeatsComponent,
    SeatDetailComponent,
    ConfirmUpdateComponent,
    DownloadCertificateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxQRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    AddressModule,
    DateAgoModule,
    AccountSelectorModule,

    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatStepperModule,
    InputAddressModule,
    InputAmountModule,
    MatStepperModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [LanguageService],
      useFactory: getLanguage,
    },
    { provide: 'global', useFactory: () => window },
  ],
  entryComponents: [
    AddAccountComponent,
    PinSetupDialogComponent,
    PinConfirmationComponent,
    RevealPassphraseComponent,
    EditAccountComponent,
    MultisigInfoComponent,
    SeatDetailComponent,
    ConfirmUpdateComponent,
    DownloadCertificateComponent,
  ],
})
export class AppModule {}
// platformBrowserDynamic().bootstrapModule(AppModule);
