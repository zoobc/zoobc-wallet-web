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
import { ContactService } from 'src/app/services/contact.service';
import { OrderBy } from 'zoobc-sdk/grpc/model/pagination_pb';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyTaskComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() isError: boolean = false;
  @Input() withDetail: boolean = false;

  escrowTransactions;
  account;
  timeout;
  blockHeight: number;
  page: number = 1;
  perPage: number = 10;
  total: number = 0;
  finished: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authServ: AuthService,
    private contactServ: ContactService
  ) {}
  async ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    this.getEscrowTx(true);
    this.getBlockHeight();
  }

  getEscrowTx(reload: boolean = false) {
    if (!this.isLoading) {
      this.isLoading = true;
      const perPage = Math.ceil(window.outerHeight / 72);

      const params: EscrowListParams = {
        approverAddress: this.account.address,
        statusList: [0],
        pagination: {
          page: this.page,
          limit: perPage,
          orderBy: OrderBy.DESC,
          orderField: 'block_height',
        },
      };
      zoobc.Escrows.getList(params)
        .then((res: GetEscrowTransactionsResponse.AsObject) => {
          this.total = parseInt(res.total);
          let txFilter = res.escrowsList.filter(tx => {
            if (tx.latest == true) return tx;
          });
          let txMap = txFilter.map(tx => {
            const alias = this.contactServ.get(tx.recipientaddress).alias || '';
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
          if (reload) {
            this.escrowTransactions = txMap;
          } else {
            this.escrowTransactions = this.escrowTransactions.concat(txMap);
          }
        })
        .catch(err => {
          this.isError = true;
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    }
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

  onScroll() {
    if (
      this.escrowTransactions &&
      this.escrowTransactions.length < this.total
    ) {
      this.page++;
      this.getEscrowTx();
    } else this.finished = true;
  }
}
