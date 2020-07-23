import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSelectorComponent } from './account-selector.component';
import { AddressModule } from '../address/address.module';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [AccountSelectorComponent],
  imports: [CommonModule, AddressModule, DateAgoModule, MatCardModule, MatButtonModule],
  exports: [AccountSelectorComponent],
})
export class AccountSelectorModule {}
