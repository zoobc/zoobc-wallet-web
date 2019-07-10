import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-node-admin',
  templateUrl: './node-admin.component.html',
  styleUrls: ['./node-admin.component.scss'],
})
export class NodeAdminComponent implements OnInit {
  public doughnutChartData = [70, 30];
  public doughnutChartType = 'doughnut';

  constructor() {}

  ngOnInit() {}
}
