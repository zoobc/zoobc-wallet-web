import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'reward-table',
  templateUrl: './reward-table.component.html',
  styleUrls: ['./reward-table.component.scss'],
})
export class RewardTableComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() tableData;
  @Input() displayedColumns: any;
  @Input() isShowAutomaticNumber: boolean = false;
  @Input() isLoading: boolean;
  @Input() isError: boolean;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  dataSource;
  displayCol: string[];
  widthColumn: any;

  ngOnInit() {
    this.displayCol = this.displayedColumns.map(dc => dc.id);
    if (this.isShowAutomaticNumber) this.displayCol.unshift('no');
    this.widthColumn = 100 / this.displayCol.length;
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  onRefresh() {
    this.refresh.emit(true);
  }

  getDate(timestamp: any) {
    const newDate = new Date(timestamp);
    return newDate;
  }
}
