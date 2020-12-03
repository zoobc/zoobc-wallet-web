import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SendmoneyComponent } from './pages/sendmoney/sendmoney.component';
import { LoginComponent } from './pages/login/login.component';
import { TransferhistoryComponent } from './pages/transferhistory/transferhistory.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ParentComponent } from '../app/components/parent/parent.component';

import { AppService } from './app.service';
import { ContactlistComponent } from './pages/list-contact/contactlist/contactlist.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { MyTaskComponent } from './pages/my-task/my-task.component';
import { AccountComponent } from './pages/account/account.component';
import { MultisigApprovalHistoryComponent } from './pages/my-task/multisig-approval-history/multisig-approval-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: ParentComponent,
    canActivate: [AppService],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transferhistory', component: TransferhistoryComponent },
      { path: 'sendmoney', component: SendmoneyComponent },
      { path: 'request/:recipient', component: SendmoneyComponent },
      { path: 'request/:recipient/:amount', component: SendmoneyComponent },
      { path: 'contact-list', component: ContactlistComponent },
      { path: 'my-tasks', component: MyTaskComponent },
      { path: 'accounts', component: AccountComponent },
      {
        path: 'multisignature',
        loadChildren: './pages/multisignature/multisignature.module#MultisignatureModule',
      },
      { path: 'multisig-approval-history', component: MultisigApprovalHistoryComponent },
      {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingsModule',
      },
      {
        path: 'nodeadmin',
        loadChildren: './pages/node-admin/node-admin.module#NodeAdminModule',
      },
      { path: 'apps', loadChildren: './pages/apps/apps.module#AppsModule' },
      { path: 'zoobc-server', loadChildren: './pages/zoobc-server/zoobc-server.module#ZoobcServerModule'}
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
      { path: 'feedback', component: ContactUsComponent },
      { path: 'info', loadChildren: './pages/info/info.module#InfoModule' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
