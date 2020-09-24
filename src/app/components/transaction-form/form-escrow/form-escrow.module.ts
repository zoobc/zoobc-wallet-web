import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormEscrowComponent } from './form-escrow.component';
import { InputAddressComponent } from 'src/app/components/input-address/input-address.component';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { InputAddressModule } from '../../input-address/input-address.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
@NgModule({
  declarations: [FormEscrowComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    InputAmountModule,
    InputAddressModule,
  ],
  exports: [FormEscrowComponent],
})
export class FormEscrowModule {}
