import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SavedAccount } from 'src/app/services/auth.service';
import zoobc, { AccountDatasetListParams, AccountDatasetsResponse } from 'zoobc-sdk';
@Component({
  selector: 'app-account-dataset',
  templateUrl: './account-dataset.component.html',
  styleUrls: ['./account-dataset.component.scss'],
})
export class AccountDatasetComponent implements OnInit {
  dataSetList: any[];
  isLoading: boolean;
  isError: boolean;

  feeRefDialog: MatDialogRef<any>;
  @ViewChild('feedialog') feeDialog: TemplateRef<any>;

  constructor(
    private dialogRef: MatDialogRef<AccountDatasetComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private account: SavedAccount
  ) {}

  ngOnInit() {
    this.dataSetList = [1, 2, 3];
    //this.getDataSetList();
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
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onDelete(index: number) {
    this.feeRefDialog = this.dialog.open(this.feeDialog, {
      width: '300px',
      maxHeight: '90vh',
    });
  }

  onRefresh() {
    this.getDataSetList();
  }
}
