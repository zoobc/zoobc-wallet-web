import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import zoobc from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { GetEscrowTransactionsResponse } from 'zoobc-sdk/grpc/model/escrow_pb';
import { MatTabChangeEvent } from '@angular/material';
import { EscrowTableComponent } from 'src/app/components/escrow-table/escrow-table.component';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-my-task-list',
  templateUrl: './my-task-list.component.html',
  styleUrls: ['./my-task-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyTaskListComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;
  @ViewChild(EscrowTableComponent) private escrowTx: EscrowTableComponent;

  escrowTransactions;
  account;
  timeout;
  blockHeight: number;

  constructor(
    public dialog: MatDialog,
    private authServ: AuthService,
    private contactServ: ContactService
  ) {}
  async ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.getEscrowTx();
    this.getBlockHeight();
  }
  async getEscrowTx() {
    this.isLoading = true;

    const params = {
      approverAddress: this.account.address,
    };
    const txs = await zoobc.Escrows.getList(params)
      .then((res: GetEscrowTransactionsResponse.AsObject) => {
        this.escrowTransactions = res.escrowsList.filter(tx => {
          if (tx.status == 0 && tx.latest == true) return tx;
        });
        this.escrowTransactions = this.escrowTransactions.map(tx => {
          const alias =
            this.contactServ.getContact(tx.recipientaddress).alias || '';
          return {
            id: tx.id,
            alias: alias,
            senderaddress: tx.senderaddress,
            recipientaddress: tx.recipientaddress,
            approveraddress: tx.approveraddress,
            amount: tx.amount,
            commission: tx.commission,
            timeout: parseInt(tx.timeout),
            status: tx.status,
            blockheight: tx.blockheight,
            latest: tx.latest,
            instruction: tx.instruction,
          };
        });
      })
      .catch(err => {
        this.isError = true;
      })
      .finally(() => (this.isLoading = false));
  }

  getBlockHeight() {
    this.isLoading = true;
    zoobc.Account.getBalance(this.account.address)
      .then(res => {
        this.blockHeight = res.accountbalance.blockheight;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => (this.isLoading = false));
  }

  onTabChanged(event: MatTabChangeEvent) {
    // reset the escrow list & blockheight to undefined instead of making it null because it will not indicate that you don't have any data
    this.escrowTransactions = undefined;
    this.blockHeight = undefined;
    if (event.index == 0) {
      this.escrowTx.onRefresh();
      this.getBlockHeight();
    }
  }
}
