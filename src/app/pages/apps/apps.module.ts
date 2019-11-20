import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatRadioModule,
  MatDialogModule,
  MatExpansionModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatTableModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatChipsModule,
  MatDividerModule,
  MatAutocompleteModule,
} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { AppsComponent } from './apps.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from 'src/app/services/language.service';
import { SellZbcComponent } from './sell-zbc/sell-zbc.component';
import { AddressModule } from 'src/app/components/address/address.module';
import { AccountSelectorModule } from 'src/app/components/account-selector/account-selector.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

export function getLanguage(languageServ: LanguageService) {
  return languageServ.selected;
}

const routes: Routes = [
  { path: '', component: AppsComponent },
  { path: 'sell-zbc', component: SellZbcComponent },
];

@NgModule({
  declarations: [AppsComponent, SellZbcComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    AddressModule,
    AccountSelectorModule,

    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatAutocompleteModule,
  ],
  entryComponents: [],
  exports: [FormsModule, ReactiveFormsModule],
})
export class AppsModule {}
