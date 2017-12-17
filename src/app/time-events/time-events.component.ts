import { Component, Input, OnInit } from '@angular/core';

import { Event } from '../event';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-time-events',
  templateUrl: './time-events.component.html',
  styleUrls: ['./time-events.component.scss']
})
export class TimeEventsComponent implements OnInit {

  @Input() events: Event[];

  constructor(
    private selectionService: SelectionService
  ) { }

  ngOnInit() {
  }

  trackByEvents(index: number, event: Event): number { return event.id; }

}
