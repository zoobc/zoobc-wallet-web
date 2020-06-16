import { Component, OnInit } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { ConfirmUpdateComponent } from '../confirm-update/confirm-update.component';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
const web3 = new Web3(
  new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws/v3/2ebd28952cb94885bd6924966184dba2')
);

@Component({
  selector: 'app-seat-detail',
  templateUrl: './seat-detail.component.html',
  styleUrls: ['./seat-detail.component.scss'],
})
export class SeatDetailComponent implements OnInit {
  account: SavedAccount;
  nodePublicKey: string = 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai';

  metamask: boolean = false;
  etherscanUrl = environment.etherscan;

  constructor(private authServ: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    const ethereum = window['ethereum'];
    this.metamask = ethereum.isConnected();
  }

  onSwitch(account: SavedAccount) {
    this.account = account;
  }

  generateRandomNodePublicKey(length: number = 44) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (this.nodePublicKey = result);
  }

  onUpdate() {
    const confirmRefDialog = this.dialog.open(ConfirmUpdateComponent, {
      width: '800px',
      maxHeight: '90vh',
    });

    confirmRefDialog.afterClosed().subscribe(onConfirm => {
      if (onConfirm) this.onOpenPinDialog();
    });
  }

  async connectMetamask() {
    const ethereum = window['ethereum'];
    await ethereum.enable();
    this.metamask = ethereum.isConnected();
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) this.onSendTransaction();
    });
  }

  onSendTransaction() {
    const ethereum = window['ethereum'];

    const transactionParameters = {
      nonce: '0x00',
      gasPrice: web3.utils.toHex(web3.utils.toWei('15', 'gwei')),
      gas: web3.utils.toHex('380000'),
      to: '0x35725814A6F71E27C5C428A3bEdb8DAA504Aa0e7',
      from: ethereum.selectedAddress,
      value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')),
      data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
      chainId: 3,
    };

    ethereum.sendAsync(
      {
        method: 'eth_sendTransaction',
        params: [transactionParameters],
        from: ethereum.selectedAddress,
      },
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
          const txHash = response.result;
          Swal.fire({
            type: 'success',
            title: 'Transaction sent!',
            html:
              'Click ' +
              `<a href="${environment.etherscan}tx/${txHash}" target="_blank">here</a> ` +
              'to check your transaction status in etherscan.io',
          });
          this.dialog.closeAll();
        }
      }
    );
  }
}
