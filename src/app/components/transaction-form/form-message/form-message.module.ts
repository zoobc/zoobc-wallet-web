import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormMessageComponent } from './form-message.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [FormMessageComponent],
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
  ],
  exports: [FormMessageComponent],
})
export class FormMessageModule {}
