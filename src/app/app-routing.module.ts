import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ParentComponent } from '../app/components/parent/parent.component';

import { AppService } from './app.service';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { AccountComponent } from './pages/account/account.component';
import { SeatsComponent } from './pages/seats/seats.component';
import { GenesisComponent } from './pages/genesis/genesis.component';
import { InfoComponent } from './pages/info/info.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: ParentComponent,
    canActivate: [AppService],
    children: [
      { path: 'dashboard', component: SeatsComponent },
      { path: 'accounts', component: AccountComponent },
      { path: 'info', component: InfoComponent },
      { path: 'accounts/:accountBase64', component: AccountComponent },
      {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingsModule',
      },
    ],
  },
  {
    path: '',
    component: ParentComponent,
    children: [
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'open-wallet', component: RestoreWalletComponent },
      { path: 'confirm-passphrase', component: ConfirmPassphraseComponent },
      { path: 'info', loadChildren: './pages/info/info.module#InfoModule' },
      { path: 'genesis', component: GenesisComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
