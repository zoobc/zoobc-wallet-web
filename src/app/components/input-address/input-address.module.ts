import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAddressComponent } from './input-address.component';
import { MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';

@NgModule({
  declarations: [InputAddressComponent],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  exports: [InputAddressComponent],
})
export class InputAddressModule {}
