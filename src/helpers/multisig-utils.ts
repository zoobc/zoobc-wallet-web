// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

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

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import {
  createEscrowApprovalBytes,
  createEscrowApprovalForm,
  escrowApprovalMap,
} from 'src/app/components/transaction-form/form-escrow-approval/form-escrow-approval.component';
import {
  createRemoveDatasetForm,
  createRemoveSetupDatasetBytes,
  removeDatasetMap,
} from 'src/app/components/transaction-form/form-remove-account-dataset/form-remove-account-dataset.component';
import {
  createSendMoneyBytes,
  createSendMoneyForm,
  sendMoneyMap,
} from 'src/app/components/transaction-form/form-send-money/form-send-money.component';
import {
  createSetupDatasetBytes,
  createSetupDatasetForm,
  setupDatasetMap,
} from 'src/app/components/transaction-form/form-setup-account-dataset/form-setup-account-dataset.component';
import { TransactionType } from 'zbc-sdk';

// =========================== END INPUT MAP ======================= //

export function createInnerTxForm(txType: number) {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyForm();
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetForm();
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveDatasetForm();
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalForm();
  }
}

export function createInnerTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyBytes(form);
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetBytes(form);
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveSetupDatasetBytes(form);
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalBytes(form);
  }
}

export function getInputMap(txType: number): Object {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyMap;
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return setupDatasetMap;
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return removeDatasetMap;
    case TransactionType.APPROVALESCROWTRANSACTION:
      return escrowApprovalMap;
  }
}

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'transfer zoobc';
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return 'setup account dataset';
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return 'remove setup account dataset';
    case TransactionType.APPROVALESCROWTRANSACTION:
      return 'escrow approval';
  }
}
