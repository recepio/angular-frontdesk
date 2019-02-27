import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BookingSliderComponent,
    FullBarDirective,
    MaxHDirective,
    MinHDirective,
    SelBarDirective
} from './booking-slider.component';
import {FillPipe} from '../fill.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      BookingSliderComponent,
      FullBarDirective,
      SelBarDirective,
      MinHDirective,
      FillPipe,
      MaxHDirective,
  ],
  exports: [
      BookingSliderComponent,
      FillPipe
  ]
})
export class BookingSliderModule { }
