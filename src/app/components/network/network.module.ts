import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkComponent } from './network.component';
import { MatSelectModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [NetworkComponent],
  imports: [CommonModule, MatSelectModule, MatButtonModule],
  exports: [NetworkComponent],
})
export class NetworkModule {}
