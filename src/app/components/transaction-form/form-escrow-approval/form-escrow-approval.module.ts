import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEscrowApprovalComponent } from './form-escrow-approval.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatInputModule, MatCheckboxModule } from '@angular/material';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [FormEscrowApprovalComponent],
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
    MatCheckboxModule,
    InputAmountModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [FormEscrowApprovalComponent],
})
export class FormEscrowApprovalModule {}
