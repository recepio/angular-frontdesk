import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';

import { Event } from '../event';
import { SelectionService } from '../selection.service';
import { EventService } from '../event.service';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit {

  @Input() event: Event;

  @HostBinding('attr.tabindex') tabindex = '0';

  @HostBinding('style.width')
  public get getWidth(): string {
    return `${this.event.duration.days * this.timelineService.dayWidth}px`;
  }

  @HostBinding('style.left')
  public get getLeft(): string {
    const days = (this.event.date.getTime() - this.timelineService.startFrom.getTime()) / 24 / 60 / 60 / 1000;
    return `${days * this.timelineService.dayWidth}px`;
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    if (!evt.ctrlKey && !evt.metaKey) {
      this.selectionService.clear();
    }
    if (evt.shiftKey) {
      const beginPosition = this.eventService.items.indexOf(this.selectionService.current);
      const endPosition = this.eventService.items.indexOf(this.event);
      console.log(beginPosition, endPosition);
      for (let i = Math.min(beginPosition, endPosition); i <= Math.max(beginPosition, endPosition); i++) {
        this.selectionService.select(this.eventService.items[i], false);
      }
    }
    this.selectionService.select(this.event, false);
  }

  constructor(
    public eventService: EventService,
    public selectionService: SelectionService,
    public timelineService: TimelineService
  ) { }

  ngOnInit() {
  }

  delete(event: Event): void {
    this.eventService.delete(event).subscribe();
  }
}
