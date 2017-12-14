import { Injectable } from '@angular/core';

import { max, addDays, differenceInDays } from 'date-fns';

import { EventService } from './event.service';
import { Event } from './event';

@Injectable()
export class TimelineService {

  startFrom: Date = new Date();
  dayWidth = 120;

  constructor(private eventService: EventService) { }

}
