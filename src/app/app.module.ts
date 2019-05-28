import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SendmoneyComponent } from './sendmoney/sendmoney.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { LoginComponent } from './login/login.component';
import { TransferhistoryComponent } from './transferhistory/transferhistory.component';
import { MessagehistoryComponent } from './messagehistory/messagehistory.component';
import { ParentComponent } from './components/parent/parent.component';
import { SignupComponent } from './pages/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SendmoneyComponent,
    NavbarComponent,
    SendmessageComponent,
    LoginComponent,
    TransferhistoryComponent,
    MessagehistoryComponent,
    ParentComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
