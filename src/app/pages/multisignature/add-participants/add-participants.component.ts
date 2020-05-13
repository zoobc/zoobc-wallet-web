import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatStepper, MatSnackBar } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
import { onCopyText } from 'src/helpers/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.component.html',
  styleUrls: ['./add-participants.component.scss'],
})
export class AddParticipantsComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([]);

  minParticipant: number = 3;
  selectedDesign: number = 1;
  account: SavedAccount;
  transactionHash: string = 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb';
  url: string = 'https://zoobc.one/...SxhdnfHF';

  constructor(private translate: TranslateService, private snackBar: MatSnackBar) {
    this.thirdFormGroup = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });
  }

  ngOnInit() {
    this.pushInitParticipant();
    this.stepper.selectedIndex = 2;
    if (this.selectedDesign == 2) {
      this.stepper.selectedIndex = 0;
    }
  }

  pushInitParticipant() {
    while (this.participantsSignatureField.length > 0) {
      this.participantsSignatureField.removeAt(0);
    }
    for (let i = 0; i < this.minParticipant; i++) {
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  addParticipant() {
    const length: number = this.participantsSignatureField.length;
    if (length >= 2) {
      this.participantsSignatureField.push(new FormControl(''));
    } else {
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  onSwitchAccount(account: SavedAccount) {
    this.account = account;
  }

  addSignature() {
    console.log('add your signature');
  }

  async copyUrl() {
    onCopyText(this.url);
    let message: string;
    await this.translate
      .get('Link Copied')
      .toPromise()
      .then(res => (message = res));
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
