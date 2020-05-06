import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multisignature',
  templateUrl: './multisignature.component.html',
  styleUrls: ['./multisignature.component.scss'],
})
export class MultisignatureComponent implements OnInit {
  constructor() {}

  addInfo: boolean = true;
  createTransaction: boolean = true;
  addSignature: boolean = true;
  multiSigDrafts: any;
  isLoading: boolean;
  isError: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.multiSigDrafts = [
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 3,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 4,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 6,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 7,
      },
      {
        sender: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
        senderAlias: 'John Doe',
        recipient: 'AFiTqqX99kYXjLFJJ2AWuzKK5zxYUT1Pn0p3s6lutkai',
        recipientAlias: 'Jane Doe',
        amount: 3,
      },
    ];
    this.isLoading = false;
    this.isError = false;
  }

  toggleInfo() {
    this.addInfo = !this.addInfo;
  }

  toogleCreateTransaction() {
    this.createTransaction = !this.createTransaction;
  }

  toogleAddSignature() {
    this.addSignature = !this.createTransaction;
  }

  onNext() {
    console.log('Next clicked');
  }

  onRefresh() {
    console.log('Refresh clicked');
  }
}
