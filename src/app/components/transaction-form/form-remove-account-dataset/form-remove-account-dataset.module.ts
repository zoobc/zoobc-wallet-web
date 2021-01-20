import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRemoveAccountDatasetComponent } from './form-remove-account-dataset.component';
import { MatCheckboxModule, MatDividerModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { InputAddressModule } from '../../input-address/input-address.module';
import { InputAmountModule } from '../../input-amount/input-amount.module';
import { AccountSelectorModule } from '../../account-selector/account-selector.module';
import { AddressModule } from '../../address/address.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [FormRemoveAccountDatasetComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    InputAddressModule,
    InputAmountModule,
    MatCheckboxModule,
    AccountSelectorModule,
    AddressModule,
    MatDividerModule,
  ],
  exports: [FormRemoveAccountDatasetComponent],
})
export class FormRemoveAccountDatasetModule {}
