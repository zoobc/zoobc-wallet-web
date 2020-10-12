import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormClaimNodeComponent } from './form-claim-node.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
@NgModule({
  declarations: [FormClaimNodeComponent],
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
    InputAmountModule,
  ],
  exports: [FormClaimNodeComponent],
})
export class FormClaimNodeModule {}
