import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../account-selector/account-selector.module';
import { HttpClient } from '@angular/common/http';
import { AddressModule } from '../address/address.module';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { MatTooltipModule, MatCardModule } from '@angular/material';
import { ApprovalEscrowComponent } from './approval-escrow/approval-escrow.component';

@NgModule({
  declarations: [TransactionListComponent, ApprovalEscrowComponent],
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
  ],
  exports: [TransactionListComponent],
})
export class TransactionListModule {}
