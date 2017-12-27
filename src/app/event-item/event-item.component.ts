import { Component, OnInit, Input, HostBinding, Inject } from '@angular/core';

import { Event } from '../event';
import { EventService } from '../event.service';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit {

  @Input() event: Event;

  @HostBinding('style.width')
  public get getWidth(): string {
    return `${this.event.duration.days * this.timelineService.dayWidth}px`;
  }

  @HostBinding('style.left')
  public get getLeft(): string {
    const days = (this.event.date.getTime() - this.timelineService.startFrom.getTime()) / 24 / 60 / 60 / 1000;
    return `${days * this.timelineService.dayWidth}px`;
  }

  constructor(
    @Inject('eventService') public eventService: EventService,
    public timelineService: TimelineService
  ) { }

  ngOnInit() {
  }

  delete(event: Event): void {
    this.eventService.delete(event).subscribe();
  }
}
