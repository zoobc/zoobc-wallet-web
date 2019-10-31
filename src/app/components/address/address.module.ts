import { NgModule } from '@angular/core';
import { AddressComponent } from './address.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [AddressComponent],
  exports: [AddressComponent],
})
export class AddressModule {}
