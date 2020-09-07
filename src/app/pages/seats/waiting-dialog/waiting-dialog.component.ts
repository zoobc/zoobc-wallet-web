import { Component, OnInit, Inject } from '@angular/core';
import { SeatService } from 'src/app/services/seat.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
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
  status: string = 'Waiting for Metamask...';
  url = environment.etherscan;
  txHash = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private seatServ: SeatService,
    public dialogRef: MatDialogRef<WaitingDialogComponent>,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.seatServ
      .update(this.data.seat)
      .then((res: any) => {
        this.status = 'Sending Transaction...';
        this.txHash = res.result;
        const interval = setInterval(async () => {
          await web3.eth.getTransactionReceipt(this.txHash).then(res => {
            if (res) {
              this.isLoading = false;
              clearInterval(interval);
              if (res.status) {
                this.status = 'Update Confirmed';
                this.canDownload = true;
              } else {
                this.status = 'Update Failed';
                this.canCancel = true;
              }
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
    const plaintText = JSON.stringify(cert);

    let enc: string = GibberishAES.enc(plaintText, key);
    enc = enc.replace(/(\r\n|\n|\r)/gm, '');

    const address = cert.ownerAccount.slice(0, 21);
    const m = new Date();
    const dateString =
      m.getFullYear() +
      ('0' + (m.getMonth() + 1)).slice(-2) +
      ('0' + m.getDate()).slice(-2) +
      '_' +
      ('0' + m.getHours()).slice(-2) +
      ('0' + m.getMinutes()).slice(-2) +
      ('0' + m.getSeconds()).slice(-2);

    const blob = new Blob([enc]);
    saveAs(blob, `${address}_${dateString}.zbc`);

    this.dialog.closeAll();
    this.router.navigate(['/info']);
  }
}
