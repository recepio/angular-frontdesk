import { Component, Input, OnInit } from '@angular/core';

import { Event } from '../event';
import { Resource } from '../resource';
import { SelectionService } from '../selection.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-time-events',
  templateUrl: './time-events.component.html',
  styleUrls: ['./time-events.component.scss']
})
export class TimeEventsComponent implements OnInit {

  @Input() resource: Resource[];

  constructor(
    public eventService: EventService,
    private selectionService: SelectionService
  ) { }

  ngOnInit() {
  }

  trackByEvents(index: number, event: Event): number { return event.id; }

}
