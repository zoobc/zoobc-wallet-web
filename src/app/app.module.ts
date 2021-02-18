// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { PinSetupDialogComponent } from './components/pin-setup-dialog/pin-setup-dialog.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { PinConfirmationComponent } from './components/pin-confirmation/pin-confirmation.component';
import { RevealPassphraseComponent } from './components/reveal-passphrase/reveal-passphrase.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';
import { AddressModule } from './components/address/address.module';
import { DateAgoModule } from './pipes/date-ago.module';
import { MyTaskComponent } from './pages/my-task/my-task.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AccountSelectorModule } from './components/account-selector/account-selector.module';
import { AddNodeAdminComponent } from './pages/node-admin/add-node-admin/add-node-admin.component';
import { EscrowTransactionModule } from './pages/my-task/escrow-transaction/escrow-transaction.module';
import { MultisigTransactionModule } from './pages/my-task/multisig-transaction/multisig-transaction.module';
import { FeeSelectorModule } from './components/fee-selector/fee-selector.module';
import { InputAddressModule } from './components/input-address/input-address.module';
import { InputAmountModule } from './components/input-amount/input-amount.module';
import { ConfirmSendComponent } from './pages/sendmoney/confirm-send/confirm-send.component';
import { AccountComponent } from './pages/account/account.component';
import { MultisigInfoComponent } from './pages/account/multisig-info/multisig-info.component';
import { AccountDatasetComponent } from './pages/account-dataset/account-dataset.component';
import { SetupDatasetComponent } from './pages/account-dataset/setup-dataset/setup-dataset.component';
import { RewardTableModule } from './components/reward-table/reward-table.module';
import { NodeRewardListComponent } from './components/node-reward-list/node-reward-list.component';
import { FormRegisterNodeModule } from './components/transaction-form/form-register-node/form-register-node.module';
import { FormEscrowModule } from './components/transaction-form/form-escrow/form-escrow.module';
import { FormSendMoneyModule } from './components/transaction-form/form-send-money/form-send-money.module';
import { TransactionListModule } from './components/transaction-list/transaction-list.module';
import { FormEscrowApprovalModule } from './components/transaction-form/form-escrow-approval/form-escrow-approval.module';
import { FormClaimNodeModule } from './components/transaction-form/form-claim-node/form-claim-node.module';
import { FormRemoveAccountDatasetModule } from './components/transaction-form/form-remove-account-dataset/form-remove-account-dataset.module';
import { FormRemoveNodeModule } from './components/transaction-form/form-remove-node/form-remove-node.module';
import { FormSetupAccountDatasetModule } from './components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.module';
import { PrivateKeyComponent } from './pages/login/private-key/private-key.component';
import { AddressComponent } from './pages/login/address/address.component';
import { EscrowDetailComponent } from './pages/my-task/escrow-detail/escrow-detail.component';
import { MultisigDetailComponent } from './pages/my-task/multisig-detail/multisig-detail.component';
import { FormFeeModule } from './components/transaction-form/form-fee/form-fee.module';
import { FormMessageModule } from './components/transaction-form/form-message/form-message.module';

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
    RestoreWalletComponent,
    PinSetupDialogComponent,
    ContactUsComponent,
    ConfirmPassphraseComponent,
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
    NodeRewardListComponent,
    PrivateKeyComponent,
    AddressComponent,
    EscrowDetailComponent,
    MultisigDetailComponent,
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
    FormRemoveNodeModule,
    FormRegisterNodeModule,
    FormSendMoneyModule,
    FormEscrowModule,
    FormEscrowApprovalModule,
    FormClaimNodeModule,
    FormRemoveAccountDatasetModule,
    FormSetupAccountDatasetModule,
    FormFeeModule,
    FormMessageModule,
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
    PrivateKeyComponent,
    AddressComponent,
  ],
})
export class AppModule {}
// platformBrowserDynamic().bootstrapModule(AppModule);
