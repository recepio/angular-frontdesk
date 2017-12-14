import {
  Component, ElementRef, Input, OnChanges, OnInit, Pipe, PipeTransform, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {addDays, differenceInMonths, isFirstDayOfMonth} from 'date-fns';

import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineComponent implements OnInit, OnChanges {

  @Input() width: number;
  @Input() height: number;

  public fitDays = 0;
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
