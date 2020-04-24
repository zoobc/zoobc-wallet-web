import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultisigTransactionComponent } from './multisig-transaction.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { HttpClient } from '@angular/common/http';
import { MatCardModule, MatButtonModule, MatDividerModule } from '@angular/material';
import { AddressModule } from '../address/address.module';
import { SendTransactionComponent } from './send-transaction/send-transaction.component';
import { AccountSelectorModule } from '../account-selector/account-selector.module';
import { FeeSelectorModule } from '../fee-selector/fee-selector.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [MultisigTransactionComponent, SendTransactionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DateAgoModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    AddressModule,
    AccountSelectorModule,
    FeeSelectorModule,
  ],
  exports: [MultisigTransactionComponent],
})
export class MultisigTransactionModule {}
