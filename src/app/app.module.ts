import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPopperModule } from 'ngx-popper';
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
import { AddAccountComponent } from './pages/account/add-account/add-account.component';
import { ContactlistComponent } from './pages/list-contact/contactlist/contactlist.component';
import { AddcontactComponent } from './pages/list-contact/addcontact/addcontact.component';
import { EditcontactComponent } from './pages/list-contact/editcontact/editcontact.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { PinSetupDialogComponent } from './components/pin-setup-dialog/pin-setup-dialog.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';
import { PinConfirmationComponent } from './components/pin-confirmation/pin-confirmation.component';
import { RevealPassphraseComponent } from './components/reveal-passphrase/reveal-passphrase.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';
import { AddressModule } from './components/address/address.module';
import { DateAgoModule } from './pipes/date-ago.module';
import { MyTaskComponent } from './pages/my-task/my-task.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AccountSelectorModule } from './components/account-selector/account-selector.module';
import { AddNodeAdminComponent } from './pages/node-admin/add-node-admin/add-node-admin.component';
import { EscrowTransactionModule } from './components/escrow-transaction/escrow-transaction.module';
import { MultisigTransactionModule } from './components/multisig-transaction/multisig-transaction.module';
import { FeeSelectorModule } from './components/fee-selector/fee-selector.module';
import { InputAddressModule } from './components/input-address/input-address.module';
import { InputAmountModule } from './components/input-amount/input-amount.module';
import { ConfirmSendComponent } from './pages/sendmoney/confirm-send/confirm-send.component';
import { AccountComponent } from './pages/account/account.component';
import { MultisigInfoComponent } from './pages/account/multisig-info/multisig-info.component';
import { AccountDatasetComponent } from './pages/account-dataset/account-dataset.component';
import { SetupDatasetComponent } from './pages/account-dataset/setup-dataset/setup-dataset.component';
import { ApprovalEscrowHistoryComponent } from './pages/my-task/approval-escrow-history/approval-escrow-history.component';
import { MultisigApprovalHistoryComponent } from './pages/my-task/multisig-approval-history/multisig-approval-history.component';
import { RewardTableModule } from './components/reward-table/reward-table.module';
import { NodeRewardListComponent } from './components/node-reward-list/node-reward-list.component';
import { FormRegisterNodeModule } from './components/transaction-form/form-register-node/form-register-node.module';
import { TransactionListModule } from './components/transaction-list/transaction-list.module';

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
    PinSetupDialogComponent,
    ContactUsComponent,
    ConfirmPassphraseComponent,
    TransactionDetailComponent,
    PinConfirmationComponent,
    RevealPassphraseComponent,
    EditAccountComponent,
    AddNodeAdminComponent,
    MyTaskComponent,
    ConfirmSendComponent,
    AccountComponent,
    MultisigInfoComponent,
    AccountDatasetComponent,
    SetupDatasetComponent,
    ApprovalEscrowHistoryComponent,
    MultisigApprovalHistoryComponent,
    NodeRewardListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxQRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPopperModule.forRoot({ trigger: 'hover', placement: 'bottom', applyClass: 'pooper-style' }),
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
    TransactionListModule,

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
    EscrowTransactionModule,
    MultisigTransactionModule,
    FeeSelectorModule,
    InputAddressModule,
    InputAmountModule,
    MatStepperModule,
    RewardTableModule,
    FormRegisterNodeModule,
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
    AddcontactComponent,
    EditcontactComponent,
    PinSetupDialogComponent,
    SendmoneyComponent,
    TransactionDetailComponent,
    PinConfirmationComponent,
    ReceiveComponent,
    RevealPassphraseComponent,
    EditAccountComponent,
    AddNodeAdminComponent,
    ConfirmSendComponent,
    MultisigInfoComponent,
    AccountDatasetComponent,
    SetupDatasetComponent,
    NodeRewardListComponent,
  ],
})
export class AppModule {}
// platformBrowserDynamic().bootstrapModule(AppModule);
