import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFeeComponent } from './form-fee.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InputAmountModule } from '../../input-amount/input-amount.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [FormFeeComponent],
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
  ],
  exports: [FormFeeComponent],
})
export class FormFeeModule {}
