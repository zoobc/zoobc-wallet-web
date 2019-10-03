import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PoownService } from 'src/app/services/poown.service';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import { KeyringService } from 'src/app/services/keyring.service';
import { BytesMaker } from 'src/helpers/BytesMaker';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-update-node',
  templateUrl: './update-node.component.html',
  styleUrls: ['./update-node.component.scss'],
})
export class UpdateNodeComponent implements OnInit {
  formUpdateNode: FormGroup;
  ownerForm = new FormControl('', Validators.required);
  ipAddressForm = new FormControl('', Validators.required);
  lockedAmountForm = new FormControl('', Validators.required);
  feeForm = new FormControl('', Validators.required);
  nodePublicKeyForm = new FormControl('', Validators.required);

  poown: any;

  account: SavedAccount;

  constructor(
    private poownServ: PoownService,
    private authServ: AuthService,
    private keyringServ: KeyringService,
    private transactionServ: TransactionService
  ) {
    this.formUpdateNode = new FormGroup({
      owner: this.ownerForm,
      ipAddress: this.ipAddressForm,
      lockedAmount: this.lockedAmountForm,
      fee: this.feeForm,
      nodePublicKey: this.nodePublicKeyForm,
    });

    this.account = authServ.getCurrAccount();
  }

  ngOnInit() {
    this.poownServ.get().then(res => {
      console.log(res);

      this.poown = res;
      if (res) {
        this.onUpdateNode();
      }
    });
    // this.nodeServ.getRegisteredNode().then(res => {});
  }

  onUpdateNode() {
    const account = this.account;
    const seed = Buffer.from(this.authServ.currSeed, 'hex');
    this.keyringServ.calcBip32RootKeyFromSeed('ZBC', seed);
    const childSeed = this.keyringServ.calcForDerivationPathForCoin(
      'ZBC',
      account.path
    );
    const sender = Buffer.from(this.authServ.currAddress, 'utf-8');

    const nodeAddress = Buffer.from(
      'mToyyAc9bOXMMMeRFWN9SzEtdmHbUPL0ZIaQ9iWQ1Yc=',
      'utf-8'
    );
    const fee = 0.001 * 1e8;
    const timestamp = Math.trunc(Date.now() / 1000);
    const pubKey = [
      153,
      58,
      50,
      200,
      7,
      61,
      108,
      229,
      204,
      48,
      199,
      145,
      21,
      99,
      125,
      75,
      49,
      45,
      118,
      97,
      219,
      80,
      242,
      244,
      100,
      134,
      144,
      246,
      37,
      144,
      213,
      135,
    ];

    let bytes = new BytesMaker(353);
    // transaction type
    bytes.write4bytes(258);
    // version
    bytes.write1Byte(1);
    // timestamp
    bytes.write8Bytes(timestamp);
    // sender address length
    bytes.write4bytes(44);
    // sender address
    bytes.write44Bytes(sender);
    // recepient address length
    bytes.write4bytes(44);
    // recepient address
    bytes.write44Bytes(new Uint8Array(44));
    // tx fee
    bytes.write8Bytes(fee);
    // tx body length
    bytes.write4bytes(232);
    // tx body (node pub key)
    bytes.write(pubKey, 32);
    // tx body (node address)
    bytes.write4bytes(44);
    bytes.write44Bytes(nodeAddress);
    // tx locked balance
    bytes.write8Bytes(100);
    // tx poown
    // console.log('poown', this.poown);

    bytes.write(this.poown, 144);
    console.log(bytes.value.join(', '));

    let signature = childSeed.sign(bytes.value);
    let bytesWithSign = new BytesMaker(421);
    // copy to new bytes
    bytesWithSign.write(bytes.value, 353);
    // set signature type
    bytesWithSign.write4bytes(0);
    // set signature
    bytesWithSign.write(signature, 64);
    // console.log(bytesWithSign.value.join(', '));

    this.transactionServ.postTransaction(bytesWithSign.value).then(
      (res: any) => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
