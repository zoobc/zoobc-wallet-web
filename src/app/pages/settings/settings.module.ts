import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatChipsModule,
  MatDividerModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { AboutComponent } from './about/about.component';
import { NetworkComponent } from './network/network.component';
import { GeneralComponent } from './general/general.component';
import { NetworkModule } from 'src/app/components/network/network.module';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', component: GeneralComponent },
      { path: 'general', component: GeneralComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
];

@NgModule({
  declarations: [SettingsComponent, AboutComponent, GeneralComponent, NetworkComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NetworkModule,
    RouterModule.forChild(routes),
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
  ],
})
export class SettingsModule {}
