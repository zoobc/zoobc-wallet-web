import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { InputAmountComponent } from './input-amount.component';

@NgModule({
  declarations: [InputAmountComponent],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  exports: [InputAmountComponent],
})
export class InputAmountModule {}
