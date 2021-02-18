// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https://github.com/zoobc/zoobc-wallet-web>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

//     2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
// contact us at roberto.capodieci[at]blockchainzoo.com
// and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { NgModule } from '@angular/core';
import { NodeAdminComponent } from './node-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AddressModule } from 'src/app/components/address/address.module';
import { InputAmountModule } from 'src/app/components/input-amount/input-amount.module';
import { RewardTableModule } from 'src/app/components/reward-table/reward-table.module';
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
  MatAutocompleteModule,
} from '@angular/material';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UpdateNodeComponent } from './update-node/update-node.component';
import { RegisterNodeComponent } from './register-node/register-node.component';
import { ClaimNodeComponent } from './claim-node/claim-node.component';
import { RemoveNodeComponent } from './remove-node/remove-node.component';
import { DemoNodeAdminComponent } from './demo-node-admin/demo-node-admin.component';
import { FormRemoveNodeModule } from 'src/app/components/transaction-form/form-remove-node/form-remove-node.module';
import { FormRegisterNodeModule } from 'src/app/components/transaction-form/form-register-node/form-register-node.module';

import { FormUpdateNodeModule } from 'src/app/components/transaction-form/form-update-node/form-update-node.module';
import { FormClaimNodeModule } from 'src/app/components/transaction-form/form-claim-node/form-claim-node.module';
import { FormFeeModule } from 'src/app/components/transaction-form/form-fee/form-fee.module';
import { FormMessageModule } from 'src/app/components/transaction-form/form-message/form-message.module';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/languages/locales/', '.json');
}

const routes: Routes = [
  { path: '', component: NodeAdminComponent },
  { path: 'demo', component: DemoNodeAdminComponent },
];

@NgModule({
  declarations: [
    NodeAdminComponent,
    RegisterNodeComponent,
    UpdateNodeComponent,
    ClaimNodeComponent,
    DemoNodeAdminComponent,
    RemoveNodeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AddressModule,
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
    MatAutocompleteModule,
    InputAmountModule,
    RewardTableModule,
    FormRemoveNodeModule,
    FormRegisterNodeModule,
    FormUpdateNodeModule,
    FormClaimNodeModule,
    FormFeeModule,
    FormMessageModule,
  ],
  entryComponents: [RegisterNodeComponent, UpdateNodeComponent, ClaimNodeComponent, RemoveNodeComponent],
})
export class NodeAdminModule {}
