import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SendmoneyComponent } from "./pages/sendmoney/sendmoney.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SendmessageComponent } from "./pages/sendmessage/sendmessage.component";
import { LoginComponent } from "./pages/login/login.component";
import { TransferhistoryComponent } from "./pages/transferhistory/transferhistory.component";
import { MessagehistoryComponent } from "./pages/messagehistory/messagehistory.component";
import { ParentComponent } from "./components/parent/parent.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

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
    SidebarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
