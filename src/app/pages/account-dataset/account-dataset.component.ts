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
    private authServ: AuthService,
    private translate: TranslateService,
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
    this.isErrorDelete = false;

    const keyring = this.authServ.keyring;
    const seed: BIP32Interface = keyring.calcDerivationPath(this.account.path);

    let param: RemoveDatasetInterface = {
      setterAccountAddress: this.dataSet.setteraccountaddress,
      recipientAccountAddress: this.dataSet.recipientaccountaddress,
      property: this.dataSet.property,
      value: this.dataSet.value,
      fee: this.feeForm.value,
    };

    zoobc.AccountDataset.removeDataset(param, seed)
      .then(async res => {
        let message = await getTranslation('Your Request is processing', this.translate);
        let subMessage = await getTranslation(
          'The dataset will remove when it has been successfully processed on the server',
          this.translate
        );
        Swal.fire(message, subMessage, 'success');
      })
      .catch(async err => {
        console.log(err);
        let message = await getTranslation('An error occurred while processing your request', this.translate);
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

  onSetupNewDataset() {
    let newRefDialog = this.dialog.open(SetupDatasetComponent, {
      width: '360px',
      maxHeight: '99vh',
      data: this.account,
      disableClose: true,
    });
  }
}
