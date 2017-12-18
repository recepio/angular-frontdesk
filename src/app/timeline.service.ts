import { Injectable } from '@angular/core';

import { startOfToday } from 'date-fns';

@Injectable()
export class TimelineService {

  startFrom: Date = startOfToday();
  dayWidth = 60;

  constructor() { }

}
