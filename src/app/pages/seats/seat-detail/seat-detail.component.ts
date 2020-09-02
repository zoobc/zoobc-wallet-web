import { Component, OnInit, Inject } from '@angular/core';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmUpdateComponent } from '../confirm-update/confirm-update.component';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Seat, SeatService } from 'src/app/services/seat.service';
import { ZooKeyring, getZBCAdress } from 'zoobc-sdk';
import { eddsa as EdDSA } from 'elliptic';
import * as sha256 from 'sha256';
import { WaitingDialogComponent } from '../waiting-dialog/waiting-dialog.component';

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
  readonly: boolean = true;

  seat: Seat;
  selectedAddress: string;

  form: FormGroup;
  addressField = new FormControl('', Validators.required);
  nodePubKeyField = new FormControl('', Validators.required);
  messageField = new FormControl('', [
    this.checkMessageLength.bind(this),
    Validators.pattern('^[a-zA-Z0-9 ]*$'),
  ]);
  passwordField = new FormControl('', Validators.required);
  confirmPassField = new FormControl('', Validators.required);

  messageSize: number;
  passphrase: string;
  tokenId: number;

  constructor(
    private authServ: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SeatDetailComponent>,
    private seatServ: SeatService,
    @Inject(MAT_DIALOG_DATA) dataToken: number
  ) {
    this.form = new FormGroup({
      address: this.addressField,
      nodePubKey: this.nodePubKeyField,
      message: this.messageField,
      password: this.passwordField,
      confirmPass: this.confirmPassField,
    });

    this.tokenId = dataToken;
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
        this.checkMetamask();
        this.messageSize = this.getByteLength(this.messageField.value);
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false;
        this.isError = true;
      });
  }

  checkMetamask() {
    const ethereum = window['ethereum'];
    if (
      ethereum &&
      ethereum.selectedAddress &&
      ethereum.selectedAddress.toLowerCase() == this.seat.ethAddress.toLowerCase()
    ) {
      this.editable = true;
      if (!this.seat.zbcAddress) {
        this.readonly = false;
        this.dialogRef.disableClose = true;
      }
    }
  }

  openEdit() {
    this.readonly = false;
  }

  checkCanEdit() {
    const ethereum = window['ethereum'];
    if (
      ethereum &&
      ethereum.selectedAddress &&
      ethereum.selectedAddress.toLowerCase() == this.seat.ethAddress.toLowerCase()
    )
      this.editable = true;
    else this.editable = false;
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

  changeConfirmPass() {
    if (this.passwordField.value != this.confirmPassField.value) {
      this.form.get('confirmPass').setErrors({ notmatch: true });
    }
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

  onCancel() {
    this.dialogRef.close();

    // Swal.fire({
    //   html: `<b>WARNING</b>: you must update the smart contract AND download the certificate to complete your registration. <br>
    //       If you close this window before both of these things are done, your registration will be incomplete and your node will not run correctly. <br>
    //       <b>ARE YOU SURE YOU WANT TO CLOSE???</b>`,
    //   showCancelButton: true,
    //   preConfirm: () => {
    //     this.dialogRef.close();
    //   },
    // });
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
    const seat: Seat = {
      tokenId: this.tokenId,
      ethAddress: this.seat.ethAddress,
      zbcAddress: this.addressField.value,
      nodePubKey: this.nodePubKeyField.value,
      message: this.messageField.value,
    };

    this.dialog.open(WaitingDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { seat, nodeKey: this.passphrase, password: this.passwordField.value },
    });
  }

  getByteLength(str: string) {
    const buf = Buffer.from(str);
    return Buffer.byteLength(buf);
  }

  checkMessageLength(ctrl: AbstractControl) {
    const length = this.getByteLength(ctrl.value);
    if (length > 100) return { invalidLimit: true };
    return null;
  }

  onKeyUpMessage(e: any) {
    this.messageSize = this.getByteLength(e.target.value);
  }
}
