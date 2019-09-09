import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SendmoneyComponent } from './pages/sendmoney/sendmoney.component';
import { SendmessageComponent } from './pages/sendmessage/sendmessage.component';
import { LoginComponent } from './pages/login/login.component';
import { TransferhistoryComponent } from './pages/transferhistory/transferhistory.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ParentComponent } from '../app/components/parent/parent.component';

import { AppService } from './app.service';
import { ContactlistComponent } from './pages/list-contact/contactlist/contactlist.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { NodeAdminComponent } from './pages/node-admin/node-admin.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ConfirmPassphraseComponent } from './pages/confirm-passphrase/confirm-passphrase.component';
import { FaqComponent } from './faq/faq.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { RegisterNodeComponent } from './pages/node-admin/register-node/register-node.component';
import { UpdateNodeComponent } from './pages/node-admin/update-node/update-node.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { GeneralComponent } from './pages/settings/general/general.component';
import { NetworkComponent } from './pages/settings/network/network.component';
import { AboutComponent } from './pages/settings/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: ParentComponent,
    canActivate: [AppService],
    children: [
      { path: 'sendmessage', component: SendmessageComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transferhistory', component: TransferhistoryComponent },
      { path: 'nodeadmin', component: NodeAdminComponent },
      { path: 'nodeadmin/register', component: RegisterNodeComponent },
      { path: 'nodeadmin/updatenode', component: UpdateNodeComponent },
      { path: 'receive', component: ReceiveComponent },
      { path: 'sendmoney', component: SendmoneyComponent },
      { path: 'contact-list', component: ContactlistComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', component: GeneralComponent },
          { path: 'general', component: GeneralComponent },
          { path: 'network', component: NetworkComponent },
          { path: 'about', component: AboutComponent },
        ],
      },
      { path: 'request/:recipient/:amount', component: SendmoneyComponent },
    ],
  },
  {
    path: '',
    component: ParentComponent,
    children: [
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'restore', component: RestoreWalletComponent },
      { path: 'confirm-passphrase', component: ConfirmPassphraseComponent },
      { path: 'feedback', component: ContactUsComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'terms-of-use', component: TermsOfUseComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
