import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeSelectorComponent } from './fee-selector.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAgoModule } from 'src/app/pipes/date-ago.module';
import { HttpClient } from '@angular/common/http';
import {
  MatCardModule,
  MatCheckboxModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
} from '@angular/material';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

@NgModule({
  declarations: [FeeSelectorComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DateAgoModule,

    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [FeeSelectorComponent],
})
export class FeeSelectorModule {}
