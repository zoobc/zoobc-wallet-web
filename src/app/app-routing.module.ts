import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SendmoneyComponent } from './sendmoney/sendmoney.component';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { LoginComponent } from './login/login.component';
import { TransferhistoryComponent } from './transferhistory/transferhistory.component';


const routes: Routes = [
  {path: 'sendmoney', component: SendmoneyComponent},
  {path: 'sendmessage', component: SendmessageComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'transferhistory', component: TransferhistoryComponent},
  {path: 'sendmoney', component: SendmoneyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
