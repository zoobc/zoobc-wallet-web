import { NgModule } from '@angular/core';
import { NodeAdminComponent } from './node-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AddressModule } from 'src/app/components/address/address.module';
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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UpdateNodeComponent } from './update-node/update-node.component';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import { DemoNodeAdminComponent } from './demo-node-admin/demo-node-admin.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/languages/locales/',
    '.json'
  );
}

const routes: Routes = [
  { path: '', component: NodeAdminComponent },
  { path: 'demo', component: DemoNodeAdminComponent },
];

@NgModule({
  declarations: [
    NodeAdminComponent,
    RegisterNodeComponent,
    UpdateNodeComponent,
    ClaimNodeComponent,
    DemoNodeAdminComponent,
    RemoveNodeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AddressModule,
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
  entryComponents: [
    RegisterNodeComponent,
    UpdateNodeComponent,
    ClaimNodeComponent,
    RemoveNodeComponent,
  ],
})
export class NodeAdminModule {}
