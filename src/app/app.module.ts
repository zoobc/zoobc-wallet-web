import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { sign as naclSign } from 'tweetnacl';
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
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageService } from './services/language.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SendmoneyComponent } from './pages/sendmoney/sendmoney.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { TransferhistoryComponent } from './pages/transferhistory/transferhistory.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { ParentComponent } from './components/parent/parent.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PinsComponent } from './components/pins/pins.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddAccountComponent } from './pages/add-account/add-account.component';
import { ContactlistComponent } from './pages/list-contact/contactlist/contactlist.component';
import { AddcontactComponent } from './pages/list-contact/addcontact/addcontact.component';
import { EditcontactComponent } from './pages/list-contact/editcontact/editcontact.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { NodeAdminComponent } from './pages/node-admin/node-admin.component';
import { PinSetupDialogComponent } from './components/pin-setup-dialog/pin-setup-dialog.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AddNodeAdminComponent } from './pages/add-node-admin/add-node-admin.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { FaqComponent } from './pages/faq/faq.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { RegisterNodeComponent } from './pages/node-admin/register-node/register-node.component';
import { UpdateNodeComponent } from './pages/node-admin/update-node/update-node.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AboutComponent } from './pages/settings/about/about.component';
import { GeneralComponent } from './pages/settings/general/general.component';
import { NetworkComponent } from './pages/settings/network/network.component';
import { AddressComponent } from './components/address/address.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';
import { PinConfirmationComponent } from './components/pin-confirmation/pin-confirmation.component';
import { ClaimNodeComponent } from './pages/node-admin/claim-node/claim-node.component';
import { RemoveNodeComponent } from './pages/node-admin/remove-node/remove-node.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

export function getLanguage(languageServ: LanguageService) {
  return languageServ.selected;
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SendmoneyComponent,
    NavbarComponent,
    LoginComponent,
    TransferhistoryComponent,
    ReceiveComponent,
    ParentComponent,
    SignupComponent,
    SidebarComponent,
    PinsComponent,
    AddAccountComponent,
    ContactlistComponent,
    AddcontactComponent,
    EditcontactComponent,
    TransactionTableComponent,
    RestoreWalletComponent,
    NodeAdminComponent,
    PinSetupDialogComponent,
    ContactUsComponent,
    AddNodeAdminComponent,
    ConfirmPassphraseComponent,
    FaqComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    RegisterNodeComponent,
    UpdateNodeComponent,
    SettingsComponent,
    AboutComponent,
    GeneralComponent,
    NetworkComponent,
    AddressComponent,
    DateAgoPipe,
    TransactionDetailComponent,
    PinConfirmationComponent,
    ClaimNodeComponent,
    RemoveNodeComponent,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

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
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [LanguageService],
      useFactory: getLanguage,
    },
    { provide: 'global', useFactory: () => window },
    { provide: 'nacl.sign', useFactory: () => naclSign },
  ],
  entryComponents: [
    AddAccountComponent,
    AddcontactComponent,
    EditcontactComponent,
    PinSetupDialogComponent,
    AddNodeAdminComponent,
    SendmoneyComponent,
    TransactionDetailComponent,
    PinConfirmationComponent,
    ClaimNodeComponent,
    ReceiveComponent,
    RegisterNodeComponent,
    UpdateNodeComponent,
  ],
})
export class AppModule {}
// platformBrowserDynamic().bootstrapModule(AppModule);
