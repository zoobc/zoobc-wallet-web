import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscrowTransactionComponent } from './escrow-transaction.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { HttpClient } from '@angular/common/http';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { AddressModule } from '../address/address.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

@NgModule({
  declarations: [EscrowTransactionComponent],
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
    MatCardModule,
    MatButtonModule,
    AddressModule,
  ],
  exports: [EscrowTransactionComponent],
})
export class EscrowTransactionModule {}
