import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount, AuthService } from 'src/app/services/auth.service';
import zoobc, {
  AccountDatasetListParams,
  AccountDatasetsResponse,
  RemoveDatasetInterface,
  BIP32Interface,
} from 'zoobc-sdk';
import { environment } from 'src/environments/environment';
import { CurrencyRateService, Currency } from 'src/app/services/currency-rate.service';
import { truncate, getTranslation } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { PinConfirmationComponent } from 'src/app/components/pin-confirmation/pin-confirmation.component';
import { SetupDatasetComponent } from './setup-dataset/setup-dataset.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-account-dataset',
  templateUrl: './account-dataset.component.html',
  styleUrls: ['./account-dataset.component.scss'],
})
export class AccountDatasetComponent implements OnInit {
  subscription: Subscription = new Subscription();
  dataSetList: any[];
  dataSet: any;
  isLoading: boolean;
  isError: boolean;
  isLoadingDelete: boolean;
  isErrorDelete: boolean;
  minFee = environment.fee;
  currencyRate: Currency;
  form: FormGroup;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl('ZBC');

  account: SavedAccount;

  feeRefDialog: MatDialogRef<any>;
  @ViewChild('feedialog') feeDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private currencyServ: CurrencyRateService,
    private authServ: AuthService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: SavedAccount
  ) {
    this.form = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });

    this.account = data;
  }

  ngOnInit() {
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
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
    this.isErrorDelete = false;

    this.authServ.switchAccount(this.account);
    const seed: BIP32Interface = this.authServ.seed;

    let param: RemoveDatasetInterface = {
      setterAccountAddress: this.dataSet.setteraccountaddress,
      recipientAccountAddress: this.dataSet.recipientaccountaddress,
      property: this.dataSet.property,
      value: this.dataSet.value,
      fee: this.feeForm.value,
    };

    zoobc.AccountDataset.removeDataset(param, seed)
      .then(res => {
        let message = getTranslation('your request is processing', this.translate);
        let subMessage = getTranslation(
          'the dataset will remove when it has been successfully processed on the server',
          this.translate
        );
        Swal.fire(message, subMessage, 'success');
      })
      .catch(async err => {
        console.log(err);
        let message = getTranslation('an error occurred while processing your request', this.translate);
        Swal.fire('Opps...', message, 'error');
        this.isErrorDelete = true;
        this.isLoadingDelete = false;
      })
      .finally(() => {
        this.isLoadingDelete = false;
      });
    this.feeRefDialog.close();
  }

  onDelete(dataset: any) {
    this.dataSet = dataset;
    this.isErrorDelete = false;
    this.isLoadingDelete = false;
    this.feeRefDialog = this.dialog.open(this.feeDialog, {
      width: '360px',
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

  onRefresh() {
    this.getDataSetList();
  }

  onSetupNewDataset() {
    let newRefDialog = this.dialog.open(SetupDatasetComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: this.account,
      disableClose: true,
    });
  }
}
