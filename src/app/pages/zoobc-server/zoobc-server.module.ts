import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ZoobcServerComponent } from './zoobc-server.component'
import { ZoobcServerExtensionComponent } from './zoobc-server-extension/zoobc-server-extension.component'
import { NotificationComponent } from './zoobc-server-extension/notification/notification.component'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from 'src/app/services/language.service';
import { BackupAddressComponent } from './zoobc-server-extension/backup-address/backup-address.component';
import {MatFormFieldModule} from '@angular/material/form-field';

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
  { path: '', component: ZoobcServerComponent },
  { path: 'zoobc-server-extension', component: ZoobcServerExtensionComponent },
  { path: 'zoobc-server-extension/notification', component: NotificationComponent },
  { path: 'zoobc-server-extension/backup-address', component: BackupAddressComponent }
];

@NgModule({
  declarations: [ZoobcServerComponent, ZoobcServerExtensionComponent, NotificationComponent, BackupAddressComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
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
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  entryComponents: [],
  exports: [FormsModule, ReactiveFormsModule],
})
export class ZoobcServerModule { }
