import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormSendMoneyComponent } from './form-send-money.component';
import { AccountSelectorModule } from 'src/app/components/account-selector/account-selector.module';
import { InputAddressModule } from 'src/app/components/input-address/input-address.module';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { AddressModule } from 'src/app/components/address/address.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
@NgModule({
  declarations: [FormSendMoneyComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    AccountSelectorModule,
    InputAddressModule,
    InputAmountModule,
    AddressModule,
  ],
  exports: [FormSendMoneyComponent],
})
export class FormSendMoneyModule {}
