import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRegisterNodeComponent } from './form-register-node.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}
@NgModule({
  declarations: [FormRegisterNodeComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
    FormsModule,
    InputAmountModule,
    MatInputModule,
  ],
  exports: [FormRegisterNodeComponent],
})
export class FormRegisterNodeModule {}
