import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SendmoneyComponent } from './pages/sendmoney/sendmoney.component';
import { SendmessageComponent } from './pages/sendmessage/sendmessage.component';
import { LoginComponent } from './pages/login/login.component';
import { TransferhistoryComponent } from './pages/transferhistory/transferhistory.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { AddNewAccountComponent } from './pages/add-new-account/add-new-account.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ParentComponent } from '../app/components/parent/parent.component';

import { AppService } from './app.service';
import { ContactlistComponent } from './pages/list-contact/contactlist/contactlist.component';
import { AddcontactComponent } from './pages/list-contact/addcontact/addcontact.component';
import { EditcontactComponent } from './pages/list-contact/editcontact/editcontact.component';

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
      { path: 'receive', component: ReceiveComponent },
      { path: 'sendmoney', component: SendmoneyComponent },
      { path: 'add-account', component: AddNewAccountComponent },
      { path: 'contact-list', component: ContactlistComponent },
      { path: 'addContact', component: AddcontactComponent },
      { path: 'editContact/:address', component: EditcontactComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
