import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineComponent implements OnInit {

  @HostBinding('width')
  public get getWidth(): string {
    return `${this.event.duration.days * this.timelineService.dayWidth}px`;
  }

  constructor() { }

  ngOnInit() {
  }

}
