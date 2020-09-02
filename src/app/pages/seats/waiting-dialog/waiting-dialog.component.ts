import { Component, OnInit, Inject } from '@angular/core';
import { SeatService } from 'src/app/services/seat.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { saveAs } from 'file-saver';
const web3 = new Web3(new Web3.providers.WebsocketProvider(environment.infuraProvider));
const GibberishAES = require('../../../../helpers/gibberish-aes.js');

@Component({
  selector: 'app-waiting-dialog',
  templateUrl: './waiting-dialog.component.html',
})
export class WaitingDialogComponent implements OnInit {
  isLoading: boolean = false;
  canCancel: boolean = false;
  canDownload: boolean = false;
  status: string = 'Waiting Metamask...';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private seatServ: SeatService,
    public dialogRef: MatDialogRef<WaitingDialogComponent>
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.seatServ
      .update(this.data.seat)
      .then((res: any) => {
        this.status = 'Sending Transaction...';
        const txHash = res.result;
        const interval = setInterval(async () => {
          await web3.eth.getTransactionReceipt(txHash).then(res => {
            if (res) {
              this.isLoading = false;
              clearInterval(interval);
              if (res.status) {
                this.status = 'Update Confirmed';
                this.canDownload = true;
              } else this.status = 'Update Failed';
            }
          });
        }, 5 * 1000);
      })
      .catch(err => {
        console.log(err);

        this.isLoading = false;
        this.canCancel = true;
        this.status = err.message;
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDownload() {
    const key = this.data.password;
    const cert = {
      nodeKey: this.data.nodeKey,
      ownerAccount: this.data.seat.zbcAddress,
    };
    console.log(cert);
    const plaintText = JSON.stringify(cert);

    let enc: string = GibberishAES.enc(plaintText, key);
    enc = enc.replace(/(\r\n|\n|\r)/gm, '');

    const blob = new Blob([enc]);
    saveAs(blob, 'wallet.zbc');
  }
}
