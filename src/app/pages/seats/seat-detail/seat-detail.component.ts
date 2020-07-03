import { Component, OnInit, Inject } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmUpdateComponent } from '../confirm-update/confirm-update.component';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
const web3 = new Web3(
  new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/2ebd28952cb94885bd6924966184dba2')
);
import { abi } from 'src/helpers/abi';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Seat, SeatService } from 'src/app/services/seat.service';

@Component({
  selector: 'app-seat-detail',
  templateUrl: './seat-detail.component.html',
  styleUrls: ['./seat-detail.component.scss'],
})
export class SeatDetailComponent implements OnInit {
  account: SavedAccount;
  nodePublicKey: string = 'ZBC_RERG3XD7_GAKOZZKY_VMZP2SQE_LBP45DC6_VDFGDTFK_3BZFBQGK_JMWELLO7';

  metamask: boolean = false;
  etherscanUrl = environment.etherscan;

  isLoading: boolean = false;
  isError: boolean = false;
  editable: boolean = false;

  seat: Seat;
  selectedAddress: string;

  form: FormGroup;
  addressField = new FormControl('', Validators.required);
  nodePubKeyField = new FormControl('', Validators.required);
  messageField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    public dialog: MatDialog,
    private seatServ: SeatService,
    @Inject(MAT_DIALOG_DATA) private tokenId: number
  ) {
    this.form = new FormGroup({
      address: this.addressField,
      nodePubKey: this.nodePubKeyField,
      message: this.messageField,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();

    if (window['ethereum']) {
      const ethereum = window['ethereum'];
      this.metamask = ethereum.isConnected() ? (ethereum.selectedAddress ? true : false) : false;
      this.selectedAddress = ethereum.selectedAddress;
    }

    this.getSeat();
  }

  getSeat() {
    this.isLoading = true;
    this.isError = false;
    this.seatServ
      .get(this.tokenId)
      .then(seat => {
        this.isLoading = false;
        this.seat = seat;
        this.addressField.setValue(seat.zbcAddress);
        this.nodePubKeyField.setValue(seat.nodePubKey);
        this.messageField.setValue(seat.message);

        this.checkCanEdit();
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false;
        this.isError = true;
      });
  }

  checkCanEdit() {
    const ethereum = window['ethereum'];
    if (
      ethereum &&
      ethereum.selectedAddress &&
      ethereum.selectedAddress.toLowerCase() == this.seat.ethAddress.toLowerCase()
    ) {
      this.addressField.enable();
      this.nodePubKeyField.enable();
      this.messageField.enable();
      this.editable = true;
    } else {
      this.addressField.disable();
      this.nodePubKeyField.disable();
      this.messageField.disable();
      this.editable = false;
    }
  }

  onSwitch(account: SavedAccount) {
    this.addressField.setValue(account.address);
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
    if (ethereum) {
      await ethereum.enable();
      this.metamask = ethereum.isConnected();

      this.checkCanEdit();
    } else Swal.fire({ type: 'error', title: 'Please install Metamask first' });
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

    const tokenAddress = environment.tokenAddress;
    const abiItem = abi;

    const address = this.addressField.value;
    const pubkey = this.nodePubKeyField.value;
    const message = this.messageField.value;

    let contract = new web3.eth.Contract(abiItem, tokenAddress);
    const data = contract.methods.setData(this.tokenId, address, pubkey, message).encodeABI();
    contract.options.from = ethereum.selectedAddress;

    const transactionParameters = {
      nonce: '0x00',
      gasPrice: web3.utils.toHex(web3.utils.toWei(environment.gasPrice.toString(), 'gwei')),
      gas: web3.utils.toHex(environment.gasLimit.toString()),
      to: tokenAddress,
      from: ethereum.selectedAddress,
      value: '0x00',
      data: data,
      chainId: environment.chainId,
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
