import { Component, OnInit, Inject } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmUpdateComponent } from '../confirm-update/confirm-update.component';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Seat, SeatService } from 'src/app/services/seat.service';
import { ZooKeyring, getZBCAdress } from 'zoobc-sdk';
import { eddsa as EdDSA } from 'elliptic';
import * as sha256 from 'sha256';
import { DownloadCertificateComponent } from '../download-certificate/download-certificate.component';

@Component({
  selector: 'app-seat-detail',
  templateUrl: './seat-detail.component.html',
  styleUrls: ['./seat-detail.component.scss'],
})
export class SeatDetailComponent implements OnInit {
  account: SavedAccount;
  metamask: boolean = false;

  isLoading: boolean = false;
  isLoadingUpdate: boolean = false;
  isError: boolean = false;
  editable: boolean = false;

  seat: Seat;
  selectedAddress: string;

  form: FormGroup;
  addressField = new FormControl('', Validators.required);
  nodePubKeyField = new FormControl('', Validators.required);
  messageField = new FormControl('', [this.checkMessageLength.bind(this)]);
  messageSize: number;

  passphrase: string;

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
        this.messageSize = this.getByteLength(this.messageField.value);
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

  generateNodePublicKey() {
    this.passphrase = ZooKeyring.generateRandomPhrase(12, 'english');
    const seedBuffer = new TextEncoder().encode(this.passphrase);
    const seedHash = sha256(seedBuffer);
    const ec = new EdDSA('ed25519');
    const pairKey = ec.keyFromSecret(seedHash);
    const nodeAddress = getZBCAdress(pairKey.getPublic(), 'ZNK');
    this.nodePubKeyField.setValue(nodeAddress);
  }

  onDownload() {
    this.dialog.open(DownloadCertificateComponent, {
      width: '420px',
      maxHeight: '90vh',
      data: { nodeKey: this.passphrase, ownerAccount: this.addressField.value },
    });
  }

  onUpdate() {
    const confirmRefDialog = this.dialog.open(ConfirmUpdateComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        old: this.seat,
        new: {
          zbcAddress: this.addressField.value,
          nodePubKey: this.nodePubKeyField.value,
          message: this.messageField.value,
        },
      },
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
    this.isLoadingUpdate = true;

    const params: Seat = {
      tokenId: this.tokenId,
      ethAddress: this.seat.ethAddress,
      zbcAddress: this.addressField.value,
      nodePubKey: this.nodePubKeyField.value,
      message: this.messageField.value,
    };
    this.seatServ
      .update(params)
      .then((res: any) => {
        this.isLoadingUpdate = false;
        const txHash = res.result;
        Swal.fire({
          type: 'success',
          title: 'Transaction sent!',
          html:
            'Click ' +
            `<a href="${environment.etherscan}tx/${txHash}" target="_blank">here</a> ` +
            'to check your transaction status in etherscan.io',
        });
        this.dialog.closeAll();
      })
      .catch(err => {
        this.isLoadingUpdate = false;
        Swal.fire({ type: 'error', title: err.err.message });
      });
  }

  getByteLength(str: string) {
    const buf = Buffer.from(str);
    return Buffer.byteLength(buf);
  }

  checkMessageLength(ctrl: AbstractControl) {
    const length = this.getByteLength(ctrl.value);
    if (length > 256) return { invalidLimit: true };
    return null;
  }

  onKeyUpMessage(e: any) {
    this.messageSize = this.getByteLength(e.target.value);
  }
}
