import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import * as $ from "jquery";

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
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { NgxPaginationModule } from "ngx-pagination";
import { PinsComponent } from "./components/pins/pins.component";
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

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
    SidebarComponent,
    PinsComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    NgxQRCodeModule,
    HttpClientModule,
    NgxPaginationModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
