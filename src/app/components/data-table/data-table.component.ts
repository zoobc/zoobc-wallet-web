import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() tableData;
  @Input() displayedColumns: any;
  @Input() isShowAutomaticNumber: boolean = false;
  @Input() isLoading: boolean;
  @Input() isError: boolean;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  dataSource;
  displayCol: string[];

  ngOnInit() {
    this.displayCol = this.displayedColumns.map(dc => dc.id);
    if (this.isShowAutomaticNumber) this.displayCol.unshift('no');
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  onRefresh() {
    this.refresh.emit(true);
  }
}
