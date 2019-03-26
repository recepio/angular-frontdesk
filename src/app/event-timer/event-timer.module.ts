import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { EventTimerComponent } from './event-timer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimerComponent, EventTimerComponent],
  exports: [
      EventTimerComponent
  ]
})
export class EventTimerModule { }
