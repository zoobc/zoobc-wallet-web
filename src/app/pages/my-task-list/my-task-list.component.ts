import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import zoobc, { EscrowListParams } from 'zoobc-sdk';
import { AuthService } from 'src/app/services/auth.service';
import { GetEscrowTransactionsResponse } from 'zoobc-sdk/grpc/model/escrow_pb';
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
  totalTx: number = 0;
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
    const params: EscrowListParams = {
      approverAddress: this.account.address,
      statusList: [0],
      pagination: {
        orderBy: 0,
      },
    };
    const txs = await zoobc.Escrows.getList(params)
      .then((res: GetEscrowTransactionsResponse.AsObject) => {
        this.escrowTransactions = res.escrowsList.filter(tx => {
          if (tx.latest == true) return tx;
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
        console.log(err);
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
}
