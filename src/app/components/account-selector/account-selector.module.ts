import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSelectorComponent } from './account-selector.component';
import { AddressModule } from '../address/address.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { MatCardModule, MatButtonModule } from '@angular/material';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

@NgModule({
  declarations: [AccountSelectorComponent],
  imports: [
    CommonModule,
    AddressModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DateAgoModule,
    MatCardModule,
    MatButtonModule,
  ],
  exports: [AccountSelectorComponent],
})
export class AccountSelectorModule {}
