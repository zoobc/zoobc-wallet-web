import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../account-selector/account-selector.module';
import { HttpClient } from '@angular/common/http';
import { AddressModule } from '../address/address.module';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { MatTooltipModule, MatCardModule, MatButtonModule } from '@angular/material';
import { SendMoneyComponent } from './send-money/send-money.component';

@NgModule({
  declarations: [TransactionListComponent, SendMoneyComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AddressModule,
    DateAgoModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
  ],
  exports: [TransactionListComponent],
})
export class TransactionListModule {}