import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAddressComponent } from './input-address.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [InputAddressComponent],
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
    MatAutocompleteModule,
  ],
  exports: [InputAddressComponent],
})
export class InputAddressModule {}
