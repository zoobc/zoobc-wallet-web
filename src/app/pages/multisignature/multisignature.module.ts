// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultisignatureComponent } from './multisignature.component';
import { AddMultisigInfoComponent } from './add-multisig-info/add-multisig-info.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { AddParticipantsComponent } from './add-participants/add-participants.component';
import { SendTransactionComponent } from './send-transaction/send-transaction.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  MatChipsModule,
  MatDividerModule,
  MatStepperModule,
  MatRadioModule,
  MatSelectModule,
  MatDialogModule,
  MatMenuModule,
} from '@angular/material';
import { DateAgoModule } from '../../pipes/date-ago.module';
import { AddressModule } from '../../components/address/address.module';
import { InputAddressModule } from '../../components/input-address/input-address.module';
import { AccountSelectorModule } from '../../components/account-selector/account-selector.module';
import { InputAmountModule } from '../../components/input-amount/input-amount.module';
import { FormSendMoneyModule } from '../../components/transaction-form/form-send-money/form-send-money.module';
import { FormSetupAccountDatasetModule } from 'src/app/components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.module';
import { FormEscrowModule } from 'src/app/components/transaction-form/form-escrow/form-escrow.module';
import { OffchainSignComponent } from './offchain-sign/offchain-sign.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { FormEscrowApprovalModule } from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.module';
import { FormRemoveAccountDatasetModule } from 'src/app/components/transaction-form/form-remove-account-dataset/form-remove-account-dataset.module';
import { CreateMultisigComponent } from './create-multisig/create-multisig.component';
import { FormFeeModule } from 'src/app/components/transaction-form/form-fee/form-fee.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
const routes: Routes = [
  { path: '', component: MultisignatureComponent },
  { path: 'sign/:txHash/:address/:signature', component: MultisignatureComponent },
  {
    path: 'create',
    component: CreateMultisigComponent,
    children: [
      { path: 'add-multisig-info', component: AddMultisigInfoComponent },
      { path: 'create-transaction', component: CreateTransactionComponent },
      { path: 'add-signatures', component: AddParticipantsComponent },
      { path: 'send-transaction', component: SendTransactionComponent },
    ],
  },
];

@NgModule({
  declarations: [
    MultisignatureComponent,
    AddMultisigInfoComponent,
    CreateTransactionComponent,
    AddParticipantsComponent,
    SendTransactionComponent,
    OffchainSignComponent,
    CreateMultisigComponent,
  ],
  imports: [
    AddressModule,
    CommonModule,
    DateAgoModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    AccountSelectorModule,
    InputAddressModule,
    InputAmountModule,
    NgxQRCodeModule,
    FormSendMoneyModule,
    FormEscrowModule,
    FormSetupAccountDatasetModule,
    FormRemoveAccountDatasetModule,
    FormEscrowApprovalModule,
    FormFeeModule,
  ],
  exports: [OffchainSignComponent],
  entryComponents: [OffchainSignComponent],
})
export class MultisignatureModule {}
