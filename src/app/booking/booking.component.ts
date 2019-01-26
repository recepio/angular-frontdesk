import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {addDays, isFirstDayOfMonth} from 'date-fns';
import {TimelineService} from '../timeline.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent implements OnInit, OnChanges {
  width: number = 800;
  height: number = 150;
  paddingLeft: number = 3;

  public fitDays = 15;
  public isFirstDay = isFirstDayOfMonth;

  constructor(public timelineService: TimelineService) { }

  ngOnInit() {
  }

  addDays (i: number): Date {
    return addDays(this.timelineService.startFrom, i);
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.width) {
          this.fitDays = Math.floor(changes.width.currentValue / this.timelineService.dayWidth);
      }
  }
}
