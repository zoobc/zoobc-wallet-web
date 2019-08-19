import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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
  MatButtonToggleModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatStepperModule,
  MatTooltipModule,
} from '@angular/material';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NetworkComponent } from './network/network.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { SettingsComponent } from './settings.component';
import { AboutComponent } from './about/about.component';
import { GeneralComponent } from './general/general.component';

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
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'general', component: GeneralComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

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
    MatButtonToggleModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatStepperModule,
    MatTooltipModule,
  ],
  declarations: [
    SettingsComponent,
    AboutComponent,
    GeneralComponent,
    NetworkComponent,
  ],
  exports: [FormsModule, ReactiveFormsModule],
  entryComponents: [],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [LanguageService],
      useFactory: getLanguage,
    },
  ],
})
export class SettingsModule {}
