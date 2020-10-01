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
} from '@angular/material';
import { DateAgoModule } from '../../pipes/date-ago.module';
import { AddressModule } from '../../components/address/address.module';
import { InputAddressModule } from '../../components/input-address/input-address.module';
import { AccountSelectorModule } from '../../components/account-selector/account-selector.module';
import { InputAmountModule } from '../../components/input-amount/input-amount.module';
import { FormSendMoneyModule } from '../../components/transaction-form/form-send-money/form-send-money.module';
import { FormSetupAccountDatasetModule } from 'src/app/components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
const routes: Routes = [
  { path: '', component: MultisignatureComponent },
  { path: 'add-multisig-info', component: AddMultisigInfoComponent },
  { path: 'create-transaction', component: CreateTransactionComponent },
  { path: 'add-signatures', component: AddParticipantsComponent },
  { path: 'send-transaction', component: SendTransactionComponent },
];

@NgModule({
  declarations: [
    MultisignatureComponent,
    AddMultisigInfoComponent,
    CreateTransactionComponent,
    AddParticipantsComponent,
    SendTransactionComponent,
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
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    AccountSelectorModule,
    InputAddressModule,
    InputAmountModule,
    FormSendMoneyModule,
    FormSetupAccountDatasetModule,
  ],
})
export class MultisignatureModule {}
