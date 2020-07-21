import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
import zoobc, { AccountDatasetListParams, AccountDatasetsResponse } from 'zoobc-sdk';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
@Component({
  selector: 'app-account-dataset',
  templateUrl: './account-dataset.component.html',
  styleUrls: ['./account-dataset.component.scss'],
})
export class AccountDatasetComponent implements OnInit {
  subscription: Subscription = new Subscription();
  dataSetList: any[];
  dataSetId: any;
  isLoading: boolean;
  isError: boolean;
  isLoadingDelete: boolean;
  isErrorDelete: boolean;
  minFee = environment.fee;
  kindFee: string;
  currencyRate: Currency;
  form: FormGroup;
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);
  customFee: boolean = false;

  feeRefDialog: MatDialogRef<any>;
  @ViewChild('feedialog') feeDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private currencyServ: CurrencyRateService,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {
    this.form = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
    });
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    this.getDataSetList();
  }

  getDataSetList() {
    this.isError = false;
    this.isLoading = true;
    const listParam: AccountDatasetListParams = {
      recipientAccountAddress: this.account.address,
    };
    zoobc.AccountDataset.getList(listParam)
      .then((res: AccountDatasetsResponse) => {
        this.dataSetList = res.accountdatasetsList;
      })
      .catch(err => {
        this.isError = true;
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deleteDataSet() {
    this.isLoadingDelete = true;
    //this.feeRefDialog.close();
  }

  onDelete(index: number) {
    this.dataSetId = index;
    this.isErrorDelete = false;
    this.isLoadingDelete = false;
    this.feeRefDialog = this.dialog.open(this.feeDialog, {
      width: '300px',
      maxHeight: '90vh',
    });
  }

  onOpenPinDialog() {
    let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
      width: '400px',
      maxHeight: '90vh',
    });

    pinRefDialog.afterClosed().subscribe(isPinValid => {
      if (isPinValid) {
        this.deleteDataSet();
      }
    });
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }

  onRefresh() {
    this.getDataSetList();
  }
}
