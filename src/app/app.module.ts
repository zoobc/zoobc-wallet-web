import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SendmoneyComponent } from "./pages/sendmoney/sendmoney.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SendmessageComponent } from "./pages/sendmessage/sendmessage.component";
import { LoginComponent } from "./pages/login/login.component";
import { TransferhistoryComponent } from "./pages/transferhistory/transferhistory.component";
import { MessagehistoryComponent } from "./pages/messagehistory/messagehistory.component";
import { ReceiveComponent } from "./pages/receive/receive.component";
import { ParentComponent } from "./components/parent/parent.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NgxQRCodeModule } from "ngx-qrcode2";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SendmoneyComponent,
    NavbarComponent,
    SendmessageComponent,
    LoginComponent,
    TransferhistoryComponent,
    ReceiveComponent,
    MessagehistoryComponent,
    ParentComponent,
    SignupComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    NgxQRCodeModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
