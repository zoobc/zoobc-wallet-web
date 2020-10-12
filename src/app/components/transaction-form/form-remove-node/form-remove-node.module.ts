import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRemoveNodeComponent } from './form-remove-node.component';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [FormRemoveNodeComponent],
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
  exports: [FormRemoveNodeComponent],
})
export class FormRemoveNodeModule {}
