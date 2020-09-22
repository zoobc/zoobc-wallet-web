import { NgModule } from '@angular/core';
import { AddressComponent } from './address.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material';
import { NgxPopperModule } from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    NgxPopperModule.forRoot({
      trigger: 'hover',
      placement: 'bottom',
      applyClass: 'pooper-style',
    }),
  ],
  declarations: [AddressComponent],
  exports: [AddressComponent],
})
export class AddressModule {}
