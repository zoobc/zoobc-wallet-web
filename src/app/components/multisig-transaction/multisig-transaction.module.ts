import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultisigTransactionComponent } from './multisig-transaction.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { HttpClient } from '@angular/common/http';
import { MatCardModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { AddressModule } from '../address/address.module';
import { FeeSelectorModule } from 'src/app/components/fee-selector/fee-selector.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [MultisigTransactionComponent],
  imports: [
    CommonModule,
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
    AddressModule,
    FeeSelectorModule,
    MatCheckboxModule,
  ],
  exports: [MultisigTransactionComponent],
})
export class MultisigTransactionModule {}