import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NetworkComponent } from './network.component';
import { MatSelectModule, MatButtonModule, MatInputModule, MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [NetworkComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
  ],
  exports: [NetworkComponent],
})
export class NetworkModule {}
